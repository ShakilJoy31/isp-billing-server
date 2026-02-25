const sequelize = require("../../database/connection");
const { Op } = require("sequelize");
const BankAccount = require("../../models/account/account.model");
const TransferHistory = require("../../models/account/transfer-history.model");

//! Create new bank account
const createBankAccount = async (req, res, next) => {
  try {
    const {
      bankName,
      accountHolderName,
      accountName,
      accountNumber,
      accountType,
      branchId,
      branchName,
      routingNumber,
      swiftCode,
      iban,
      openingBalance,
      currency,
      isPrimary,
      transactionLimit,
      dailyLimit,
      monthlyLimit,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !bankName ||
      !accountHolderName ||
      !accountName ||
      !accountNumber ||
      !accountType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: bankName, accountHolderName, accountName, accountNumber, accountType",
      });
    }

    // Create new bank account
    const newAccount = await BankAccount.create({
      bankName,
      accountHolderName,
      accountName,
      accountNumber,
      accountType,
      branchId: branchId || null,
      branchName,
      routingNumber,
      swiftCode,
      iban,
      openingBalance: openingBalance || 0,
      currentBalance: openingBalance || 0,
      currency: currency || "BDT",
      isActive: true,
      isPrimary: isPrimary || false,
      transactionLimit,
      dailyLimit,
      monthlyLimit,
      notes,
      createdBy: req.user?.id || "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Account Created Successfully!",
      data: newAccount,
    });
  } catch (error) {
    console.error("Error creating bank account:", error);

    // Handle unique constraint error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: `An account with bank name "${req.body.bankName}" and account number "${req.body.accountNumber}" already exists!`,
      });
    }

    next(error);
  }
};

const checkCombination = async (req, res) => {
  try {
    const { bankName, accountNumber } = req.query;

    if (!bankName || !accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Bank name and account number are required",
      });
    }

    const existingAccount = await BankAccount.findOne({
      where: {
        bankName: bankName,
        accountNumber: accountNumber,
      },
    });

    return res.status(200).json({
      success: true,
      exists: !!existingAccount,
    });
  } catch (error) {
    console.error("Error checking combination:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking account combination",
    });
  }
};

//! Get all bank accounts with filtering and pagination
const getAllBankAccounts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      bankName,
      accountType,
      isActive,
      branchId,
      isPrimary,
      startDate,
      endDate,
      minBalance,
      maxBalance,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};

    // Handle bankName filter
    if (bankName && bankName !== "") {
      whereClause.bankName = { [Op.like]: `%${bankName}%` };
    }

    // Handle accountType filter
    if (accountType && accountType !== "") {
      whereClause.accountType = accountType;
    }

    // Handle isActive filter
    if (isActive !== undefined && isActive !== "") {
      whereClause.isActive = isActive === "true";
    }

    // Handle isPrimary filter
    if (isPrimary !== undefined && isPrimary !== "") {
      whereClause.isPrimary = isPrimary === "true";
    }

    // Handle branchId filter
    if (branchId && branchId !== "") {
      whereClause.branchId = branchId;
    }

    // Date range filter for creation date
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate && startDate !== "") {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== "") {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    // Balance range filter
    if (minBalance || maxBalance) {
      whereClause.currentBalance = {};
      if (minBalance && minBalance !== "") {
        whereClause.currentBalance[Op.gte] = parseFloat(minBalance);
      }
      if (maxBalance && maxBalance !== "") {
        whereClause.currentBalance[Op.lte] = parseFloat(maxBalance);
      }
    }

    // Search filter
    if (search && search !== "") {
      whereClause[Op.or] = [
        { accountHolderName: { [Op.like]: `%${search}%` } },
        { accountName: { [Op.like]: `%${search}%` } },
        { accountNumber: { [Op.like]: `%${search}%` } },
        { bankName: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate and set sort order
    const validSortOrders = ["ASC", "DESC"];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    // Validate sortBy field
    const validSortFields = [
      "accountHolderName",
      "bankName",
      "accountType",
      "currentBalance",
      "openingBalance",
      "createdAt",
      "updatedAt",
      "lastTransactionDate",
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const accounts = await BankAccount.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset,
    });

    return res.status(200).json({
      success: true,
      message: "Bank accounts retrieved successfully!",
      data: accounts.rows,
      meta: {
        totalItems: accounts.count,
        totalPages: Math.ceil(accounts.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving bank accounts:", error);
    next(error);
  }
};

//! Get bank account by ID
const getBankAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID",
      });
    }

    const account = await BankAccount.findOne({ where: { id } });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bank account retrieved successfully!",
      data: account,
    });
  } catch (error) {
    console.error("Error retrieving bank account:", error);
    next(error);
  }
};

//! Update bank account
const updateBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID",
      });
    }

    // Find the account
    const account = await BankAccount.findOne({ where: { id } });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    // Prevent updating id and account number
    delete updateData.id;

    // If trying to update account number, check for duplicates
    if (
      updateData.accountNumber &&
      updateData.accountNumber !== account.accountNumber
    ) {
      const existingAccount = await BankAccount.findOne({
        where: {
          accountNumber: updateData.accountNumber,
          id: { [Op.ne]: id },
        },
      });

      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: "Account number already exists",
        });
      }
    }

    // Update the account
    await account.update({
      ...updateData,
      updatedBy: req.user?.id || "admin",
    });

    return res.status(200).json({
      success: true,
      message: "Bank account updated successfully!",
      data: account,
    });
  } catch (error) {
    console.error("Error updating bank account:", error);
    next(error);
  }
};

//! Update account balance
const updateAccountBalance = async (req, res, next) => {
  // Format currency helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  try {
    const { id } = req.params;
    const { amount, transactionType, description } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID",
      });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    if (
      !transactionType ||
      !["deposit", "withdrawal", "transfer"].includes(transactionType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid transaction type is required (deposit, withdrawal, transfer)",
      });
    }

    const account = await BankAccount.findOne({ where: { id } });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    if (!account.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot update balance of inactive account",
      });
    }

    const previousBalance = parseFloat(account.currentBalance);
    let newBalance = previousBalance;
    const transactionAmount = parseFloat(amount);

    // Update balance based on transaction type
    if (transactionType === "deposit") {
      newBalance += transactionAmount;
    } else if (transactionType === "withdrawal") {
      // Check for sufficient balance
      if (newBalance < transactionAmount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance. Available: ${formatCurrency(newBalance)}, Required: ${formatCurrency(transactionAmount)}`,
        });
      }

      // Check daily limit if set
      if (account.dailyLimit && transactionAmount > account.dailyLimit) {
        return res.status(400).json({
          success: false,
          message: `Transaction amount exceeds daily limit of ${formatCurrency(account.dailyLimit)}`,
        });
      }

      // Check monthly limit if set
      if (account.monthlyLimit && transactionAmount > account.monthlyLimit) {
        return res.status(400).json({
          success: false,
          message: `Transaction amount exceeds monthly limit of ${formatCurrency(account.monthlyLimit)}`,
        });
      }

      newBalance -= transactionAmount;
    } else if (transactionType === "transfer") {
      // Handle transfer logic
      if (newBalance < transactionAmount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance for transfer. Available: ${formatCurrency(newBalance)}, Required: ${formatCurrency(transactionAmount)}`,
        });
      }

      newBalance -= transactionAmount;
    }

    // Update the account balance
    await account.update({
      currentBalance: newBalance,
      lastTransactionDate: new Date(),
      updatedBy: req.user?.id || "admin",
    });

    return res.status(200).json({
      success: true,
      message: `Account balance ${transactionType === "deposit" ? "increased" : "decreased"} successfully!`,
      data: {
        accountId: account.id,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        bankName: account.bankName,
        previousBalance: previousBalance,
        newBalance: newBalance,
        transactionAmount: transactionAmount,
        transactionType: transactionType,
        description:
          description ||
          `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} transaction`,
        formatted: {
          previousBalance: formatCurrency(previousBalance),
          newBalance: formatCurrency(newBalance),
          transactionAmount: formatCurrency(transactionAmount),
        },
      },
    });
  } catch (error) {
    console.error("Error updating account balance:", error);
    next(error);
  }
};

//! Delete bank account (soft delete by setting isActive to false)
const deleteBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID",
      });
    }

    const account = await BankAccount.findOne({ where: { id } });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    // Soft delete by marking as inactive
    await account.update({
      isActive: false,
      updatedBy: req.user?.id || "admin",
    });

    return res.status(200).json({
      success: true,
      message: "Bank account deactivated successfully!",
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    next(error);
  }
};

const deleteBankAccountEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID",
      });
    }

    const account = await BankAccount.findOne({ where: { id } });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    // Soft delete by marking as inactive
    await account.destroy();

    return res.status(200).json({
      success: true,
      message: "Bank account deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    next(error);
  }
};

//! Get bank account statistics
const getBankAccountStats = async (req, res, next) => {
  try {
    const totalAccounts = await BankAccount.count();
    const activeAccounts = await BankAccount.count({
      where: { isActive: true },
    });
    const primaryAccounts = await BankAccount.count({
      where: { isPrimary: true },
    });

    const typeStats = await BankAccount.findAll({
      attributes: [
        "accountType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("currentBalance")), "totalBalance"],
      ],
      group: ["accountType"],
    });

    const bankStats = await BankAccount.findAll({
      attributes: [
        "bankName",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("currentBalance")), "totalBalance"],
      ],
      group: ["bankName"],
    });

    // Calculate total balance across all accounts
    const totalBalanceResult = await BankAccount.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("currentBalance")), "totalBalance"],
      ],
      where: { isActive: true },
    });

    const totalBalance = totalBalanceResult
      ? totalBalanceResult.dataValues.totalBalance
      : 0;

    // Get accounts with low balance (less than 1000)
    const lowBalanceAccounts = await BankAccount.count({
      where: {
        currentBalance: { [Op.lt]: 1000 },
        isActive: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Bank account statistics retrieved successfully!",
      data: {
        totalAccounts,
        activeAccounts,
        inactiveAccounts: totalAccounts - activeAccounts,
        primaryAccounts,
        totalBalance,
        averageBalance: totalBalance / activeAccounts || 0,
        typeBreakdown: typeStats,
        bankBreakdown: bankStats,
        lowBalanceAccounts,
      },
    });
  } catch (error) {
    console.error("Error retrieving bank account statistics:", error);
    next(error);
  }
};

//! Get accounts by branch
const getAccountsByBranch = async (req, res, next) => {
  try {
    const { branchId } = req.params;

    if (!branchId || isNaN(branchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch ID",
      });
    }

    const accounts = await BankAccount.findAll({
      where: {
        branchId: parseInt(branchId),
        isActive: true,
      },
      order: [["accountHolderName", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: `Accounts for branch ${branchId} retrieved successfully!`,
      data: accounts,
      count: accounts.length,
    });
  } catch (error) {
    console.error("Error retrieving accounts by branch:", error);
    next(error);
  }
};

//! Get accounts by type
const getAccountsByType = async (req, res, next) => {
  try {
    const { type } = req.params;

    const validTypes = [
      "Bank",
      "MobileBanking",
      "AgentBanking",
      "DigitalWallet",
      "Other",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid account type. Valid types: Bank, MobileBanking, AgentBanking, DigitalWallet, Other",
      });
    }

    const accounts = await BankAccount.findAll({
      where: {
        accountType: type,
        isActive: true,
      },
      order: [
        ["bankName", "ASC"],
        ["accountHolderName", "ASC"],
      ],
    });

    const totalBalanceResult = await BankAccount.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("currentBalance")), "totalBalance"],
      ],
      where: {
        accountType: type,
        isActive: true,
      },
    });

    const totalBalance = totalBalanceResult
      ? totalBalanceResult.dataValues.totalBalance
      : 0;

    return res.status(200).json({
      success: true,
      message: `${type} accounts retrieved successfully!`,
      data: accounts,
      count: accounts.length,
      totalBalance: totalBalance,
    });
  } catch (error) {
    console.error("Error retrieving accounts by type:", error);
    next(error);
  }
};






















//! Balance transfer

//! Transfer balance between accounts
const transferBalance = async (req, res, next) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const transaction = await sequelize.transaction();

  try {
    const {
      fromAccountId,
      toAccountId,
      amount,
      description,
      reference,
      remarks,
      receiptPhoto
    } = req.body;

    // Validation
    if (!fromAccountId || !toAccountId || !amount) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Missing required fields: fromAccountId, toAccountId, amount",
      });
    }

    if (fromAccountId === toAccountId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to the same account",
      });
    }

    if (amount <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Get both accounts
    const fromAccount = await BankAccount.findOne({
      where: { id: fromAccountId, isActive: true },
      transaction
    });

    const toAccount = await BankAccount.findOne({
      where: { id: toAccountId, isActive: true },
      transaction
    });

    if (!fromAccount) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Source account not found or is inactive",
      });
    }

    if (!toAccount) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Destination account not found or is inactive",
      });
    }

    const transferAmount = parseFloat(amount);
    const fromCurrentBalance = parseFloat(fromAccount.currentBalance);

    // Check sufficient balance
    if (fromCurrentBalance < transferAmount) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Insufficient balance in source account. Available: ${formatCurrency(fromCurrentBalance)}`,
      });
    }

    // Check daily limit for source account
    if (fromAccount.dailyLimit && transferAmount > fromAccount.dailyLimit) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Transfer amount exceeds daily limit of ${formatCurrency(fromAccount.dailyLimit)}`,
      });
    }

    // Check monthly limit for source account
    if (fromAccount.monthlyLimit && transferAmount > fromAccount.monthlyLimit) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Transfer amount exceeds monthly limit of ${formatCurrency(fromAccount.monthlyLimit)}`,
      });
    }

    // Store previous balances
    const previousFromBalance = parseFloat(fromAccount.currentBalance);
    const previousToBalance = parseFloat(toAccount.currentBalance);

    // Calculate new balances
    const newFromBalance = previousFromBalance - transferAmount;
    const newToBalance = previousToBalance + transferAmount;

    // Update both accounts
    await fromAccount.update({
      currentBalance: newFromBalance,
      lastTransactionDate: new Date(),
      updatedBy: req.user?.id || "admin",
    }, { transaction });

    await toAccount.update({
      currentBalance: newToBalance,
      lastTransactionDate: new Date(),
      updatedBy: req.user?.id || "admin",
    }, { transaction });

    // Create transfer history record
    const transferHistory = await TransferHistory.create({
      fromAccountId,
      toAccountId,
      fromAccountNumber: fromAccount.accountNumber,
      toAccountNumber: toAccount.accountNumber,
      fromBankName: fromAccount.bankName,
      toBankName: toAccount.bankName,
      fromAccountName: fromAccount.accountName,
      toAccountName: toAccount.accountName,
      amount: transferAmount,
      previousFromBalance,
      previousToBalance,
      newFromBalance,
      newToBalance,
      description: description || `Transfer from ${fromAccount.accountName} to ${toAccount.accountName}`,
      reference: reference || `TRF-${Date.now()}`,
      status: 'completed',
      initiatedBy: req.user?.id || "admin",
      remarks,
      receiptPhoto: receiptPhoto || null,
    }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Balance transferred successfully!",
      data: {
        transferId: transferHistory.id,
        fromAccount: {
          id: fromAccount.id,
          accountNumber: fromAccount.accountNumber,
          accountName: fromAccount.accountName,
          bankName: fromAccount.bankName,
          previousBalance: previousFromBalance,
          newBalance: newFromBalance,
        },
        toAccount: {
          id: toAccount.id,
          accountNumber: toAccount.accountNumber,
          accountName: toAccount.accountName,
          bankName: toAccount.bankName,
          previousBalance: previousToBalance,
          newBalance: newToBalance,
        },
        amount: transferAmount,
        description: transferHistory.description,
        reference: transferHistory.reference,
        transferDate: transferHistory.transferDate,
        receiptPhoto: transferHistory.receiptPhoto,
        formatted: {
          amount: formatCurrency(transferAmount),
          fromPreviousBalance: formatCurrency(previousFromBalance),
          fromNewBalance: formatCurrency(newFromBalance),
          toPreviousBalance: formatCurrency(previousToBalance),
          toNewBalance: formatCurrency(newToBalance),
        },
      },
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Error transferring balance:", error);
    next(error);
  }
};

//! Get transfer history with pagination and filters
const getTransferHistory = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      fromAccountId,
      toAccountId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      status,
      search,
      sortBy = "transferDate",
      sortOrder = "DESC",
    } = req.query;

    // Build where clause
    const whereClause = {};

    // Filter by accounts
    if (fromAccountId && fromAccountId !== "") {
      whereClause.fromAccountId = fromAccountId;
    }

    if (toAccountId && toAccountId !== "") {
      whereClause.toAccountId = toAccountId;
    }

    // Date range filter
    if (startDate || endDate) {
      whereClause.transferDate = {};
      if (startDate && startDate !== "") {
        whereClause.transferDate[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== "") {
        whereClause.transferDate[Op.lte] = new Date(endDate);
      }
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      whereClause.amount = {};
      if (minAmount && minAmount !== "") {
        whereClause.amount[Op.gte] = parseFloat(minAmount);
      }
      if (maxAmount && maxAmount !== "") {
        whereClause.amount[Op.lte] = parseFloat(maxAmount);
      }
    }

    // Status filter
    if (status && status !== "") {
      whereClause.status = status;
    }

    // Search filter
    if (search && search !== "") {
      whereClause[Op.or] = [
        { fromAccountNumber: { [Op.like]: `%${search}%` } },
        { toAccountNumber: { [Op.like]: `%${search}%` } },
        { fromBankName: { [Op.like]: `%${search}%` } },
        { toBankName: { [Op.like]: `%${search}%` } },
        { fromAccountName: { [Op.like]: `%${search}%` } },
        { toAccountName: { [Op.like]: `%${search}%` } },
        { reference: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate sort order
    const validSortOrders = ["ASC", "DESC"];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    // Validate sort by field
    const validSortFields = [
      "transferDate",
      "amount",
      "fromBankName",
      "toBankName",
      "status",
      "createdAt",
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "transferDate";

    const transfers = await TransferHistory.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Calculate summary statistics
    const totalTransferred = await TransferHistory.sum('amount', {
      where: whereClause,
    });

    const averageTransfer = await TransferHistory.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("amount")), "averageAmount"],
      ],
      where: whereClause,
    });

    return res.status(200).json({
      success: true,
      message: "Transfer history retrieved successfully!",
      data: transfers.rows,
      meta: {
        totalItems: transfers.count,
        totalPages: Math.ceil(transfers.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        summary: {
          totalTransferred: totalTransferred || 0,
          averageTransfer: averageTransfer?.dataValues?.averageAmount || 0,
          totalTransfers: transfers.count,
        },
      },
    });

  } catch (error) {
    console.error("Error retrieving transfer history:", error);
    next(error);
  }
};

//! Get transfer history by ID
const getTransferHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer ID",
      });
    }

    const transfer = await TransferHistory.findOne({
      where: { id },
    });

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer history not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transfer history retrieved successfully!",
      data: transfer,
    });

  } catch (error) {
    console.error("Error retrieving transfer history:", error);
    next(error);
  }
};

module.exports = {
  createBankAccount,
  checkCombination,
  getAllBankAccounts,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
  getBankAccountStats,
  getAccountsByBranch,
  getAccountsByType,
  updateAccountBalance,
  deleteBankAccountEntry,
  transferBalance,
  getTransferHistory,
  getTransferHistoryById,
};
