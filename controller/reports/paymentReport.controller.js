const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const { Expense, ExpensePayment } = require("../../models/expense/expense.model");
const ExpenseCategory = require("../../models/expense/category.model");
const ExpenseSubCategory = require("../../models/expense/sub-category.model");
const BankAccount = require("../../models/account/account.model");
const ClientInformation = require("../../models/Authentication/client.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const EmployeePayment = require("../../models/payment/employee-payment.model");
const Transaction = require("../../models/payment/client-payment.model");

// Helper function to parse date filters
const parseDateFilters = (startDate, endDate, field = "date") => {
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
  }).replace(/\//g, "-");
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
  if (!userId) return "Unknown";
  
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

// Helper function to get status badge color
const getStatusColor = (status) => {
  const colors = {
    'Pending': 'yellow',
    'Approved': 'green',
    'Paid': 'blue',
    'Rejected': 'red',
    'Partially_Paid': 'orange'
  };
  return colors[status] || 'gray';
};

//! 1. EXPENSE REPORT (Enhanced with comprehensive data)
const getExpenseReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      categoryId,
      subCategoryId,
      accountId,
      expenseBy,
      status,
      paymentStatus,
      isClientExpense,
      clientId,
      minAmount,
      maxAmount,
      search,
      page = 1,
      limit = 100,
      sortBy = 'date',
      sortOrder = 'DESC'
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause for expenses
    const whereClause = { isActive: true };

    // Date filter
    if (startDate || endDate) {
      const dateFilter = parseDateFilters(startDate, endDate, "date");
      Object.assign(whereClause, dateFilter);
    }

    // Category filters
    if (categoryId) whereClause.expenseCategoryId = categoryId;
    if (subCategoryId) whereClause.expenseSubcategoryId = subCategoryId;
    
    // Status filters
    if (status) whereClause.status = status;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    
    // Client expense filter
    if (isClientExpense !== undefined && isClientExpense !== '') {
      whereClause.isClientExpense = isClientExpense === 'true' || isClientExpense === '1' || isClientExpense === true;
    }
    
    // Client filter
    if (clientId) whereClause.clientId = clientId;
    
    // Amount range filter
    if (minAmount || maxAmount) {
      whereClause.totalAmount = {};
      if (minAmount && minAmount !== '') {
        whereClause.totalAmount[Op.gte] = parseFloat(minAmount);
      }
      if (maxAmount && maxAmount !== '') {
        whereClause.totalAmount[Op.lte] = parseFloat(maxAmount);
      }
    }

    // Search filter
    if (search && search !== '') {
      whereClause[Op.or] = [
        { note: { [Op.like]: `%${search}%` } },
        { expenseCode: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get total count
    const totalCount = await Expense.count({ where: whereClause });

    // Validate sort
    const validSortFields = ['date', 'totalAmount', 'status', 'paymentStatus', 'createdAt', 'updatedAt', 'expenseCode'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'date';
    const finalSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get expenses with comprehensive associations
    const expenses = await Expense.findAll({
      where: whereClause,
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'categoryName', 'categoryCode', 'description', 'isActive'],
        },
        {
          model: ExpenseSubCategory,
          as: 'subcategory',
          attributes: ['id', 'subCategoryName', 'subCategoryCode', 'description', 'isActive'],
        },
        {
          model: ExpensePayment,
          as: 'payments',
          include: [
            {
              model: BankAccount,
              as: 'account',
              attributes: ['id', 'accountName', 'bankName', 'accountNumber', 'accountType', 'currentBalance', 'accountHolderName'],
            }
          ],
        },
        {
          model: ClientInformation,
          as: 'client',
          attributes: ['id', 'fullName', 'mobileNo', 'userId', 'customerId', 'email', 'status'],
        }
      ],
      order: [[finalSortBy, finalSortOrder], ['createdAt', 'DESC']],
      limit: limitNumber,
      offset: offset,
    });

    // Transform expenses to comprehensive report format
    const expenseItems = await Promise.all(
      expenses.map(async (expense, index) => {
        const expenseData = expense.toJSON();
        
        // Process all payments
        const payments = expenseData.payments || [];
        
        // Get payment methods summary
        const paymentMethods = payments.map(p => ({
          accountName: p.account?.accountName || 'Unknown',
          bankName: p.account?.bankName || 'N/A',
          accountNumber: p.account?.accountNumber || 'N/A',
          amount: formatCurrency(p.paymentAmount),
          status: p.status,
          processedAt: p.processedAt ? formatDate(p.processedAt) : 'Pending'
        }));

        // Calculate payment statistics
        const totalPaid = payments
          .filter(p => p.status === 'Processed')
          .reduce((sum, p) => sum + parseFloat(p.paymentAmount), 0);
        
        const totalPending = payments
          .filter(p => p.status === 'Pending')
          .reduce((sum, p) => sum + parseFloat(p.paymentAmount), 0);

        // Get approver name
        let approverName = "System";
        if (expenseData.approvedBy) {
          approverName = await getUserName(expenseData.approvedBy);
        }

        // Get creator name
        let creatorName = "System";
        if (payments.length > 0 && payments[0].createdBy) {
          creatorName = await getUserName(payments[0].createdBy);
        }

        // Determine payee
        let payee = expenseData.note || "N/A";
        if (expenseData.isClientExpense && expenseData.client) {
          payee = expenseData.client.fullName;
        } else if (expenseData.note) {
          payee = expenseData.note;
        }

        // Create comprehensive description
        const descriptionParts = [];
        if (expenseData.category) descriptionParts.push(`Category: ${expenseData.category.categoryName}`);
        if (expenseData.subcategory) descriptionParts.push(`Sub: ${expenseData.subcategory.subCategoryName}`);
        if (expenseData.note) descriptionParts.push(`Note: ${expenseData.note}`);
        if (expenseData.isClientExpense && expenseData.client) {
          descriptionParts.push(`Client: ${expenseData.client.fullName} (${expenseData.client.mobileNo || 'No phone'})`);
        }

        return {
          sl: offset + index + 1,
          expenseCode: expenseData.expenseCode,
          date: formatDate(expenseData.date),
          createdAt: formatDate(expenseData.createdAt),
          updatedAt: formatDate(expenseData.updatedAt),
          accountDetails: {
            primaryAccount: payments.length > 0 ? {
              name: payments[0].account?.accountName || 'N/A',
              bank: payments[0].account?.bankName || 'N/A',
              number: payments[0].account?.accountNumber || 'N/A',
              type: payments[0].account?.accountType || 'N/A'
            } : null,
            allAccounts: paymentMethods,
            totalPayments: payments.length,
            totalPaid: formatCurrency(totalPaid),
            totalPending: formatCurrency(totalPending)
          },
          payee: payee,
          description: descriptionParts.join(' | '),
          amount: formatCurrency(expenseData.totalAmount),
          category: {
            id: expenseData.category?.id,
            name: expenseData.category?.categoryName || "Uncategorized",
            code: expenseData.category?.categoryCode || "N/A"
          },
          subCategory: expenseData.subcategory ? {
            id: expenseData.subcategory.id,
            name: expenseData.subcategory.subCategoryName,
            code: expenseData.subcategory.subCategoryCode
          } : null,
          status: {
            current: expenseData.status,
            payment: expenseData.paymentStatus,
            color: getStatusColor(expenseData.status)
          },
          approval: {
            approvedBy: approverName,
            approvedAt: expenseData.approvedAt ? formatDate(expenseData.approvedAt) : null,
            rejectionReason: expenseData.rejectionReason
          },
          createdBy: creatorName,
          clientInfo: expenseData.client ? {
            id: expenseData.client.id,
            name: expenseData.client.fullName,
            mobile: expenseData.client.mobileNo,
            customerId: expenseData.client.customerId,
            email: expenseData.client.email,
          } : null,
          isClientExpense: expenseData.isClientExpense,
          note: expenseData.note,
          image: expenseData.image,
        };
      })
    );

    // Calculate comprehensive summary statistics
    const totalAmount = expenseItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    // Category breakdown with percentages
    const categoryMap = {};
    expenseItems.forEach(item => {
      const catName = item.category.name;
      if (!categoryMap[catName]) {
        categoryMap[catName] = { 
          count: 0, 
          total: 0,
          categoryId: item.category.id,
          categoryCode: item.category.code
        };
      }
      categoryMap[catName].count += 1;
      categoryMap[catName].total += parseFloat(item.amount);
    });
    
    const categoryBreakdown = Object.keys(categoryMap).map(catName => ({
      categoryId: categoryMap[catName].categoryId,
      categoryName: catName,
      categoryCode: categoryMap[catName].categoryCode,
      count: categoryMap[catName].count,
      totalAmount: formatCurrency(categoryMap[catName].total),
      percentage: totalAmount > 0 ? ((categoryMap[catName].total / totalAmount) * 100).toFixed(2) : "0.00",
    })).sort((a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount));

    // Account breakdown
    const accountMap = {};
    expenseItems.forEach(item => {
      if (item.accountDetails.primaryAccount) {
        const accName = item.accountDetails.primaryAccount.name;
        if (!accountMap[accName]) {
          accountMap[accName] = { 
            count: 0, 
            total: 0,
            bank: item.accountDetails.primaryAccount.bank
          };
        }
        accountMap[accName].count += 1;
        accountMap[accName].total += parseFloat(item.amount);
      }
    });
    
    const accountBreakdown = Object.keys(accountMap).map(accName => ({
      accountName: accName,
      bank: accountMap[accName].bank,
      count: accountMap[accName].count,
      totalAmount: formatCurrency(accountMap[accName].total),
      percentage: totalAmount > 0 ? ((accountMap[accName].total / totalAmount) * 100).toFixed(2) : "0.00",
    })).sort((a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount));

    // Status breakdown
    const statusMap = {};
    expenseItems.forEach(item => {
      const status = item.status.current;
      if (!statusMap[status]) {
        statusMap[status] = { count: 0, total: 0 };
      }
      statusMap[status].count += 1;
      statusMap[status].total += parseFloat(item.amount);
    });

    const statusBreakdown = Object.keys(statusMap).map(status => ({
      status,
      count: statusMap[status].count,
      totalAmount: formatCurrency(statusMap[status].total),
      percentage: totalAmount > 0 ? ((statusMap[status].total / totalAmount) * 100).toFixed(2) : "0.00",
    }));

    // Client expense breakdown
    const clientExpenseTotal = expenseItems
      .filter(item => item.isClientExpense)
      .reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    const regularExpenseTotal = totalAmount - clientExpenseTotal;

    // Top payees
    const payeeMap = {};
    expenseItems.forEach(item => {
      const payee = item.payee;
      if (!payeeMap[payee]) {
        payeeMap[payee] = { count: 0, total: 0 };
      }
      payeeMap[payee].count += 1;
      payeeMap[payee].total += parseFloat(item.amount);
    });

    const topPayees = Object.keys(payeeMap)
      .map(payee => ({
        name: payee,
        count: payeeMap[payee].count,
        totalAmount: formatCurrency(payeeMap[payee].total)
      }))
      .sort((a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount))
      .slice(0, 10);

    // Monthly trend
    const monthMap = {};
    expenseItems.forEach(item => {
      const monthYear = item.date.substring(3); // DD-MM-YYYY -> MM-YYYY
      if (!monthMap[monthYear]) {
        monthMap[monthYear] = { 
          month: monthYear,
          count: 0, 
          total: 0 
        };
      }
      monthMap[monthYear].count += 1;
      monthMap[monthYear].total += parseFloat(item.amount);
    });

    const monthlyTrend = Object.keys(monthMap)
      .map(key => ({
        month: key,
        count: monthMap[key].count,
        totalAmount: formatCurrency(monthMap[key].total)
      }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.month.split('-');
        const [dayB, monthB, yearB] = b.month.split('-');
        return new Date(yearB, monthB-1, dayB) - new Date(yearA, monthA-1, dayA);
      });

    // Get filter options for frontend
    const categories = await ExpenseCategory.findAll({
      where: { isActive: true },
      attributes: ['id', 'categoryName', 'categoryCode'],
      order: [['categoryName', 'ASC']],
    });

    const subCategories = await ExpenseSubCategory.findAll({
      where: { isActive: true },
      attributes: ['id', 'subCategoryName', 'categoryId'],
      order: [['subCategoryName', 'ASC']],
    });

    const accounts = await BankAccount.findAll({
      where: { isActive: true },
      attributes: ['id', 'accountName', 'bankName', 'accountNumber', 'accountType'],
      order: [['accountName', 'ASC']],
    });

    // Get unique expense creators
    const expenseByUsers = await Expense.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('approvedBy')), 'approvedBy']],
      where: { approvedBy: { [Op.ne]: null, [Op.ne]: '' } },
    });

    const expenseByNames = await Promise.all(
      expenseByUsers.map(async (item) => {
        const userId = item.approvedBy;
        if (!userId) return null;
        const name = await getUserName(userId);
        return { userId, name };
      })
    ).then(results => results.filter(Boolean));

    // Get clients for filter
    const clients = await ClientInformation.findAll({
      where: { status: 'Active' },
      attributes: ['id', 'fullName', 'customerId'],
      order: [['fullName', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: {
        reportTitle: "Comprehensive Expense Report",
        companyInfo: {
          name: "Ring Tel",
          address: "Savar, Dhaka - 1340",
          mobile: "01601 997 701",
          website: "www.rtel.com.bd",
          email: "ringtel.isp@gmail.com",
          logo: "https://example.com/logo.png" // Add your logo URL
        },
        period: {
          startDate: startDate ? formatDate(startDate) : "All time",
          endDate: endDate ? formatDate(endDate) : "Current",
        },
        generatedDate: formatDate(new Date()),
        generatedTime: new Date().toLocaleTimeString(),
        generatedBy: req.user?.name || "Shamim Rony",
        filters: {
          startDate: startDate || null,
          endDate: endDate || null,
          categoryId: categoryId || null,
          subCategoryId: subCategoryId || null,
          accountId: accountId || null,
          status: status || null,
          paymentStatus: paymentStatus || null,
          isClientExpense: isClientExpense || null,
          clientId: clientId || null,
          minAmount: minAmount || null,
          maxAmount: maxAmount || null,
          search: search || null,
        },
        expenses: expenseItems,
      },
      summary: {
        totalExpenses: expenseItems.length,
        totalAmount: formatCurrency(totalAmount),
        averagePerExpense: expenseItems.length > 0 ? formatCurrency(totalAmount / expenseItems.length) : "0.00",
        maxExpense: expenseItems.length > 0 ? formatCurrency(Math.max(...expenseItems.map(e => parseFloat(e.amount)))) : "0.00",
        minExpense: expenseItems.length > 0 ? formatCurrency(Math.min(...expenseItems.map(e => parseFloat(e.amount)))) : "0.00",
        totalPendingAmount: formatCurrency(
          expenseItems
            .filter(e => e.status.current === 'Pending')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0)
        ),
        totalApprovedAmount: formatCurrency(
          expenseItems
            .filter(e => e.status.current === 'Approved' || e.status.current === 'Paid')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0)
        ),
        totalRejectedAmount: formatCurrency(
          expenseItems
            .filter(e => e.status.current === 'Rejected')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0)
        ),
        clientExpenses: {
          count: expenseItems.filter(e => e.isClientExpense).length,
          total: formatCurrency(clientExpenseTotal),
          percentage: totalAmount > 0 ? ((clientExpenseTotal / totalAmount) * 100).toFixed(2) : "0.00"
        },
        regularExpenses: {
          count: expenseItems.filter(e => !e.isClientExpense).length,
          total: formatCurrency(regularExpenseTotal),
          percentage: totalAmount > 0 ? ((regularExpenseTotal / totalAmount) * 100).toFixed(2) : "0.00"
        },
        categoryBreakdown: categoryBreakdown,
        accountBreakdown: accountBreakdown,
        statusBreakdown: statusBreakdown,
        monthlyTrend: monthlyTrend.slice(0, 12), // Last 12 months
        topPayees: topPayees,
      },
      filters: {
        categories: categories.map(c => ({ 
          id: c.id, 
          name: c.categoryName,
          code: c.categoryCode 
        })),
        subCategories: subCategories.map(s => ({ 
          id: s.id, 
          name: s.subCategoryName, 
          categoryId: s.categoryId 
        })),
        accounts: accounts.map(a => ({ 
          id: a.id, 
          name: a.accountName,
          accountName: `${a.accountName}${a.bankName ? ` (${a.bankName})` : ''}`,
          bankName: a.bankName,
          accountNumber: a.accountNumber,
          accountType: a.accountType
        })),
        expenseBy: expenseByNames,
        clients: clients.map(c => ({
          id: c.id,
          name: c.fullName,
          customerId: c.customerId
        })),
        statuses: ["Pending", "Approved", "Rejected", "Partially_Paid", "Paid"],
        paymentStatuses: ["Pending", "Partially_Paid", "Paid"],
      },
      pagination: {
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        hasNextPage: pageNumber < Math.ceil(totalCount / limitNumber),
        hasPreviousPage: pageNumber > 1,
        showingFrom: offset + 1,
        showingTo: Math.min(offset + limitNumber, totalCount),
      },
    });
  } catch (error) {
    console.error("Error in expense report:", error);
    next(error);
  }
};

module.exports = {
  getExpenseReport
};