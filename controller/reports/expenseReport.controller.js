const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const AuthorityInformation = require("../../models/Authentication/authority.model");
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

    // Get all expense categories with their expenses
    const categories = await ExpenseCategory.findAll({
      include: [
        {
          model: Expense,
          as: "expenses",
          where: whereClause,
          required: false,
          include: [
            {
              model: ExpenseSubCategory,
              as: "subcategory",
              attributes: ["subCategoryName"],
            },
          ],
        },
      ],
      order: [["categoryName", "ASC"]],
    });

    // Get expenses with pagination for detailed view
    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["date", "DESC"]],
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
        {
          model: ExpensePayment,
          as: "payments",
          include: [
            {
              model: BankAccount,
              as: "account",
              attributes: ["bankName", "accountName"],
            },
          ],
        },
      ],
    });

    // Category-wise statistics - FIXED: Specify table name for id
    const categoryStats = await Expense.findAll({
      where: whereClause,
      attributes: [
        "expenseCategoryId",
        [sequelize.fn("COUNT", sequelize.col("Expense.id")), "count"], // Specify Expense.id
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("totalAmount")), "averageAmount"],
        [sequelize.fn("MIN", sequelize.col("totalAmount")), "minAmount"],
        [sequelize.fn("MAX", sequelize.col("totalAmount")), "maxAmount"],
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

    // Subcategory-wise statistics - FIXED: Specify table name for id
    const subcategoryStats = await Expense.findAll({
      where: {
        ...whereClause,
        expenseSubcategoryId: { [Op.not]: null },
      },
      attributes: [
        "expenseCategoryId",
        "expenseSubcategoryId",
        [sequelize.fn("COUNT", sequelize.col("Expense.id")), "count"], // Specify Expense.id
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
      ],
      group: ["expenseCategoryId", "expenseSubcategoryId"],
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

    // Monthly expense trend by category - FIXED: Specify table name for id
    const monthlyCategoryTrend = await Expense.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"), "month"],
        "expenseCategoryId",
        [sequelize.fn("COUNT", sequelize.col("Expense.id")), "count"], // Specify Expense.id
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
      ],
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"),
        "expenseCategoryId",
      ],
      include: [
        {
          model: ExpenseCategory,
          as: "category",
          attributes: ["categoryName"],
        },
      ],
      order: [
        [sequelize.fn("DATE_FORMAT", sequelize.col("date"), "%Y-%m"), "DESC"],
      ],
      limit: 36, // Last 3 years
    });

    // Payment status by category - FIXED: Specify table name for id
    const paymentStatusByCategory = await Expense.findAll({
      where: whereClause,
      attributes: [
        "expenseCategoryId",
        "paymentStatus",
        [sequelize.fn("COUNT", sequelize.col("Expense.id")), "count"], // Specify Expense.id
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
      ],
      group: ["expenseCategoryId", "paymentStatus"],
      include: [
        {
          model: ExpenseCategory,
          as: "category",
          attributes: ["categoryName"],
        },
      ],
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
      categoriesCount: categories.length,
      subcategoriesCount: new Set(
        expenses
          .filter((e) => e.expenseSubcategoryId)
          .map((e) => e.expenseSubcategoryId),
      ).size,
    };

    // Format category data for charts
    const categoryChartData = categoryStats.map((stat) => ({
      category: stat.category?.categoryName || "Uncategorized",
      amount: parseFloat(stat.totalAmount || 0),
      count: stat.count,
      average: parseFloat(stat.averageAmount || 0),
    }));

    // Format monthly trend
    const monthlyTrendData = {};
    monthlyCategoryTrend.forEach((item) => {
      const month = item.month;
      if (!monthlyTrendData[month]) {
        monthlyTrendData[month] = { month, total: 0 };
      }
      monthlyTrendData[month].total += parseFloat(item.totalAmount || 0);
    });

    res.status(200).json({
      success: true,
      data: {
        categories: categories.map((cat) => ({
          id: cat.id,
          categoryName: cat.categoryName,
          description: cat.description, // Changed from categoryDetails to description
          expenseCount: cat.expenses.length,
          totalAmount: cat.expenses.reduce(
            (sum, exp) => sum + parseFloat(exp.totalAmount || 0),
            0,
          ),
        })),
        expenses,
        statistics: {
          categoryStats,
          subcategoryStats,
          monthlyCategoryTrend,
          paymentStatusByCategory,
        },
        topExpenses,
        chartData: {
          categoryChartData,
          monthlyTrend: Object.values(monthlyTrendData),
        },
        totals,
      },
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in expense category report:", error);
    next(error);
  }
};

//! 2. BANK TRANSACTION REPORT
const getBankTransactionReport = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      accountId,
      accountType,
      transactionType,
      page = 1,
      limit = 30,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get bank accounts
    const bankAccounts = await BankAccount.findAll({
      where: accountType ? { accountType } : {},
      order: [
        ["bankName", "ASC"],
        ["accountName", "ASC"],
      ],
    });

    // Get all transactions from different sources
    const allTransactions = [];

    // Get expense payments (outgoing) - NO CHANGES NEEDED HERE
    const expensePayments = await ExpensePayment.findAll({
      where: {
        ...(accountId ? { accountId } : {}),
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                ...(endDate
                  ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                  : {}),
              },
            }
          : {}),
      },
      include: [
        {
          model: Expense,
          as: "expense",
          attributes: ["expenseCode", "note", "totalAmount"],
        },
        {
          model: BankAccount,
          as: "account",
          attributes: ["bankName", "accountName", "accountNumber"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Add expense payments to transactions
    expensePayments.forEach((payment) => {
      allTransactions.push({
        id: `expense-${payment.id}`,
        date: payment.createdAt,
        type: "Expense Payment",
        description:
          payment.expense?.note || `Expense: ${payment.expense?.expenseCode}`,
        accountId: payment.accountId,
        accountName: payment.account?.accountName,
        bankName: payment.account?.bankName,
        debit: payment.paymentAmount,
        credit: 0,
        reference: payment.expense?.expenseCode,
        status: payment.status,
        source: "Expense",
      });
    });

    // Get employee collection deposits (incoming) - FIXED: Remove includes
    const employeeCollections = await EmployeePayment.findAll({
      where: {
        status: "deposited",
        ...(accountId ? { paymentAccount: accountId } : {}),
        ...(startDate || endDate
          ? {
              depositedAt: {
                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                ...(endDate
                  ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                  : {}),
              },
            }
          : {}),
      },
      // REMOVED includes since associations don't exist
      order: [["depositedAt", "DESC"]],
    });

    // If we need client and employee info, fetch separately
    if (employeeCollections.length > 0) {
      // Get unique client and employee IDs
      const clientIds = [...new Set(employeeCollections.map(ec => ec.clientId))];
      const employeeIds = [...new Set(employeeCollections.map(ec => ec.employeeId))];
      
      // Fetch client and employee info separately
      const [clients, employees] = await Promise.all([
        ClientInformation.findAll({
          where: { userId: clientIds },
          attributes: ["userId", "fullName", "mobileNo"]
        }),
        AuthorityInformation.findAll({
          where: { userId: employeeIds },
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

      // Add employee collections to transactions with fetched data
      employeeCollections.forEach((collection) => {
        const client = clientMap[collection.clientId];
        const employee = employeeMap[collection.employeeId];
        
        allTransactions.push({
          id: `collection-${collection.id}`,
          date: collection.depositedAt,
          type: "Revenue Deposit",
          description: `Collection from ${client?.fullName || collection.clientName || "Client"} by ${employee?.fullName || collection.employeeName || "Employee"}`,
          accountId: collection.paymentAccount,
          accountName: "Revenue Account", // This should come from bank account
          bankName: "Collection Deposit",
          debit: 0,
          credit: collection.amount,
          reference: collection.receiptNumber,
          status: "Deposited",
          source: "Employee Collection",
        });
      });
    } else {
      // If no collections, just push empty or handle differently
      employeeCollections.forEach((collection) => {
        allTransactions.push({
          id: `collection-${collection.id}`,
          date: collection.depositedAt,
          type: "Revenue Deposit",
          description: `Collection from ${collection.clientName} by ${collection.employeeName}`,
          accountId: collection.paymentAccount,
          accountName: "Revenue Account",
          bankName: "Collection Deposit",
          debit: 0,
          credit: collection.amount,
          reference: collection.receiptNumber,
          status: "Deposited",
          source: "Employee Collection",
        });
      });
    }

    // Get online payments (incoming) - FIXED: Remove includes
    const onlinePayments = await Transaction.findAll({
      where: {
        status: "approved",
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                ...(endDate
                  ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                  : {}),
              },
            }
          : {}),
      },
      // REMOVED include since association doesn't exist
      order: [["createdAt", "DESC"]],
    });

    // If we need client info for online payments, fetch separately
    if (onlinePayments.length > 0) {
      const clientIds = [...new Set(onlinePayments.map(op => op.userId))];
      const clients = await ClientInformation.findAll({
        where: { userId: clientIds },
        attributes: ["userId", "fullName", "mobileNo"]
      });

      const clientMap = {};
      clients.forEach(client => {
        clientMap[client.userId] = client;
      });

      // Add online payments to transactions
      onlinePayments.forEach((payment) => {
        const client = clientMap[payment.userId];
        
        // Assuming online payments go to a specific account
        allTransactions.push({
          id: `online-${payment.id}`,
          date: payment.createdAt,
          type: "Online Payment",
          description: `Payment from ${client?.fullName || "Client"}`,
          accountId: 1, // This should be the main online payment account ID
          accountName: "Online Payment Account",
          bankName: "Payment Gateway",
          debit: 0,
          credit: payment.amount,
          reference: payment.trxId,
          status: "Approved",
          source: "Online Payment",
        });
      });
    } else {
      // If no online payments
      onlinePayments.forEach((payment) => {
        allTransactions.push({
          id: `online-${payment.id}`,
          date: payment.createdAt,
          type: "Online Payment",
          description: `Payment from Client`,
          accountId: 1,
          accountName: "Online Payment Account",
          bankName: "Payment Gateway",
          debit: 0,
          credit: payment.amount,
          reference: payment.trxId,
          status: "Approved",
          source: "Online Payment",
        });
      });
    }

    // Sort all transactions by date
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply transaction type filter if specified
    let filteredTransactions = allTransactions;
    if (transactionType === "debit") {
      filteredTransactions = allTransactions.filter((t) => t.debit > 0);
    } else if (transactionType === "credit") {
      filteredTransactions = allTransactions.filter((t) => t.credit > 0);
    }

    // Apply pagination
    const paginatedTransactions = filteredTransactions.slice(
      offset,
      offset + limitNumber,
    );
    const totalCount = filteredTransactions.length;

    // Account balance summary
    const accountSummary = await Promise.all(
      bankAccounts.map(async (account) => {
        // Calculate total debits for this account
        const totalDebits = allTransactions
          .filter((t) => t.accountId == account.id && t.debit > 0)
          .reduce((sum, t) => sum + parseFloat(t.debit || 0), 0);

        // Calculate total credits for this account
        const totalCredits = allTransactions
          .filter((t) => t.accountId == account.id && t.credit > 0)
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
          isBalanced: Math.abs(currentBalance - calculatedBalance) < 0.01,
        };
      }),
    );

    // Transaction summary by type
    const transactionSummary = {
      totalTransactions: allTransactions.length,
      totalDebits: allTransactions.reduce(
        (sum, t) => sum + parseFloat(t.debit || 0),
        0,
      ),
      totalCredits: allTransactions.reduce(
        (sum, t) => sum + parseFloat(t.credit || 0),
        0,
      ),
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
      }, {}),
    };

    // Daily transaction trend
    const dailyTrend = allTransactions.reduce((acc, transaction) => {
      // Handle case where date might be null
      if (!transaction.date) return acc;
      
      const date = transaction.date.toISOString ? 
        transaction.date.toISOString().split("T")[0] : 
        new Date(transaction.date).toISOString().split("T")[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          debit: 0,
          credit: 0,
          count: 0,
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
          totalAmount: allTransactions.reduce(
            (sum, t) =>
              sum + parseFloat(t.debit || 0) + parseFloat(t.credit || 0),
            0,
          ),
          netFlow:
            transactionSummary.totalCredits - transactionSummary.totalDebits,
        },
      },
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error in bank transaction report:", error);
    next(error);
  }
};

// 3. ACCOUNT RECONCILIATION REPORT
const getAccountReconciliationReport = async (req, res, next) => {
  try {
    const { accountId, startDate, endDate, page = 1, limit = 30 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get specific account or all accounts
    const whereClause = {};
    if (accountId) whereClause.id = accountId;

    const bankAccounts = await BankAccount.findAll({
      where: whereClause,
      order: [["bankName", "ASC"]],
    });

    const reconciliationResults = await Promise.all(
      bankAccounts.map(async (account) => {
        // Get all transactions for this account from various sources
        const accountTransactions = [];

        // Expense payments from this account - NO CHANGES NEEDED
        const expensePayments = await ExpensePayment.findAll({
          where: {
            accountId: account.id,
            ...(startDate || endDate
              ? {
                  createdAt: {
                    ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                    ...(endDate
                      ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                      : {}),
                  },
                }
              : {}),
          },
          include: [
            {
              model: Expense,
              as: "expense",
              attributes: ["expenseCode", "note", "totalAmount", "date"],
            },
          ],
        });

        expensePayments.forEach((payment) => {
          accountTransactions.push({
            id: `expense-${payment.id}`,
            date: payment.createdAt,
            type: "Expense Payment",
            description:
              payment.expense?.note ||
              `Expense: ${payment.expense?.expenseCode}`,
            amount: -payment.paymentAmount, // Negative for outgoing
            reference: payment.expense?.expenseCode,
            source: "Expense System",
            status: payment.status,
            reconciled: payment.status === "Processed",
          });
        });

        // Employee collections deposited to this account - FIXED: Remove includes
        const employeeCollections = await EmployeePayment.findAll({
          where: {
            paymentAccount: account.id,
            status: "deposited",
            ...(startDate || endDate
              ? {
                  depositedAt: {
                    ...(startDate ? { [Op.gte]: new Date(startDate) } : {}),
                    ...(endDate
                      ? { [Op.lte]: new Date(endDate + " 23:59:59") }
                      : {}),
                  },
                }
              : {}),
          },
          // REMOVED includes since association doesn't exist
        });

        // If we need client info, fetch it separately
        if (employeeCollections.length > 0) {
          const clientIds = [...new Set(employeeCollections.map(ec => ec.clientId))];
          const clients = await ClientInformation.findAll({
            where: { userId: clientIds },
            attributes: ["userId", "fullName"]
          });

          const clientMap = {};
          clients.forEach(client => {
            clientMap[client.userId] = client;
          });

          // Add employee collections with client info
          employeeCollections.forEach((collection) => {
            const client = clientMap[collection.clientId];
            accountTransactions.push({
              id: `collection-${collection.id}`,
              date: collection.depositedAt,
              type: "Revenue Deposit",
              description: `Collection from ${client?.fullName || collection.clientName || "Client"}`,
              amount: collection.amount, // Positive for incoming
              reference: collection.receiptNumber,
              source: "Collection System",
              status: "Deposited",
              reconciled: true, // Assuming deposited means reconciled
            });
          });
        } else {
          // If no collections or no need for client info
          employeeCollections.forEach((collection) => {
            accountTransactions.push({
              id: `collection-${collection.id}`,
              date: collection.depositedAt,
              type: "Revenue Deposit",
              description: `Collection from ${collection.clientName || "Client"}`,
              amount: collection.amount,
              reference: collection.receiptNumber,
              source: "Collection System",
              status: "Deposited",
              reconciled: true,
            });
          });
        }

        // Sort transactions by date
        accountTransactions.sort((a, b) => {
          // Handle null dates
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date) - new Date(b.date);
        });

        // Calculate running balance
        let runningBalance = parseFloat(account.openingBalance || 0);
        const transactionsWithBalance = accountTransactions.map(
          (transaction) => {
            runningBalance += parseFloat(transaction.amount || 0);
            return {
              ...transaction,
              runningBalance: runningBalance.toFixed(2),
            };
          },
        );

        // Expected balance vs actual balance
        const expectedBalance = runningBalance;
        const actualBalance = parseFloat(account.currentBalance || 0);
        const discrepancy = actualBalance - expectedBalance;

        // Identify unreconciled transactions
        const unreconciledTransactions = accountTransactions.filter(
          (t) => !t.reconciled,
        );
        const unreconciledAmount = unreconciledTransactions.reduce(
          (sum, t) => sum + parseFloat(t.amount || 0),
          0,
        );

        // Transaction summary
        const summary = {
          totalTransactions: accountTransactions.length,
          reconciledTransactions: accountTransactions.filter(
            (t) => t.reconciled,
          ).length,
          unreconciledTransactions: unreconciledTransactions.length,
          totalIncoming: accountTransactions
            .filter((t) => t.amount > 0)
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
          totalOutgoing: Math.abs(
            accountTransactions
              .filter((t) => t.amount < 0)
              .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
          ),
          openingBalance: parseFloat(account.openingBalance || 0),
          expectedBalance: expectedBalance,
          actualBalance: actualBalance,
          discrepancy: discrepancy.toFixed(2),
          reconciliationStatus:
            Math.abs(discrepancy) < 0.01 ? "Balanced" : "Unbalanced",
          unreconciledAmount: Math.abs(unreconciledAmount).toFixed(2),
        };

        // Apply pagination
        const paginatedTransactions = transactionsWithBalance.slice(
          offset,
          offset + limitNumber,
        );
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
            lastTransactionDate: account.lastTransactionDate,
          },
          transactions: paginatedTransactions,
          summary,
          pagination: {
            totalItems: totalCount,
            totalPages,
            currentPage: pageNumber,
            itemsPerPage: limitNumber,
          },
        };
      }),
    );

    // Overall reconciliation status
    const overallStatus = {
      totalAccounts: reconciliationResults.length,
      balancedAccounts: reconciliationResults.filter(
        (r) => r.summary.reconciliationStatus === "Balanced",
      ).length,
      unbalancedAccounts: reconciliationResults.filter(
        (r) => r.summary.reconciliationStatus === "Unbalanced",
      ).length,
      totalDiscrepancy: reconciliationResults
        .reduce(
          (sum, r) => sum + Math.abs(parseFloat(r.summary.discrepancy || 0)),
          0,
        )
        .toFixed(2),
      totalUnreconciled: reconciliationResults
        .reduce(
          (sum, r) => sum + parseFloat(r.summary.unreconciledAmount || 0),
          0,
        )
        .toFixed(2),
    };

    res.status(200).json({
      success: true,
      data: {
        reconciliationResults,
        overallStatus,
        filters: {
          accountId,
          startDate,
          endDate,
        },
      },
    });
  } catch (error) {
    console.error("Error in account reconciliation report:", error);
    next(error);
  }
};

// 4. ASSET MANAGEMENT REPORT
const getAssetManagementReport = async (req, res, next) => {
  try {
    const { assetType, status, assignedTo, page = 1, limit = 20 } = req.query;

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
      where: status ? { isActive: status === "active" } : {},
    });

    bankAccounts.forEach((account) => {
      conceptualAssets.push({
        id: `bank-${account.id}`,
        assetType: "Financial",
        assetName: `${account.bankName} - ${account.accountName}`,
        description: `${account.accountType} Account`,
        serialNumber: account.accountNumber,
        purchaseValue: account.openingBalance,
        currentValue: account.currentBalance,
        purchaseDate: account.createdAt,
        status: account.isActive ? "Active" : "Inactive",
        assignedTo: "Company",
        location: "Bank",
        depreciation: 0, // Bank accounts don't depreciate
        maintenanceHistory: [],
        notes: account.notes,
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
      filteredAssets = filteredAssets.filter(
        (asset) => asset.assetType === assetType,
      );
    }
    if (assignedTo) {
      filteredAssets = filteredAssets.filter(
        (asset) => asset.assignedTo === assignedTo,
      );
    }

    // Apply pagination
    const paginatedAssets = filteredAssets.slice(offset, offset + limitNumber);
    const totalCount = filteredAssets.length;

    // Asset statistics
    const assetStats = {
      totalAssets: totalCount,
      totalValue: filteredAssets
        .reduce((sum, asset) => sum + parseFloat(asset.currentValue || 0), 0)
        .toFixed(2),
      byType: filteredAssets.reduce((acc, asset) => {
        if (!acc[asset.assetType])
          acc[asset.assetType] = { count: 0, value: 0 };
        acc[asset.assetType].count++;
        acc[asset.assetType].value += parseFloat(asset.currentValue || 0);
        return acc;
      }, {}),
      byStatus: filteredAssets.reduce((acc, asset) => {
        if (!acc[asset.status]) acc[asset.status] = { count: 0, value: 0 };
        acc[asset.status].count++;
        acc[asset.status].value += parseFloat(asset.currentValue || 0);
        return acc;
      }, {}),
    };

    // Depreciation schedule (conceptual)
    const depreciationSchedule = filteredAssets
      .filter((asset) => asset.assetType !== "Financial")
      .map((asset) => {
        const purchaseDate = new Date(asset.purchaseDate);
        const usefulLife = 5; // years
        const salvageValue = parseFloat(asset.purchaseValue || 0) * 0.1;
        const annualDepreciation =
          (parseFloat(asset.purchaseValue || 0) - salvageValue) / usefulLife;

        const years = [];
        for (let i = 1; i <= usefulLife; i++) {
          const yearEndValue = Math.max(
            parseFloat(asset.purchaseValue || 0) - annualDepreciation * i,
            salvageValue,
          );
          years.push({
            year: i,
            depreciation: annualDepreciation.toFixed(2),
            bookValue: yearEndValue.toFixed(2),
          });
        }

        return {
          assetName: asset.assetName,
          purchaseValue: asset.purchaseValue,
          usefulLife,
          salvageValue: salvageValue.toFixed(2),
          annualDepreciation: annualDepreciation.toFixed(2),
          schedule: years,
        };
      });

    // Maintenance history (conceptual - would come from Maintenance model)
    const maintenanceHistory = [
      // Sample data - in real system, this would come from database
      {
        assetId: "sample-1",
        assetName: "Sample Router",
        maintenanceDate: "2024-01-15",
        type: "Preventive",
        cost: 5000,
        description: "Regular maintenance and firmware update",
        performedBy: "Tech Team",
      },
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
          equipmentAssets: assetStats.byType.Equipment?.count || 0,
        },
      },
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
      note: "This is a conceptual asset management report. In a production system, you would need dedicated Asset, Inventory, and Maintenance models.",
    });
  } catch (error) {
    console.error("Error in asset management report:", error);
    next(error);
  }
};

module.exports = {
  getExpenseCategoryReport,
  getBankTransactionReport,
  getAccountReconciliationReport,
  getAssetManagementReport,
};

