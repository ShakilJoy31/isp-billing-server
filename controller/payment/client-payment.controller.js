const sequelize = require("../../database/connection");
const ClientInformation = require("../../models/Authentication/client.model");
const Transaction = require("../../models/payment/client-payment.model");

const createTransaction = async (req, res) => {
  try {
    const {
      userId,
      trxId,
      amount,
      phoneNumber,
      status,
      remark,
      billingMonth,
      billingYear,
    } = req.body;

    // Validate required fields
    if (!billingMonth || !billingYear) {
      return res.status(400).json({
        success: false,
        message: "billingMonth and billingYear are required fields",
      });
    }

    // Check if user already paid for this month and year
    const existingPayment = await Transaction.findOne({
      where: {
        userId,
        billingMonth,
        billingYear,
        status: ["pending", "approved"], // Check for both pending and approved
      },
    });

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: `Payment already exists for ${billingMonth} ${billingYear}.`,
        data: {
          existingPayment: {
            id: existingPayment.id,
            amount: existingPayment.amount,
            status: existingPayment.status,
            createdAt: existingPayment.createdAt,
          },
        },
      });
    }

    const payload = {
      userId,
      trxId,
      amount,
      billingMonth,
      billingYear,
      phoneNumber,
      status,
      remark,
    };

    const newTransaction = await Transaction.create(payload);

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);

    // Handle duplicate trxId error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Transaction ID already exists",
        error: "Duplicate transaction ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};

//! Get trx by user ID.
const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const totalItems = await Transaction.count({ where: { userId } });

    const transactions = await Transaction.findAll({
      where: { userId },
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for the given user ID",
      });
    }

    const totalPages = Math.ceil(totalItems / limitNumber);

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions",
      error: error.message,
    });
  }
};

//! Update transaction status
const updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, approvedBy, approvalRemark, rejectedBy, rejectionReason } =
      req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const updateData = { status };

    if (
      status.toLowerCase() === "approved" ||
      status.toLowerCase() === "success"
    ) {
      if (!approvedBy) {
        return res.status(400).json({
          success: false,
          message: "approvedBy field is required when approving a transaction",
        });
      }

      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
      updateData.approvalRemark = approvalRemark || "";

      updateData.rejectedBy = null;
      updateData.rejectedAt = null;
      updateData.rejectionReason = null;
    } else if (
      status.toLowerCase() === "rejected" ||
      status.toLowerCase() === "failed"
    ) {
      if (!rejectedBy) {
        return res.status(400).json({
          success: false,
          message: "rejectedBy field is required when rejecting a transaction",
        });
      }

      updateData.rejectedBy = rejectedBy;
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = rejectionReason || "";

      updateData.approvedBy = null;
      updateData.approvedAt = null;
      updateData.approvalRemark = null;
    } else if (status.toLowerCase() === "pending") {
      updateData.approvedBy = null;
      updateData.approvedAt = null;
      updateData.approvalRemark = null;
      updateData.rejectedBy = null;
      updateData.rejectedAt = null;
      updateData.rejectionReason = null;
    }

    await transaction.update(updateData);

    const updatedTransaction = await Transaction.findByPk(transactionId);

    res.status(200).json({
      success: true,
      message: `Transaction status updated to ${status} successfully`,
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update transaction status",
      error: error.message,
    });
  }
};

//! Get all transactions with filtering and pagination (for admin dashboard)
const getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "",
      startDate = "",
      endDate = "",
      search = "",
      billingMonth = "",
      billingYear = "",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    let whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    // Filter by billing month
    if (billingMonth) {
      whereClause.billingMonth = billingMonth;
    }

    // Filter by billing year
    if (billingYear) {
      whereClause.billingYear = billingYear;
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.$lte = new Date(endDate);
      }
    }

    if (search) {
      whereClause = {
        ...whereClause,
        $or: [
          { trxId: { $like: `%${search}%` } },
          { userId: { $like: `%${search}%` } },
          { phoneNumber: { $like: `%${search}%` } },
          { billingMonth: { $like: `%${search}%` } },
          { billingYear: { $like: `%${search}%` } },
        ],
      };
    }

    const totalItems = await Transaction.count({ where: whereClause });

    const transactions = await Transaction.findAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    // Extract all unique user IDs from transactions (for client info)
    const userIds = [
      ...new Set(
        transactions
          .map((t) => t.userId)
          .filter((id) => id && id !== null && id !== undefined)
      ),
    ];

    // Extract all unique admin IDs from approvedBy and rejectedBy fields
    const adminIds = [
      ...new Set(
        transactions
          .flatMap((t) => [t.approvedBy, t.rejectedBy])
          .filter((id) => id && id !== null && id !== undefined)
      ),
    ];

    let userMap = {};
    let adminMap = {};

    // Fetch client information
    if (userIds.length > 0) {
      const users = await ClientInformation.findAll({
        where: { id: userIds },
        attributes: { exclude: ["password"] },
      });

      for (const user of users) {
        try {
          userMap[user.id] = await transformClientWithPackage(user);
        } catch (error) {
          console.error(`Error transforming user ${user.id}:`, error);
          userMap[user.id] = {
            id: user.id,
            fullName: user.fullName || "Unknown",
            email: user.email || "",
            mobileNo: user.mobileNo || "",
            photo: user.photo || "",
            error: "Failed to load package details",
          };
        }
      }
    }

    // Fetch admin information (super-admins)
    if (adminIds.length > 0) {
      const admins = await ClientInformation.findAll({
        where: {
          id: adminIds,
          role: "super-admin", // Assuming super-admins have this role
        },
        attributes: { exclude: ["password"] },
      });

      for (const admin of admins) {
        adminMap[admin.id] = {
          id: admin.id,
          fullName: admin.fullName || "Admin",
          email: admin.email || "",
          mobileNo: admin.mobileNo || "",
          photo: admin.photo || "",
          role: admin.role || "super-admin",
        };
      }
    }

    // Enrich transactions with user and admin information
    const enrichedTransactions = transactions.map((transaction) => {
      const transactionData = transaction.toJSON();

      // Get user info
      const userInfo = userMap[transaction.userId] || {
        id: transaction.userId,
        name: "User not found",
        email: "",
        phone: "",
        note: "User information unavailable",
      };

      // Get approvedBy admin info
      const approvedByInfo = transaction.approvedBy
        ? adminMap[transaction.approvedBy] || {
            id: transaction.approvedBy,
            fullName: "Admin not found",
            email: "",
            mobileNo: "",
            photo: "",
            note: "Admin information unavailable",
          }
        : null;

      // Get rejectedBy admin info
      const rejectedByInfo = transaction.rejectedBy
        ? adminMap[transaction.rejectedBy] || {
            id: transaction.rejectedBy,
            fullName: "Admin not found",
            email: "",
            mobileNo: "",
            photo: "",
            note: "Admin information unavailable",
          }
        : null;

      return {
        ...transactionData,
        userInfo: userInfo,
        approvedBy: approvedByInfo,
        rejectedBy: rejectedByInfo,
        // Keep original IDs as separate fields if needed
        approvedById: transaction.approvedBy,
        rejectedById: transaction.rejectedBy,
      };
    });

    const totalPages = Math.ceil(totalItems / limitNumber);

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: enrichedTransactions,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions",
      error: error.message,
    });
  }
};

//! Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transaction",
      error: error.message,
    });
  }
};

//! Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const statusCounts = await Transaction.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const totalSuccessfulAmount =
      (await Transaction.sum("amount", {
        where: { status: "approved" },
      })) || 0;

    const totalPendingAmount =
      (await Transaction.sum("amount", {
        where: { status: "pending" },
      })) || 0;

    const totalTransactions = await Transaction.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactions = await Transaction.count({
      where: {
        createdAt: {
          $gte: today,
        },
      },
    });

    const todaySuccessfulAmount =
      (await Transaction.sum("amount", {
        where: {
          status: "approved",
          createdAt: {
            $gte: today,
          },
        },
      })) || 0;

    // Additional stats by month and year
    const monthlyStats = await Transaction.findAll({
      attributes: [
        "billingMonth",
        "billingYear",
        [sequelize.fn("COUNT", sequelize.col("id")), "transactionCount"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: ["billingMonth", "billingYear"],
      order: [
        ["billingYear", "DESC"],
        ["billingMonth", "DESC"],
      ],
      raw: true,
    });

    res.status(200).json({
      success: true,
      message: "Transaction statistics retrieved successfully",
      data: {
        totalTransactions,
        totalSuccessfulAmount: parseFloat(totalSuccessfulAmount.toFixed(2)),
        totalPendingAmount: parseFloat(totalPendingAmount.toFixed(2)),
        todayTransactions,
        todaySuccessfulAmount: parseFloat(todaySuccessfulAmount.toFixed(2)),
        statusCounts,
        monthlyStats: monthlyStats || [],
      },
    });
  } catch (error) {
    console.error("Error retrieving transaction statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transaction statistics",
      error: error.message,
    });
  }
};

//! Bulk update transaction statuses (for admin)
const bulkUpdateTransactionStatus = async (req, res) => {
  try {
    const { transactionIds, status, approvedBy, approvalRemark } = req.body;

    if (
      !transactionIds ||
      !Array.isArray(transactionIds) ||
      transactionIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "transactionIds array is required and must not be empty",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (
      (status.toLowerCase() === "approved" ||
        status.toLowerCase() === "success") &&
      !approvedBy
    ) {
      return res.status(400).json({
        success: false,
        message: "approvedBy field is required when approving transactions",
      });
    }

    const updateData = { status };

    if (
      status.toLowerCase() === "approved" ||
      status.toLowerCase() === "success"
    ) {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
      updateData.approvalRemark = approvalRemark || "";
      updateData.rejectedBy = null;
      updateData.rejectedAt = null;
      updateData.rejectionReason = null;
    }

    const [affectedRows] = await Transaction.update(updateData, {
      where: {
        id: transactionIds,
      },
    });

    const updatedTransactions = await Transaction.findAll({
      where: {
        id: transactionIds,
      },
    });

    res.status(200).json({
      success: true,
      message: `${affectedRows} transaction(s) updated successfully`,
      data: updatedTransactions,
    });
  } catch (error) {
    console.error("Error bulk updating transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update transactions",
      error: error.message,
    });
  }
};

//! New: Check if user can pay for specific month/year
const checkPaymentEligibility = async (req, res) => {
  try {
    const { userId, billingMonth, billingYear } = req.query;

    if (!userId || !billingMonth || !billingYear) {
      return res.status(400).json({
        success: false,
        message: "userId, billingMonth and billingYear are required",
      });
    }

    const existingPayment = await Transaction.findOne({
      where: {
        userId,
        billingMonth,
        billingYear,
        status: ["pending", "approved"],
      },
    });

    if (existingPayment) {
      return res.status(200).json({
        success: false,
        message: `Payment already exists for ${billingMonth} ${billingYear}`,
        eligible: false,
        existingPayment: {
          id: existingPayment.id,
          amount: existingPayment.amount,
          status: existingPayment.status,
          createdAt: existingPayment.createdAt,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: `No existing payment found for ${billingMonth} ${billingYear}. User can proceed with payment.`,
      eligible: true,
    });
  } catch (error) {
    console.error("Error checking payment eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check payment eligibility",
      error: error.message,
    });
  }
};

//! New: Get user's payment history by month/year
const getUserPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const totalItems = await Transaction.count({ where: { userId } });

    const transactions = await Transaction.findAll({
      where: { userId },
      limit: limitNumber,
      offset: offset,
      order: [
        ["billingYear", "DESC"],
        ["billingMonth", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payment history found for this user",
      });
    }

    // Group by month and year
    const groupedPayments = {};
    transactions.forEach((transaction) => {
      const key = `${transaction.billingMonth}-${transaction.billingYear}`;
      if (!groupedPayments[key]) {
        groupedPayments[key] = {
          billingMonth: transaction.billingMonth,
          billingYear: transaction.billingYear,
          payments: [],
        };
      }
      groupedPayments[key].payments.push(transaction);
    });

    const totalPages = Math.ceil(totalItems / limitNumber);

    res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: Object.values(groupedPayments),
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error retrieving payment history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment history",
      error: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
  updateTransactionStatus,
  getAllTransactions,
  getTransactionById,
  getTransactionStats,
  bulkUpdateTransactionStatus,
  checkPaymentEligibility,
  getUserPaymentHistory,
};
