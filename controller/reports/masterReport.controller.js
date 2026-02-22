const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const ClientInformation = require("../../models/Authentication/client.model");
const { Expense, ExpensePayment } = require("../../models/expense/expense.model");
const Package = require("../../models/package/package.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");
const ExpenseCategory = require("../../models/expense/category.model");

// ==================== HELPER FUNCTIONS ====================

// Helper function to parse date filters
const parseDateFilters = (startDate, endDate, field = "createdAt") => {
  const filter = {};
  if (startDate || endDate) {
    filter[field] = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filter[field][Op.gte] = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter[field][Op.lte] = end;
    }
  }
  return filter;
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "/");
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return parseFloat(amount || 0).toFixed(2);
};

// Helper function to get month name
const getMonthName = (monthNumber) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[parseInt(monthNumber) - 1] || "";
};

// Helper function to get user name by userId
const getUserName = async (userId) => {
  if (!userId) return "N/A";
  
  try {
    // Check in AuthorityInformation (employees)
    const employee = await AuthorityInformation.findOne({
      where: { userId: userId },
      attributes: ["fullName"],
    });
    
    if (employee) return employee.fullName;
    
    // Check in ClientInformation (clients)
    const client = await ClientInformation.findOne({
      where: { userId: userId },
      attributes: ["fullName"],
    });
    
    if (client) return client.fullName;
    
    return userId;
  } catch (error) {
    console.error("Error getting user name:", error);
    return userId;
  }
};

// Helper function to get package details
const getPackageDetails = async (packageId) => {
  if (!packageId) return null;
  try {
    const packageData = await Package.findByPk(packageId);
    return packageData ? packageData.toJSON() : null;
  } catch (error) {
    console.error("Error fetching package details:", error);
    return null;
  }
};

// Helper function to get client details
const getClientDetails = async (userId) => {
  if (!userId) return null;
  try {
    const client = await ClientInformation.findOne({
      where: { id: userId },
      attributes: ["id", "userId", "customerId", "fullName", "mobileNo", "location", "area", "status"]
    });
    return client ? client.toJSON() : null;
  } catch (error) {
    console.error("Error fetching client details:", error);
    return null;
  }
};

//! Helper function to calculate income from transactions
const calculateTransactionIncome = async (start, end) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        status: "approved",
        createdAt: {
          [Op.between]: [start, end]
        }
      },
      attributes: ["amount", "userId", "billingMonth", "billingYear", "createdAt"]
    });

    let total = 0;
    const details = [];

    for (const transaction of transactions) {
      const amount = parseFloat(transaction.amount) || 0;
      total += amount;
      
      const clientInfo = await getClientDetails(transaction.userId);

      console.log(clientInfo,transaction.userId, 'ccccccccc')
      
      details.push({
        type: "Transaction",
        userId: transaction.userId,
        clientName: clientInfo?.fullName || "Unknown",
        clientId: clientInfo?.customerId || transaction.userId,
        amount: amount,
        billingMonth: transaction.billingMonth,
        billingYear: transaction.billingYear,
        date: transaction.createdAt,
        source: "Client Direct Payment"
      });
    }
    return { total, details };
  } catch (error) {
    console.error("Error calculating transaction income:", error);
    return { total: 0, details: [] };
  }
};

//! Helper function to calculate income from employee collections
const calculateEmployeeCollectionIncome = async (start, end) => {
  try {
    const employeePayments = await EmployeePayment.findAll({
      where: {
        status: { [Op.in]: ["collected", "verified", "deposited"] },
        collectionDate: {
          [Op.between]: [start, end]
        }
      },
      attributes: ["amount", "discount", "clientId", "clientName", "billingMonth", "employeeName", "collectionDate", "receiptNumber", "status"]
    });

    let total = 0;
    const details = [];

    for (const payment of employeePayments) {
      const amount = parseFloat(payment.amount) || 0;
      const discount = parseFloat(payment.discount) || 0;
      const netAmount = amount - discount;
      total += netAmount;
      
      details.push({
        type: "Employee Collection",
        clientId: payment.clientId,
        clientName: payment.clientName,
        amount: amount,
        discount: discount,
        netAmount: netAmount,
        billingMonth: payment.billingMonth,
        collectedBy: payment.employeeName,
        receiptNumber: payment.receiptNumber,
        date: payment.collectionDate,
        status: payment.status,
        source: "Employee Collection"
      });
    }

    return { total, details };
  } catch (error) {
    console.error("Error calculating employee collection income:", error);
    return { total: 0, details: [] };
  }
};

// Helper function to calculate expenses
const calculateExpenses = async (start, end) => {
  try {
    // Format dates for database query
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];
    
    console.log('Searching expenses between:', startDateStr, 'and', endDateStr);

    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.between]: [startDateStr, endDateStr]
        },
        status: {
          [Op.in]: ["Approved", "Paid"]
        }
      },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['categoryName'],
          required: false
        }
      ],
      attributes: [
        "id", "expenseCode", "totalAmount", "date", "note", 
        "isClientExpense", "clientId", "status", "paymentStatus"
      ]
    });

    console.log(`Found ${expenses.length} expenses in date range`);

    let total = 0;
    const categories = {};
    const details = [];

    for (const expense of expenses) {
      const expenseData = expense.get ? expense.get({ plain: true }) : expense;
      
      const amount = parseFloat(expenseData.totalAmount) || 0;
      total += amount;
      
      const categoryName = expenseData.category?.categoryName || "Uncategorized";
      
      if (!categories[categoryName]) {
        categories[categoryName] = 0;
      }
      categories[categoryName] += amount;

      let clientInfo = null;
      if (expenseData.isClientExpense && expenseData.clientId && expenseData.clientId > 0) {
        clientInfo = await ClientInformation.findOne({
          where: { id: expenseData.clientId },
          attributes: ["fullName", "customerId", "userId"]
        });
      }

      details.push({
        id: expenseData.id,
        expenseCode: expenseData.expenseCode,
        category: categoryName,
        amount: amount,
        date: expenseData.date,
        note: expenseData.note,
        isClientExpense: expenseData.isClientExpense,
        clientName: clientInfo?.fullName || null,
        clientId: clientInfo?.customerId || null,
        status: expenseData.status,
        paymentStatus: expenseData.paymentStatus
      });
    }

    console.log('Total expense calculated:', total);

    // Format expense categories for display
    const categoryBreakdown = Object.keys(categories).map(catName => ({
      name: catName,
      amount: formatCurrency(categories[catName]),
    }));

    return { total, categoryBreakdown, details };
  } catch (error) {
    console.error("Error calculating expenses:", error);
    return { total: 0, categoryBreakdown: [], details: [] };
  }
};

// Helper function to calculate referral commission
const calculateReferralCommission = (client, clientStatus = "active") => {
  const COMMISSION_PER_ACTIVE_REFERRAL = 200;
  
  if (client.referId && 
      client.referId !== "N/A" && 
      client.referId !== "null" && 
      client.referId !== "" && 
      clientStatus === "active") {
    return COMMISSION_PER_ACTIVE_REFERRAL;
  }
  return 0;
};

// Helper function to get assigned employee for a client
const getAssignedEmployee = async (clientId) => {
  try {
    const client = await ClientInformation.findOne({
      where: { userId: clientId },
      attributes: ["userAddedBy"],
    });
    
    if (client && client.userAddedBy) {
      const employeeName = await getUserName(client.userAddedBy);
      return employeeName;
    }
    
    return "Not Assigned";
  } catch (error) {
    console.error("Error getting assigned employee:", error);
    return "Unknown";
  }
};

// Helper function to get filter options
const getFilterOptions = async () => {
  try {
    // Get distinct zones (locations)
    const zones = await ClientInformation.findAll({
      where: { 
        role: "client",
        location: { [Op.ne]: null, [Op.ne]: "" } 
      },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("location")), "location"]],
    });

    // Get distinct areas
    const areas = await ClientInformation.findAll({
      where: { 
        role: "client",
        area: { [Op.ne]: null, [Op.ne]: "" } 
      },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
    });

    // Get active packages
    const packages = await Package.findAll({
      where: { status: "Active" },
      attributes: ["id", "packageName"],
    });

    // Get employees (from authority-informations)
    const employees = await AuthorityInformation.findAll({
      where: { 
        role: { [Op.in]: ["Admin", "Employee", "Super-Admin"] },
        status: "active"
      },
      attributes: ["userId", "fullName"],
    });

    // Get years and months for filters
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 5; y <= currentYear + 1; y++) {
      years.push(y.toString());
    }

    const months = [
      { value: "1", name: "January" },
      { value: "2", name: "February" },
      { value: "3", name: "March" },
      { value: "4", name: "April" },
      { value: "5", name: "May" },
      { value: "6", name: "June" },
      { value: "7", name: "July" },
      { value: "8", name: "August" },
      { value: "9", name: "September" },
      { value: "10", name: "October" },
      { value: "11", name: "November" },
      { value: "12", name: "December" },
    ];

    return {
      zones: zones.map(z => z.location).filter(Boolean),
      areas: areas.map(a => a.area).filter(Boolean),
      packages: packages.map(p => ({ id: p.id, name: p.packageName })),
      employees: employees.map(e => ({ userId: e.userId, name: e.fullName })),
      years,
      months,
      statuses: ["active", "pending", "inactive"],
    };
  } catch (error) {
    console.error("Error getting filter options:", error);
    return {
      zones: [], areas: [], packages: [], employees: [], years: [], months: [], statuses: []
    };
  }
};

//! ==================== 1. MASTER REPORT (Income vs Expense Summary) ====================
//! ==================== 1. MASTER REPORT (Income vs Expense Summary) ====================
const getMasterReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      month,
      year,
    } = req.query;

    // Determine date range
    let start, end;
    
    // Case 1: Both month and year provided
    if (month && month !== '' && year && year !== '') {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      start = new Date(yearNum, monthNum - 1, 1);
      end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
      console.log(`Filtering by specific month: ${month}/${year}`);
    }
    // Case 2: Only year provided (full year)
    else if (year && year !== '' && (!month || month === '')) {
      const yearNum = parseInt(year);
      start = new Date(yearNum, 0, 1); // Jan 1
      end = new Date(yearNum, 11, 31, 23, 59, 59, 999); // Dec 31
      console.log(`Filtering by full year: ${year}`);
    }
    // Case 3: Date range provided
    else if (startDate && startDate !== '' && endDate && endDate !== '') {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      console.log(`Filtering by date range: ${startDate} to ${endDate}`);
    }
    // Case 4: Default to current month
    else {
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      console.log(`Default to current month: ${start} to ${end}`);
    }

    console.log('Final date range:', {
      start: start.toISOString(),
      end: end.toISOString(),
      startDateStr: start.toISOString().split('T')[0],
      endDateStr: end.toISOString().split('T')[0]
    });

    // ============ CALCULATE INCOME ============
    
    // 1. Income from Client Transactions
    const transactionIncome = await calculateTransactionIncome(start, end);
    
    // 2. Income from Employee Collections
    const employeeCollectionIncome = await calculateEmployeeCollectionIncome(start, end);

    console.log('Income:', {
      transactions: transactionIncome.total,
      employeeCollections: employeeCollectionIncome.total,
      total: transactionIncome.total + employeeCollectionIncome.total
    });

    // Total Income
    const totalIncome = transactionIncome.total + employeeCollectionIncome.total;

    // ============ CALCULATE EXPENSES ============
    const expenseData = await calculateExpenses(start, end);

    console.log('Expense total:', expenseData.total);
    
    // ============ CALCULATE NET INCOME ============
    const netIncome = totalIncome - expenseData.total;
    const profitMargin = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(2) : "0.00";

    // Get filter options
    const filterOptions = await getFilterOptions();

    // Get user info (would come from logged in user)
    const generatedBy = req.user?.fullName || "System";

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "Master Report",
        companyInfo: {
          name: "Ring Tel",
          address: "Savar, Dhaka - 1340",
          mobile: "01601 997 701",
          website: "www.rtel.com.bd",
          email: "ringtel.isp@gmail.com",
        },
        period: {
          startDate: formatDate(start),
          endDate: formatDate(end),
        },
        generatedDate: formatDate(new Date()),
        generatedBy: generatedBy,
        income: {
          clientTransactions: {
            total: formatCurrency(transactionIncome.total),
            details: transactionIncome.details
          },
          employeeCollections: {
            total: formatCurrency(employeeCollectionIncome.total),
            details: employeeCollectionIncome.details
          },
          totalIncome: formatCurrency(totalIncome),
        },
        expense: {
          totalExpense: formatCurrency(expenseData.total),
          categories: expenseData.categoryBreakdown,
          details: expenseData.details,
        },
        netIncome: formatCurrency(netIncome),
        calculationNote: "Net Income = Total Income - Total Expense",
      },
      summary: {
        totalIncome: formatCurrency(totalIncome),
        totalExpense: formatCurrency(expenseData.total),
        netIncome: formatCurrency(netIncome),
        profitMargin: profitMargin + "%",
      },
      filters: {
        years: filterOptions.years,
        months: filterOptions.months,
      },
    });
  } catch (error) {
    console.error("Error in master report:", error);
    next(error);
  }
};




















//! ==================== 2. NEW CONNECTION REPORT ====================
const getNewConnectionReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      packageId,
      status,
      assignedEmployee,
      page = 1,
      limit = 100,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for new connections (clients created in date range)
    const whereClause = { 
      role: "client",
    };

    // Date filter based on creation date (new connections)
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, "createdAt");
      Object.assign(whereClause, dateFilter);
    }

    // Location/Zone filters
    if (location) whereClause.location = location;
    if (area) whereClause.area = area;
    if (packageId) whereClause.package = packageId;
    if (status) whereClause.status = status;
    
    // Employee filter (by userAddedBy)
    if (assignedEmployee) whereClause.userAddedBy = assignedEmployee;

    // Get total count
    const totalCount = await ClientInformation.count({ where: whereClause });

    // Get new connections (clients) with pagination
    const clients = await ClientInformation.findAll({
      where: whereClause,
      attributes: [
        "id",
        "userId",
        "customerId",
        "fullName",
        "mobileNo",
        "location",
        "area",
        "package",
        "costForPackage",
        "status",
        "referId",
        "userAddedBy",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: limitNumber,
      offset: offset,
    });

    // Transform clients to match the report format
    const connectionItems = await Promise.all(
      clients.map(async (client, index) => {
        const clientData = client.toJSON();

        // Get package details
        let packageName = "No Package";
        let monthlyBill = 0;
        let installationFee = 0;
        
        if (clientData.package) {
          const packageDetails = await getPackageDetails(clientData.package);
          if (packageDetails) {
            packageName = packageDetails.packageName;
            monthlyBill = parseFloat(packageDetails.packagePrice) || 0;
            installationFee = parseFloat(packageDetails.installationFee) || 0;
          }
        }

        // Use costForPackage if available (overrides package price)
        if (clientData.costForPackage) {
          monthlyBill = parseFloat(clientData.costForPackage) || 0;
        }

        // Get referral information
        let referralName = "None";
        let referralCommission = 0;
        
        if (clientData.referId && 
            clientData.referId !== "N/A" && 
            clientData.referId !== "null" && 
            clientData.referId !== "") {
          
          // Check if referrer is a client
          const referrerClient = await ClientInformation.findOne({
            where: { userId: clientData.referId },
            attributes: ["fullName"],
          });
          
          if (referrerClient) {
            referralName = referrerClient.fullName;
          } else {
            // Check if referrer is an employee
            const referrerEmployee = await AuthorityInformation.findOne({
              where: { userId: clientData.referId },
              attributes: ["fullName"],
            });
            if (referrerEmployee) {
              referralName = referrerEmployee.fullName;
            } else {
              referralName = clientData.referId;
            }
          }
          
          // Calculate referral commission
          referralCommission = calculateReferralCommission(clientData, clientData.status);
        }

        // Get assigned employee
        const assignedEmployeeName = await getAssignedEmployee(clientData.userId);

        // Calculate expenses for this connection (from Expense table where isClientExpense=true)
        let connectionExpenses = 0;
        try {
          const clientDbRecord = await ClientInformation.findOne({
            where: { userId: clientData.userId },
            attributes: ["id"]
          });
          
          if (clientDbRecord && clientDbRecord.id) {
            const expenses = await Expense.findAll({
              where: {
                clientId: clientDbRecord.id,
                isClientExpense: true,
                status: { [Op.in]: ["Approved", "Paid"] }
              },
              attributes: ["totalAmount"]
            });
            
            expenses.forEach(exp => {
              connectionExpenses += parseFloat(exp.totalAmount) || 0;
            });
          }
        } catch (error) {
          console.error("Error calculating client expenses:", error);
        }

        // Format date
        const connectionDate = formatDate(clientData.createdAt);

        return {
          sl: offset + index + 1,
          customerId: clientData.customerId || clientData.userId,
          clientName: clientData.fullName,
          mobile: clientData.mobileNo,
          zone: clientData.location || "N/A",
          area: clientData.area || "N/A",
          package: packageName,
          monthlyBill: formatCurrency(monthlyBill),
          installationFee: formatCurrency(installationFee),
          referralName: referralName,
          referralCommission: formatCurrency(referralCommission),
          expenses: formatCurrency(connectionExpenses),
          assignedEmployee: assignedEmployeeName,
          connectionDate: connectionDate,
          status: clientData.status,
        };
      })
    );

    // Calculate summary totals
    const totalMonthlyBill = connectionItems.reduce((sum, item) => sum + parseFloat(item.monthlyBill), 0);
    const totalInstallationFee = connectionItems.reduce((sum, item) => sum + parseFloat(item.installationFee), 0);
    const totalReferralCommission = connectionItems.reduce((sum, item) => sum + parseFloat(item.referralCommission), 0);
    const totalExpenses = connectionItems.reduce((sum, item) => sum + parseFloat(item.expenses), 0);
    
    const averageMonthlyBill = connectionItems.length > 0 
      ? totalMonthlyBill / connectionItems.length 
      : 0;

    // Get filter options
    const filterOptions = await getFilterOptions();

    // Get user info (would come from logged in user)
    const generatedBy = req.user?.fullName || "System";

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "New Connection Report",
        companyInfo: {
          name: "Ring Tel",
          mobile: "01601 997 701",
          website: "www.rtel.com.bd",
          email: "ringtel.isp@gmail.com",
        },
        period: {
          startDate: startDate ? formatDate(startDate) : "All time",
          endDate: endDate ? formatDate(endDate) : "Current",
        },
        generatedDate: formatDate(new Date()),
        generatedBy: generatedBy,
        connections: connectionItems,
      },
      summary: {
        totalConnections: connectionItems.length,
        totalMonthlyBill: formatCurrency(totalMonthlyBill),
        totalInstallationFee: formatCurrency(totalInstallationFee),
        totalReferralCommission: formatCurrency(totalReferralCommission),
        totalExpenses: formatCurrency(totalExpenses),
        averageMonthlyBill: formatCurrency(averageMonthlyBill),
      },
      filters: {
        zones: filterOptions.zones,
        areas: filterOptions.areas,
        packages: filterOptions.packages,
        employees: filterOptions.employees,
        statuses: filterOptions.statuses,
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalCount / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error in new connection report:", error);
    next(error);
  }
};

module.exports = {
  getMasterReport,
  getNewConnectionReport,
};