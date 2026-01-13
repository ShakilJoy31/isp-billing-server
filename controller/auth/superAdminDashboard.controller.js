const { Op, Sequelize } = require("sequelize");
const ClientInformation = require("../../models/Authentication/client.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const Transaction = require("../../models/payment/client-payment.model");
const Package = require("../../models/package/package.model");
const { Expense } = require("../../models/expense/expense.model");
const BankAccount = require("../../models/account/account.model");
const Reminder = require("../../models/reminder/reminder.model");
const EmployeeAttendance = require("../../models/attendence/attendence.model");
const { transformClientWithPackage } = require("./signup");


//! Helper function to get date ranges
const getDateRanges = () => {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));
  
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  
  return {
    today: { start: startOfToday, end: endOfToday },
    week: { start: startOfWeek, end: endOfWeek },
    month: { start: startOfMonth, end: endOfMonth },
    year: { start: startOfYear, end: endOfYear }
  };
};

//! Create Super-Admin User

const createSuperAdmin = async (req, res, next) => {
  try {
    const {
      fullName,
      fatherOrSpouseName,
      dateOfBirth,
      age,
      sex,
      maritalStatus,
      nidOrPassportNo,
      jobPlaceName,
      jobCategory,
      customerId,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails,
      costForPackage,
      referId,
      photo,
      password,
      status,
      role,
      routerLoginId,
      routerLoginPassword,
    } = req.body;

    // Generate unique IDs
    const userId = await generateUniqueUserId(fullName);

    // Create new client
    const newClient = await ClientInformation.create({
      customerId,
      userId,
      fullName,
      photo: photo || null,
      fatherOrSpouseName,
      dateOfBirth: dateOfBirth || null,
      age: parseInt(age),
      sex,
      maritalStatus,
      nidOrPassportNo,
      jobPlaceName: jobPlaceName || null,
      jobCategory: jobCategory || null,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails: connectionDetails || null,
      costForPackage,
      referId: referId || null,
      role: role,
      status: status,
      password: password || mobileNo,
      // New fields
      routerLoginId: routerLoginId || null,
      routerLoginPassword: routerLoginPassword || null,
    });

    // Transform response with package details
    const clientData = await transformClientWithPackage(newClient);

    return res.status(201).json({
      message: "Client created successfully!",
      data: clientData,
    });
  } catch (error) {
    next(error);
  }
};





























































//! Main Dashboard Function for Super Admin
const getSuperAdminDashboard = async (req, res, next) => {
  try {
    const dateRanges = getDateRanges();

    //! Inside testing function to fetch the records matched. Don't touch this...........
    // const getWarningOver = async () => {
    //     const result = await Reminder.findAll({
    //       where: {
    //         dueDate: { [Op.lt]: new Date() },
    //         status: 'Pending'
    //       }
    //     })
    //     console.log(result);
    // }


    // getWarningOver();
    
    // 1. Get Client Statistics
    const totalClients = await ClientInformation.count();
    const activeClients = await ClientInformation.count({ 
      where: { status: 'active' } 
    });
    const newClientsToday = await ClientInformation.count({
      where: {
        createdAt: {
          [Op.between]: [dateRanges.today.start, dateRanges.today.end]
        }
      }
    });
    const newClientsThisMonth = await ClientInformation.count({
      where: {
        createdAt: {
          [Op.between]: [dateRanges.month.start, dateRanges.month.end]
        }
      }
    });

    // 2. Get Financial Statistics
    const totalRevenue = await Transaction.sum('amount', {
      where: { status: 'approved' }
    }) || 0;

    const revenueToday = await Transaction.sum('amount', {
      where: {
        status: 'approved',
        createdAt: {
          [Op.between]: [dateRanges.today.start, dateRanges.today.end]
        }
      }
    }) || 0;

    const revenueThisMonth = await Transaction.sum('amount', {
      where: {
        status: 'approved',
        createdAt: {
          [Op.between]: [dateRanges.month.start, dateRanges.month.end]
        }
      }
    }) || 0;

    const pendingPayments = await Transaction.sum('amount', {
      where: { status: 'pending' }
    }) || 0;

    // 3. Get Expense Statistics
    const totalExpenses = await Expense.sum('totalAmount', {
      where: { status: 'Approved' }
    }) || 0;

    const expensesThisMonth = await Expense.sum('totalAmount', {
      where: {
        status: 'Approved',
        date: {
          [Op.between]: [dateRanges.month.start, dateRanges.month.end]
        }
      }
    }) || 0;

    const pendingExpenses = await Expense.sum('totalAmount', {
      where: { paymentStatus: 'Pending' }
    }) || 0;

    // 4. Get Employee Statistics
    const totalEmployees = await AuthorityInformation.count();
    const activeEmployees = await AuthorityInformation.count({
      where: { status: 'active' }
    });

    // 5. Get Bank Account Statistics
    const totalBankAccounts = await BankAccount.count();
    const activeBankAccounts = await BankAccount.sum('currentBalance', {
      where: { isActive: true }
    }) || 0;
    
    const primaryAccount = await BankAccount.findOne({
      where: { isPrimary: true, isActive: true },
      attributes: ['bankName', 'accountNumber', 'currentBalance', 'currency']
    });

    // 6. Get Recent Transactions (Last 10)
    const recentTransactions = await Transaction.findAll({
      where: { status: 'approved' },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'userId', 'amount', 'phoneNumber', 'status', 'createdAt', 'remark']
    });

    // 7. Get Recent Clients (Last 10)
    const recentClients = await ClientInformation.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'customerId', 'fullName', 'mobileNo', 'email', 'package', 'status', 'createdAt']
    });

    // 8. Get Upcoming Reminders (Payment Due - Next 7 days)
    const upcomingReminders = await Reminder.findAll({
      where: {
        dueDate: {
          [Op.gte]: new Date(),
          [Op.lte]: new Date(new Date().setDate(new Date().getDate() + 7))
        },
        status: 'Pending'
      },
      order: [['dueDate', 'ASC']],
      limit: 10,
      attributes: ['id', 'reminderId', 'customerName', 'customerPhone', 'amountDue', 'dueDate', 'reminderType', 'priority']
    });

    // 9. Get Attendance Today
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await EmployeeAttendance.count({
      where: {
        date: today,
        status: 'Present'
      }
    });

    const onLeaveToday = await EmployeeAttendance.count({
      where: {
        date: today,
        status: 'Leave'
      }
    });

    // 10. Get Performance Metrics
    const conversionRate = totalClients > 0 ? 
      ((activeClients / totalClients) * 100).toFixed(2) : 0;
    
    const revenuePerClient = activeClients > 0 ? 
      ((totalRevenue / activeClients) || 0).toFixed(2) : 0;
    
    const expenseRatio = totalRevenue > 0 ? 
      ((totalExpenses / totalRevenue) * 100).toFixed(2) : 0;

    // 11. Get Monthly Revenue Trends (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenueTrends = await Transaction.findAll({
      where: {
        status: 'approved',
        createdAt: {
          [Op.gte]: sixMonthsAgo
        }
      },
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue']
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // 12. Get Client Growth (Last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const clientGrowth = await ClientInformation.findAll({
      where: {
        createdAt: {
          [Op.gte]: twelveMonthsAgo
        }
      },
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'new_clients']
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // 13. Get Top Packages by Revenue - SIMPLIFIED APPROACH
    const topPackages = [];
    
    // Get package counts
    const packageCounts = await ClientInformation.findAll({
      where: { status: 'active' },
      attributes: [
        'package',
        [Sequelize.fn('COUNT', Sequelize.col('package')), 'client_count']
      ],
      group: ['package'],
      raw: true
    });

    // Get package details for counts
    for (const pkg of packageCounts) {
      const packageDetails = await Package.findOne({
        where: { id: pkg.package },
        attributes: ['packageName', 'packagePrice']
      });
      
      if (packageDetails) {
        topPackages.push({
          packageName: packageDetails.packageName,
          client_count: parseInt(pkg.client_count),
          estimated_monthly_revenue: (parseFloat(packageDetails.packagePrice) * parseInt(pkg.client_count)).toFixed(2)
        });
      }
    }
    
    // Sort and keep top 5
    topPackages.sort((a, b) => parseFloat(b.estimated_monthly_revenue) - parseFloat(a.estimated_monthly_revenue));
    const top5Packages = topPackages.slice(0, 5);

    // 14. Get Employee by Role
    const employeesByRole = await AuthorityInformation.findAll({
      attributes: [
        'role',
        [Sequelize.fn('COUNT', Sequelize.col('role')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    // 15. Get Quick Stats Summary
    const transactionCount = await Transaction.count({ where: { status: 'approved' } });
    const averageTransaction = transactionCount > 0 ? (totalRevenue / transactionCount).toFixed(2) : 0;

    const quickStats = {
      netProfit: (totalRevenue - totalExpenses).toFixed(2),
      accountsReceivable: pendingPayments,
      averageTransaction: averageTransaction,
      clientSatisfaction: '95%',
      systemUptime: '99.9%'
    };

    // Response Data
    const dashboardData = {
      summary: {
        totalClients,
        activeClients,
        newClientsToday,
        newClientsThisMonth,
        totalEmployees,
        activeEmployees,
        totalRevenue,
        revenueToday,
        revenueThisMonth,
        totalExpenses,
        expensesThisMonth,
        netProfit: (totalRevenue - totalExpenses)
      },
      financials: {
        pendingPayments,
        pendingExpenses,
        totalBankBalance: activeBankAccounts,
        primaryAccount: primaryAccount || null,
        conversionRate: `${conversionRate}%`,
        revenuePerClient,
        expenseRatio: `${expenseRatio}%`
      },
      clients: {
        recentClients,
        clientGrowth: clientGrowth || []
      },
      employees: {
        byRole: employeesByRole,
        attendanceToday: todayAttendance,
        onLeaveToday,
        totalEmployees
      },
      transactions: {
        recentTransactions,
        monthlyTrends: monthlyRevenueTrends || []
      },
      reminders: {
        upcomingReminders,
        totalUpcoming: upcomingReminders.length
      },
      performance: {
        topPackages: top5Packages,
        quickStats
      },
      charts: {
        monthlyRevenue: monthlyRevenueTrends || [],
        clientGrowth: clientGrowth || [],
        packageDistribution: top5Packages.map(p => ({
          name: p.packageName,
          value: p.client_count
        }))
      },
      alerts: {
        lowBalanceAccounts: await BankAccount.count({
          where: {
            isActive: true,
            currentBalance: { [Op.lt]: 1000 }
          }
        }),
        overdueReminders: await Reminder.count({
          where: {
            dueDate: { [Op.lt]: new Date() },
            status: 'Pending'
          }
        }),
        pendingApprovals: await Transaction.count({
          where: { status: 'pending' }
        }) + await Expense.count({
          where: { status: 'Pending' }
        })
      }
    };

    return res.status(200).json({
      success: true,
      message: "Super Admin Dashboard Data Retrieved Successfully",
      data: dashboardData,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message
    });
  }
};

//! Get Dashboard Stats Only (Lightweight)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalClients = await ClientInformation.count();
    const activeClients = await ClientInformation.count({ where: { status: 'active' } });
    const totalRevenue = await Transaction.sum('amount', { where: { status: 'approved' } }) || 0;
    const totalExpenses = await Expense.sum('totalAmount', { where: { status: 'Approved' } }) || 0;
    const totalEmployees = await AuthorityInformation.count();
    const pendingPayments = await Transaction.sum('amount', { where: { status: 'pending' } }) || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalClients,
        activeClients,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        totalEmployees,
        pendingPayments
      }
    });
  } catch (error) {
    next(error);
  }
};

//! Get Recent Activities
const getRecentActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recent transactions
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit / 2,
      attributes: ['id', 'userId', 'amount', 'status', 'createdAt', 'remark']
    });

    // Get recent client registrations
    const clientRegistrations = await ClientInformation.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit / 2,
      attributes: ['id', 'fullName', 'mobileNo', 'status', 'createdAt']
    });

    // Get recent expense approvals
    const expenses = await Expense.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit / 4,
      attributes: ['id', 'expenseCode', 'totalAmount', 'status', 'date', 'createdAt']
    });

    const activities = [
      ...transactions.map(t => ({
        type: 'transaction',
        id: t.id,
        title: `Payment ${t.status === 'approved' ? 'Received' : 'Pending'}`,
        description: t.remark || `Payment of ${t.amount} from ${t.userId}`,
        amount: t.amount,
        status: t.status,
        timestamp: t.createdAt
      })),
      ...clientRegistrations.map(c => ({
        type: 'client',
        id: c.id,
        title: `New ${c.status} Client`,
        description: `${c.fullName} registered with mobile ${c.mobileNo}`,
        status: c.status,
        timestamp: c.createdAt
      })),
      ...expenses.map(e => ({
        type: 'expense',
        id: e.id,
        title: `Expense ${e.status}`,
        description: `Expense ${e.expenseCode} - ${e.totalAmount}`,
        amount: e.totalAmount,
        status: e.status,
        timestamp: e.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);

    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

//! Get Financial Overview
const getFinancialOverview = async (req, res, next) => {
  try {
    const period = req.query.period || 'month'; // day, week, month, year
    
    const dateRanges = getDateRanges();
    const range = dateRanges[period] || dateRanges.month;

    const revenue = await Transaction.sum('amount', {
      where: {
        status: 'approved',
        createdAt: { [Op.between]: [range.start, range.end] }
      }
    }) || 0;

    const expenses = await Expense.sum('totalAmount', {
      where: {
        status: 'Approved',
        date: { [Op.between]: [range.start, range.end] }
      }
    }) || 0;

    const pending = await Transaction.sum('amount', {
      where: {
        status: 'pending',
        createdAt: { [Op.between]: [range.start, range.end] }
      }
    }) || 0;

    return res.status(200).json({
      success: true,
      data: {
        period,
        revenue,
        expenses,
        netProfit: revenue - expenses,
        pendingCollections: pending,
        profitMargin: revenue > 0 ? ((revenue - expenses) / revenue * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

//! Get Employee Performance
const getEmployeePerformance = async (req, res, next) => {
  try {
    const employees = await AuthorityInformation.findAll({
      where: { status: 'active' },
      attributes: ['id', 'fullName', 'role', 'baseSalary', 'createdAt']
    });

    // Get attendance data for each employee
    const employeePerformance = await Promise.all(
      employees.map(async (employee) => {
        const attendance = await EmployeeAttendance.count({
          where: {
            employeeId: employee.id,
            status: 'Present',
            date: {
              [Op.between]: [
                new Date(new Date().setMonth(new Date().getMonth() - 1)),
                new Date()
              ]
            }
          }
        });

        const totalDays = 30; // Approximate working days in a month
        const attendanceRate = (attendance / totalDays * 100).toFixed(2);

        return {
          id: employee.id,
          name: employee.fullName,
          role: employee.role,
          baseSalary: employee.baseSalary,
          attendanceRate: `${attendanceRate}%`,
          joinDate: employee.createdAt,
          performance: attendanceRate > 90 ? 'Excellent' : 
                     attendanceRate > 80 ? 'Good' : 
                     attendanceRate > 70 ? 'Average' : 'Needs Improvement'
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: employeePerformance
    });
  } catch (error) {
    next(error);
  }
};

//! Pure Sequelize version of getClientGrowthData
const getClientGrowthData = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const growthData = await ClientInformation.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'new_clients'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'active' THEN 1 ELSE 0 END")), 'active_clients']
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
      raw: true
    });

    return res.status(200).json({
      success: true,
      data: growthData
    });
  } catch (error) {
    console.error("Client Growth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching client growth data",
      error: error.message
    });
  }
};

module.exports = {
  createSuperAdmin,
  getSuperAdminDashboard,
  getDashboardStats,
  getRecentActivities,
  getFinancialOverview,
  getEmployeePerformance,
  getClientGrowthData
};