const { Op } = require("sequelize");
const Withdraw = require("../../models/account/Withdraw.model");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");

// Helper function to generate withdraw ID
const generateWithdrawId = () => {
  return `WDR_${Date.now()}`;
};








//! Create new withdrawal request
const createWithdrawRequest = async (req, res, next) => {
  try {
    const { 
      amount, 
      paymentMethod, 
      accountDetails,
      withdrawRequestBy,
      withdrawRequestRole,
      status,
      notes 
    } = req.body;

    // Validate required fields
    if (!amount || !paymentMethod || !accountDetails) {
      return res.status(400).json({
        message: "Amount, payment method, and account details are required fields.",
      });
    }

    // Validate amount is positive number
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number.",
      });
    }

    // Check minimum withdrawal amount (e.g., $10)
    const MIN_WITHDRAW_AMOUNT = 10;
    if (withdrawAmount < MIN_WITHDRAW_AMOUNT) {
      return res.status(400).json({
        message: `Minimum withdrawal amount is ${MIN_WITHDRAW_AMOUNT}.`,
      });
    }

    // Generate withdraw ID
    const withdrawId = generateWithdrawId();

    // Create new withdrawal request
    const newWithdrawal = await Withdraw.create({
      withdrawId,
      amount: withdrawAmount,
      status: 'pending',
      requestDate: new Date(),
      paymentMethod,
      status,
      accountDetails,
      withdrawRequestBy: withdrawRequestBy,
      withdrawRequestRole: withdrawRequestRole,
      notes: notes || null,
    });

    // Here you might want to:
    // 1. Create a transaction record
    // 2. Send notification to admin
    // 3. Send confirmation email to user

    return res.status(201).json({
      message: "Withdrawal request submitted successfully! It will be processed within 24-48 hours.",
      data: newWithdrawal,
    });
  } catch (error) {
    next(error);
  }
};














//! Get all withdrawals (Admin only)
const getAllWithdrawals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Extract filters
    const { 
      search, 
      status, 
      paymentMethod, 
      role, 
      startDate, 
      endDate,
      sortBy = 'requestDate',
      sortOrder = 'DESC'
    } = req.query;

    let whereCondition = {};

    // Add search filter
    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { withdrawId: { [Op.like]: `%${search}%` } },
          { withdrawRequestBy: { [Op.like]: `%${search}%` } },
          { accountDetails: { [Op.like]: `%${search}%` } },
          { transactionReference: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Add status filter
    if (status) {
      whereCondition.status = status;
    }

    // Add payment method filter
    if (paymentMethod) {
      whereCondition.paymentMethod = paymentMethod;
    }

    // Add role filter
    if (role) {
      whereCondition.withdrawRequestRole = role;
    }

    // Add date range filter
    if (startDate || endDate) {
      whereCondition.requestDate = {};
      if (startDate) {
        whereCondition.requestDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereCondition.requestDate[Op.lte] = new Date(endDate);
      }
    }

    // Validate sort order
    const validSortOrders = ['ASC', 'DESC'];
    const order = validSortOrders.includes(sortOrder.toUpperCase()) 
      ? [[sortBy, sortOrder.toUpperCase()]] 
      : [['requestDate', 'DESC']];

    // Fetch paginated withdrawals
    const { count, rows: withdrawals } = await Withdraw.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "Withdrawals retrieved successfully!",
      data: withdrawals,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        limit: limit
      },
    });
  } catch (error) {
    next(error);
  }
};
















//! Get withdrawal by ID
const getWithdrawalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the withdrawal by ID or withdrawId
    const withdrawal = await Withdraw.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { withdrawId: id }
        ]
      }
    });

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found!",
      });
    }


    // Get user details based on role
    let userDetails = null;
    if (withdrawal.withdrawRequestRole === 'seller') {
      userDetails = await AuthorityInformation.findOne({
        where: { email: withdrawal.withdrawRequestBy },
        attributes: ['id', 'fullName', 'mobileNo', 'email', 'status']
      });
    } else if (withdrawal.withdrawRequestRole === 'client') {
      userDetails = await ClientInformation.findOne({
        where: { email: withdrawal.withdrawRequestBy },
        attributes: ['id', 'fullName', 'mobileNo', 'email', 'status']
      });
    }

    return res.status(200).json({
      message: "Withdrawal retrieved successfully!",
      data: {
        ...withdrawal.toJSON(),
        userDetails
      },
    });
  } catch (error) {
    next(error);
  }
};















//! Get user's own withdrawals
const getMyWithdrawals = async (req, res, next) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { status, startDate, endDate } = req.query;

    let whereCondition = {
      withdrawRequestBy: user.email
    };

    // Add status filter
    if (status) {
      whereCondition.status = status;
    }

    // Add date range filter
    if (startDate || endDate) {
      whereCondition.requestDate = {};
      if (startDate) {
        whereCondition.requestDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereCondition.requestDate[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows: withdrawals } = await Withdraw.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['requestDate', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "Your withdrawals retrieved successfully!",
      data: withdrawals,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        limit: limit
      },
    });
  } catch (error) {
    next(error);
  }
};






















//! Approve withdrawal (Admin only)
const approveWithdrawal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transactionReference, notes, user } = req.body;

    // Find the withdrawal
    const withdrawal = await Withdraw.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { withdrawId: id }
        ]
      }
    });

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found!",
      });
    }

    // Check if withdrawal is in pending status
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        message: `Withdrawal is already ${withdrawal.status}.`,
      });
    }

    // Update withdrawal
    withdrawal.status = 'approved';
    withdrawal.approvedBy = user;
    withdrawal.approvedAt = new Date();
    withdrawal.transactionReference = transactionReference || null;
    if (notes) withdrawal.notes = notes;

    await withdrawal.save();

    return res.status(200).json({
      message: "Withdrawal approved successfully!",
      data: withdrawal,
    });
  } catch (error) {
    next(error);
  }
};



















//! Reject withdrawal (Admin only)
const rejectWithdrawal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason, user } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required.",
      });
    }

    // Find the withdrawal
    const withdrawal = await Withdraw.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { withdrawId: id }
        ]
      }
    });

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found!",
      });
    }

    // Check if withdrawal is in pending status
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        message: `Cannot reject withdrawal that is already ${withdrawal.status}.`,
      });
    }

    // Update withdrawal
    withdrawal.status = 'rejected';
    withdrawal.approvedBy = user;
    withdrawal.approvedAt = new Date();
    withdrawal.rejectionReason = rejectionReason;

    await withdrawal.save();

    // Here you might want to:
    // 1. Send notification to user about rejection
    // 2. Send email with rejection reason

    return res.status(200).json({
      message: "Withdrawal rejected successfully!",
      data: withdrawal,
    });
  } catch (error) {
    next(error);
  }
};



















//! Complete withdrawal (Admin only - after payment is sent)
const completeWithdrawal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminUser = req.user;

    // Find the withdrawal
    const withdrawal = await Withdraw.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { withdrawId: id }
        ]
      }
    });

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found!",
      });
    }

    // Check if withdrawal is in approved status
    if (withdrawal.status !== 'approved') {
      return res.status(400).json({
        message: `Withdrawal must be approved before marking as completed. Current status: ${withdrawal.status}`,
      });
    }

    // Update withdrawal
    withdrawal.status = 'completed';
    withdrawal.completedAt = new Date();

    await withdrawal.save();

    // Here you might want to:
    // 1. Send notification to user about completion
    // 2. Update payment records

    return res.status(200).json({
      message: "Withdrawal marked as completed successfully!",
      data: withdrawal,
    });
  } catch (error) {
    next(error);
  }
};























//! Get withdrawal statistics (Admin only)
const getWithdrawStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let whereCondition = {};

    // Add date range filter
    if (startDate || endDate) {
      whereCondition.requestDate = {};
      if (startDate) {
        whereCondition.requestDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereCondition.requestDate[Op.lte] = new Date(endDate);
      }
    }

    // Get all withdrawals for the period
    const withdrawals = await Withdraw.findAll({
      where: whereCondition,
      attributes: ['status', 'amount', 'withdrawRequestRole', 'paymentMethod']
    });

    // Calculate statistics
    const stats = {
      total: withdrawals.length,
      pending: withdrawals.filter(w => w.status === 'pending').length,
      approved: withdrawals.filter(w => w.status === 'approved').length,
      rejected: withdrawals.filter(w => w.status === 'rejected').length,
      completed: withdrawals.filter(w => w.status === 'completed').length,
      failed: withdrawals.filter(w => w.status === 'failed').length,
      totalAmount: withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0),
      pendingAmount: withdrawals
        .filter(w => w.status === 'pending')
        .reduce((sum, w) => sum + parseFloat(w.amount), 0),
      completedAmount: withdrawals
        .filter(w => w.status === 'completed')
        .reduce((sum, w) => sum + parseFloat(w.amount), 0),
      byRole: {
        seller: withdrawals.filter(w => w.withdrawRequestRole === 'seller').length,
        client: withdrawals.filter(w => w.withdrawRequestRole === 'client').length,
      },
      byPaymentMethod: withdrawals.reduce((acc, w) => {
        acc[w.paymentMethod] = (acc[w.paymentMethod] || 0) + 1;
        return acc;
      }, {})
    };

    return res.status(200).json({
      message: "Withdrawal statistics retrieved successfully!",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
























//! Get withdrawals by user email (Admin only)
const getUserWithdrawals = async (req, res, next) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { status } = req.query;

    let whereCondition = {
      withdrawRequestBy: email
    };

    if (status) {
      whereCondition.status = status;
    }

    const { count, rows: withdrawals } = await Withdraw.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['requestDate', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "User withdrawals retrieved successfully!",
      data: withdrawals,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        limit: limit
      },
    });
  } catch (error) {
    next(error);
  }
};


















//! Get pending withdrawals (Admin only)
const getPendingWithdrawals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: withdrawals } = await Withdraw.findAndCountAll({
      where: { status: 'pending' },
      limit,
      offset,
      order: [['requestDate', 'ASC']], // Oldest first for pending
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "Pending withdrawals retrieved successfully!",
      data: withdrawals,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        limit: limit
      },
    });
  } catch (error) {
    next(error);
  }
};




























//! Update withdrawal (Admin only)
const updateWithdrawal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, accountDetails, notes } = req.body;

    // Find the withdrawal
    const withdrawal = await Withdraw.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { withdrawId: id }
        ]
      }
    });

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found!",
      });
    }

    // Only allow updates to pending withdrawals
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        message: `Cannot update withdrawal that is already ${withdrawal.status}.`,
      });
    }

    // Update fields
    if (amount !== undefined) {
      const withdrawAmount = parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        return res.status(400).json({
          message: "Amount must be a positive number.",
        });
      }
      withdrawal.amount = withdrawAmount;
    }

    if (paymentMethod) withdrawal.paymentMethod = paymentMethod;
    if (accountDetails) withdrawal.accountDetails = accountDetails;
    if (notes !== undefined) withdrawal.notes = notes;

    await withdrawal.save();

    return res.status(200).json({
      message: "Withdrawal updated successfully!",
      data: withdrawal,
    });
  } catch (error) {
    next(error);
  }
};




































//! Delete withdrawal (Admin only)
const deleteWithdrawal = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the withdrawal
    const withdrawal = await Withdraw.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { withdrawId: id }
        ]
      }
    });

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found!",
      });
    }

    // Only allow deletion of pending withdrawals
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        message: `Cannot delete withdrawal that is already ${withdrawal.status}.`,
      });
    }

    await withdrawal.destroy();

    return res.status(200).json({
      message: "Withdrawal deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};


















module.exports = {
  createWithdrawRequest,
  getAllWithdrawals,
  getWithdrawalById,
  getMyWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  completeWithdrawal,
  getWithdrawStats,
  getUserWithdrawals,
  getPendingWithdrawals,
  updateWithdrawal,
  deleteWithdrawal,
};