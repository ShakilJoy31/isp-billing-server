const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const Package = require("../../models/package/package.model");
const BankAccount = require("../../models/account/account.model");
const { Expense, ExpensePayment } = require("../../models/expense/expense.model");
const ExpenseCategory = require("../../models/expense/category.model");
const ExpenseSubCategory = require("../../models/expense/sub-category.model");
const ClientInformation = require("../../models/Authentication/client.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");
const EmployeeAttendance = require("../../models/attendence/attendence.model");
const Salary = require("../../models/salary/salary.model");
const { Chat, ChatMessage, ChatParticipant } = require("../../models/live-chat/liveChat.model");

// 1. CLIENT REGISTRATION REPORT
const getClientRegistrationReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            status,
            customerType,
            location,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions
        const whereClause = { role: 'client' };

        // Date filter
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
        }

        if (status) whereClause.status = status;
        if (customerType) whereClause.customerType = customerType;
        if (location) whereClause.location = location;

        // Get clients with pagination
        const { count, rows: clients } = await ClientInformation.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [['createdAt', 'DESC']],
            attributes: [
                'id', 'userId', 'customerId', 'fullName', 'email', 'mobileNo',
                'customerType', 'package', 'location', 'area', 'status',
                'createdAt', 'userAddedBy'
            ]
        });

        // Get package details for each client
        const clientsWithPackage = await Promise.all(
            clients.map(async (client) => {
                const clientData = client.toJSON();
                if (clientData.package) {
                    const packageDetails = await Package.findOne({
                        where: { id: clientData.package },
                        attributes: ['packageName', 'packageBandwidth', 'packagePrice']
                    });
                    clientData.packageDetails = packageDetails ? packageDetails.toJSON() : null;
                }
                return clientData;
            })
        );

        // Summary statistics
        const totalClients = await ClientInformation.count({ where: { role: 'client' } });
        const activeClients = await ClientInformation.count({
            where: { role: 'client', status: 'active' }
        });
        const pendingClients = await ClientInformation.count({
            where: { role: 'client', status: 'pending' }
        });

        const totalPages = Math.ceil(count / limitNumber);

        res.status(200).json({
            success: true,
            data: clientsWithPackage,
            summary: {
                totalClients,
                activeClients,
                pendingClients,
                currentPageCount: clients.length
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            },
            filters: {
                startDate,
                endDate,
                status,
                customerType,
                location
            }
        });
    } catch (error) {
        console.error("Error in client registration report:", error);
        next(error);
    }
};

// 2. CLIENT STATUS REPORT
const getClientStatusReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = { role: 'client' };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
        }

        // Status breakdown
        const statusBreakdown = await ClientInformation.findAll({
            where: whereClause,
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('costForPackage')), 'totalRevenue']
            ],
            group: ['status']
        });

        // Status change history (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const statusChanges = await ClientInformation.findAll({
            where: {
                role: 'client',
                updatedAt: { [Op.gte]: thirtyDaysAgo }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('updatedAt')), 'date'],
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('updatedAt')), 'status'],
            order: [[sequelize.fn('DATE', sequelize.col('updatedAt')), 'DESC']]
        });

        // Monthly status trend
        const monthlyStatus = await ClientInformation.findAll({
            where: { role: 'client' },
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'status'],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'DESC']],
            limit: 12
        });

        res.status(200).json({
            success: true,
            data: {
                statusBreakdown,
                statusChanges,
                monthlyStatus
            }
        });
    } catch (error) {
        console.error("Error in client status report:", error);
        next(error);
    }
};

// 3. CLIENT PACKAGE DISTRIBUTION REPORT
const getClientPackageDistributionReport = async (req, res, next) => {
    try {
        const { startDate, endDate, status } = req.query;

        const whereClause = { role: 'client' };
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (status) whereClause.status = status;

        // Get all packages
        const packages = await Package.findAll({
            attributes: ['id', 'packageName', 'packageBandwidth', 'packagePrice', 'duration']
        });

        // Get client count per package
        const packageDistribution = await Promise.all(
            packages.map(async (pkg) => {
                const clientCount = await ClientInformation.count({
                    where: {
                        ...whereClause,
                        package: pkg.id
                    }
                });

                const activeClients = await ClientInformation.count({
                    where: {
                        ...whereClause,
                        package: pkg.id,
                        status: 'active'
                    }
                });

                const monthlyRevenue = clientCount * (pkg.packagePrice || 0);

                return {
                    packageId: pkg.id,
                    packageName: pkg.packageName,
                    bandwidth: pkg.packageBandwidth,
                    price: pkg.packagePrice,
                    duration: pkg.duration,
                    totalClients: clientCount,
                    activeClients: activeClients,
                    inactiveClients: clientCount - activeClients,
                    estimatedMonthlyRevenue: monthlyRevenue
                };
            })
        );

        // Total summary
        const totalSummary = {
            totalPackages: packages.length,
            totalClients: await ClientInformation.count({ where: whereClause }),
            totalActiveClients: await ClientInformation.count({
                where: { ...whereClause, status: 'active' }
            }),
            totalMonthlyRevenue: packageDistribution.reduce((sum, pkg) =>
                sum + pkg.estimatedMonthlyRevenue, 0
            )
        };

        res.status(200).json({
            success: true,
            data: {
                packageDistribution,
                totalSummary
            }
        });
    } catch (error) {
        console.error("Error in package distribution report:", error);
        next(error);
    }
};

// 4. CLIENT LOCATION REPORT
const getClientLocationReport = async (req, res, next) => {
    try {
        const { status } = req.query;

        const whereClause = { role: 'client' };
        if (status) whereClause.status = status;

        // Location distribution
        const locationDistribution = await ClientInformation.findAll({
            where: whereClause,
            attributes: [
                'location',
                'area',
                [sequelize.fn('COUNT', sequelize.col('id')), 'clientCount'],
                [sequelize.fn('SUM', sequelize.col('costForPackage')), 'totalRevenue']
            ],
            group: ['location', 'area'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
        });

        // Area-wise details
        const areaDetails = await ClientInformation.findAll({
            where: whereClause,
            attributes: [
                'area',
                'location',
                [sequelize.fn('COUNT', sequelize.col('id')), 'clientCount'],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'active' THEN 1 ELSE 0 END`)
                    ),
                    'activeCount'
                ]
            ],
            group: ['area', 'location'],
            order: [['area', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: {
                locationDistribution,
                areaDetails
            }
        });
    } catch (error) {
        console.error("Error in client location report:", error);
        next(error);
    }
};

// 5. REFERRAL CLIENT REPORT
const getReferralClientReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = {
            role: 'client',
            referId: { [Op.not]: null }
        };

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
        }

        // Get all referred clients
        const referredClients = await ClientInformation.findAll({
            where: whereClause,
            attributes: [
                'id', 'userId', 'fullName', 'mobileNo', 'email',
                'referId', 'createdAt', 'status', 'package'
            ],
            order: [['createdAt', 'DESC']]
        });

        // Get referrer details for each referred client
        const clientsWithReferrer = await Promise.all(
            referredClients.map(async (client) => {
                const clientData = client.toJSON();

                // Find referrer (could be client or employee)
                let referrer = await ClientInformation.findOne({
                    where: { userId: clientData.referId },
                    attributes: ['fullName', 'mobileNo', 'email', 'role']
                });

                if (!referrer) {
                    referrer = await AuthorityInformation.findOne({
                        where: { userId: clientData.referId },
                        attributes: ['fullName', 'mobileNo', 'email', 'role']
                    });
                }

                clientData.referrerDetails = referrer ? referrer.toJSON() : null;
                return clientData;
            })
        );

        // Referral statistics
        const referralStats = await ClientInformation.findAll({
            where: { role: 'client' },
            attributes: [
                'referId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'referralCount'],
                [
                    sequelize.fn('COUNT',
                        sequelize.literal(`CASE WHEN status = 'active' THEN 1 ELSE 0 END`)
                    ),
                    'activeReferrals'
                ]
            ],
            group: ['referId'],
            having: sequelize.literal('referralCount > 0'),
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
            limit: 20
        });

        // Top referrers with details
        const topReferrers = await Promise.all(
            referralStats.map(async (stat) => {
                const referrerData = stat.toJSON();

                let referrer = await ClientInformation.findOne({
                    where: { userId: referrerData.referId },
                    attributes: ['fullName', 'mobileNo', 'email']
                });

                if (!referrer) {
                    referrer = await AuthorityInformation.findOne({
                        where: { userId: referrerData.referId },
                        attributes: ['fullName', 'mobileNo', 'email']
                    });
                }

                return {
                    referId: referrerData.referId,
                    referrerName: referrer ? referrer.fullName : 'Unknown',
                    referrerContact: referrer ? referrer.mobileNo : 'N/A',
                    referralCount: referrerData.referralCount,
                    activeReferrals: referrerData.activeReferrals
                };
            })
        );

        res.status(200).json({
            success: true,
            data: {
                referredClients: clientsWithReferrer,
                topReferrers,
                totalReferrals: referredClients.length,
                uniqueReferrers: referralStats.length
            }
        });
    } catch (error) {
        console.error("Error in referral client report:", error);
        next(error);
    }
};

// 6. EMPLOYEE REPORT
const getEmployeeReport = async (req, res, next) => {
    try {
        const { status, role, jobType } = req.query;

        const whereClause = {};
        if (status) whereClause.status = status;
        if (role) whereClause.role = role;
        if (jobType) whereClause.jobType = jobType;

        // Get all employees
        const employees = await AuthorityInformation.findAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        // Role distribution
        const roleDistribution = await AuthorityInformation.findAll({
            attributes: [
                'role',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('AVG', sequelize.col('baseSalary')), 'avgSalary']
            ],
            group: ['role']
        });

        // Status distribution
        const statusDistribution = await AuthorityInformation.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        // Job type distribution
        const jobTypeDistribution = await AuthorityInformation.findAll({
            attributes: [
                'jobType',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['jobType']
        });

        res.status(200).json({
            success: true,
            data: {
                employees: employees.map(emp => emp.toJSON()),
                statistics: {
                    totalEmployees: employees.length,
                    roleDistribution,
                    statusDistribution,
                    jobTypeDistribution
                }
            }
        });
    } catch (error) {
        console.error("Error in employee report:", error);
        next(error);
    }
};

// 7. USER GROWTH REPORT
const getUserGrowthReport = async (req, res, next) => {
    try {
        const { period = 'monthly', startDate, endDate } = req.query;

        let dateFormat;
        switch (period) {
            case 'daily':
                dateFormat = '%Y-%m-%d';
                break;
            case 'monthly':
                dateFormat = '%Y-%m';
                break;
            case 'yearly':
                dateFormat = '%Y';
                break;
            default:
                dateFormat = '%Y-%m';
        }

        // Client growth
        const clientGrowth = await ClientInformation.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), dateFormat), 'period'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'newClients'],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'active' THEN 1 ELSE 0 END`)
                    ),
                    'activeClients'
                ]
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), dateFormat)],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), dateFormat), 'ASC']]
        });

        // Employee growth
        const employeeGrowth = await AuthorityInformation.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), dateFormat), 'period'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'newEmployees'],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'active' THEN 1 ELSE 0 END`)
                    ),
                    'activeEmployees'
                ]
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), dateFormat)],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), dateFormat), 'ASC']]
        });

        // Total users over time
        const totalUsersOverTime = await Promise.all(
            clientGrowth.map(async (clientPeriod, index) => {
                const periodDate = clientPeriod.period;

                // Calculate cumulative totals
                const totalClientsUpToPeriod = await ClientInformation.count({
                    where: {
                        createdAt: {
                            [Op.lte]: new Date(periodDate + (dateFormat === '%Y-%m' ? '-01' : ''))
                        }
                    }
                });

                const totalEmployeesUpToPeriod = await AuthorityInformation.count({
                    where: {
                        createdAt: {
                            [Op.lte]: new Date(periodDate + (dateFormat === '%Y-%m' ? '-01' : ''))
                        }
                    }
                });

                return {
                    period: periodDate,
                    newClients: clientGrowth[index]?.newClients || 0,
                    newEmployees: employeeGrowth[index]?.newEmployees || 0,
                    totalClients: totalClientsUpToPeriod,
                    totalEmployees: totalEmployeesUpToPeriod,
                    totalUsers: totalClientsUpToPeriod + totalEmployeesUpToPeriod
                };
            })
        );

        // Growth rate calculation
        const growthRate = totalUsersOverTime.map((period, index) => {
            if (index === 0) return { period: period.period, growthRate: 0 };

            const prevPeriod = totalUsersOverTime[index - 1];
            const growthRate = prevPeriod.totalUsers > 0
                ? ((period.totalUsers - prevPeriod.totalUsers) / prevPeriod.totalUsers * 100).toFixed(2)
                : 0;

            return {
                period: period.period,
                growthRate: parseFloat(growthRate)
            };
        });

        res.status(200).json({
            success: true,
            data: {
                clientGrowth,
                employeeGrowth,
                totalUsersOverTime,
                growthRate,
                period: period,
                summary: {
                    totalClients: await ClientInformation.count(),
                    totalEmployees: await AuthorityInformation.count(),
                    totalUsers: await ClientInformation.count() + await AuthorityInformation.count()
                }
            }
        });
    } catch (error) {
        console.error("Error in user growth report:", error);
        next(error);
    }
};







//! The collections

// 1. REVENUE COLLECTION REPORT
const getRevenueCollectionReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            paymentMethod,
            status,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions for transactions
        const transactionWhere = {};
        if (startDate || endDate) {
            transactionWhere.createdAt = {};
            if (startDate) transactionWhere.createdAt[Op.gte] = new Date(startDate);
            if (endDate) transactionWhere.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (status) transactionWhere.status = status;

        // Get transactions
        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: transactionWhere,
            limit: limitNumber,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: ClientInformation,
                as: 'client',
                attributes: ['fullName', 'mobileNo', 'email', 'userId']
            }]
        });

        // Get employee collections
        const employeeCollectionWhere = {};
        if (startDate || endDate) {
            employeeCollectionWhere.collectionDate = {};
            if (startDate) employeeCollectionWhere.collectionDate[Op.gte] = new Date(startDate);
            if (endDate) employeeCollectionWhere.collectionDate[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (status) employeeCollectionWhere.status = status;
        if (paymentMethod) employeeCollectionWhere.paymentMethod = paymentMethod;

        const employeeCollections = await EmployeePayment.findAll({
            where: employeeCollectionWhere,
            include: [
                {
                    model: ClientInformation,
                    as: 'client',
                    attributes: ['fullName', 'mobileNo', 'email']
                },
                {
                    model: AuthorityInformation,
                    as: 'employee',
                    attributes: ['fullName', 'userId']
                }
            ]
        });

        // Calculate totals
        const onlineRevenue = transactions
            .filter(t => t.status === 'approved')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        const employeeRevenue = employeeCollections
            .filter(ec => ec.status === 'deposited')
            .reduce((sum, ec) => sum + parseFloat(ec.amount || 0), 0);

        const totalRevenue = onlineRevenue + employeeRevenue;

        // Monthly revenue trend
        const monthlyRevenue = await Transaction.findAll({
            where: {
                status: 'approved',
                createdAt: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
                }
            },
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'revenue']
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
        });

        const totalPages = Math.ceil(count / limitNumber);

        res.status(200).json({
            success: true,
            data: {
                onlineTransactions: transactions,
                employeeCollections: employeeCollections,
                summary: {
                    totalRevenue,
                    onlineRevenue,
                    employeeRevenue,
                    totalTransactions: count,
                    totalCollections: employeeCollections.length
                },
                monthlyTrend: monthlyRevenue
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in revenue collection report:", error);
        next(error);
    }
};

// 2. PAYMENT STATUS REPORT
const getPaymentStatusReport = async (req, res, next) => {
    try {
        const { billingMonth, billingYear, clientId } = req.query;

        const whereClause = {};
        if (billingMonth) whereClause.billingMonth = billingMonth;
        if (billingYear) whereClause.billingYear = billingYear;
        if (clientId) whereClause.userId = clientId;

        // Get all transactions
        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [{
                model: ClientInformation,
                as: 'client',
                attributes: ['fullName', 'mobileNo', 'email', 'package', 'location']
            }],
            order: [['billingMonth', 'DESC'], ['billingYear', 'DESC']]
        });

        // Get employee collections
        const employeeCollections = await EmployeePayment.findAll({
            where: whereClause.billingMonth ? {
                billingMonth: whereClause.billingMonth
            } : {},
            include: [
                {
                    model: ClientInformation,
                    as: 'client',
                    attributes: ['fullName', 'mobileNo', 'email', 'package', 'location']
                },
                {
                    model: AuthorityInformation,
                    as: 'employee',
                    attributes: ['fullName', 'userId']
                }
            ]
        });

        // Combine and analyze payment status
        const allPayments = [
            ...transactions.map(t => ({
                type: 'Online',
                clientId: t.userId,
                clientName: t.client?.fullName || 'N/A',
                amount: t.amount,
                status: t.status,
                date: t.createdAt,
                billingMonth: t.billingMonth,
                billingYear: t.billingYear,
                method: 'Online Payment'
            })),
            ...employeeCollections.map(ec => ({
                type: 'Employee Collection',
                clientId: ec.clientId,
                clientName: ec.client?.fullName || 'N/A',
                amount: ec.amount,
                status: ec.status,
                date: ec.collectionDate,
                billingMonth: ec.billingMonth,
                billingYear: ec.billingYear,
                method: ec.paymentMethod,
                collectedBy: ec.employee?.fullName || 'N/A'
            }))
        ];

        // Group by client and billing period
        const clientPaymentStatus = {};
        allPayments.forEach(payment => {
            const key = `${payment.clientId}-${payment.billingMonth}-${payment.billingYear}`;
            if (!clientPaymentStatus[key]) {
                clientPaymentStatus[key] = {
                    clientId: payment.clientId,
                    clientName: payment.clientName,
                    billingMonth: payment.billingMonth,
                    billingYear: payment.billingYear,
                    totalAmount: 0,
                    paidAmount: 0,
                    pendingAmount: 0,
                    payments: [],
                    status: 'Unpaid'
                };
            }

            clientPaymentStatus[key].payments.push(payment);
            clientPaymentStatus[key].totalAmount += parseFloat(payment.amount || 0);

            if (payment.status === 'approved' || payment.status === 'deposited') {
                clientPaymentStatus[key].paidAmount += parseFloat(payment.amount || 0);
            } else {
                clientPaymentStatus[key].pendingAmount += parseFloat(payment.amount || 0);
            }

            // Determine overall status
            if (clientPaymentStatus[key].paidAmount > 0) {
                clientPaymentStatus[key].status =
                    clientPaymentStatus[key].paidAmount >= clientPaymentStatus[key].totalAmount
                        ? 'Paid'
                        : 'Partially Paid';
            }
        });

        const paymentStatusArray = Object.values(clientPaymentStatus);

        // Calculate statistics
        const totalClients = await ClientInformation.count({ where: { status: 'active' } });
        const paidClients = paymentStatusArray.filter(p => p.status === 'Paid').length;
        const partiallyPaid = paymentStatusArray.filter(p => p.status === 'Partially Paid').length;
        const unpaidClients = totalClients - (paidClients + partiallyPaid);

        // Overdue payments (more than 30 days from billing month)
        const overduePayments = paymentStatusArray.filter(payment => {
            const billingDate = new Date(`${payment.billingYear}-${payment.billingMonth}-01`);
            const today = new Date();
            const monthsDiff = (today.getFullYear() - billingDate.getFullYear()) * 12 +
                (today.getMonth() - billingDate.getMonth());
            return monthsDiff > 1 && payment.status !== 'Paid';
        });

        res.status(200).json({
            success: true,
            data: {
                paymentDetails: paymentStatusArray,
                statistics: {
                    totalClients,
                    paidClients,
                    partiallyPaid,
                    unpaidClients,
                    collectionRate: totalClients > 0 ? ((paidClients / totalClients) * 100).toFixed(2) : 0,
                    totalRevenue: paymentStatusArray.reduce((sum, p) => sum + p.totalAmount, 0),
                    collectedRevenue: paymentStatusArray.reduce((sum, p) => sum + p.paidAmount, 0),
                    pendingRevenue: paymentStatusArray.reduce((sum, p) => sum + p.pendingAmount, 0),
                    overduePaymentsCount: overduePayments.length,
                    overdueAmount: overduePayments.reduce((sum, p) => sum + p.pendingAmount, 0)
                },
                overduePayments
            }
        });
    } catch (error) {
        console.error("Error in payment status report:", error);
        next(error);
    }
};

// 3. MONTHLY BILLING REPORT
const getMonthlyBillingReport = async (req, res, next) => {
    try {
        const { year, month } = req.query;
        const targetYear = year || new Date().getFullYear();

        // Generate monthly data for the year
        const monthlyData = [];

        for (let m = 1; m <= 12; m++) {
            const monthStr = m.toString().padStart(2, '0');
            const billingMonth = `${targetYear}-${monthStr}`;

            // Get transactions for this month
            const transactions = await Transaction.findAll({
                where: {
                    billingMonth,
                    status: 'approved'
                }
            });

            // Get employee collections for this month
            const employeeCollections = await EmployeePayment.findAll({
                where: {
                    billingMonth,
                    status: 'deposited'
                }
            });

            const onlineRevenue = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
            const employeeRevenue = employeeCollections.reduce((sum, ec) => sum + parseFloat(ec.amount || 0), 0);
            const totalRevenue = onlineRevenue + employeeRevenue;

            // Count clients
            const activeClients = await ClientInformation.count({
                where: {
                    status: 'active',
                    createdAt: { [Op.lte]: new Date(`${targetYear}-${monthStr}-31`) }
                }
            });

            // Calculate average revenue per client
            const avgRevenuePerClient = activeClients > 0 ? (totalRevenue / activeClients).toFixed(2) : 0;

            monthlyData.push({
                month: billingMonth,
                year: targetYear,
                monthNumber: m,
                onlineRevenue,
                employeeRevenue,
                totalRevenue,
                transactionCount: transactions.length,
                collectionCount: employeeCollections.length,
                activeClients,
                avgRevenuePerClient: parseFloat(avgRevenuePerClient),
                collectionRate: activeClients > 0 ?
                    ((transactions.length + employeeCollections.length) / activeClients * 100).toFixed(2) : 0
            });
        }

        // Yearly summary
        const yearlySummary = {
            totalRevenue: monthlyData.reduce((sum, month) => sum + month.totalRevenue, 0),
            totalOnlineRevenue: monthlyData.reduce((sum, month) => sum + month.onlineRevenue, 0),
            totalEmployeeRevenue: monthlyData.reduce((sum, month) => sum + month.employeeRevenue, 0),
            totalTransactions: monthlyData.reduce((sum, month) => sum + month.transactionCount, 0),
            totalCollections: monthlyData.reduce((sum, month) => sum + month.collectionCount, 0),
            avgMonthlyRevenue: (monthlyData.reduce((sum, month) => sum + month.totalRevenue, 0) / 12).toFixed(2),
            peakMonth: monthlyData.reduce((max, month) => month.totalRevenue > max.totalRevenue ? month : max, monthlyData[0])
        };

        // Client package revenue distribution
        const packageRevenue = await ClientInformation.findAll({
            attributes: [
                'package',
                [sequelize.fn('COUNT', sequelize.col('id')), 'clientCount'],
                [sequelize.literal('COUNT(id) * (SELECT packagePrice FROM packages WHERE packages.id = package)'), 'estimatedRevenue']
            ],
            where: { status: 'active' },
            group: ['package'],
            raw: true
        });

        // Add package names
        const packages = await Package.findAll();
        const packageRevenueWithNames = packageRevenue.map(pkg => {
            const packageDetails = packages.find(p => p.id == pkg.package);
            return {
                packageId: pkg.package,
                packageName: packageDetails ? packageDetails.packageName : 'Unknown',
                clientCount: pkg.clientCount,
                estimatedMonthlyRevenue: pkg.estimatedRevenue || 0
            };
        });

        res.status(200).json({
            success: true,
            data: {
                monthlyData,
                yearlySummary,
                packageRevenue: packageRevenueWithNames,
                year: targetYear
            }
        });
    } catch (error) {
        console.error("Error in monthly billing report:", error);
        next(error);
    }
};

// 4. EMPLOYEE COLLECTION REPORT
const getEmployeeCollectionReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            employeeId,
            status,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions
        const whereClause = {};
        if (startDate || endDate) {
            whereClause.collectionDate = {};
            if (startDate) whereClause.collectionDate[Op.gte] = new Date(startDate);
            if (endDate) whereClause.collectionDate[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (employeeId) whereClause.employeeId = employeeId;
        if (status) whereClause.status = status;

        // Get employee collections with pagination
        const { count, rows: collections } = await EmployeePayment.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [['collectionDate', 'DESC']],
            include: [
                {
                    model: ClientInformation,
                    as: 'client',
                    attributes: ['fullName', 'mobileNo', 'email', 'location']
                },
                {
                    model: AuthorityInformation,
                    as: 'employee',
                    attributes: ['fullName', 'userId', 'role']
                }
            ]
        });

        // Employee performance summary
        const employeePerformance = await EmployeePayment.findAll({
            where: whereClause.status ? { status: whereClause.status } : {},
            attributes: [
                'employeeId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'collectionCount'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
                [sequelize.fn('AVG', sequelize.col('amount')), 'averageAmount'],
                [sequelize.fn('MIN', sequelize.col('collectionDate')), 'firstCollection'],
                [sequelize.fn('MAX', sequelize.col('collectionDate')), 'lastCollection']
            ],
            group: ['employeeId'],
            raw: true
        });

        // Add employee details to performance data
        const performanceWithDetails = await Promise.all(
            employeePerformance.map(async (perf) => {
                const employee = await AuthorityInformation.findOne({
                    where: { userId: perf.employeeId },
                    attributes: ['fullName', 'role', 'mobileNo']
                });

                // Calculate success rate (deposited vs total)
                const totalCollections = await EmployeePayment.count({
                    where: { employeeId: perf.employeeId }
                });

                const successfulCollections = await EmployeePayment.count({
                    where: {
                        employeeId: perf.employeeId,
                        status: 'deposited'
                    }
                });

                const successRate = totalCollections > 0 ?
                    (successfulCollections / totalCollections * 100).toFixed(2) : 0;

                return {
                    employeeId: perf.employeeId,
                    employeeName: employee ? employee.fullName : 'Unknown',
                    employeeRole: employee ? employee.role : 'N/A',
                    collectionCount: perf.collectionCount,
                    totalAmount: parseFloat(perf.totalAmount || 0),
                    averageAmount: parseFloat(perf.averageAmount || 0),
                    firstCollection: perf.firstCollection,
                    lastCollection: perf.lastCollection,
                    successRate: parseFloat(successRate),
                    contact: employee ? employee.mobileNo : 'N/A'
                };
            })
        );

        // Daily collection trend
        const dailyTrend = await EmployeePayment.findAll({
            where: whereClause,
            attributes: [
                [sequelize.fn('DATE', sequelize.col('collectionDate')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'amount']
            ],
            group: [sequelize.fn('DATE', sequelize.col('collectionDate'))],
            order: [[sequelize.fn('DATE', sequelize.col('collectionDate')), 'ASC']],
            limit: 30
        });

        const totalPages = Math.ceil(count / limitNumber);

        res.status(200).json({
            success: true,
            data: {
                collections,
                employeePerformance: performanceWithDetails,
                dailyTrend,
                summary: {
                    totalCollections: count,
                    totalAmount: collections.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0),
                    averageCollection: count > 0 ?
                        (collections.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) / count).toFixed(2) : 0,
                    uniqueEmployees: new Set(collections.map(c => c.employeeId)).size
                }
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in employee collection report:", error);
        next(error);
    }
};

// 5. TRANSACTION APPROVAL REPORT
const getTransactionApprovalReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            status,
            approvedBy,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions
        const whereClause = {};
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (status) whereClause.status = status;
        if (approvedBy) whereClause.approvedBy = approvedBy;

        // Get transactions
        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: ClientInformation,
                as: 'client',
                attributes: ['fullName', 'mobileNo', 'email']
            }]
        });

        // Approval statistics
        const approvalStats = await Transaction.findAll({
            where: whereClause.startDate || whereClause.endDate ? {
                createdAt: whereClause.createdAt
            } : {},
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
                [sequelize.fn('AVG', sequelize.col('amount')), 'averageAmount']
            ],
            group: ['status']
        });

        // Approver performance
        const approverPerformance = await Transaction.findAll({
            where: {
                approvedBy: { [Op.not]: null },
                ...(whereClause.createdAt ? { createdAt: whereClause.createdAt } : {})
            },
            attributes: [
                'approvedBy',
                [sequelize.fn('COUNT', sequelize.col('id')), 'approvedCount'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalApprovedAmount'],
                [sequelize.fn('AVG',
                    sequelize.literal('TIMESTAMPDIFF(MINUTE, createdAt, approvedAt)')
                ), 'avgApprovalTime']
            ],
            group: ['approvedBy'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
        });

        // Approval time analysis
        const approvalTimeAnalysis = await Transaction.findAll({
            where: {
                status: 'approved',
                approvedAt: { [Op.not]: null },
                ...(whereClause.createdAt ? { createdAt: whereClause.createdAt } : {})
            },
            attributes: [
                [sequelize.fn('HOUR', sequelize.col('approvedAt')), 'hourOfDay'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('AVG',
                    sequelize.literal('TIMESTAMPDIFF(MINUTE, createdAt, approvedAt)')
                ), 'avgApprovalTime']
            ],
            group: [sequelize.fn('HOUR', sequelize.col('approvedAt'))],
            order: [[sequelize.fn('HOUR', sequelize.col('approvedAt')), 'ASC']]
        });

        // Pending transactions requiring attention
        const pendingTransactions = await Transaction.findAll({
            where: {
                status: 'pending',
                createdAt: {
                    [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 1)) // Older than 1 day
                }
            },
            include: [{
                model: ClientInformation,
                as: 'client',
                attributes: ['fullName', 'mobileNo', 'email']
            }],
            order: [['createdAt', 'ASC']],
            limit: 50
        });

        const totalPages = Math.ceil(count / limitNumber);

        res.status(200).json({
            success: true,
            data: {
                transactions,
                statistics: {
                    approvalStats,
                    approverPerformance,
                    approvalTimeAnalysis,
                    pendingCount: pendingTransactions.length,
                    totalTransactions: count,
                    approvalRate: count > 0 ?
                        (approvalStats.find(s => s.status === 'approved')?.count || 0) / count * 100 : 0
                },
                pendingAttention: pendingTransactions
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in transaction approval report:", error);
        next(error);
    }
};

// 6. BANK ACCOUNT BALANCE REPORT
const getBankAccountBalanceReport = async (req, res, next) => {
    try {
        const { accountType, isActive, isPrimary } = req.query;

        const whereClause = {};
        if (accountType) whereClause.accountType = accountType;
        if (isActive !== undefined) whereClause.isActive = isActive === 'true';
        if (isPrimary !== undefined) whereClause.isPrimary = isPrimary === 'true';

        // Get all bank accounts
        const bankAccounts = await BankAccount.findAll({
            where: whereClause,
            order: [
                ['isPrimary', 'DESC'],
                ['currentBalance', 'DESC']
            ]
        });

        // Calculate totals
        const totals = bankAccounts.reduce((acc, account) => {
            const balance = parseFloat(account.currentBalance || 0);

            if (account.isActive) {
                acc.totalBalance += balance;
                acc.activeAccounts++;
            }

            if (account.isPrimary) {
                acc.primaryBalance += balance;
            }

            // Group by account type
            if (!acc.byType[account.accountType]) {
                acc.byType[account.accountType] = {
                    count: 0,
                    balance: 0
                };
            }
            acc.byType[account.accountType].count++;
            acc.byType[account.accountType].balance += balance;

            return acc;
        }, {
            totalBalance: 0,
            primaryBalance: 0,
            activeAccounts: 0,
            byType: {}
        });

        // Recent transactions for each account (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // You would need to have transaction models linked to bank accounts
        // For now, we'll return basic account info

        // Account balance trend (last 30 days)
        const balanceHistory = await BankAccount.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('lastTransactionDate')), 'date'],
                [sequelize.fn('SUM', sequelize.col('currentBalance')), 'totalBalance'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'accountCount']
            ],
            where: {
                lastTransactionDate: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) }
            },
            group: [sequelize.fn('DATE', sequelize.col('lastTransactionDate'))],
            order: [[sequelize.fn('DATE', sequelize.col('lastTransactionDate')), 'DESC']]
        });

        // Account status summary
        const statusSummary = {
            totalAccounts: bankAccounts.length,
            activeAccounts: bankAccounts.filter(a => a.isActive).length,
            inactiveAccounts: bankAccounts.filter(a => !a.isActive).length,
            primaryAccounts: bankAccounts.filter(a => a.isPrimary).length,
            totalBalance: totals.totalBalance,
            primaryBalance: totals.primaryBalance
        };

        // Low balance alerts (below 10% of transaction limit)
        const lowBalanceAccounts = bankAccounts.filter(account => {
            const balance = parseFloat(account.currentBalance || 0);
            const dailyLimit = parseFloat(account.dailyLimit || 0);
            const monthlyLimit = parseFloat(account.monthlyLimit || 0);

            const limit = dailyLimit > 0 ? dailyLimit : monthlyLimit;
            return limit > 0 && balance < (limit * 0.1);
        });

        res.status(200).json({
            success: true,
            data: {
                bankAccounts: bankAccounts.map(account => account.toJSON()),
                totals,
                statusSummary,
                balanceHistory,
                lowBalanceAlerts: lowBalanceAccounts.map(account => ({
                    accountName: account.accountName,
                    bankName: account.bankName,
                    accountNumber: account.accountNumber,
                    currentBalance: account.currentBalance,
                    dailyLimit: account.dailyLimit,
                    monthlyLimit: account.monthlyLimit,
                    balancePercentage: account.dailyLimit ?
                        ((account.currentBalance / account.dailyLimit) * 100).toFixed(2) + '%' :
                        'N/A'
                })),
                byAccountType: totals.byType
            }
        });
    } catch (error) {
        console.error("Error in bank account balance report:", error);
        next(error);
    }
};

// 7. EXPENSE REPORT
const getExpenseReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            categoryId,
            subcategoryId,
            status,
            paymentStatus,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions
        const whereClause = {};
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = new Date(startDate);
            if (endDate) whereClause.date[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (categoryId) whereClause.expenseCategoryId = categoryId;
        if (subcategoryId) whereClause.expenseSubcategoryId = subcategoryId;
        if (status) whereClause.status = status;
        if (paymentStatus) whereClause.paymentStatus = paymentStatus;

        // Get expenses with pagination
        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [['date', 'DESC']],
            include: [
                {
                    model: ExpenseCategory,
                    as: 'category',
                    attributes: ['id', 'categoryName']
                },
                {
                    model: ExpenseSubCategory,
                    as: 'subcategory',
                    attributes: ['id', 'subCategoryName']
                },
                {
                    model: ExpensePayment,
                    as: 'payments',
                    include: [{
                        model: BankAccount,
                        as: 'account',
                        attributes: ['bankName', 'accountName', 'accountNumber']
                    }]
                }
            ]
        });

        // Expense statistics by category
        const categoryStats = await Expense.findAll({
            where: whereClause,
            attributes: [
                'expenseCategoryId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
                [sequelize.fn('AVG', sequelize.col('totalAmount')), 'averageAmount']
            ],
            group: ['expenseCategoryId'],
            include: [{
                model: ExpenseCategory,
                as: 'category',
                attributes: ['categoryName']
            }]
        });

        // Monthly expense trend
        const monthlyExpense = await Expense.findAll({
            where: whereClause.startDate || whereClause.endDate ? {
                date: whereClause.date
            } : {},
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m')],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'DESC']],
            limit: 12
        });

        // Payment status summary
        const paymentStats = await Expense.findAll({
            where: whereClause,
            attributes: [
                'paymentStatus',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
            ],
            group: ['paymentStatus']
        });

        // Top expenses
        const topExpenses = await Expense.findAll({
            where: whereClause,
            order: [['totalAmount', 'DESC']],
            limit: 10,
            include: [
                {
                    model: ExpenseCategory,
                    as: 'category',
                    attributes: ['categoryName']
                },
                {
                    model: ExpenseSubCategory,
                    as: 'subcategory',
                    attributes: ['subCategoryName']
                }
            ]
        });

        const totalPages = Math.ceil(count / limitNumber);

        // Calculate totals
        const totals = {
            totalExpenses: count,
            totalAmount: expenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
            paidAmount: expenses
                .filter(exp => exp.paymentStatus === 'Paid')
                .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
            pendingAmount: expenses
                .filter(exp => exp.paymentStatus === 'Pending')
                .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
            averageExpense: count > 0 ?
                (expenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0) / count).toFixed(2) : 0
        };

        res.status(200).json({
            success: true,
            data: {
                expenses,
                statistics: {
                    categoryStats,
                    monthlyExpense,
                    paymentStats,
                    totals
                },
                topExpenses
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in expense report:", error);
        next(error);
    }
};




// 1. EMPLOYEE ATTENDANCE REPORT
const getEmployeeAttendanceReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            employeeId,
            status,
            department,
            page = 1,
            limit = 30
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions
        const whereClause = {};
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = new Date(startDate);
            if (endDate) whereClause.date[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (employeeId) whereClause.employeeId = employeeId;
        if (status) whereClause.status = status;

        // Get attendance records with pagination
        const { count, rows: attendanceRecords } = await EmployeeAttendance.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [['date', 'DESC']],
            include: [{
                model: AuthorityInformation,
                as: 'employee',
                attributes: ['fullName', 'userId', 'role', 'jobCategory', 'department']
            }]
        });

        // If department filter is applied, filter after fetching
        let filteredRecords = attendanceRecords;
        if (department) {
            filteredRecords = attendanceRecords.filter(record =>
                record.employee && record.employee.department === department
            );
        }

        // Calculate attendance statistics
        const attendanceStats = await EmployeeAttendance.findAll({
            where: whereClause,
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('AVG', sequelize.col('workingHours')), 'avgWorkingHours'],
                [sequelize.fn('SUM', sequelize.col('lateMinutes')), 'totalLateMinutes'],
                [sequelize.fn('AVG', sequelize.col('lateMinutes')), 'avgLateMinutes']
            ],
            group: ['status']
        });

        // Employee-wise attendance summary
        const employeeSummary = await EmployeeAttendance.findAll({
            where: whereClause,
            attributes: [
                'employeeId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalDays'],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Present' THEN 1 ELSE 0 END`)
                    ),
                    'presentDays'
                ],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Absent' THEN 1 ELSE 0 END`)
                    ),
                    'absentDays'
                ],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Leave' THEN 1 ELSE 0 END`)
                    ),
                    'leaveDays'
                ],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Half Day' THEN 1 ELSE 0 END`)
                    ),
                    'halfDays'
                ],
                [sequelize.fn('SUM', sequelize.col('workingHours')), 'totalWorkingHours'],
                [sequelize.fn('AVG', sequelize.col('workingHours')), 'avgWorkingHours'],
                [sequelize.fn('SUM', sequelize.col('lateMinutes')), 'totalLateMinutes']
            ],
            group: ['employeeId']
        });

        // Add employee details to summary
        const employeeSummaryWithDetails = await Promise.all(
            employeeSummary.map(async (summary) => {
                const employee = await AuthorityInformation.findOne({
                    where: { id: summary.employeeId },
                    attributes: ['fullName', 'userId', 'role', 'jobCategory', 'department', 'baseSalary']
                });

                const summaryData = summary.toJSON();

                // Calculate attendance percentage
                const attendancePercentage = summaryData.totalDays > 0
                    ? (summaryData.presentDays / summaryData.totalDays * 100).toFixed(2)
                    : 0;

                // Calculate late arrival frequency
                const lateFrequency = summaryData.totalDays > 0
                    ? (summaryData.totalLateMinutes > 0 ? 1 : 0) // Simplified - can be enhanced
                    : 0;

                return {
                    employeeId: summaryData.employeeId,
                    employeeName: employee ? employee.fullName : 'Unknown',
                    userId: employee ? employee.userId : 'N/A',
                    role: employee ? employee.role : 'N/A',
                    department: employee ? employee.department : 'N/A',
                    totalDays: summaryData.totalDays,
                    presentDays: summaryData.presentDays,
                    absentDays: summaryData.absentDays,
                    leaveDays: summaryData.leaveDays,
                    halfDays: summaryData.halfDays,
                    attendancePercentage: parseFloat(attendancePercentage),
                    totalWorkingHours: parseFloat(summaryData.totalWorkingHours || 0),
                    avgWorkingHours: parseFloat(summaryData.avgWorkingHours || 0),
                    totalLateMinutes: summaryData.totalLateMinutes,
                    lateFrequency: lateFrequency,
                    performanceScore: calculateAttendanceScore(
                        parseFloat(attendancePercentage),
                        parseFloat(summaryData.avgWorkingHours || 0),
                        summaryData.totalLateMinutes
                    )
                };
            })
        );

        // Daily attendance trend
        const dailyAttendance = await EmployeeAttendance.findAll({
            where: whereClause,
            attributes: [
                [sequelize.fn('DATE', sequelize.col('date')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalEmployees'],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Present' THEN 1 ELSE 0 END`)
                    ),
                    'presentCount'
                ],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Absent' THEN 1 ELSE 0 END`)
                    ),
                    'absentCount'
                ],
                [sequelize.fn('AVG', sequelize.col('workingHours')), 'avgWorkingHours']
            ],
            group: [sequelize.fn('DATE', sequelize.col('date'))],
            order: [[sequelize.fn('DATE', sequelize.col('date')), 'DESC']],
            limit: 30
        });

        // Late arrival analysis
        const lateAnalysis = await EmployeeAttendance.findAll({
            where: {
                ...whereClause,
                lateMinutes: { [Op.gt]: 0 }
            },
            attributes: [
                'employeeId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'lateDays'],
                [sequelize.fn('SUM', sequelize.col('lateMinutes')), 'totalLateMinutes'],
                [sequelize.fn('AVG', sequelize.col('lateMinutes')), 'avgLateMinutes'],
                [sequelize.fn('MAX', sequelize.col('lateMinutes')), 'maxLateMinutes']
            ],
            group: ['employeeId'],
            order: [[sequelize.fn('SUM', sequelize.col('lateMinutes')), 'DESC']]
        });

        const totalPages = Math.ceil(count / limitNumber);

        res.status(200).json({
            success: true,
            data: {
                attendanceRecords: filteredRecords.map(record => record.toJSON()),
                statistics: {
                    attendanceStats,
                    employeeSummary: employeeSummaryWithDetails,
                    dailyAttendance,
                    lateAnalysis
                },
                summary: {
                    totalRecords: count,
                    totalPresent: attendanceStats.find(s => s.status === 'Present')?.count || 0,
                    totalAbsent: attendanceStats.find(s => s.status === 'Absent')?.count || 0,
                    totalLeave: attendanceStats.find(s => s.status === 'Leave')?.count || 0,
                    avgWorkingHours: attendanceStats.reduce((sum, stat) =>
                        sum + (parseFloat(stat.avgWorkingHours || 0) * stat.count), 0
                    ) / count,
                    totalLateMinutes: attendanceStats.reduce((sum, stat) =>
                        sum + (parseInt(stat.totalLateMinutes || 0)), 0
                    )
                }
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in employee attendance report:", error);
        next(error);
    }
};

// Helper function to calculate attendance performance score
const calculateAttendanceScore = (attendancePercentage, avgWorkingHours, totalLateMinutes) => {
    let score = 100;

    // Deduct for low attendance
    if (attendancePercentage < 95) score -= (95 - attendancePercentage);
    if (attendancePercentage < 90) score -= 5;
    if (attendancePercentage < 85) score -= 10;

    // Deduct for low working hours (assuming 8 hours standard)
    if (avgWorkingHours < 8) score -= (8 - avgWorkingHours) * 2;

    // Deduct for late minutes
    if (totalLateMinutes > 0) {
        score -= Math.min(totalLateMinutes * 0.1, 20); // Max 20 points deduction
    }

    return Math.max(0, Math.min(100, score));
};

// 2. SALARY & PAYMENT REPORT
const getSalaryPaymentReport = async (req, res, next) => {
    try {
        const {
            salaryMonth,
            salaryYear,
            employeeId,
            paymentStatus,
            department,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions
        const whereClause = {};
        if (salaryMonth) whereClause.salaryMonth = salaryMonth;
        if (salaryYear) whereClause.salaryYear = salaryYear;
        if (employeeId) whereClause.employeeId = employeeId;
        if (paymentStatus) whereClause.paymentStatus = paymentStatus;

        // Get salary records with pagination
        const { count, rows: salaryRecords } = await Salary.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [['salaryMonth', 'DESC'], ['salaryYear', 'DESC']]
        });

        // If department filter is applied, filter after fetching with employee details
        let filteredRecords = salaryRecords;
        if (department) {
            const recordsWithEmployee = await Promise.all(
                salaryRecords.map(async (record) => {
                    const employee = await AuthorityInformation.findOne({
                        where: { userId: record.employeeId },
                        attributes: ['fullName', 'department', 'role', 'baseSalary']
                    });
                    return {
                        ...record.toJSON(),
                        employeeDetails: employee ? employee.toJSON() : null
                    };
                })
            );
            filteredRecords = recordsWithEmployee.filter(record =>
                record.employeeDetails && record.employeeDetails.department === department
            );
        } else {
            // Get employee details for all records
            filteredRecords = await Promise.all(
                salaryRecords.map(async (record) => {
                    const employee = await AuthorityInformation.findOne({
                        where: { userId: record.employeeId },
                        attributes: ['fullName', 'department', 'role', 'baseSalary']
                    });
                    return {
                        ...record.toJSON(),
                        employeeDetails: employee ? employee.toJSON() : null
                    };
                })
            );
        }

        // Salary statistics
        const salaryStats = await Salary.findAll({
            where: whereClause,
            attributes: [
                'paymentStatus',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('basicSalary')), 'totalBasic'],
                [sequelize.fn('SUM', sequelize.col('houseRent')), 'totalHouseRent'],
                [sequelize.fn('SUM', sequelize.col('medicalAllowance')), 'totalMedical'],
                [sequelize.fn('SUM', sequelize.col('travelAllowance')), 'totalTravel'],
                [sequelize.fn('SUM', sequelize.col('otherAllowances')), 'totalOtherAllowances'],
                [sequelize.fn('SUM', sequelize.col('overtimeAmount')), 'totalOvertime'],
                [sequelize.fn('SUM', sequelize.col('performanceBonus')), 'totalBonus'],
                [sequelize.fn('SUM', sequelize.col('providentFund')), 'totalPF'],
                [sequelize.fn('SUM', sequelize.col('taxDeduction')), 'totalTax']
            ],
            group: ['paymentStatus']
        });

        // Calculate net salary for each record
        const recordsWithNetSalary = filteredRecords.map(record => {
            const earnings =
                (record.basicSalary || 0) +
                (record.houseRent || 0) +
                (record.medicalAllowance || 0) +
                (record.travelAllowance || 0) +
                (record.otherAllowances || 0) +
                (record.overtimeAmount || 0) +
                (record.performanceBonus || 0) +
                (record.festivalBonus || 0) +
                (record.otherBonuses || 0);

            const deductions =
                (record.providentFund || 0) +
                (record.taxDeduction || 0) +
                (record.otherDeductions || 0);

            const netSalary = earnings - deductions;

            return {
                ...record,
                earnings: earnings.toFixed(2),
                deductions: deductions.toFixed(2),
                netSalary: netSalary.toFixed(2)
            };
        });

        // Monthly salary trend
        const monthlySalary = await Salary.findAll({
            attributes: [
                'salaryMonth',
                'salaryYear',
                [sequelize.fn('COUNT', sequelize.col('id')), 'employeeCount'],
                [sequelize.fn('SUM', sequelize.col('basicSalary')), 'totalBasic'],
                [sequelize.fn('SUM',
                    sequelize.literal('basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances')
                ), 'totalGross'],
                [sequelize.fn('SUM',
                    sequelize.literal('providentFund + taxDeduction + otherDeductions')
                ), 'totalDeductions'],
                [sequelize.fn('AVG',
                    sequelize.literal('basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances - providentFund - taxDeduction - otherDeductions')
                ), 'avgNetSalary']
            ],
            group: ['salaryMonth', 'salaryYear'],
            order: [['salaryYear', 'DESC'], ['salaryMonth', 'DESC']],
            limit: 12
        });

        // Department-wise salary summary
        const departmentSalary = await Salary.findAll({
            attributes: [
                [sequelize.literal('employee.department'), 'department'],
                [sequelize.fn('COUNT', sequelize.col('Salary.id')), 'employeeCount'],
                [sequelize.fn('SUM', sequelize.col('basicSalary')), 'totalBasic'],
                [sequelize.fn('AVG', sequelize.col('basicSalary')), 'avgBasic'],
                [sequelize.fn('SUM',
                    sequelize.literal('basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances')
                ), 'totalGross'],
                [sequelize.fn('AVG',
                    sequelize.literal('basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances')
                ), 'avgGross']
            ],
            include: [{
                model: AuthorityInformation,
                as: 'employee',
                attributes: [],
                required: true
            }],
            group: [sequelize.literal('employee.department')],
            raw: true
        });

        // Payment method distribution
        const paymentMethodDistribution = await Salary.findAll({
            where: whereClause,
            attributes: [
                'paymentMethod',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM',
                    sequelize.literal('basicSalary + houseRent + medicalAllowance + travelAllowance + otherAllowances - providentFund - taxDeduction - otherDeductions')
                ), 'totalAmount']
            ],
            group: ['paymentMethod']
        });

        const totalPages = Math.ceil(count / limitNumber);

        // Calculate totals
        const totals = {
            totalEmployees: count,
            totalBasic: salaryStats.reduce((sum, stat) => sum + parseFloat(stat.totalBasic || 0), 0),
            totalGross: salaryStats.reduce((sum, stat) =>
                sum + parseFloat(stat.totalBasic || 0) +
                parseFloat(stat.totalHouseRent || 0) +
                parseFloat(stat.totalMedical || 0) +
                parseFloat(stat.totalTravel || 0) +
                parseFloat(stat.totalOtherAllowances || 0), 0),
            totalDeductions: salaryStats.reduce((sum, stat) =>
                sum + parseFloat(stat.totalPF || 0) +
                parseFloat(stat.totalTax || 0), 0),
            totalNet: recordsWithNetSalary.reduce((sum, record) =>
                sum + parseFloat(record.netSalary || 0), 0),
            paidAmount: recordsWithNetSalary
                .filter(record => record.paymentStatus === 'paid')
                .reduce((sum, record) => sum + parseFloat(record.netSalary || 0), 0),
            pendingAmount: recordsWithNetSalary
                .filter(record => record.paymentStatus === 'pending')
                .reduce((sum, record) => sum + parseFloat(record.netSalary || 0), 0)
        };

        res.status(200).json({
            success: true,
            data: {
                salaryRecords: recordsWithNetSalary,
                statistics: {
                    salaryStats,
                    monthlySalary,
                    departmentSalary,
                    paymentMethodDistribution
                },
                totals
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in salary payment report:", error);
        next(error);
    }
};

// 3. LEAVE & ATTENDANCE SUMMARY
const getLeaveAttendanceSummary = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            employeeId,
            department,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions for attendance
        const attendanceWhere = {};
        if (startDate || endDate) {
            attendanceWhere.date = {};
            if (startDate) attendanceWhere.date[Op.gte] = new Date(startDate);
            if (endDate) attendanceWhere.date[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (employeeId) attendanceWhere.employeeId = employeeId;

        // Get attendance summary with pagination
        const { count, rows: attendanceSummary } = await EmployeeAttendance.findAndCountAll({
            where: attendanceWhere,
            limit: limitNumber,
            offset: offset,
            attributes: [
                'employeeId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalDays'],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Present' THEN 1 ELSE 0 END`)
                    ),
                    'presentDays'
                ],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Leave' THEN 1 ELSE 0 END`)
                    ),
                    'leaveDays'
                ],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Half Day' THEN 1 ELSE 0 END`)
                    ),
                    'halfDays'
                ],
                [
                    sequelize.fn('SUM',
                        sequelize.literal(`CASE WHEN status = 'Absent' THEN 1 ELSE 0 END`)
                    ),
                    'absentDays'
                ],
                [sequelize.fn('SUM', sequelize.col('workingHours')), 'totalWorkingHours'],
                [sequelize.fn('AVG', sequelize.col('workingHours')), 'avgWorkingHours'],
                [sequelize.fn('SUM', sequelize.col('lateMinutes')), 'totalLateMinutes'],
                [sequelize.fn('MAX', sequelize.col('lateMinutes')), 'maxLateMinutes']
            ],
            group: ['employeeId'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
        });

        // Add employee details and calculate metrics
        const summaryWithDetails = await Promise.all(
            attendanceSummary.map(async (summary) => {
                const employee = await AuthorityInformation.findOne({
                    where: { id: summary.employeeId },
                    attributes: ['fullName', 'userId', 'role', 'department', 'jobType', 'baseSalary']
                });

                const summaryData = summary.toJSON();

                // Calculate percentages
                const attendanceRate = summaryData.totalDays > 0
                    ? (summaryData.presentDays / summaryData.totalDays * 100).toFixed(2)
                    : 0;

                const leaveRate = summaryData.totalDays > 0
                    ? (summaryData.leaveDays / summaryData.totalDays * 100).toFixed(2)
                    : 0;

                const absenceRate = summaryData.totalDays > 0
                    ? (summaryData.absentDays / summaryData.totalDays * 100).toFixed(2)
                    : 0;

                // Calculate productivity score
                const productivityScore = calculateProductivityScore(
                    parseFloat(attendanceRate),
                    parseFloat(summaryData.avgWorkingHours || 0),
                    summaryData.totalLateMinutes
                );

                // Calculate leave balance (assuming 18 days annual leave)
                const annualLeaveEntitlement = 18; // days per year
                const monthsWorked = 12; // This should be calculated based on joining date
                const proRataLeave = (annualLeaveEntitlement / 12) * monthsWorked;
                const leaveBalance = proRataLeave - summaryData.leaveDays;

                return {
                    employeeId: summaryData.employeeId,
                    employeeName: employee ? employee.fullName : 'Unknown',
                    userId: employee ? employee.userId : 'N/A',
                    department: employee ? employee.department : 'N/A',
                    role: employee ? employee.role : 'N/A',
                    jobType: employee ? employee.jobType : 'N/A',
                    totalDays: summaryData.totalDays,
                    presentDays: summaryData.presentDays,
                    leaveDays: summaryData.leaveDays,
                    halfDays: summaryData.halfDays,
                    absentDays: summaryData.absentDays,
                    attendanceRate: parseFloat(attendanceRate),
                    leaveRate: parseFloat(leaveRate),
                    absenceRate: parseFloat(absenceRate),
                    totalWorkingHours: parseFloat(summaryData.totalWorkingHours || 0),
                    avgWorkingHours: parseFloat(summaryData.avgWorkingHours || 0),
                    totalLateMinutes: summaryData.totalLateMinutes,
                    maxLateMinutes: summaryData.maxLateMinutes,
                    productivityScore: productivityScore,
                    leaveEntitlement: proRataLeave.toFixed(2),
                    leaveBalance: leaveBalance > 0 ? leaveBalance.toFixed(2) : '0.00',
                    leaveStatus: leaveBalance > 5 ? 'Healthy' : leaveBalance > 0 ? 'Low' : 'Exhausted'
                };
            })
        );

        // Apply department filter if specified
        let filteredSummary = summaryWithDetails;
        if (department) {
            filteredSummary = summaryWithDetails.filter(summary =>
                summary.department === department
            );
        }

        // Department-wise summary
        const departmentSummary = filteredSummary.reduce((acc, summary) => {
            const dept = summary.department || 'Unassigned';
            if (!acc[dept]) {
                acc[dept] = {
                    department: dept,
                    employeeCount: 0,
                    totalDays: 0,
                    totalPresent: 0,
                    totalLeave: 0,
                    totalAbsent: 0,
                    avgAttendanceRate: 0,
                    avgProductivity: 0
                };
            }

            acc[dept].employeeCount++;
            acc[dept].totalDays += summary.totalDays;
            acc[dept].totalPresent += summary.presentDays;
            acc[dept].totalLeave += summary.leaveDays;
            acc[dept].totalAbsent += summary.absentDays;
            acc[dept].avgAttendanceRate += summary.attendanceRate;
            acc[dept].avgProductivity += summary.productivityScore;

            return acc;
        }, {});

        // Calculate averages for department summary
        Object.keys(departmentSummary).forEach(dept => {
            const deptData = departmentSummary[dept];
            deptData.avgAttendanceRate = deptData.employeeCount > 0
                ? (deptData.avgAttendanceRate / deptData.employeeCount).toFixed(2)
                : 0;
            deptData.avgProductivity = deptData.employeeCount > 0
                ? (deptData.avgProductivity / deptData.employeeCount).toFixed(2)
                : 0;
        });

        // Leave trend over time
        const leaveTrend = await EmployeeAttendance.findAll({
            where: {
                ...attendanceWhere,
                status: 'Leave'
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('date')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'leaveCount'],
                [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('employeeId'))), 'uniqueEmployees']
            ],
            group: [sequelize.fn('DATE', sequelize.col('date'))],
            order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']],
            limit: 30
        });

        // Top employees with most leave
        const topLeaveTakers = [...filteredSummary]
            .sort((a, b) => b.leaveDays - a.leaveDays)
            .slice(0, 10)
            .map(emp => ({
                employeeName: emp.employeeName,
                department: emp.department,
                leaveDays: emp.leaveDays,
                leaveRate: emp.leaveRate,
                leaveBalance: emp.leaveBalance,
                leaveStatus: emp.leaveStatus
            }));

        // Top performers (best attendance)
        const topPerformers = [...filteredSummary]
            .sort((a, b) => b.attendanceRate - a.attendanceRate)
            .slice(0, 10)
            .map(emp => ({
                employeeName: emp.employeeName,
                department: emp.department,
                attendanceRate: emp.attendanceRate,
                presentDays: emp.presentDays,
                productivityScore: emp.productivityScore
            }));

        const totalPages = Math.ceil(count / limitNumber);

        // Overall statistics
        const overallStats = {
            totalEmployees: filteredSummary.length,
            totalDaysTracked: filteredSummary.reduce((sum, emp) => sum + emp.totalDays, 0),
            avgAttendanceRate: filteredSummary.length > 0
                ? (filteredSummary.reduce((sum, emp) => sum + emp.attendanceRate, 0) / filteredSummary.length).toFixed(2)
                : 0,
            avgLeaveRate: filteredSummary.length > 0
                ? (filteredSummary.reduce((sum, emp) => sum + emp.leaveRate, 0) / filteredSummary.length).toFixed(2)
                : 0,
            totalLeaveDays: filteredSummary.reduce((sum, emp) => sum + emp.leaveDays, 0),
            totalAbsentDays: filteredSummary.reduce((sum, emp) => sum + emp.absentDays, 0),
            employeesOnLeave: filteredSummary.filter(emp => emp.leaveDays > 0).length,
            employeesExhaustedLeave: filteredSummary.filter(emp => emp.leaveStatus === 'Exhausted').length
        };

        res.status(200).json({
            success: true,
            data: {
                attendanceSummary: filteredSummary,
                departmentSummary: Object.values(departmentSummary),
                leaveTrend,
                topLeaveTakers,
                topPerformers,
                overallStats
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in leave attendance summary:", error);
        next(error);
    }
};

// Helper function to calculate productivity score
const calculateProductivityScore = (attendanceRate, avgWorkingHours, totalLateMinutes) => {
    let score = 100;

    // Attendance contributes 40%
    const attendanceScore = attendanceRate * 0.4;

    // Working hours contribute 40% (assuming 8 hours standard)
    const workingHoursScore = Math.min(avgWorkingHours / 8 * 40, 40);

    // Punctuality contributes 20% (deduct for late minutes)
    let punctualityScore = 20;
    if (totalLateMinutes > 0) {
        punctualityScore -= Math.min(totalLateMinutes * 0.05, 20);
    }

    score = attendanceScore + workingHoursScore + punctualityScore;
    return Math.max(0, Math.min(100, score.toFixed(2)));
};



















// 1. EXPENSE CATEGORY REPORT
const getExpenseCategoryReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            categoryId,
            subcategoryId,
            status,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where conditions
        const whereClause = {};
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = new Date(startDate);
            if (endDate) whereClause.date[Op.lte] = new Date(endDate + ' 23:59:59');
        }
        if (categoryId) whereClause.expenseCategoryId = categoryId;
        if (subcategoryId) whereClause.expenseSubcategoryId = subcategoryId;
        if (status) whereClause.status = status;

        // Get all expense categories with their expenses
        const categories = await ExpenseCategory.findAll({
            include: [{
                model: Expense,
                as: 'expenses',
                where: whereClause,
                required: false,
                include: [{
                    model: ExpenseSubCategory,
                    as: 'subcategory',
                    attributes: ['subCategoryName']
                }]
            }],
            order: [['categoryName', 'ASC']]
        });

        // Get expenses with pagination for detailed view
        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [['date', 'DESC']],
            include: [
                {
                    model: ExpenseCategory,
                    as: 'category',
                    attributes: ['categoryName']
                },
                {
                    model: ExpenseSubCategory,
                    as: 'subcategory',
                    attributes: ['subCategoryName']
                },
                {
                    model: ExpensePayment,
                    as: 'payments',
                    include: [{
                        model: BankAccount,
                        as: 'account',
                        attributes: ['bankName', 'accountName']
                    }]
                }
            ]
        });

        // Category-wise statistics
        const categoryStats = await Expense.findAll({
            where: whereClause,
            attributes: [
                'expenseCategoryId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
                [sequelize.fn('AVG', sequelize.col('totalAmount')), 'averageAmount'],
                [sequelize.fn('MIN', sequelize.col('totalAmount')), 'minAmount'],
                [sequelize.fn('MAX', sequelize.col('totalAmount')), 'maxAmount']
            ],
            group: ['expenseCategoryId'],
            include: [{
                model: ExpenseCategory,
                as: 'category',
                attributes: ['categoryName']
            }]
        });

        // Subcategory-wise statistics
        const subcategoryStats = await Expense.findAll({
            where: {
                ...whereClause,
                expenseSubcategoryId: { [Op.not]: null }
            },
            attributes: [
                'expenseCategoryId',
                'expenseSubcategoryId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
            ],
            group: ['expenseCategoryId', 'expenseSubcategoryId'],
            include: [
                {
                    model: ExpenseCategory,
                    as: 'category',
                    attributes: ['categoryName']
                },
                {
                    model: ExpenseSubCategory,
                    as: 'subcategory',
                    attributes: ['subCategoryName']
                }
            ]
        });

        // Monthly expense trend by category
        const monthlyCategoryTrend = await Expense.findAll({
            where: whereClause,
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'],
                'expenseCategoryId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'expenseCategoryId'],
            include: [{
                model: ExpenseCategory,
                as: 'category',
                attributes: ['categoryName']
            }],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'DESC']],
            limit: 36 // Last 3 years
        });

        // Payment status by category
        const paymentStatusByCategory = await Expense.findAll({
            where: whereClause,
            attributes: [
                'expenseCategoryId',
                'paymentStatus',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
            ],
            group: ['expenseCategoryId', 'paymentStatus'],
            include: [{
                model: ExpenseCategory,
                as: 'category',
                attributes: ['categoryName']
            }]
        });

        // Top expenses
        const topExpenses = await Expense.findAll({
            where: whereClause,
            order: [['totalAmount', 'DESC']],
            limit: 10,
            include: [
                {
                    model: ExpenseCategory,
                    as: 'category',
                    attributes: ['categoryName']
                },
                {
                    model: ExpenseSubCategory,
                    as: 'subcategory',
                    attributes: ['subCategoryName']
                }
            ]
        });

        const totalPages = Math.ceil(count / limitNumber);

        // Calculate totals
        const totals = {
            totalExpenses: count,
            totalAmount: expenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
            paidAmount: expenses
                .filter(exp => exp.paymentStatus === 'Paid')
                .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
            pendingAmount: expenses
                .filter(exp => exp.paymentStatus === 'Pending')
                .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
            averageExpense: count > 0 ?
                (expenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0) / count).toFixed(2) : 0,
            categoriesCount: categories.length,
            subcategoriesCount: new Set(expenses.filter(e => e.expenseSubcategoryId).map(e => e.expenseSubcategoryId)).size
        };

        // Format category data for charts
        const categoryChartData = categoryStats.map(stat => ({
            category: stat.category?.categoryName || 'Uncategorized',
            amount: parseFloat(stat.totalAmount || 0),
            count: stat.count,
            average: parseFloat(stat.averageAmount || 0)
        }));

        res.status(200).json({
            success: true,
            data: {
                categories: categories.map(cat => ({
                    id: cat.id,
                    categoryName: cat.categoryName,
                    categoryDetails: cat.categoryDetails,
                    expenseCount: cat.expenses.length,
                    totalAmount: cat.expenses.reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0)
                })),
                expenses,
                statistics: {
                    categoryStats,
                    subcategoryStats,
                    monthlyCategoryTrend,
                    paymentStatusByCategory
                },
                topExpenses,
                chartData: {
                    categoryChartData,
                    monthlyTrend: monthlyCategoryTrend.reduce((acc, item) => {
                        const month = item.month;
                        if (!acc[month]) acc[month] = { month, total: 0 };
                        acc[month].total += parseFloat(item.totalAmount || 0);
                        return acc;
                    }, {})
                },
                totals
            },
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in expense category report:", error);
        next(error);
    }
};

// 2. BANK TRANSACTION REPORT
const getBankTransactionReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            accountId,
            accountType,
            transactionType,
            page = 1,
            limit = 30
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Get bank accounts
        const bankAccounts = await BankAccount.findAll({
            where: accountType ? { accountType } : {},
            order: [['bankName', 'ASC'], ['accountName', 'ASC']]
        });

        // Get all transactions from different sources
        const allTransactions = [];

        // Get expense payments (outgoing)
        const expensePayments = await ExpensePayment.findAll({
            where: {
                ...(accountId ? { accountId } : {}),
                ...(startDate || endDate ? {
                    createdAt: {
                        ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                        ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
                    }
                } : {})
            },
            include: [
                {
                    model: Expense,
                    as: 'expense',
                    attributes: ['expenseCode', 'note', 'totalAmount']
                },
                {
                    model: BankAccount,
                    as: 'account',
                    attributes: ['bankName', 'accountName', 'accountNumber']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Add expense payments to transactions
        expensePayments.forEach(payment => {
            allTransactions.push({
                id: `expense-${payment.id}`,
                date: payment.createdAt,
                type: 'Expense Payment',
                description: payment.expense?.note || `Expense: ${payment.expense?.expenseCode}`,
                accountId: payment.accountId,
                accountName: payment.account?.accountName,
                bankName: payment.account?.bankName,
                debit: payment.paymentAmount,
                credit: 0,
                reference: payment.expense?.expenseCode,
                status: payment.status,
                source: 'Expense'
            });
        });

        // Get employee collection deposits (incoming)
        const employeeCollections = await EmployeePayment.findAll({
            where: {
                status: 'deposited',
                ...(accountId ? { paymentAccount: accountId } : {}),
                ...(startDate || endDate ? {
                    depositedAt: {
                        ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                        ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
                    }
                } : {})
            },
            include: [
                {
                    model: ClientInformation,
                    as: 'client',
                    attributes: ['fullName', 'mobileNo']
                },
                {
                    model: AuthorityInformation,
                    as: 'employee',
                    attributes: ['fullName']
                }
            ],
            order: [['depositedAt', 'DESC']]
        });

        // Add employee collections to transactions
        employeeCollections.forEach(collection => {
            allTransactions.push({
                id: `collection-${collection.id}`,
                date: collection.depositedAt,
                type: 'Revenue Deposit',
                description: `Collection from ${collection.client?.fullName || 'Client'} by ${collection.employee?.fullName || 'Employee'}`,
                accountId: collection.paymentAccount,
                accountName: 'Revenue Account', // This should come from bank account
                bankName: 'Collection Deposit',
                debit: 0,
                credit: collection.amount,
                reference: collection.receiptNumber,
                status: 'Deposited',
                source: 'Employee Collection'
            });
        });

        // Get online payments (incoming)
        const onlinePayments = await Transaction.findAll({
            where: {
                status: 'approved',
                ...(startDate || endDate ? {
                    createdAt: {
                        ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                        ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
                    }
                } : {})
            },
            include: [{
                model: ClientInformation,
                as: 'client',
                attributes: ['fullName', 'mobileNo']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Add online payments to transactions
        onlinePayments.forEach(payment => {
            // Assuming online payments go to a specific account
            allTransactions.push({
                id: `online-${payment.id}`,
                date: payment.createdAt,
                type: 'Online Payment',
                description: `Payment from ${payment.client?.fullName || 'Client'}`,
                accountId: 1, // This should be the main online payment account ID
                accountName: 'Online Payment Account',
                bankName: 'Payment Gateway',
                debit: 0,
                credit: payment.amount,
                reference: payment.trxId,
                status: 'Approved',
                source: 'Online Payment'
            });
        });

        // Sort all transactions by date
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Apply transaction type filter if specified
        let filteredTransactions = allTransactions;
        if (transactionType === 'debit') {
            filteredTransactions = allTransactions.filter(t => t.debit > 0);
        } else if (transactionType === 'credit') {
            filteredTransactions = allTransactions.filter(t => t.credit > 0);
        }

        // Apply pagination
        const paginatedTransactions = filteredTransactions.slice(offset, offset + limitNumber);
        const totalCount = filteredTransactions.length;

        // Account balance summary
        const accountSummary = await Promise.all(
            bankAccounts.map(async (account) => {
                // Calculate total debits for this account
                const totalDebits = allTransactions
                    .filter(t => t.accountId == account.id && t.debit > 0)
                    .reduce((sum, t) => sum + parseFloat(t.debit || 0), 0);

                // Calculate total credits for this account
                const totalCredits = allTransactions
                    .filter(t => t.accountId == account.id && t.credit > 0)
                    .reduce((sum, t) => sum + parseFloat(t.credit || 0), 0);

                const currentBalance = parseFloat(account.currentBalance || 0);
                const openingBalance = parseFloat(account.openingBalance || 0);
                const calculatedBalance = openingBalance + totalCredits - totalDebits;

                return {
                    accountId: account.id,
                    bankName: account.bankName,
                    accountName: account.accountName,
                    accountNumber: account.accountNumber,
                    accountType: account.accountType,
                    openingBalance,
                    totalDebits,
                    totalCredits,
                    currentBalance,
                    calculatedBalance,
                    discrepancy: currentBalance - calculatedBalance,
                    isBalanced: Math.abs(currentBalance - calculatedBalance) < 0.01
                };
            })
        );

        // Transaction summary by type
        const transactionSummary = {
            totalTransactions: allTransactions.length,
            totalDebits: allTransactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0),
            totalCredits: allTransactions.reduce((sum, t) => sum + parseFloat(t.credit || 0), 0),
            bySource: allTransactions.reduce((acc, t) => {
                if (!acc[t.source]) acc[t.source] = { count: 0, amount: 0 };
                acc[t.source].count++;
                acc[t.source].amount += parseFloat(t.debit || t.credit || 0);
                return acc;
            }, {}),
            byType: allTransactions.reduce((acc, t) => {
                if (!acc[t.type]) acc[t.type] = { count: 0, amount: 0 };
                acc[t.type].count++;
                acc[t.type].amount += parseFloat(t.debit || t.credit || 0);
                return acc;
            }, {})
        };

        // Daily transaction trend
        const dailyTrend = allTransactions.reduce((acc, transaction) => {
            const date = transaction.date.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = {
                    date,
                    debit: 0,
                    credit: 0,
                    count: 0
                };
            }
            acc[date].debit += parseFloat(transaction.debit || 0);
            acc[date].credit += parseFloat(transaction.credit || 0);
            acc[date].count++;
            return acc;
        }, {});

        const dailyTrendArray = Object.values(dailyTrend)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 30);

        const totalPages = Math.ceil(totalCount / limitNumber);

        res.status(200).json({
            success: true,
            data: {
                transactions: paginatedTransactions,
                bankAccounts,
                accountSummary,
                transactionSummary,
                dailyTrend: dailyTrendArray,
                totals: {
                    totalTransactions: totalCount,
                    totalAmount: allTransactions.reduce((sum, t) =>
                        sum + parseFloat(t.debit || 0) + parseFloat(t.credit || 0), 0
                    ),
                    netFlow: transactionSummary.totalCredits - transactionSummary.totalDebits
                }
            },
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (error) {
        console.error("Error in bank transaction report:", error);
        next(error);
    }
};

// 3. ACCOUNT RECONCILIATION REPORT
const getAccountReconciliationReport = async (req, res, next) => {
    try {
        const {
            accountId,
            startDate,
            endDate,
            page = 1,
            limit = 30
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Get specific account or all accounts
        const whereClause = {};
        if (accountId) whereClause.id = accountId;

        const bankAccounts = await BankAccount.findAll({
            where: whereClause,
            order: [['bankName', 'ASC']]
        });

        const reconciliationResults = await Promise.all(
            bankAccounts.map(async (account) => {
                // Get all transactions for this account from various sources
                const accountTransactions = [];

                // Expense payments from this account
                const expensePayments = await ExpensePayment.findAll({
                    where: {
                        accountId: account.id,
                        ...(startDate || endDate ? {
                            createdAt: {
                                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                                ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
                            }
                        } : {})
                    },
                    include: [{
                        model: Expense,
                        as: 'expense',
                        attributes: ['expenseCode', 'note', 'totalAmount', 'date']
                    }]
                });

                expensePayments.forEach(payment => {
                    accountTransactions.push({
                        id: `expense-${payment.id}`,
                        date: payment.createdAt,
                        type: 'Expense Payment',
                        description: payment.expense?.note || `Expense: ${payment.expense?.expenseCode}`,
                        amount: -payment.paymentAmount, // Negative for outgoing
                        reference: payment.expense?.expenseCode,
                        source: 'Expense System',
                        status: payment.status,
                        reconciled: payment.status === 'Processed'
                    });
                });

                // Employee collections deposited to this account
                const employeeCollections = await EmployeePayment.findAll({
                    where: {
                        paymentAccount: account.id,
                        status: 'deposited',
                        ...(startDate || endDate ? {
                            depositedAt: {
                                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                                ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
                            }
                        } : {})
                    },
                    include: [{
                        model: ClientInformation,
                        as: 'client',
                        attributes: ['fullName']
                    }]
                });

                employeeCollections.forEach(collection => {
                    accountTransactions.push({
                        id: `collection-${collection.id}`,
                        date: collection.depositedAt,
                        type: 'Revenue Deposit',
                        description: `Collection from ${collection.client?.fullName || 'Client'}`,
                        amount: collection.amount, // Positive for incoming
                        reference: collection.receiptNumber,
                        source: 'Collection System',
                        status: 'Deposited',
                        reconciled: true // Assuming deposited means reconciled
                    });
                });

                // Sort transactions by date
                accountTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

                // Calculate running balance
                let runningBalance = parseFloat(account.openingBalance || 0);
                const transactionsWithBalance = accountTransactions.map(transaction => {
                    runningBalance += parseFloat(transaction.amount || 0);
                    return {
                        ...transaction,
                        runningBalance: runningBalance.toFixed(2)
                    };
                });

                // Expected balance vs actual balance
                const expectedBalance = runningBalance;
                const actualBalance = parseFloat(account.currentBalance || 0);
                const discrepancy = actualBalance - expectedBalance;

                // Identify unreconciled transactions
                const unreconciledTransactions = accountTransactions.filter(t => !t.reconciled);
                const unreconciledAmount = unreconciledTransactions.reduce((sum, t) =>
                    sum + parseFloat(t.amount || 0), 0
                );

                // Transaction summary
                const summary = {
                    totalTransactions: accountTransactions.length,
                    reconciledTransactions: accountTransactions.filter(t => t.reconciled).length,
                    unreconciledTransactions: unreconciledTransactions.length,
                    totalIncoming: accountTransactions
                        .filter(t => t.amount > 0)
                        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
                    totalOutgoing: Math.abs(accountTransactions
                        .filter(t => t.amount < 0)
                        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)),
                    openingBalance: account.openingBalance,
                    expectedBalance,
                    actualBalance,
                    discrepancy: discrepancy.toFixed(2),
                    reconciliationStatus: Math.abs(discrepancy) < 0.01 ? 'Balanced' : 'Unbalanced',
                    unreconciledAmount: Math.abs(unreconciledAmount).toFixed(2)
                };

                // Apply pagination
                const paginatedTransactions = transactionsWithBalance.slice(offset, offset + limitNumber);
                const totalCount = transactionsWithBalance.length;
                const totalPages = Math.ceil(totalCount / limitNumber);

                return {
                    account: {
                        id: account.id,
                        bankName: account.bankName,
                        accountName: account.accountName,
                        accountNumber: account.accountNumber,
                        accountType: account.accountType,
                        currentBalance: account.currentBalance,
                        lastTransactionDate: account.lastTransactionDate
                    },
                    transactions: paginatedTransactions,
                    summary,
                    pagination: {
                        totalItems: totalCount,
                        totalPages,
                        currentPage: pageNumber,
                        itemsPerPage: limitNumber
                    }
                };
            })
        );

        // Overall reconciliation status
        const overallStatus = {
            totalAccounts: reconciliationResults.length,
            balancedAccounts: reconciliationResults.filter(r =>
                r.summary.reconciliationStatus === 'Balanced'
            ).length,
            unbalancedAccounts: reconciliationResults.filter(r =>
                r.summary.reconciliationStatus === 'Unbalanced'
            ).length,
            totalDiscrepancy: reconciliationResults.reduce((sum, r) =>
                sum + Math.abs(parseFloat(r.summary.discrepancy || 0)), 0
            ).toFixed(2),
            totalUnreconciled: reconciliationResults.reduce((sum, r) =>
                sum + parseFloat(r.summary.unreconciledAmount || 0), 0
            ).toFixed(2)
        };

        res.status(200).json({
            success: true,
            data: {
                reconciliationResults,
                overallStatus,
                filters: {
                    accountId,
                    startDate,
                    endDate
                }
            }
        });
    } catch (error) {
        console.error("Error in account reconciliation report:", error);
        next(error);
    }
};

// 4. ASSET MANAGEMENT REPORT
const getAssetManagementReport = async (req, res, next) => {
    try {
        const {
            assetType,
            status,
            assignedTo,
            page = 1,
            limit = 20
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Note: Since there's no dedicated Asset model in your provided models,
        // I'll create a conceptual report based on existing data
        // In a real system, you would have an Asset model

        // Conceptual assets from various sources:
        const conceptualAssets = [];

        // 1. Bank Accounts as financial assets
        const bankAccounts = await BankAccount.findAll({
            where: status ? { isActive: status === 'active' } : {}
        });

        bankAccounts.forEach(account => {
            conceptualAssets.push({
                id: `bank-${account.id}`,
                assetType: 'Financial',
                assetName: `${account.bankName} - ${account.accountName}`,
                description: `${account.accountType} Account`,
                serialNumber: account.accountNumber,
                purchaseValue: account.openingBalance,
                currentValue: account.currentBalance,
                purchaseDate: account.createdAt,
                status: account.isActive ? 'Active' : 'Inactive',
                assignedTo: 'Company',
                location: 'Bank',
                depreciation: 0, // Bank accounts don't depreciate
                maintenanceHistory: [],
                notes: account.notes
            });
        });

        // 2. Employee assets (conceptual - laptops, phones, etc.)
        // This would normally come from an Asset model
        // For now, we'll create sample data

        // 3. Network equipment (routers, switches, etc.) - conceptual
        // This would normally come from an Inventory model

        // Apply filters
        let filteredAssets = conceptualAssets;
        if (assetType) {
            filteredAssets = filteredAssets.filter(asset =>
                asset.assetType === assetType
            );
        }
        if (assignedTo) {
            filteredAssets = filteredAssets.filter(asset =>
                asset.assignedTo === assignedTo
            );
        }

        // Apply pagination
        const paginatedAssets = filteredAssets.slice(offset, offset + limitNumber);
        const totalCount = filteredAssets.length;

        // Asset statistics
        const assetStats = {
            totalAssets: totalCount,
            totalValue: filteredAssets.reduce((sum, asset) =>
                sum + parseFloat(asset.currentValue || 0), 0
            ).toFixed(2),
            byType: filteredAssets.reduce((acc, asset) => {
                if (!acc[asset.assetType]) acc[asset.assetType] = { count: 0, value: 0 };
                acc[asset.assetType].count++;
                acc[asset.assetType].value += parseFloat(asset.currentValue || 0);
                return acc;
            }, {}),
            byStatus: filteredAssets.reduce((acc, asset) => {
                if (!acc[asset.status]) acc[asset.status] = { count: 0, value: 0 };
                acc[asset.status].count++;
                acc[asset.status].value += parseFloat(asset.currentValue || 0);
                return acc;
            }, {})
        };

        // Depreciation schedule (conceptual)
        const depreciationSchedule = filteredAssets
            .filter(asset => asset.assetType !== 'Financial')
            .map(asset => {
                const purchaseDate = new Date(asset.purchaseDate);
                const usefulLife = 5; // years
                const salvageValue = parseFloat(asset.purchaseValue || 0) * 0.1;
                const annualDepreciation = (parseFloat(asset.purchaseValue || 0) - salvageValue) / usefulLife;

                const years = [];
                for (let i = 1; i <= usefulLife; i++) {
                    const yearEndValue = Math.max(
                        parseFloat(asset.purchaseValue || 0) - (annualDepreciation * i),
                        salvageValue
                    );
                    years.push({
                        year: i,
                        depreciation: annualDepreciation.toFixed(2),
                        bookValue: yearEndValue.toFixed(2)
                    });
                }

                return {
                    assetName: asset.assetName,
                    purchaseValue: asset.purchaseValue,
                    usefulLife,
                    salvageValue: salvageValue.toFixed(2),
                    annualDepreciation: annualDepreciation.toFixed(2),
                    schedule: years
                };
            });

        // Maintenance history (conceptual - would come from Maintenance model)
        const maintenanceHistory = [
            // Sample data - in real system, this would come from database
            {
                assetId: 'sample-1',
                assetName: 'Sample Router',
                maintenanceDate: '2024-01-15',
                type: 'Preventive',
                cost: 5000,
                description: 'Regular maintenance and firmware update',
                performedBy: 'Tech Team'
            }
        ];

        const totalPages = Math.ceil(totalCount / limitNumber);

        res.status(200).json({
            success: true,
            data: {
                assets: paginatedAssets,
                statistics: assetStats,
                depreciationSchedule,
                maintenanceHistory,
                summary: {
                    totalAssets: assetStats.totalAssets,
                    totalAssetValue: assetStats.totalValue,
                    activeAssets: assetStats.byStatus.Active?.count || 0,
                    inactiveAssets: assetStats.byStatus.Inactive?.count || 0,
                    financialAssets: assetStats.byType.Financial?.count || 0,
                    equipmentAssets: assetStats.byType.Equipment?.count || 0
                }
            },
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            },
            note: "This is a conceptual asset management report. In a production system, you would need dedicated Asset, Inventory, and Maintenance models."
        });
    } catch (error) {
        console.error("Error in asset management report:", error);
        next(error);
    }
};



























// 1. CHAT/SUPPORT TICKET REPORT
const getChatSupportReport = async (req, res, next) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      priority, 
      category,
      assignedTo,
      page = 1, 
      limit = 20 
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
    }
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (category) whereClause.category = category;
    if (assignedTo) whereClause.assignedTo = assignedTo;

    // Get chats with pagination
    const { count, rows: chats } = await Chat.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [['lastMessageAt', 'DESC']],
      include: [
        {
          model: ChatMessage,
          as: 'chatmessages',
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('chatmessages.id')), 'messageCount'],
            [sequelize.fn('MAX', sequelize.col('chatmessages.createdAt')), 'lastMessageTime']
          ],
          required: false
        },
        {
          model: ChatParticipant,
          as: 'chatparticipants',
          attributes: ['userId', 'userType', 'role'],
          required: false
        }
      ],
      group: ['Chat.id'] // Group by chat to avoid duplication from joins
    });

    // Get detailed chat information with participants
    const detailedChats = await Promise.all(
      chats.map(async (chat) => {
        const chatData = chat.toJSON();
        
        // Get participants with details
        const participants = await Promise.all(
          (chatData.chatparticipants || []).map(async (participant) => {
            let userDetails = null;
            
            if (participant.userType === 'User') {
              userDetails = await ClientInformation.findOne({
                where: { id: participant.userId },
                attributes: ['fullName', 'mobileNo', 'email', 'userId']
              });
            } else if (participant.userType === 'Support' || participant.userType === 'Admin') {
              userDetails = await AuthorityInformation.findOne({
                where: { id: participant.userId },
                attributes: ['fullName', 'mobileNo', 'email', 'userId', 'role']
              });
            }
            
            return {
              ...participant,
              userDetails: userDetails ? userDetails.toJSON() : null
            };
          })
        );
        
        // Get assigned agent details if assigned
        let assignedAgent = null;
        if (chatData.assignedTo) {
          assignedAgent = await AuthorityInformation.findOne({
            where: { id: chatData.assignedTo },
            attributes: ['fullName', 'userId', 'role']
          });
        }
        
        // Get creator details
        let creatorDetails = null;
        const creatorParticipant = participants.find(p => p.role === 'Creator');
        if (creatorParticipant) {
          creatorDetails = creatorParticipant.userDetails;
        }
        
        return {
          ...chatData,
          participants,
          assignedAgent: assignedAgent ? assignedAgent.toJSON() : null,
          creatorDetails,
          messageCount: chatData.chatmessages?.[0]?.messageCount || 0,
          lastMessageTime: chatData.chatmessages?.[0]?.lastMessageTime || null
        };
      })
    );

    // Chat statistics
    const chatStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [
          sequelize.fn('AVG', 
            sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)')
          ), 
          'avgResolutionTime'
        ]
      ],
      group: ['status']
    });

    // Category statistics
    const categoryStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [
          sequelize.fn('AVG', 
            sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)')
          ), 
          'avgResolutionTime'
        ]
      ],
      group: ['category']
    });

    // Priority statistics
    const priorityStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [
          sequelize.fn('AVG', 
            sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)')
          ), 
          'avgResolutionTime'
        ]
      ],
      group: ['priority']
    });

    // Daily chat trend
    const dailyTrend = await Chat.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'newChats'],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`)
          ), 
          'resolvedChats'
        ]
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'DESC']],
      limit: 30
    });

    // Response time analysis
    const responseTimeAnalysis = await Chat.findAll({
      where: {
        ...whereClause,
        lastMessageAt: { [Op.not]: null }
      },
      attributes: [
        [
          sequelize.fn('HOUR', 
            sequelize.literal('TIMESTAMPDIFF(MINUTE, createdAt, lastMessageAt)')
          ), 
          'resolutionHours'
        ],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.literal('HOUR(TIMESTAMPDIFF(MINUTE, createdAt, lastMessageAt))')],
      order: [[sequelize.literal('resolutionHours'), 'ASC']]
    });

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate summary
    const summary = {
      totalChats: count,
      activeChats: chatStats.find(s => s.status === 'Active')?.count || 0,
      resolvedChats: chatStats.find(s => s.status === 'Resolved')?.count || 0,
      avgResolutionTime: chatStats.reduce((sum, stat) => 
        sum + (parseFloat(stat.avgResolutionTime || 0) * stat.count), 0
      ) / count,
      mostCommonCategory: categoryStats.reduce((max, cat) => 
        cat.count > max.count ? cat : max, { category: 'None', count: 0 }
      ),
      urgentPriorityCount: priorityStats.find(p => p.priority === 'Urgent')?.count || 0
    };

    res.status(200).json({
      success: true,
      data: {
        chats: detailedChats,
        statistics: {
          chatStats,
          categoryStats,
          priorityStats,
          dailyTrend,
          responseTimeAnalysis
        },
        summary
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error in chat support report:", error);
    next(error);
  }
};

// 2. REMINDER & NOTIFICATION REPORT
const getReminderNotificationReport = async (req, res, next) => {
  try {
    const { 
      startDate, 
      endDate, 
      reminderType, 
      status,
      reminderMethod,
      priority,
      page = 1, 
      limit = 30 
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.scheduledAt = {};
      if (startDate) whereClause.scheduledAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.scheduledAt[Op.lte] = new Date(endDate + ' 23:59:59');
    }
    if (reminderType) whereClause.reminderType = reminderType;
    if (status) whereClause.status = status;
    if (reminderMethod) whereClause.reminderMethod = reminderMethod;
    if (priority) whereClause.priority = priority;

    // Get reminders with pagination
    const { count, rows: reminders } = await Reminder.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [['scheduledAt', 'DESC']]
    });

    // Get client details for each reminder
    const remindersWithDetails = await Promise.all(
      reminders.map(async (reminder) => {
        const reminderData = reminder.toJSON();
        
        // Get client details
        let clientDetails = null;
        if (reminderData.customerId) {
          clientDetails = await ClientInformation.findOne({
            where: { id: reminderData.customerId },
            attributes: ['fullName', 'mobileNo', 'email', 'userId', 'package', 'status']
          });
        }
        
        // Calculate days until/since due date
        const dueDate = new Date(reminderData.dueDate);
        const today = new Date();
        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        let dueStatus = 'Future';
        if (daysDiff < 0) dueStatus = 'Overdue';
        else if (daysDiff === 0) dueStatus = 'Due Today';
        else if (daysDiff <= 3) dueStatus = 'Due Soon';
        
        return {
          ...reminderData,
          clientDetails: clientDetails ? clientDetails.toJSON() : null,
          daysDifference: daysDiff,
          dueStatus,
          isRecurring: reminderData.isRecurring,
          nextReminderDate: reminderData.nextReminderDate
        };
      })
    );

    // Reminder statistics
    const reminderStats = await Reminder.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amountDue')), 'totalAmount'],
        [
          sequelize.fn('AVG', 
            sequelize.literal('TIMESTAMPDIFF(HOUR, scheduledAt, sentAt)')
          ), 
          'avgDeliveryTime'
        ]
      ],
      group: ['status']
    });

    // Type statistics
    const typeStats = await Reminder.findAll({
      where: whereClause,
      attributes: [
        'reminderType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amountDue')), 'totalAmount'],
        [
          sequelize.fn('AVG', 
            sequelize.literal('CASE WHEN status = "Sent" THEN TIMESTAMPDIFF(HOUR, scheduledAt, sentAt) ELSE NULL END')
          ), 
          'avgDeliveryTime'
        ]
      ],
      group: ['reminderType']
    });

    // Method statistics
    const methodStats = await Reminder.findAll({
      where: whereClause,
      attributes: [
        'reminderMethod',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amountDue')), 'totalAmount'],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Sent' THEN 1 ELSE 0 END`)
          ), 
          'successCount'
        ],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Failed' THEN 1 ELSE 0 END`)
          ), 
          'failedCount'
        ]
      ],
      group: ['reminderMethod']
    });

    // Daily reminder trend
    const dailyTrend = await Reminder.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('DATE', sequelize.col('scheduledAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'scheduledCount'],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Sent' THEN 1 ELSE 0 END`)
          ), 
          'sentCount'
        ],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Failed' THEN 1 ELSE 0 END`)
          ), 
          'failedCount'
        ],
        [sequelize.fn('SUM', sequelize.col('amountDue')), 'totalAmount']
      ],
      group: [sequelize.fn('DATE', sequelize.col('scheduledAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('scheduledAt')), 'DESC']],
      limit: 30
    });

    // Success rate by method
    const successRateByMethod = methodStats.map(method => {
      const methodData = method.toJSON();
      const successRate = methodData.count > 0 
        ? (methodData.successCount / methodData.count * 100).toFixed(2)
        : 0;
      return {
        method: methodData.reminderMethod,
        total: methodData.count,
        success: methodData.successCount,
        failed: methodData.failedCount,
        successRate: parseFloat(successRate),
        totalAmount: parseFloat(methodData.totalAmount || 0)
      };
    });

    // Overdue reminders analysis
    const overdueReminders = remindersWithDetails.filter(reminder => 
      reminder.dueStatus === 'Overdue' && reminder.status !== 'Sent'
    );

    // Recurring reminders analysis
    const recurringReminders = remindersWithDetails.filter(reminder => 
      reminder.isRecurring
    );

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate summary
    const summary = {
      totalReminders: count,
      sentReminders: reminderStats.find(s => s.status === 'Sent')?.count || 0,
      failedReminders: reminderStats.find(s => s.status === 'Failed')?.count || 0,
      pendingReminders: reminderStats.find(s => s.status === 'Pending')?.count || 0,
      totalAmountDue: reminderStats.reduce((sum, stat) => 
        sum + parseFloat(stat.totalAmount || 0), 0
      ).toFixed(2),
      successRate: count > 0 
        ? ((reminderStats.find(s => s.status === 'Sent')?.count || 0) / count * 100).toFixed(2)
        : 0,
      overdueCount: overdueReminders.length,
      overdueAmount: overdueReminders.reduce((sum, reminder) => 
        sum + parseFloat(reminder.amountDue || 0), 0
      ).toFixed(2),
      recurringCount: recurringReminders.length
    };

    res.status(200).json({
      success: true,
      data: {
        reminders: remindersWithDetails,
        statistics: {
          reminderStats,
          typeStats,
          methodStats,
          dailyTrend,
          successRateByMethod
        },
        analysis: {
          overdueReminders: overdueReminders.slice(0, 50), // Limit to 50 for performance
          recurringReminders: recurringReminders.slice(0, 50)
        },
        summary
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error in reminder notification report:", error);
    next(error);
  }
};

// 3. CUSTOMER SUPPORT PERFORMANCE REPORT
const getCustomerSupportPerformanceReport = async (req, res, next) => {
  try {
    const { 
      startDate, 
      endDate, 
      supportAgentId,
      department,
      page = 1, 
      limit = 20 
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get all support agents (employees with support role)
    const supportAgents = await AuthorityInformation.findAll({
      where: {
        role: { [Op.like]: '%Support%' },
        ...(department ? { department } : {}),
        ...(supportAgentId ? { id: supportAgentId } : {})
      },
      attributes: ['id', 'fullName', 'userId', 'email', 'mobileNo', 'role', 'department'],
      order: [['fullName', 'ASC']]
    });

    // Get performance data for each support agent
    const agentPerformance = await Promise.all(
      supportAgents.map(async (agent) => {
        const agentId = agent.id;
        
        // Build where conditions for this agent's chats
        const chatWhere = {
          assignedTo: agentId,
          ...(startDate || endDate ? {
            createdAt: {
              ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
              ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
            }
          } : {})
        };
        
        // Get assigned chats
        const assignedChats = await Chat.findAll({
          where: chatWhere,
          attributes: [
            'id', 'status', 'priority', 'category', 'createdAt', 'lastMessageAt'
          ]
        });
        
        // Calculate metrics
        const totalChats = assignedChats.length;
        const resolvedChats = assignedChats.filter(chat => chat.status === 'Resolved').length;
        const activeChats = assignedChats.filter(chat => chat.status === 'Active').length;
        
        // Calculate resolution time (only for resolved chats)
        const resolvedChatData = assignedChats.filter(chat => 
          chat.status === 'Resolved' && chat.lastMessageAt
        );
        
        const totalResolutionTime = resolvedChatData.reduce((sum, chat) => {
          const resolutionTime = new Date(chat.lastMessageAt) - new Date(chat.createdAt);
          return sum + resolutionTime;
        }, 0);
        
        const avgResolutionTime = resolvedChatData.length > 0 
          ? totalResolutionTime / resolvedChatData.length / (1000 * 60 * 60) // Convert to hours
          : 0;
        
        // Get chat messages sent by this agent
        const agentMessages = await ChatMessage.count({
          where: {
            senderId: agentId,
            senderType: 'Support',
            ...(startDate || endDate ? {
              createdAt: {
                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
              }
            } : {})
          }
        });
        
        // Calculate response time (time between customer message and agent reply)
        // This is a simplified calculation
        const responseTimeSamples = await ChatMessage.findAll({
          where: {
            chatId: { [Op.in]: assignedChats.map(c => c.id) },
            senderType: 'User'
          },
          attributes: ['id', 'chatId', 'createdAt'],
          limit: 100 // Sample size for performance
        });
        
        let totalResponseTime = 0;
        let responseCount = 0;
        
        for (const customerMessage of responseTimeSamples) {
          const agentReply = await ChatMessage.findOne({
            where: {
              chatId: customerMessage.chatId,
              senderId: agentId,
              senderType: 'Support',
              createdAt: { [Op.gt]: customerMessage.createdAt }
            },
            order: [['createdAt', 'ASC']],
            attributes: ['createdAt']
          });
          
          if (agentReply) {
            const responseTime = new Date(agentReply.createdAt) - new Date(customerMessage.createdAt);
            totalResponseTime += responseTime;
            responseCount++;
          }
        }
        
        const avgResponseTime = responseCount > 0 
          ? totalResponseTime / responseCount / (1000 * 60) // Convert to minutes
          : 0;
        
        // Customer satisfaction (would normally come from ratings)
        // For now, we'll use resolution rate as a proxy
        const resolutionRate = totalChats > 0 
          ? (resolvedChats / totalChats * 100).toFixed(2)
          : 0;
        
        // Priority distribution
        const priorityDistribution = assignedChats.reduce((acc, chat) => {
          const priority = chat.priority;
          if (!acc[priority]) acc[priority] = 0;
          acc[priority]++;
          return acc;
        }, {});
        
        // Category distribution
        const categoryDistribution = assignedChats.reduce((acc, chat) => {
          const category = chat.category;
          if (!acc[category]) acc[category] = 0;
          acc[category]++;
          return acc;
        }, {});
        
        // Calculate performance score
        const performanceScore = calculateSupportPerformanceScore(
          parseFloat(resolutionRate),
          avgResolutionTime,
          avgResponseTime,
          totalChats
        );
        
        return {
          agentId: agent.id,
          agentName: agent.fullName,
          userId: agent.userId,
          department: agent.department,
          role: agent.role,
          contact: agent.mobileNo,
          performance: {
            totalChats,
            resolvedChats,
            activeChats,
            resolutionRate: parseFloat(resolutionRate),
            avgResolutionTime: avgResolutionTime.toFixed(2),
            avgResponseTime: avgResponseTime.toFixed(2),
            totalMessages: agentMessages,
            performanceScore: performanceScore.toFixed(2),
            priorityDistribution,
            categoryDistribution
          }
        };
      })
    );

    // Sort by performance score
    const sortedPerformance = agentPerformance.sort((a, b) => 
      parseFloat(b.performance.performanceScore) - parseFloat(a.performance.performanceScore)
    );

    // Apply pagination
    const paginatedPerformance = sortedPerformance.slice(offset, offset + limitNumber);
    const totalCount = sortedPerformance.length;

    // Overall statistics
    const overallStats = {
      totalAgents: agentPerformance.length,
      totalChats: agentPerformance.reduce((sum, agent) => 
        sum + agent.performance.totalChats, 0
      ),
      resolvedChats: agentPerformance.reduce((sum, agent) => 
        sum + agent.performance.resolvedChats, 0
      ),
      avgResolutionRate: agentPerformance.length > 0 
        ? (agentPerformance.reduce((sum, agent) => 
            sum + parseFloat(agent.performance.resolutionRate), 0
          ) / agentPerformance.length).toFixed(2)
        : 0,
      avgResolutionTime: agentPerformance.length > 0
        ? (agentPerformance.reduce((sum, agent) => 
            sum + parseFloat(agent.performance.avgResolutionTime), 0
          ) / agentPerformance.length).toFixed(2)
        : 0,
      avgResponseTime: agentPerformance.length > 0
        ? (agentPerformance.reduce((sum, agent) => 
            sum + parseFloat(agent.performance.avgResponseTime), 0
          ) / agentPerformance.length).toFixed(2)
        : 0,
      topPerformer: sortedPerformance[0] || null,
      bottomPerformer: sortedPerformance[sortedPerformance.length - 1] || null
    };

    // Department-wise performance
    const departmentPerformance = agentPerformance.reduce((acc, agent) => {
      const dept = agent.department || 'Unassigned';
      if (!acc[dept]) {
        acc[dept] = {
          department: dept,
          agentCount: 0,
          totalChats: 0,
          resolvedChats: 0,
          totalPerformanceScore: 0
        };
      }
      
      acc[dept].agentCount++;
      acc[dept].totalChats += agent.performance.totalChats;
      acc[dept].resolvedChats += agent.performance.resolvedChats;
      acc[dept].totalPerformanceScore += parseFloat(agent.performance.performanceScore);
      
      return acc;
    }, {});

    // Calculate averages for department performance
    Object.keys(departmentPerformance).forEach(dept => {
      const deptData = departmentPerformance[dept];
      deptData.avgPerformanceScore = deptData.agentCount > 0
        ? (deptData.totalPerformanceScore / deptData.agentCount).toFixed(2)
        : 0;
      deptData.resolutionRate = deptData.totalChats > 0
        ? ((deptData.resolvedChats / deptData.totalChats) * 100).toFixed(2)
        : 0;
    });

    // Daily performance trend
    const dailyPerformance = await Chat.findAll({
      where: {
        assignedTo: { [Op.not]: null },
        ...(startDate || endDate ? {
          createdAt: {
            ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
            ...(endDate ? { [Op.lte]: new Date(endDate + ' 23:59:59') } : {})
          }
        } : {})
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        'assignedTo',
        [sequelize.fn('COUNT', sequelize.col('id')), 'newChats'],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`)
          ), 
          'resolvedChats'
        ]
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'assignedTo'],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'DESC']],
      limit: 100
    });

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      success: true,
      data: {
        agentPerformance: paginatedPerformance,
        overallStats,
        departmentPerformance: Object.values(departmentPerformance),
        dailyPerformance,
        summary: {
          totalAgents: overallStats.totalAgents,
          totalChatsHandled: overallStats.totalChats,
          overallResolutionRate: overallStats.avgResolutionRate,
          bestPerformanceScore: sortedPerformance[0]?.performance.performanceScore || 0,
          worstPerformanceScore: sortedPerformance[sortedPerformance.length - 1]?.performance.performanceScore || 0
        }
      },
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error in customer support performance report:", error);
    next(error);
  }
};

// Helper function to calculate support performance score
const calculateSupportPerformanceScore = (
  resolutionRate, 
  avgResolutionTime, 
  avgResponseTime,
  totalChats
) => {
  let score = 100;
  
  // Resolution rate contributes 40%
  const resolutionScore = resolutionRate * 0.4;
  
  // Resolution time contributes 30%
  let resolutionTimeScore = 30;
  if (avgResolutionTime > 24) resolutionTimeScore -= 10; // More than 24 hours
  if (avgResolutionTime > 48) resolutionTimeScore -= 10; // More than 48 hours
  if (avgResolutionTime > 72) resolutionTimeScore -= 10; // More than 72 hours
  
  // Response time contributes 20%
  let responseTimeScore = 20;
  if (avgResponseTime > 60) responseTimeScore -= 5; // More than 60 minutes
  if (avgResponseTime > 120) responseTimeScore -= 5; // More than 2 hours
  if (avgResponseTime > 240) responseTimeScore -= 10; // More than 4 hours
  
  // Volume bonus contributes 10%
  let volumeBonus = 0;
  if (totalChats > 50) volumeBonus += 5;
  if (totalChats > 100) volumeBonus += 5;
  
  score = resolutionScore + resolutionTimeScore + responseTimeScore + volumeBonus;
  return Math.max(0, Math.min(100, score));
};

// 4. ISSUE CATEGORY REPORT
const getIssueCategoryReport = async (req, res, next) => {
  try {
    const { 
      startDate, 
      endDate, 
      category,
      priority,
      status,
      page = 1, 
      limit = 20 
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate + ' 23:59:59');
    }
    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;
    if (status) whereClause.status = status;

    // Get chats with pagination
    const { count, rows: chats } = await Chat.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ChatMessage,
          as: 'chatmessages',
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('chatmessages.id')), 'messageCount']
          ],
          required: false
        },
        {
          model: ChatParticipant,
          as: 'chatparticipants',
          where: { userType: 'User' },
          attributes: ['userId'],
          required: false
        }
      ]
    });

    // Get detailed chat information with client details
    const detailedChats = await Promise.all(
      chats.map(async (chat) => {
        const chatData = chat.toJSON();
        
        // Get client details from participants
        let clientDetails = null;
        if (chatData.chatparticipants && chatData.chatparticipants.length > 0) {
          const clientParticipant = chatData.chatparticipants[0];
          clientDetails = await ClientInformation.findOne({
            where: { id: clientParticipant.userId },
            attributes: ['fullName', 'mobileNo', 'email', 'userId', 'package', 'location']
          });
        }
        
        // Get assigned agent details
        let assignedAgent = null;
        if (chatData.assignedTo) {
          assignedAgent = await AuthorityInformation.findOne({
            where: { id: chatData.assignedTo },
            attributes: ['fullName', 'userId']
          });
        }
        
        // Calculate resolution time
        let resolutionTime = null;
        if (chatData.status === 'Resolved' && chatData.lastMessageAt) {
          resolutionTime = Math.round(
            (new Date(chatData.lastMessageAt) - new Date(chatData.createdAt)) / (1000 * 60 * 60)
          ); // Hours
        }
        
        return {
          ...chatData,
          clientDetails: clientDetails ? clientDetails.toJSON() : null,
          assignedAgent: assignedAgent ? assignedAgent.toJSON() : null,
          messageCount: chatData.chatmessages?.[0]?.messageCount || 0,
          resolutionTime,
          daysOpen: Math.round(
            (new Date() - new Date(chatData.createdAt)) / (1000 * 60 * 60 * 24)
          )
        };
      })
    );

    // Category statistics
    const categoryStats = await Chat.findAll({
      where: whereClause,
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalIssues'],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`)
          ), 
          'resolvedIssues'
        ],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Active' THEN 1 ELSE 0 END`)
          ), 
          'activeIssues'
        ],
        [
          sequelize.fn('AVG', 
            sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)')
          ), 
          'avgResolutionTime'
        ],
        [
          sequelize.fn('AVG', 
            sequelize.literal('(SELECT COUNT(*) FROM chatmessages WHERE chatmessages.chatId = Chat.id)')
          ), 
          'avgMessagesPerIssue'
        ]
      ],
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    // Priority distribution by category
    const priorityByCategory = await Chat.findAll({
      where: whereClause,
      attributes: [
        'category',
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [
          sequelize.fn('AVG', 
            sequelize.literal('TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt)')
          ), 
          'avgResolutionTime'
        ]
      ],
      group: ['category', 'priority'],
      order: [['category', 'ASC'], ['priority', 'ASC']]
    });

    // Monthly trend by category
    const monthlyTrend = await Chat.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'issueCount'],
        [
          sequelize.fn('COUNT', 
            sequelize.literal(`CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END`)
          ), 
          'resolvedCount'
        ]
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'category'],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'DESC']],
      limit: 36 // Last 3 years
    });

    // Resolution time analysis by category
    const resolutionTimeAnalysis = await Chat.findAll({
      where: {
        ...whereClause,
        status: 'Resolved',
        lastMessageAt: { [Op.not]: null }
      },
      attributes: [
        'category',
        [
          sequelize.literal('FLOOR(TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt) / 24)'), 
          'resolutionDays'
        ],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category', sequelize.literal('FLOOR(TIMESTAMPDIFF(HOUR, createdAt, lastMessageAt) / 24)')],
      order: [['category', 'ASC'], [sequelize.literal('resolutionDays'), 'ASC']]
    });

    // Top recurring issues (similar titles/messages)
    // This is simplified - in production you might use NLP or keyword analysis
    const commonIssues = await Chat.findAll({
      where: whereClause,
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'frequency'],
        [
          sequelize.fn('GROUP_CONCAT', 
            sequelize.literal('DISTINCT priority ORDER BY priority')
          ), 
          'priorities'
        ]
      ],
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    // Client package vs issue category correlation
    const packageIssueCorrelation = await Promise.all(
      categoryStats.map(async (categoryStat) => {
        const category = categoryStat.category;
        
        // Get chats for this category with client package info
        const chatsInCategory = await Chat.findAll({
          where: { ...whereClause, category },
          include: [{
            model: ChatParticipant,
            as: 'chatparticipants',
            where: { userType: 'User' },
            attributes: ['userId'],
            required: true
          }]
        });
        
        // Get client packages
        const clientIds = chatsInCategory
          .map(chat => chat.chatparticipants?.[0]?.userId)
          .filter(id => id);
        
        const clients = await ClientInformation.findAll({
          where: { id: { [Op.in]: clientIds } },
          attributes: ['package']
        });
        
        // Count packages
        const packageCount = clients.reduce((acc, client) => {
          const pkg = client.package || 'Unknown';
          if (!acc[pkg]) acc[pkg] = 0;
          acc[pkg]++;
          return acc;
        }, {});
        
        return {
          category,
          totalIssues: categoryStat.totalIssues,
          packageDistribution: Object.entries(packageCount).map(([pkg, count]) => ({
            package: pkg,
            count,
            percentage: ((count / categoryStat.totalIssues) * 100).toFixed(2)
          }))
        };
      })
    );

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate summary
    const summary = {
      totalIssues: count,
      totalCategories: new Set(chats.map(chat => chat.category)).size,
      mostCommonCategory: categoryStats.length > 0 ? categoryStats[0] : null,
      leastCommonCategory: categoryStats.length > 0 ? categoryStats[categoryStats.length - 1] : null,
      avgResolutionTime: categoryStats.reduce((sum, cat) => 
        sum + (parseFloat(cat.avgResolutionTime || 0) * cat.totalIssues), 0
      ) / count,
      resolutionRate: count > 0 
        ? (categoryStats.reduce((sum, cat) => sum + cat.resolvedIssues, 0) / count * 100).toFixed(2)
        : 0
    };

    res.status(200).json({
      success: true,
      data: {
        issues: detailedChats,
        statistics: {
          categoryStats,
          priorityByCategory,
          monthlyTrend,
          resolutionTimeAnalysis,
          commonIssues,
          packageIssueCorrelation
        },
        summary,
        insights: {
          topCategories: categoryStats.slice(0, 5),
          slowestResolvingCategories: [...categoryStats]
            .filter(cat => cat.avgResolutionTime)
            .sort((a, b) => parseFloat(b.avgResolutionTime) - parseFloat(a.avgResolutionTime))
            .slice(0, 5),
          fastestResolvingCategories: [...categoryStats]
            .filter(cat => cat.avgResolutionTime)
            .sort((a, b) => parseFloat(a.avgResolutionTime) - parseFloat(b.avgResolutionTime))
            .slice(0, 5)
        }
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error in issue category report:", error);
    next(error);
  }
};









module.exports = {
    getClientRegistrationReport,
    getClientStatusReport,
    getClientPackageDistributionReport,
    getClientLocationReport,
    getReferralClientReport,
    getEmployeeReport,
    getUserGrowthReport,
    getRevenueCollectionReport,
    getPaymentStatusReport,
    getMonthlyBillingReport,
    getEmployeeCollectionReport,
    getTransactionApprovalReport,
    getBankAccountBalanceReport,
    getExpenseReport,
    getEmployeeAttendanceReport,
    getSalaryPaymentReport,
    getLeaveAttendanceSummary,
    getExpenseCategoryReport,
    getBankTransactionReport,
    getAccountReconciliationReport,
    getAssetManagementReport,
    
    getChatSupportReport,
  getReminderNotificationReport,
  getCustomerSupportPerformanceReport,
  getIssueCategoryReport
};