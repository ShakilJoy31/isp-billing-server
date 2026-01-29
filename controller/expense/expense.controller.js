const sequelize = require("../../database/connection");
const { Op } = require("sequelize");
const { Expense, ExpensePayment } = require("../../models/expense/expense.model");
const ExpenseCategory = require("../../models/expense/category.model");
const ExpenseSubCategory = require("../../models/expense/sub-category.model");
const BankAccount = require("../../models/account/account.model");
const ClientInformation = require("../../models/Authentication/client.model");

//! Create new expense with multiple payments (with client expense support)
const createExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      note,
      expenseCategoryId,
      expenseSubcategoryId,
      totalAmount,
      date,
      image,
      payments,
      isClientExpense = false,
      clientId = null
    } = req.body;

    // Validate required fields
    if (!expenseCategoryId || !totalAmount || !date) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: expenseCategoryId, totalAmount, date" 
      });
    }

    // Validate total amount
    if (parseFloat(totalAmount) <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Total amount must be greater than 0"
      });
    }

    // Check if category exists
    const category = await ExpenseCategory.findOne({ 
      where: { id: expenseCategoryId, isActive: true } 
    });

    if (!category) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Expense category not found or inactive"
      });
    }

    // Check if subcategory exists (if provided)
    if (expenseSubcategoryId) {
      const subcategory = await ExpenseSubCategory.findOne({
        where: { 
          id: expenseSubcategoryId, 
          isActive: true,
          categoryId: expenseCategoryId
        }
      });

      if (!subcategory) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Expense subcategory not found, inactive, or doesn't belong to the selected category"
        });
      }
    }

    // Validate client expense if marked as client expense
    if (isClientExpense) {
      if (!clientId) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Client ID is required for client expense"
        });
      }

      // Check if client exists
      const client = await ClientInformation.findOne({
        where: { 
          id: clientId,
          status: 'Active'
        },
        transaction
      });

      if (!client) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Client not found or inactive"
        });
      }
    }

    // Validate payments array
    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "At least one payment method is required"
      });
    }

    // Calculate total payment amount
    const totalPaymentAmount = payments.reduce((sum, payment) => {
      return sum + parseFloat(payment.paymentAmount || 0);
    }, 0);

    // Validate if payment amounts match total amount
    if (Math.abs(totalPaymentAmount - parseFloat(totalAmount)) > 0.01) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Total payment amount does not match expense total amount"
      });
    }

    // Validate each payment account
    for (const payment of payments) {
      const account = await BankAccount.findOne({
        where: { 
          id: payment.accountId,
          isActive: true 
        }
      });

      if (!account) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Account with ID ${payment.accountId} not found or inactive`
        });
      }
    }

    // Create new expense
    const newExpense = await Expense.create({
      note,
      expenseCategoryId,
      expenseSubcategoryId,
      totalAmount,
      date,
      image,
      isClientExpense,
      clientId: isClientExpense ? clientId : null,
      createdBy: req.user?.id || 'admin'
    }, { transaction });

    // ============ Create payment records ============
    for (const payment of payments) {
      await ExpensePayment.create({
        expenseId: newExpense.id,
        accountId: payment.accountId,
        paymentAmount: payment.paymentAmount,
        status: 'Pending',
        createdBy: req.user?.id || 'admin'
      }, { transaction });
    }
    // ============ END PAYMENT CREATION ============

    await transaction.commit();

    // Fetch the complete expense with relationships
    const completeExpense = await Expense.findOne({
      where: { id: newExpense.id },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'categoryName', 'categoryCode']
        },
        {
          model: ExpenseSubCategory,
          as: 'subcategory',
          attributes: ['id', 'subCategoryName', 'subCategoryCode'],
          required: false
        },
        {
          model: ClientInformation,
          as: 'client',
          attributes: [
            'id', 'customerId', 'userId', 'fullName', 'photo', 
            'fatherOrSpouseName', 'dateOfBirth', 'age', 'sex', 
            'maritalStatus', 'nidOrPassportNo', 'mobileNo', 'email', 
            'customerType', 'package', 'location', 'area', 'flatAptNo', 
            'houseNo', 'roadNo', 'landmark', 'status'
          ],
          required: false
        },
        {
          model: ExpensePayment,
          as: 'payments',
          include: [{
            model: BankAccount,
            as: 'account',
            attributes: ['id', 'accountName', 'accountNumber', 'bankName', 'currentBalance', 'accountHolderName']
          }]
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: completeExpense
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating expense:", error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }
    
    next(error);
  }
};

//! Get all expenses with filtering and pagination
const getAllExpenses = async (req, res, next) => {
  try {
    const { 
      page = 1,
      limit = 10,
      search,
      expenseCategoryId,
      expenseSubcategoryId,
      status,
      paymentStatus,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      isActive,
      isClientExpense,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};
    
    // Parse numeric values
    if (expenseCategoryId && expenseCategoryId !== '') {
      whereClause.expenseCategoryId = parseInt(expenseCategoryId);
    }
    
    if (expenseSubcategoryId && expenseSubcategoryId !== '') {
      whereClause.expenseSubcategoryId = parseInt(expenseSubcategoryId);
    }
    
    // Handle string filters
    if (status && status !== '') {
      whereClause.status = status;
    }
    
    if (paymentStatus && paymentStatus !== '') {
      whereClause.paymentStatus = paymentStatus;
    }
    
    // Handle boolean filters
    if (isActive !== undefined && isActive !== '') {
      whereClause.isActive = isActive === 'true' || isActive === '1' || isActive === true;
    }
    
    if (isClientExpense !== undefined && isClientExpense !== '') {
      whereClause.isClientExpense = isClientExpense === 'true' || isClientExpense === '1' || isClientExpense === true;
    }
    
    // Date range filter
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate && startDate !== '') {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== '') {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }
    
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

    // Handle search separately
    if (search && search !== '') {
      whereClause[Op.or] = [
        { note: { [Op.like]: `%${search}%` } },
        { expenseCode: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate sort
    const validSortOrders = ['ASC', 'DESC'];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) 
      ? sortOrder.toUpperCase() 
      : 'DESC';

    const validSortFields = [
      'date', 'totalAmount', 'status', 'paymentStatus', 
      'createdAt', 'updatedAt', 'expenseCode', 'isClientExpense'
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // First, get the expense IDs with pagination
    const expenseIdsResult = await Expense.findAndCountAll({
      where: whereClause,
      attributes: ['id'],
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset,
      distinct: true
    });

    const expenseIds = expenseIdsResult.rows.map(expense => expense.id);

    // Then, get full expense details with all payments for those IDs
    const expenses = await Expense.findAll({
      where: {
        id: {
          [Op.in]: expenseIds
        }
      },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'categoryName', 'categoryCode']
        },
        {
          model: ExpenseSubCategory,
          as: 'subcategory',
          attributes: ['id', 'subCategoryName', 'subCategoryCode'],
          required: false
        },
        {
          model: ClientInformation,
          as: 'client',
          attributes: [
            'id', 'customerId', 'userId', 'fullName', 'photo', 
            'fatherOrSpouseName', 'dateOfBirth', 'age', 'sex', 
            'maritalStatus', 'nidOrPassportNo', 'mobileNo', 'email', 
            'customerType', 'package', 'location', 'area', 'flatAptNo', 
            'houseNo', 'roadNo', 'landmark', 'status'
          ],
          required: false
        },
        {
          model: ExpensePayment,
          as: 'payments',
          include: [{
            model: BankAccount,
            as: 'account',
            attributes: ['id', 'accountName', 'accountNumber', 'bankName', 'accountHolderName']
          }]
        }
      ],
      order: [[finalSortBy, finalSortOrder]]
    });

    return res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully!",
      data: expenses,
      meta: {
        totalItems: expenseIdsResult.count,
        totalPages: Math.ceil(expenseIdsResult.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    next(error);
  }
};









//! Get expense by ID
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid expense ID" 
      });
    }

    const expense = await Expense.findOne({ 
      where: { id },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'categoryName', 'categoryCode']
        },
        {
          model: ExpenseSubCategory,
          as: 'subcategory',
          attributes: ['id', 'subCategoryName', 'subCategoryCode'],
          required: false
        },
        {
          model: ClientInformation,
          as: 'client',
          attributes: [
            'id', 'customerId', 'userId', 'fullName', 'photo', 
            'fatherOrSpouseName', 'dateOfBirth', 'age', 'sex', 
            'maritalStatus', 'nidOrPassportNo', 'mobileNo', 'email', 
            'customerType', 'package', 'location', 'area', 'flatAptNo', 
            'houseNo', 'roadNo', 'landmark', 'status'
          ],
          required: false
        },
        {
          model: ExpensePayment,
          as: 'payments',
          include: [{
            model: BankAccount,
            as: 'account',
            attributes: ['id', 'accountName', 'accountNumber', 'bankName', 'currentBalance', 'accountHolderName']
          }]
        }
      ]
    });

    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: "Expense not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense retrieved successfully!",
      data: expense
    });
  } catch (error) {
    console.error("Error retrieving expense:", error);
    next(error);
  }
};

//! Update expense
const updateExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false,
        message: "Invalid expense ID" 
      });
    }

    // Find the expense
    const expense = await Expense.findOne({ 
      where: { id },
      include: [{ model: ExpensePayment, as: 'payments' }],
      transaction
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false,
        message: "Expense not found" 
      });
    }

    // Check if expense is already approved (restrict updates)
    if (expense.status === 'Approved' || expense.status === 'Paid') {
      const allowedFields = ['note', 'image', 'rejectionReason', 'isClientExpense'];
      const updateKeys = Object.keys(updateData);
      
      const hasDisallowedUpdates = updateKeys.some(key => !allowedFields.includes(key));
      
      if (hasDisallowedUpdates) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Cannot update expense details after approval. Only note, image, rejection reason, and client expense status can be updated."
        });
      }
    }

    // Validate client expense if being updated
    if (updateData.isClientExpense !== undefined) {
      // If marking as client expense, validate client ID
      if (updateData.isClientExpense) {
        if (!updateData.clientId && !expense.clientId) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Client ID is required for client expense"
          });
        }
        
        // Check if client exists
        const clientId = updateData.clientId || expense.clientId;
        if (clientId) {
          const client = await ClientInformation.findOne({
            where: { 
              id: clientId,
              status: 'Active'
            },
            transaction
          });

          if (!client) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: "Client not found or inactive"
            });
          }
        }
      } else {
        // If not a client expense, clear clientId
        updateData.clientId = null;
      }
    }

    // Validate category if provided
    if (updateData.expenseCategoryId) {
      const category = await ExpenseCategory.findOne({
        where: { id: updateData.expenseCategoryId, isActive: true },
        transaction
      });
      
      if (!category) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Category not found or inactive"
        });
      }
    }

    // Validate subcategory if provided
    if (updateData.expenseSubcategoryId) {
      const subcategory = await ExpenseSubCategory.findOne({
        where: { 
          id: updateData.expenseSubcategoryId, 
          isActive: true,
          categoryId: updateData.expenseCategoryId || expense.expenseCategoryId
        },
        transaction
      });
      
      if (!subcategory) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Subcategory not found, inactive, or doesn't belong to the category"
        });
      }
    }

    // Handle payments update if provided
    if (updateData.payments && Array.isArray(updateData.payments)) {
      // Only allow payment updates for pending expenses
      if (expense.status !== 'Pending') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Cannot update payments for approved or processed expenses"
        });
      }

      // Validate payments
      const totalPaymentAmount = updateData.payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.paymentAmount || 0);
      }, 0);

      const expenseTotal = updateData.totalAmount || expense.totalAmount;
      if (Math.abs(totalPaymentAmount - parseFloat(expenseTotal)) > 0.01) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Total payment amount does not match expense total amount"
        });
      }

      // Delete existing payments
      await ExpensePayment.destroy({
        where: { expenseId: expense.id },
        transaction
      });

      // Create new payments
      await Promise.all(
        updateData.payments.map(payment => 
          ExpensePayment.create({
            expenseId: expense.id,
            accountId: payment.accountId,
            paymentAmount: payment.paymentAmount,
            status: 'Pending',
            createdBy: req.user?.id || 'admin'
          }, { transaction })
        )
      );
    }

    // Update the expense
    delete updateData.payments; // Remove payments from update data
    delete updateData.id; // Prevent ID update
    
    await expense.update({
      ...updateData,
      updatedBy: req.user?.id || 'admin'
    }, { transaction });

    await transaction.commit();

    // Fetch updated expense with relationships
    const updatedExpense = await Expense.findOne({
      where: { id },
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['id', 'categoryName', 'categoryCode']
        },
        {
          model: ExpenseSubCategory,
          as: 'subcategory',
          attributes: ['id', 'subCategoryName', 'subCategoryCode'],
          required: false
        },
        {
          model: ClientInformation,
          as: 'client',
          attributes: [
            'id', 'customerId', 'userId', 'fullName', 'photo', 
            'fatherOrSpouseName', 'dateOfBirth', 'age', 'sex', 
            'maritalStatus', 'nidOrPassportNo', 'mobileNo', 'email', 
            'customerType', 'package', 'location', 'area', 'flatAptNo', 
            'houseNo', 'roadNo', 'landmark', 'status'
          ],
          required: false
        },
        {
          model: ExpensePayment,
          as: 'payments',
          include: [{
            model: BankAccount,
            as: 'account',
            attributes: ['id', 'accountName', 'accountNumber', 'bankName', 'accountHolderName']
          }]
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully!",
      data: updatedExpense
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating expense:", error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }
    
    next(error);
  }
};

//! Delete expense (soft delete)
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid expense ID" 
      });
    }

    const expense = await Expense.findOne({ where: { id } });

    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: "Expense not found" 
      });
    }

    // Check if expense is already approved
    if (expense.status === 'Approved' || expense.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: "Cannot delete approved or paid expense"
      });
    }

    // If it's a client expense, warn the user
    if (expense.isClientExpense) {
      // This is just a warning, we still allow deletion
      console.log(`Deleting client expense: ${expense.expenseCode} for client ID: ${expense.clientId}`);
    }

    await expense.destroy();

    return res.status(200).json({
      success: true,
      message: "Expense deactivated successfully!"
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    next(error);
  }
};

//! Approve expense and deduct from bank accounts
const approveExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false,
        message: "Invalid expense ID" 
      });
    }

    // First, find the expense without payments to check
    const expense = await Expense.findOne({ 
      where: { id, isActive: true },
      transaction
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false,
        message: "Expense not found or inactive" 
      });
    }

    // Now find the payments separately
    const expensePayments = await ExpensePayment.findAll({
      where: { expenseId: id },
      include: [{
        model: BankAccount,
        as: 'account'
      }],
      transaction
    });

    console.log('Expense:', expense.expenseCode);
    console.log('Number of payments found:', expensePayments.length);

    if (expensePayments.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "No payment records found for this expense. Cannot approve."
      });
    }

    // Check if already approved
    if (expense.status === 'Approved' || expense.status === 'Paid') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Expense is already approved or paid"
      });
    }

    // Check if rejected
    if (expense.status === 'Rejected') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot approve a rejected expense"
      });
    }

    // Validate all payment accounts have sufficient balance
    for (const payment of expensePayments) {
      if (!payment.account) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Account for payment not found`
        });
      }

      if (!payment.account.isActive) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Account ${payment.account.accountName} is inactive`
        });
      }

      if (parseFloat(payment.account.currentBalance) < parseFloat(payment.paymentAmount)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient balance in account ${payment.account.accountName}. Available: ${payment.account.currentBalance}, Required: ${payment.paymentAmount}`
        });
      }
    }

    // Deduct amounts from bank accounts
    for (const payment of expensePayments) {
      const newBalance = parseFloat(payment.account.currentBalance) - parseFloat(payment.paymentAmount);
      
      console.log(`Deducting ${payment.paymentAmount} from account ${payment.account.accountName}`);
      console.log(`Old balance: ${payment.account.currentBalance}, New balance: ${newBalance}`);
      
      await payment.account.update({
        currentBalance: newBalance,
        lastTransactionDate: new Date()
      }, { transaction });

      // Update payment status
      await payment.update({
        status: 'Processed',
        processedAt: new Date()
      }, { transaction });
    }

    // Update expense status
    await expense.update({
      status: 'Approved',
      paymentStatus: 'Paid',
      approvedBy: req.user?.id || 'admin',
      approvedAt: new Date(),
      updatedBy: req.user?.id || 'admin'
    }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Expense approved and amounts deducted from accounts successfully!",
      data: {
        expenseId: expense.id,
        expenseCode: expense.expenseCode,
        totalAmount: expense.totalAmount,
        status: 'Approved',
        paymentStatus: 'Paid',
        approvedBy: expense.approvedBy,
        approvedAt: expense.approvedAt,
        isClientExpense: expense.isClientExpense,
        clientId: expense.clientId
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving expense:", error);
    
    // Handle specific transaction errors
    if (error.name === 'SequelizeTimeoutError') {
      return res.status(408).json({
        success: false,
        message: "Transaction timeout. Please try again."
      });
    }
    
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('Lock wait timeout')) {
      return res.status(409).json({
        success: false,
        message: "Another transaction is in progress. Please try again in a few moments."
      });
    }
    
    next(error);
  }
};

//! Reject expense
const rejectExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid expense ID" 
      });
    }

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const expense = await Expense.findOne({ where: { id, isActive: true } });

    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: "Expense not found or inactive" 
      });
    }

    // Check if already processed
    if (expense.status === 'Approved' || expense.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an approved or paid expense"
      });
    }

    if (expense.status === 'Rejected') {
      return res.status(400).json({
        success: false,
        message: "Expense is already rejected"
      });
    }

    await expense.update({
      status: 'Rejected',
      rejectionReason,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: "Expense rejected successfully!",
      data: {
        expenseId: expense.id,
        expenseCode: expense.expenseCode,
        status: 'Rejected',
        rejectionReason,
        isClientExpense: expense.isClientExpense,
        clientId: expense.clientId
      }
    });
  } catch (error) {
    console.error("Error rejecting expense:", error);
    next(error);
  }
};

//! Get expense statistics
const getExpenseStats = async (req, res, next) => {
  try {
    const { startDate, endDate, expenseCategoryId, isClientExpense } = req.query;

    const whereClause = { isActive: true };
    
    // Date range filter
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate && startDate !== '') {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== '') {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }
    
    // Category filter
    if (expenseCategoryId && expenseCategoryId !== '') {
      whereClause.expenseCategoryId = parseInt(expenseCategoryId);
    }

    // Client expense filter
    if (isClientExpense !== undefined && isClientExpense !== '') {
      whereClause.isClientExpense = isClientExpense === 'true' || isClientExpense === '1' || isClientExpense === true;
    }

    // Get total statistics
    const totalExpenses = await Expense.count({ where: whereClause });
    const totalAmount = await Expense.sum('totalAmount', { where: whereClause });

    // Get status breakdown
    const statusStats = await Expense.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
      ],
      where: whereClause,
      group: ['status']
    });

    // Get category breakdown
    const categoryStats = await Expense.findAll({
      attributes: [
        'expenseCategoryId',
        [sequelize.fn('COUNT', sequelize.col('Expense.id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
      ],
      where: whereClause,
      group: ['expenseCategoryId'],
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['categoryName', 'categoryCode']
        }
      ]
    });

    // Get client expense statistics
    const clientExpenseStats = await Expense.findAll({
      attributes: [
        'isClientExpense',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
      ],
      where: whereClause,
      group: ['isClientExpense']
    });

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Expense.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount']
      ],
      where: {
        ...whereClause,
        date: { [Op.gte]: sixMonthsAgo }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'ASC']]
    });

    // Get recent expenses
    const recentExpenses = await Expense.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'expenseCode', 'note', 'totalAmount', 'status', 'date', 'isClientExpense'],
      include: [
        {
          model: ExpenseCategory,
          as: 'category',
          attributes: ['categoryName']
        },
        {
          model: ClientInformation,
          as: 'client',
          attributes: ['fullName'],
          required: false
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Expense statistics retrieved successfully!",
      data: {
        totalExpenses,
        totalAmount: totalAmount || 0,
        averageAmount: totalExpenses > 0 ? (totalAmount || 0) / totalExpenses : 0,
        statusBreakdown: statusStats,
        categoryBreakdown: categoryStats,
        clientExpenseStats,
        monthlyTrend,
        recentExpenses
      }
    });
  } catch (error) {
    console.error("Error retrieving expense statistics:", error);
    next(error);
  }
};

//! Get expenses by category
const getExpensesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { status, startDate, endDate, isClientExpense } = req.query;
    
    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid category ID" 
      });
    }

    // Check if category exists
    const category = await ExpenseCategory.findOne({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: "Category not found" 
      });
    }

    const whereClause = { 
      expenseCategoryId: parseInt(categoryId),
      isActive: true 
    };
    
    // Handle status filter
    if (status && status !== '') {
      whereClause.status = status;
    }
    
    // Client expense filter
    if (isClientExpense !== undefined && isClientExpense !== '') {
      whereClause.isClientExpense = isClientExpense === 'true' || isClientExpense === '1' || isClientExpense === true;
    }
    
    // Date range filter
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate && startDate !== '') {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== '') {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }

    const expenses = await Expense.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      include: [
        {
          model: ExpenseSubCategory,
          as: 'subcategory',
          attributes: ['subCategoryName'],
          required: false
        },
        {
          model: ClientInformation,
          as: 'client',
          attributes: ['id', 'fullName', 'mobileNo'],
          required: false
        },
        {
          model: ExpensePayment,
          as: 'payments',
          include: [{
            model: BankAccount,
            as: 'account',
            attributes: ['accountName', 'bankName']
          }]
        }
      ]
    });

    const totalAmount = await Expense.sum('totalAmount', { where: whereClause });

    return res.status(200).json({
      success: true,
      message: `Expenses for ${category.categoryName} retrieved successfully!`,
      data: {
        category: {
          id: category.id,
          categoryName: category.categoryName,
          categoryCode: category.categoryCode
        },
        expenses: expenses,
        count: expenses.length,
        totalAmount: totalAmount || 0
      }
    });
  } catch (error) {
    console.error("Error retrieving expenses by category:", error);
    next(error);
  }
};

//! Get expenses by account
const getExpensesByAccount = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { status, startDate, endDate, isClientExpense } = req.query;
    
    if (!accountId || isNaN(accountId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid account ID" 
      });
    }

    // Check if account exists
    const account = await BankAccount.findOne({
      where: { id: parseInt(accountId) }
    });

    if (!account) {
      return res.status(404).json({ 
        success: false,
        message: "Account not found" 
      });
    }

    // Build where clause for expense payments
    const paymentWhereClause = { accountId: parseInt(accountId) };
    
    // Build where clause for expenses
    const expenseWhereClause = { isActive: true };
    
    if (isClientExpense !== undefined && isClientExpense !== '') {
      expenseWhereClause.isClientExpense = isClientExpense === 'true' || isClientExpense === '1' || isClientExpense === true;
    }

    // Find expenses that have payments from this account
    const expensePayments = await ExpensePayment.findAll({
      where: paymentWhereClause,
      include: [
        {
          model: Expense,
          as: 'expense',
          where: expenseWhereClause,
          include: [
            {
              model: ExpenseCategory,
              as: 'category',
              attributes: ['categoryName']
            },
            {
              model: ClientInformation,
              as: 'client',
              attributes: ['id', 'fullName'],
              required: false
            }
          ]
        }
      ]
    });

    // Apply additional filters
    let filteredPayments = expensePayments;
    
    if (status && status !== '') {
      filteredPayments = filteredPayments.filter(payment => 
        payment.expense && payment.expense.status === status
      );
    }
    
    if (startDate && startDate !== '') {
      const start = new Date(startDate);
      filteredPayments = filteredPayments.filter(payment => 
        payment.expense && new Date(payment.expense.date) >= start
      );
    }
    
    if (endDate && endDate !== '') {
      const end = new Date(endDate);
      filteredPayments = filteredPayments.filter(payment => 
        payment.expense && new Date(payment.expense.date) <= end
      );
    }

    const totalAmount = filteredPayments.reduce((sum, payment) => 
      sum + parseFloat(payment.paymentAmount), 0
    );

    return res.status(200).json({
      success: true,
      message: `Expenses for account ${account.accountName} retrieved successfully!`,
      data: {
        account: {
          id: account.id,
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bankName: account.bankName,
          currentBalance: account.currentBalance
        },
        expensePayments: filteredPayments,
        count: filteredPayments.length,
        totalAmount: totalAmount
      }
    });
  } catch (error) {
    console.error("Error retrieving expenses by account:", error);
    next(error);
  }
};

//! Toggle expense status (active/inactive)
const toggleExpenseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid expense ID" 
      });
    }

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive field is required"
      });
    }

    const expense = await Expense.findOne({ where: { id } });

    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: "Expense not found" 
      });
    }

    // Don't allow deactivation of approved/paid expenses
    if (!isActive && (expense.status === 'Approved' || expense.status === 'Paid')) {
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate approved or paid expense"
      });
    }

    await expense.update({
      isActive: isActive,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: `Expense ${isActive ? 'activated' : 'deactivated'} successfully!`,
      data: { isActive: expense.isActive }
    });
  } catch (error) {
    console.error("Error toggling expense status:", error);
    next(error);
  }
};

//! Get expenses by client
const getExpensesByClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { status, startDate, endDate } = req.query;
    
    if (!clientId || isNaN(clientId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid client ID" 
      });
    }

    // Check if client exists
    const client = await ClientInformation.findOne({
      where: { id: parseInt(clientId) }
    });

    if (!client) {
      return res.status(404).json({ 
        success: false,
        message: "Client not found" 
      });
    }

    const whereClause = { 
      clientId: parseInt(clientId),
      isClientExpense: true,
      isActive: true 
    };
    
    // Handle status filter
    if (status && status !== '') {
      whereClause.status = status;
    }
    
    // Date range filter
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate && startDate !== '') {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== '') {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }

    const expenses = await Expense.findAll({
      where: whereClause,
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
          attributes: ['subCategoryName'],
          required: false
        },
        {
          model: ExpensePayment,
          as: 'payments',
          include: [{
            model: BankAccount,
            as: 'account',
            attributes: ['accountName', 'bankName']
          }]
        }
      ]
    });

    const totalAmount = await Expense.sum('totalAmount', { where: whereClause });

    return res.status(200).json({
      success: true,
      message: `Expenses for client ${client.fullName} retrieved successfully!`,
      data: {
        client: {
          id: client.id,
          fullName: client.fullName,
          customerId: client.customerId,
          mobileNo: client.mobileNo
        },
        expenses: expenses,
        count: expenses.length,
        totalAmount: totalAmount || 0
      }
    });
  } catch (error) {
    console.error("Error retrieving expenses by client:", error);
    next(error);
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  getExpenseStats,
  getExpensesByCategory,
  getExpensesByAccount,
  getExpensesByClient,
  toggleExpenseStatus
};