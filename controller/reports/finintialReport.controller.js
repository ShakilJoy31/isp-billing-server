const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const Package = require("../../models/package/package.model");
const BankAccount = require("../../models/account/account.model");
const {
  Expense,
  ExpensePayment,
} = require("../../models/expense/expense.model");
const ExpenseCategory = require("../../models/expense/category.model");
const ExpenseSubCategory = require("../../models/expense/sub-category.model");
const ClientInformation = require("../../models/Authentication/client.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");


//! 1. REVENUE COLLECTION REPORT
const getRevenueCollectionReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      paymentMethod,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions for transactions
    const transactionWhere = {};
    if (startDate || endDate) {
      transactionWhere.createdAt = {};
      if (startDate) transactionWhere.createdAt[Op.gte] = new Date(startDate);
      if (endDate)
        transactionWhere.createdAt[Op.lte] = new Date(endDate + " 23:59:59");
    }
    if (status) transactionWhere.status = status;

    // Get transactions WITHOUT associations
    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: transactionWhere,
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]],
      // No includes - association doesn't exist
    });

    // Get employee collections WITHOUT associations
    const employeeCollectionWhere = {};
    if (startDate || endDate) {
      employeeCollectionWhere.collectionDate = {};
      if (startDate)
        employeeCollectionWhere.collectionDate[Op.gte] = new Date(startDate);
      if (endDate)
        employeeCollectionWhere.collectionDate[Op.lte] = new Date(
          endDate + " 23:59:59",
        );
    }
    if (status) employeeCollectionWhere.status = status;
    if (paymentMethod) employeeCollectionWhere.paymentMethod = paymentMethod;

    const employeeCollections = await EmployeePayment.findAll({
      where: employeeCollectionWhere,
      // Remove the include section
      // include: [
      //   {
      //     model: ClientInformation,
      //     as: "client",
      //     attributes: ["fullName", "mobileNo", "email"],
      //   },
      //   {
      //     model: AuthorityInformation,
      //     as: "employee",
      //     attributes: ["fullName", "userId"],
      //   },
      // ],
    });

    // OPTION 1: If you need client and employee info, fetch separately
    // Collect all unique clientIds and employeeIds from employeeCollections
    const clientIds = [...new Set(employeeCollections.map(ec => ec.clientId))];
    const employeeIds = [...new Set(employeeCollections.map(ec => ec.employeeId))];

    // Fetch clients and employees in parallel
    const [clients, employees] = await Promise.all([
      ClientInformation.findAll({
        where: {
          userId: clientIds
        },
        attributes: ["userId", "fullName", "mobileNo", "email"]
      }),
      AuthorityInformation.findAll({
        where: {
          userId: employeeIds
        },
        attributes: ["userId", "fullName"]
      })
    ]);

    // Create lookup maps
    const clientMap = {};
    const employeeMap = {};
    
    clients.forEach(client => {
      clientMap[client.userId] = client;
    });
    
    employees.forEach(employee => {
      employeeMap[employee.userId] = employee;
    });

    // Add client and employee info to employeeCollections manually
    const employeeCollectionsWithDetails = employeeCollections.map(collection => {
      const collectionObj = collection.toJSON();
      collectionObj.client = clientMap[collection.clientId] || {
        fullName: collection.clientName,
        mobileNo: collection.clientPhone,
        email: null
      };
      collectionObj.employee = employeeMap[collection.employeeId] || {
        fullName: collection.employeeName,
        userId: collection.employeeId
      };
      return collectionObj;
    });

    // For transactions, you already have clientIds in transaction.userId
    const transactionUserIds = [...new Set(transactions.map(t => t.userId))];
    const transactionClients = await ClientInformation.findAll({
      where: {
        userId: transactionUserIds
      },
      attributes: ["userId", "fullName", "mobileNo", "email"]
    });

    const transactionClientMap = {};
    transactionClients.forEach(client => {
      transactionClientMap[client.userId] = client;
    });

    const transactionsWithClient = transactions.map(transaction => {
      const transactionObj = transaction.toJSON();
      transactionObj.client = transactionClientMap[transaction.userId] || null;
      return transactionObj;
    });

    // Calculate totals
    const onlineRevenue = transactions
      .filter((t) => t.status === "approved")
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const employeeRevenue = employeeCollections
      .filter((ec) => ec.status === "deposited")
      .reduce((sum, ec) => sum + parseFloat(ec.amount || 0), 0);

    const totalRevenue = onlineRevenue + employeeRevenue;

    // Monthly revenue trend
    const monthlyRevenue = await Transaction.findAll({
      where: {
        status: "approved",
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("SUM", sequelize.col("amount")), "revenue"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m")],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "ASC",
        ],
      ],
    });

    const totalPages = Math.ceil(count / limitNumber);

    res.status(200).json({
      success: true,
      data: {
        onlineTransactions: transactionsWithClient,
        employeeCollections: employeeCollectionsWithDetails,
        summary: {
          totalRevenue,
          onlineRevenue,
          employeeRevenue,
          totalTransactions: count,
          totalCollections: employeeCollections.length,
        },
        monthlyTrend: monthlyRevenue,
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in revenue collection report:", error);
    next(error);
  }
};

//! 2. PAYMENT STATUS REPORT
const getPaymentStatusReport = async (req, res, next) => {
  try {
    const { billingMonth, billingYear, clientId } = req.query;

    const whereClause = {};
    if (billingMonth) whereClause.billingMonth = billingMonth;
    if (billingYear) whereClause.billingYear = billingYear;
    if (clientId) whereClause.userId = clientId;

    // Get all transactions WITHOUT include
    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [
        ["billingMonth", "DESC"],
        ["billingYear", "DESC"],
      ],
    });

    // Get employee collections WITHOUT include
    const employeeCollections = await EmployeePayment.findAll({
      where: whereClause.billingMonth
        ? {
            billingMonth: whereClause.billingMonth,
          }
        : {},
    });

    // Collect all unique client IDs from both transactions and employee collections
    const allClientIds = [
      ...new Set([
        ...transactions.map(t => t.userId),
        ...employeeCollections.map(ec => ec.clientId)
      ])
    ];

    // Fetch client information separately
    const clients = await ClientInformation.findAll({
      where: {
        userId: allClientIds
      },
      attributes: ["userId", "fullName", "mobileNo", "email", "package", "location"]
    });

    // Create a client lookup map
    const clientMap = {};
    clients.forEach(client => {
      clientMap[client.userId] = client;
    });

    // Collect all unique employee IDs
    const employeeIds = [...new Set(employeeCollections.map(ec => ec.employeeId))];
    
    // Fetch employee information separately
    const employees = await AuthorityInformation.findAll({
      where: {
        userId: employeeIds
      },
      attributes: ["userId", "fullName"]
    });

    // Create an employee lookup map
    const employeeMap = {};
    employees.forEach(employee => {
      employeeMap[employee.userId] = employee;
    });

    // Combine and analyze payment status with manual data merging
    const allPayments = [
      ...transactions.map((t) => {
        const client = clientMap[t.userId];
        return {
          type: "Online",
          clientId: t.userId,
          clientName: client?.fullName || "N/A",
          clientPhone: client?.mobileNo || t.phoneNumber,
          clientEmail: client?.email || "N/A",
          clientPackage: client?.package || "N/A",
          clientLocation: client?.location || "N/A",
          amount: t.amount,
          status: t.status,
          date: t.createdAt,
          billingMonth: t.billingMonth,
          billingYear: t.billingYear,
          method: "Online Payment",
          phoneNumber: t.phoneNumber,
        };
      }),
      ...employeeCollections.map((ec) => {
        const client = clientMap[ec.clientId];
        const employee = employeeMap[ec.employeeId];
        return {
          type: "Employee Collection",
          clientId: ec.clientId,
          clientName: client?.fullName || ec.clientName,
          clientPhone: client?.mobileNo || ec.clientPhone,
          clientEmail: client?.email || "N/A",
          clientPackage: client?.package || "N/A",
          clientLocation: client?.location || "N/A",
          amount: ec.amount,
          status: ec.status,
          date: ec.collectionDate,
          billingMonth: ec.billingMonth,
          billingYear: ec.billingYear?.toString() || new Date(ec.collectionDate).getFullYear().toString(),
          method: ec.paymentMethod,
          collectedBy: employee?.fullName || ec.employeeName,
          receiptNumber: ec.receiptNumber,
        };
      }),
    ];

    // Group by client and billing period
    const clientPaymentStatus = {};
    allPayments.forEach((payment) => {
      const billingYear = payment.billingYear || new Date(payment.date).getFullYear().toString();
      const key = `${payment.clientId}-${payment.billingMonth}-${billingYear}`;
      
      if (!clientPaymentStatus[key]) {
        clientPaymentStatus[key] = {
          clientId: payment.clientId,
          clientName: payment.clientName,
          clientPhone: payment.clientPhone,
          clientEmail: payment.clientEmail,
          clientPackage: payment.clientPackage,
          clientLocation: payment.clientLocation,
          billingMonth: payment.billingMonth,
          billingYear: billingYear,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          payments: [],
          status: "Unpaid",
        };
      }

      clientPaymentStatus[key].payments.push(payment);
      clientPaymentStatus[key].totalAmount += parseFloat(payment.amount || 0);

      if (payment.status === "approved" || payment.status === "deposited") {
        clientPaymentStatus[key].paidAmount += parseFloat(payment.amount || 0);
      } else {
        clientPaymentStatus[key].pendingAmount += parseFloat(
          payment.amount || 0,
        );
      }

      // Determine overall status
      if (clientPaymentStatus[key].paidAmount > 0) {
        clientPaymentStatus[key].status =
          clientPaymentStatus[key].paidAmount >=
          clientPaymentStatus[key].totalAmount
            ? "Paid"
            : "Partially Paid";
      }
    });

    const paymentStatusArray = Object.values(clientPaymentStatus);

    // Calculate statistics
    const totalClients = await ClientInformation.count({
      where: { status: "active" },
    });
    const paidClients = paymentStatusArray.filter(
      (p) => p.status === "Paid",
    ).length;
    const partiallyPaid = paymentStatusArray.filter(
      (p) => p.status === "Partially Paid",
    ).length;
    const unpaidClients = totalClients - (paidClients + partiallyPaid);

    // Overdue payments (more than 30 days from billing month)
    const overduePayments = paymentStatusArray.filter((payment) => {
      try {
        const billingDate = new Date(
          `${payment.billingYear}-${payment.billingMonth}-01`,
        );
        const today = new Date();
        const monthsDiff =
          (today.getFullYear() - billingDate.getFullYear()) * 12 +
          (today.getMonth() - billingDate.getMonth());
        return monthsDiff > 1 && payment.status !== "Paid";
      } catch (error) {
        console.error("Error calculating overdue for payment:", payment, error);
        return false;
      }
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
          collectionRate:
            totalClients > 0
              ? ((paidClients / totalClients) * 100).toFixed(2)
              : 0,
          totalRevenue: paymentStatusArray.reduce(
            (sum, p) => sum + (p.totalAmount || 0),
            0,
          ),
          collectedRevenue: paymentStatusArray.reduce(
            (sum, p) => sum + (p.paidAmount || 0),
            0,
          ),
          pendingRevenue: paymentStatusArray.reduce(
            (sum, p) => sum + (p.pendingAmount || 0),
            0,
          ),
          overduePaymentsCount: overduePayments.length,
          overdueAmount: overduePayments.reduce(
            (sum, p) => sum + (p.pendingAmount || 0),
            0,
          ),
        },
        overduePayments,
      },
    });
  } catch (error) {
    console.error("Error in payment status report:", error);
    next(error);
  }
};

//! 3. MONTHLY BILLING REPORT
const getMonthlyBillingReport = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || new Date().getFullYear();

    // Generate monthly data for the year
    const monthlyData = [];

    for (let m = 1; m <= 12; m++) {
      const monthStr = m.toString().padStart(2, "0");
      const billingMonth = `${targetYear}-${monthStr}`;

      // Get transactions for this month
      const transactions = await Transaction.findAll({
        where: {
          billingMonth,
          status: "approved",
        },
      });

      // Get employee collections for this month
      const employeeCollections = await EmployeePayment.findAll({
        where: {
          billingMonth,
          status: "deposited",
        },
      });

      const onlineRevenue = transactions.reduce(
        (sum, t) => sum + parseFloat(t.amount || 0),
        0,
      );
      const employeeRevenue = employeeCollections.reduce(
        (sum, ec) => sum + parseFloat(ec.amount || 0),
        0,
      );
      const totalRevenue = onlineRevenue + employeeRevenue;

      // Count clients
      const activeClients = await ClientInformation.count({
        where: {
          status: "active",
          createdAt: { [Op.lte]: new Date(`${targetYear}-${monthStr}-31`) },
        },
      });

      // Calculate average revenue per client
      const avgRevenuePerClient =
        activeClients > 0 ? (totalRevenue / activeClients).toFixed(2) : 0;

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
        collectionRate:
          activeClients > 0
            ? (
                ((transactions.length + employeeCollections.length) /
                  activeClients) *
                100
              ).toFixed(2)
            : 0,
      });
    }

    // Yearly summary
    const yearlySummary = {
      totalRevenue: monthlyData.reduce(
        (sum, month) => sum + month.totalRevenue,
        0,
      ),
      totalOnlineRevenue: monthlyData.reduce(
        (sum, month) => sum + month.onlineRevenue,
        0,
      ),
      totalEmployeeRevenue: monthlyData.reduce(
        (sum, month) => sum + month.employeeRevenue,
        0,
      ),
      totalTransactions: monthlyData.reduce(
        (sum, month) => sum + month.transactionCount,
        0,
      ),
      totalCollections: monthlyData.reduce(
        (sum, month) => sum + month.collectionCount,
        0,
      ),
      avgMonthlyRevenue: (
        monthlyData.reduce((sum, month) => sum + month.totalRevenue, 0) / 12
      ).toFixed(2),
      peakMonth: monthlyData.reduce(
        (max, month) => (month.totalRevenue > max.totalRevenue ? month : max),
        monthlyData[0],
      ),
    };

    // Client package revenue distribution
    const packageRevenue = await ClientInformation.findAll({
      attributes: [
        "package",
        [sequelize.fn("COUNT", sequelize.col("id")), "clientCount"],
        [
          sequelize.literal(
            "COUNT(id) * (SELECT packagePrice FROM packages WHERE packages.id = package)",
          ),
          "estimatedRevenue",
        ],
      ],
      where: { status: "active" },
      group: ["package"],
      raw: true,
    });

    // Add package names
    const packages = await Package.findAll();
    const packageRevenueWithNames = packageRevenue.map((pkg) => {
      const packageDetails = packages.find((p) => p.id == pkg.package);
      return {
        packageId: pkg.package,
        packageName: packageDetails ? packageDetails.packageName : "Unknown",
        clientCount: pkg.clientCount,
        estimatedMonthlyRevenue: pkg.estimatedRevenue || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        monthlyData,
        yearlySummary,
        packageRevenue: packageRevenueWithNames,
        year: targetYear,
      },
    });
  } catch (error) {
    console.error("Error in monthly billing report:", error);
    next(error);
  }
};

//! 4. EMPLOYEE COLLECTION REPORT
const getEmployeeCollectionReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      employeeId,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.collectionDate = {};
      if (startDate) whereClause.collectionDate[Op.gte] = new Date(startDate);
      if (endDate)
        whereClause.collectionDate[Op.lte] = new Date(endDate + " 23:59:59");
    }
    if (employeeId) whereClause.employeeId = employeeId;
    if (status) whereClause.status = status;

    // Get employee collections WITHOUT includes
    const { count, rows: collections } = await EmployeePayment.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["collectionDate", "DESC"]],
    });

    // Get unique client and employee IDs
    const clientIds = [...new Set(collections.map(c => c.clientId))];
    const employeeIds = [...new Set(collections.map(c => c.employeeId))];

    // Fetch client and employee information separately
    const [clients, employees] = await Promise.all([
      ClientInformation.findAll({
        where: { userId: clientIds },
        attributes: ["userId", "fullName", "mobileNo", "email", "location"]
      }),
      AuthorityInformation.findAll({
        where: { userId: employeeIds },
        attributes: ["userId", "fullName", "role", "mobileNo"]
      })
    ]);

    // Create lookup maps
    const clientMap = {};
    const employeeMap = {};

    clients.forEach(client => {
      clientMap[client.userId] = client;
    });

    employees.forEach(employee => {
      employeeMap[employee.userId] = employee;
    });

    // Add client and employee details to collections manually
    const collectionsWithDetails = collections.map(collection => {
      const collectionObj = collection.toJSON();
      const client = clientMap[collection.clientId];
      const employee = employeeMap[collection.employeeId];

      collectionObj.client = {
        fullName: client?.fullName || collection.clientName,
        mobileNo: client?.mobileNo || collection.clientPhone,
        email: client?.email || "N/A",
        location: client?.location || "N/A"
      };

      collectionObj.employee = {
        fullName: employee?.fullName || collection.employeeName,
        userId: employee?.userId || collection.employeeId,
        role: employee?.role || "N/A"
      };

      return collectionObj;
    });

    // Employee performance summary
    const employeePerformance = await EmployeePayment.findAll({
      where: whereClause.status ? { status: whereClause.status } : {},
      attributes: [
        "employeeId",
        [sequelize.fn("COUNT", sequelize.col("id")), "collectionCount"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
        [
          sequelize.fn("MIN", sequelize.col("collectionDate")),
          "firstCollection",
        ],
        [
          sequelize.fn("MAX", sequelize.col("collectionDate")),
          "lastCollection",
        ],
      ],
      group: ["employeeId"],
      raw: true,
    });

    // Add employee details to performance data
    const performanceWithDetails = await Promise.all(
      employeePerformance.map(async (perf) => {
        // Find employee in our already fetched employees or fetch if not found
        let employee = employeeMap[perf.employeeId];
        if (!employee) {
          employee = await AuthorityInformation.findOne({
            where: { userId: perf.employeeId },
            attributes: ["fullName", "role", "mobileNo"],
          });
        }

        // Calculate success rate (deposited vs total)
        const totalCollections = await EmployeePayment.count({
          where: { employeeId: perf.employeeId },
        });

        const successfulCollections = await EmployeePayment.count({
          where: {
            employeeId: perf.employeeId,
            status: "deposited",
          },
        });

        const successRate =
          totalCollections > 0
            ? ((successfulCollections / totalCollections) * 100).toFixed(2)
            : 0;

        return {
          employeeId: perf.employeeId,
          employeeName: employee ? employee.fullName : collection.employeeName || "Unknown",
          employeeRole: employee ? employee.role : "N/A",
          collectionCount: parseInt(perf.collectionCount || 0),
          totalAmount: parseFloat(perf.totalAmount || 0),
          averageAmount: parseFloat(perf.averageAmount || 0),
          firstCollection: perf.firstCollection,
          lastCollection: perf.lastCollection,
          successRate: parseFloat(successRate),
          contact: employee ? employee.mobileNo : "N/A",
        };
      }),
    );

    // Daily collection trend
    const dailyTrend = await EmployeePayment.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("DATE", sequelize.col("collectionDate")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "amount"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("collectionDate"))],
      order: [[sequelize.fn("DATE", sequelize.col("collectionDate")), "ASC"]],
      limit: 30,
    });

    const totalPages = Math.ceil(count / limitNumber);

    res.status(200).json({
      success: true,
      data: {
        collections: collectionsWithDetails,
        employeePerformance: performanceWithDetails,
        dailyTrend,
        summary: {
          totalCollections: count,
          totalAmount: collections.reduce(
            (sum, c) => sum + parseFloat(c.amount || 0),
            0,
          ),
          averageCollection:
            count > 0
              ? (
                  collections.reduce(
                    (sum, c) => sum + parseFloat(c.amount || 0),
                    0,
                  ) / count
                ).toFixed(2)
              : 0,
          uniqueEmployees: new Set(collections.map((c) => c.employeeId)).size,
        },
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in employee collection report:", error);
    next(error);
  }
};

//! 5. TRANSACTION APPROVAL REPORT
const getTransactionApprovalReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      status,
      approvedBy,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate)
        whereClause.createdAt[Op.lte] = new Date(endDate + " 23:59:59");
    }
    if (status) whereClause.status = status;
    if (approvedBy) whereClause.approvedBy = approvedBy;

    // Get transactions
    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: ClientInformation,
          as: "client",
          attributes: ["fullName", "mobileNo", "email"],
        },
      ],
    });

    // Approval statistics
    const approvalStats = await Transaction.findAll({
      where:
        whereClause.startDate || whereClause.endDate
          ? {
              createdAt: whereClause.createdAt,
            }
          : {},
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
      group: ["status"],
    });

    // Approver performance
    const approverPerformance = await Transaction.findAll({
      where: {
        approvedBy: { [Op.not]: null },
        ...(whereClause.createdAt ? { createdAt: whereClause.createdAt } : {}),
      },
      attributes: [
        "approvedBy",
        [sequelize.fn("COUNT", sequelize.col("id")), "approvedCount"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalApprovedAmount"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(MINUTE, createdAt, approvedAt)"),
          ),
          "avgApprovalTime",
        ],
      ],
      group: ["approvedBy"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
    });

    // Approval time analysis
    const approvalTimeAnalysis = await Transaction.findAll({
      where: {
        status: "approved",
        approvedAt: { [Op.not]: null },
        ...(whereClause.createdAt ? { createdAt: whereClause.createdAt } : {}),
      },
      attributes: [
        [sequelize.fn("HOUR", sequelize.col("approvedAt")), "hourOfDay"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(MINUTE, createdAt, approvedAt)"),
          ),
          "avgApprovalTime",
        ],
      ],
      group: [sequelize.fn("HOUR", sequelize.col("approvedAt"))],
      order: [[sequelize.fn("HOUR", sequelize.col("approvedAt")), "ASC"]],
    });

    // Pending transactions requiring attention
    const pendingTransactions = await Transaction.findAll({
      where: {
        status: "pending",
        createdAt: {
          [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 1)), // Older than 1 day
        },
      },
      include: [
        {
          model: ClientInformation,
          as: "client",
          attributes: ["fullName", "mobileNo", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
      limit: 50,
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
          approvalRate:
            count > 0
              ? ((approvalStats.find((s) => s.status === "approved")?.count ||
                  0) /
                  count) *
                100
              : 0,
        },
        pendingAttention: pendingTransactions,
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in transaction approval report:", error);
    next(error);
  }
};

//! 6. BANK ACCOUNT BALANCE REPORT
const getBankAccountBalanceReport = async (req, res, next) => {
  try {
    const { accountType, isActive, isPrimary } = req.query;

    const whereClause = {};
    if (accountType) whereClause.accountType = accountType;
    if (isActive !== undefined) whereClause.isActive = isActive === "true";
    if (isPrimary !== undefined) whereClause.isPrimary = isPrimary === "true";

    // Get all bank accounts
    const bankAccounts = await BankAccount.findAll({
      where: whereClause,
      order: [
        ["isPrimary", "DESC"],
        ["currentBalance", "DESC"],
      ],
    });

    // Calculate totals
    const totals = bankAccounts.reduce(
      (acc, account) => {
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
            balance: 0,
          };
        }
        acc.byType[account.accountType].count++;
        acc.byType[account.accountType].balance += balance;

        return acc;
      },
      {
        totalBalance: 0,
        primaryBalance: 0,
        activeAccounts: 0,
        byType: {},
      },
    );

    // Recent transactions for each account (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // You would need to have transaction models linked to bank accounts
    // For now, we'll return basic account info

    // Account balance trend (last 30 days)
    const balanceHistory = await BankAccount.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("lastTransactionDate")), "date"],
        [sequelize.fn("SUM", sequelize.col("currentBalance")), "totalBalance"],
        [sequelize.fn("COUNT", sequelize.col("id")), "accountCount"],
      ],
      where: {
        lastTransactionDate: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("lastTransactionDate"))],
      order: [
        [sequelize.fn("DATE", sequelize.col("lastTransactionDate")), "DESC"],
      ],
    });

    // Account status summary
    const statusSummary = {
      totalAccounts: bankAccounts.length,
      activeAccounts: bankAccounts.filter((a) => a.isActive).length,
      inactiveAccounts: bankAccounts.filter((a) => !a.isActive).length,
      primaryAccounts: bankAccounts.filter((a) => a.isPrimary).length,
      totalBalance: totals.totalBalance,
      primaryBalance: totals.primaryBalance,
    };

    // Low balance alerts (below 10% of transaction limit)
    const lowBalanceAccounts = bankAccounts.filter((account) => {
      const balance = parseFloat(account.currentBalance || 0);
      const dailyLimit = parseFloat(account.dailyLimit || 0);
      const monthlyLimit = parseFloat(account.monthlyLimit || 0);

      const limit = dailyLimit > 0 ? dailyLimit : monthlyLimit;
      return limit > 0 && balance < limit * 0.1;
    });

    res.status(200).json({
      success: true,
      data: {
        bankAccounts: bankAccounts.map((account) => account.toJSON()),
        totals,
        statusSummary,
        balanceHistory,
        lowBalanceAlerts: lowBalanceAccounts.map((account) => ({
          accountName: account.accountName,
          bankName: account.bankName,
          accountNumber: account.accountNumber,
          currentBalance: account.currentBalance,
          dailyLimit: account.dailyLimit,
          monthlyLimit: account.monthlyLimit,
          balancePercentage: account.dailyLimit
            ? ((account.currentBalance / account.dailyLimit) * 100).toFixed(2) +
              "%"
            : "N/A",
        })),
        byAccountType: totals.byType,
      },
    });
  } catch (error) {
    console.error("Error in bank account balance report:", error);
    next(error);
  }
};

//! 7. EXPENSE REPORT
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
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereClause = {};
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = new Date(startDate);
      if (endDate) whereClause.date[Op.lte] = new Date(endDate + " 23:59:59");
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
      order: [["date", "DESC"]],
      include: [
        {
          model: ExpenseCategory,
          as: "category",
          attributes: ["id", "categoryName"],
        },
        {
          model: ExpenseSubCategory,
          as: "subcategory",
          attributes: ["id", "subCategoryName"],
        },
        {
          model: ExpensePayment,
          as: "payments",
          include: [
            {
              model: BankAccount,
              as: "account",
              attributes: ["bankName", "accountName", "accountNumber"],
            },
          ],
        },
      ],
    });

    // Expense statistics by category
    const categoryStats = await Expense.findAll({
      where: whereClause,
      attributes: [
        "expenseCategoryId",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("totalAmount")), "averageAmount"],
      ],
      group: ["expenseCategoryId"],
      include: [
        {
          model: ExpenseCategory,
          as: "category",
          attributes: ["categoryName"],
        },
      ],
    });

    // Monthly expense trend
    const monthlyExpense = await Expense.findAll({
      where:
        whereClause.startDate || whereClause.endDate
          ? {
              date: whereClause.date,
            }
          : {},
      attributes: [
        [sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m")],
      order: [
        [sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"), "DESC"],
      ],
      limit: 12,
    });

    // Payment status summary
    const paymentStats = await Expense.findAll({
      where: whereClause,
      attributes: [
        "paymentStatus",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
      ],
      group: ["paymentStatus"],
    });

    // Top expenses
    const topExpenses = await Expense.findAll({
      where: whereClause,
      order: [["totalAmount", "DESC"]],
      limit: 10,
      include: [
        {
          model: ExpenseCategory,
          as: "category",
          attributes: ["categoryName"],
        },
        {
          model: ExpenseSubCategory,
          as: "subcategory",
          attributes: ["subCategoryName"],
        },
      ],
    });

    const totalPages = Math.ceil(count / limitNumber);

    // Calculate totals
    const totals = {
      totalExpenses: count,
      totalAmount: expenses.reduce(
        (sum, exp) => sum + parseFloat(exp.totalAmount || 0),
        0,
      ),
      paidAmount: expenses
        .filter((exp) => exp.paymentStatus === "Paid")
        .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
      pendingAmount: expenses
        .filter((exp) => exp.paymentStatus === "Pending")
        .reduce((sum, exp) => sum + parseFloat(exp.totalAmount || 0), 0),
      averageExpense:
        count > 0
          ? (
              expenses.reduce(
                (sum, exp) => sum + parseFloat(exp.totalAmount || 0),
                0,
              ) / count
            ).toFixed(2)
          : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        expenses,
        statistics: {
          categoryStats,
          monthlyExpense,
          paymentStats,
          totals,
        },
        topExpenses,
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in expense report:", error);
    next(error);
  }
};

module.exports = {
  getRevenueCollectionReport,
  getPaymentStatusReport,
  getMonthlyBillingReport,
  getEmployeeCollectionReport,
  getTransactionApprovalReport,
  getBankAccountBalanceReport,
  getExpenseReport,
};
