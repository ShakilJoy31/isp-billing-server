const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const ClientInformation = require("../../models/Authentication/client.model");
const { Expense, ExpensePayment } = require("../../models/expense/expense.model");
const Package = require("../../models/package/package.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");
const ExpenseCategory = require("../../models/expense/category.model");

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

// Helper function to calculate referral commission (based on your business logic)
const calculateReferralCommission = (client) => {
  // Default commission is 200 BDT per active client
  const COMMISSION_PER_ACTIVE_REFERRAL = 200;
  
  if (client.referId && client.referId !== "N/A" && client.status === "active") {
    return COMMISSION_PER_ACTIVE_REFERRAL;
  }
  return 0;
};

// Helper function to get assigned employee for a client
const getAssignedEmployee = async (clientId) => {
  try {
    // This depends on how you track assigned employees
    // You might have a field in ClientInformation or a separate table
    // For now, we'll check if userAddedBy exists and is an employee
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

// Helper function to calculate expenses for a client (installation costs, etc.)
const calculateClientExpenses = async (clientId, startDate, endDate) => {
  try {
    // This would need a proper expense tracking system linked to clients
    // For now, return 0 as placeholder
    return 0;
  } catch (error) {
    console.error("Error calculating client expenses:", error);
    return 0;
  }
};

//! 1. MASTER REPORT (Income vs Expense Summary)
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
    
    if (month && year) {
      // Specific month
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      start = new Date(yearNum, monthNum - 1, 1);
      end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
    } else if (startDate && endDate) {
      // Date range
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      // Default to current month
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // ============ CALCULATE INCOME ============
    
    // 1. Client Invoice Income (from transactions and employee payments)
    
    // Get approved transactions in date range
    const transactions = await Transaction.findAll({
      where: {
        status: "approved",
        createdAt: {
          [Op.between]: [start, end]
        }
      },
      attributes: ["amount"],
    });

    // Get employee payments in date range
    const employeePayments = await EmployeePayment.findAll({
      where: {
        status: { [Op.in]: ["collected", "verified", "deposited"] },
        collectionDate: {
          [Op.between]: [start, end]
        }
      },
      attributes: ["amount"],
    });

    // Calculate total client invoice income
    let clientInvoiceTotal = 0;
    transactions.forEach(t => clientInvoiceTotal += parseFloat(t.amount) || 0);
    employeePayments.forEach(p => clientInvoiceTotal += parseFloat(p.amount) || 0);

    // 2. Other Income (if any) - you can add other income sources here
    const otherIncome = 0;

    // Total Income
    const totalIncome = clientInvoiceTotal + otherIncome;

    // ============ CALCULATE EXPENSES ============
    
    // Get all expenses in date range
    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.between]: [start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
        },
        status: { [Op.in]: ["Approved", "Paid"] }
      },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['categoryName'],
        }
      ],
      attributes: ["totalAmount", "expenseCategoryId"],
    });

    // Calculate total expenses
    let totalExpense = 0;
    const expenseCategories = {};

    expenses.forEach(expense => {
      const amount = parseFloat(expense.totalAmount) || 0;
      totalExpense += amount;
      
      const categoryName = expense.category?.categoryName || "Uncategorized";
      if (!expenseCategories[categoryName]) {
        expenseCategories[categoryName] = 0;
      }
      expenseCategories[categoryName] += amount;
    });

    // Format expense categories for display
    const expenseCategoryBreakdown = Object.keys(expenseCategories).map(catName => ({
      name: catName,
      amount: formatCurrency(expenseCategories[catName]),
    }));

    // ============ CALCULATE NET INCOME ============
    const netIncome = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(2) : "0.00";

    // Get available years and months for filters
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
        generatedBy: "Shamim Rony", // This would come from logged in user
        income: {
          clientInvoice: formatCurrency(clientInvoiceTotal),
          otherIncome: formatCurrency(otherIncome),
          totalIncome: formatCurrency(totalIncome),
        },
        expense: {
          totalExpense: formatCurrency(totalExpense),
          categories: expenseCategoryBreakdown,
        },
        netIncome: formatCurrency(netIncome),
        calculationNote: "Net Income = Total Income - Total Expense",
      },
      summary: {
        totalIncome: formatCurrency(totalIncome),
        totalExpense: formatCurrency(totalExpense),
        netIncome: formatCurrency(netIncome),
        profitMargin: profitMargin + "%",
      },
      filters: {
        years,
        months,
      },
    });
  } catch (error) {
    console.error("Error in master report:", error);
    next(error);
  }
};

//! 2. NEW CONNECTION REPORT
const getNewConnectionReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      location,
      area,
      zone,
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
    if (zone) whereClause.location = zone;
    if (area) whereClause.area = area;
    if (packageId) whereClause.package = packageId;
    if (status) whereClause.status = status;

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

        // Use costForPackage if available
        if (clientData.costForPackage) {
          monthlyBill = parseFloat(clientData.costForPackage) || 0;
        }

        // Get referral information
        let referralName = "None";
        let referralCommission = 0;
        
        if (clientData.referId && clientData.referId !== "N/A" && clientData.referId !== "null") {
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
            }
          }
          
          // Calculate referral commission
          referralCommission = calculateReferralCommission(clientData);
        }

        // Get assigned employee
        const assignedEmployeeName = await getAssignedEmployee(clientData.userId);

        // Calculate expenses for this connection (installation costs, etc.)
        const connectionExpenses = await calculateClientExpenses(
          clientData.userId, 
          clientData.createdAt, 
          clientData.createdAt
        );

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
    const zones = await ClientInformation.findAll({
      where: { role: "client" },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("location")), "location"]],
      where: { location: { [Op.ne]: null } },
    });

    const areas = await ClientInformation.findAll({
      where: { role: "client" },
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
      where: { area: { [Op.ne]: null } },
    });

    const packages = await Package.findAll({
      where: { status: "Active" },
      attributes: ["id", "packageName"],
    });

    // Get unique employees (from userAddedBy)
    const employees = await ClientInformation.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("userAddedBy")), "userAddedBy"]],
      where: { 
        userAddedBy: { [Op.ne]: null, [Op.ne]: "" } 
      },
    });

    const employeeNames = await Promise.all(
      employees.map(async (item) => {
        const userId = item.userAddedBy;
        if (!userId) return null;
        const name = await getUserName(userId);
        return { userId, name };
      })
    ).then(results => results.filter(Boolean));

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
        generatedBy: "Shamim Rony", // This would come from logged in user
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
        zones: zones.map(z => z.location).filter(Boolean),
        areas: areas.map(a => a.area).filter(Boolean),
        packages: packages.map(p => ({ id: p.id, name: p.packageName })),
        employees: employeeNames,
        statuses: ["active", "pending", "inactive"],
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