const ClientInformation = require("../../models/Authentication/client.model");
const Transaction = require("../../models/payment/client-payment.model");


const createTransaction = async (req, res) => {
    try {
        const { userId, trxId, amount, phoneNumber, status, remark } = req.body;

        const payload = {
            userId,
            trxId,
            amount,
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
        res.status(500).json({
            success: false,
            message: "Failed to create transaction",
            error: error.message,
        });
    }
};



const getTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // Extract `userId` from the request parameters
        const { page = 1, limit = 10 } = req.query; // Extract `page` and `limit` from query parameters

        // Convert `page` and `limit` to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate the offset for pagination
        const offset = (pageNumber - 1) * limitNumber;

        // Find the total number of transactions for the given `userId`
        const totalItems = await Transaction.count({ where: { userId } });

        // Find paginated transactions for the given `userId`
        const transactions = await Transaction.findAll({
            where: { userId }, // Filter by `userId`
            limit: limitNumber, // Number of items per page
            offset: offset, // Starting point for the query
            order: [["createdAt", "DESC"]], // Optional: Order by `createdAt` in descending order
        });

        // If no transactions are found, return a 404 response
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found for the given user ID",
            });
        }

        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limitNumber);

        // Return the paginated transactions and metadata
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
        const { transactionId } = req.params; // Transaction ID from URL
        const { 
            status, 
            approvedBy, 
            approvalRemark,
            rejectedBy,
            rejectionReason 
        } = req.body;

        // Validate required fields
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        // Find the transaction
        const transaction = await Transaction.findByPk(transactionId);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        // Prepare update data
        const updateData = { status };
        
        // If status is being approved
        if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'success') {
            if (!approvedBy) {
                return res.status(400).json({
                    success: false,
                    message: "approvedBy field is required when approving a transaction",
                });
            }
            
            updateData.approvedBy = approvedBy;
            updateData.approvedAt = new Date();
            updateData.approvalRemark = approvalRemark || '';
            
            // Clear rejection fields if it was previously rejected
            updateData.rejectedBy = null;
            updateData.rejectedAt = null;
            updateData.rejectionReason = null;
        }
        
        // If status is being rejected
        else if (status.toLowerCase() === 'rejected' || status.toLowerCase() === 'failed') {
            if (!rejectedBy) {
                return res.status(400).json({
                    success: false,
                    message: "rejectedBy field is required when rejecting a transaction",
                });
            }
            
            updateData.rejectedBy = rejectedBy;
            updateData.rejectedAt = new Date();
            updateData.rejectionReason = rejectionReason || '';
            
            // Clear approval fields if it was previously approved
            updateData.approvedBy = null;
            updateData.approvedAt = null;
            updateData.approvalRemark = null;
        }
        
        // If status is pending, clear both approval and rejection fields
        else if (status.toLowerCase() === 'pending') {
            updateData.approvedBy = null;
            updateData.approvedAt = null;
            updateData.approvalRemark = null;
            updateData.rejectedBy = null;
            updateData.rejectedAt = null;
            updateData.rejectionReason = null;
        }

        // Update the transaction
        await transaction.update(updateData);

        // Fetch the updated transaction
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
            search = ""
        } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        // Build where clause
        let whereClause = {};
        
        // Filter by status
        if (status) {
            whereClause.status = status;
        }
        
        // Filter by date range
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) {
                whereClause.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                whereClause.createdAt.$lte = new Date(endDate);
            }
        }
        
        // Search by trxId, userId, or phoneNumber
        if (search) {
            whereClause = {
                ...whereClause,
                $or: [
                    { trxId: { $like: `%${search}%` } },
                    { userId: { $like: `%${search}%` } },
                    { phoneNumber: { $like: `%${search}%` } }
                ]
            };
        }

        // Get total count
        const totalItems = await Transaction.count({ where: whereClause });
        
        // Get transactions with pagination
        const transactions = await Transaction.findAll({
            where: whereClause,
            limit: limitNumber,
            offset: offset,
            order: [["createdAt", "DESC"]],
        });

        // Get unique user IDs from transactions
        const userIds = [...new Set(
            transactions
                .map(t => t.userId)
                .filter(id => id && id !== null && id !== undefined)
        )];

        // Fetch all users in one batch query
        let userMap = {};
        if (userIds.length > 0) {
            const users = await ClientInformation.findAll({
                where: { id: userIds },
                attributes: { exclude: ["password"] },
            });
            
            // Transform each user with package info
            for (const user of users) {
                try {
                    userMap[user.id] = await transformClientWithPackage(user);
                } catch (error) {
                    console.error(`Error transforming user ${user.id}:`, error);
                    userMap[user.id] = {
                        id: user.id,
                        fullName: user.fullName || 'Unknown',
                        email: user.email || '',
                        mobileNo: user.mobileNo || '',
                        photo: user.photo || '',
                        error: 'Failed to load package details'
                    };
                }
            }
        }

        // Combine transactions with user information
        const enrichedTransactions = transactions.map(transaction => {
            const transactionData = transaction.toJSON();
            return {
                ...transactionData,
                userInfo: userMap[transaction.userId] || {
                    id: transaction.userId,
                    name: 'User not found',
                    email: '',
                    phone: '',
                    note: 'User information unavailable'
                }
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
        // Count transactions by status
        const statusCounts = await Transaction.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // Get total amount of successful transactions
        const totalSuccessfulAmount = await Transaction.sum('amount', {
            where: { status: 'approved' }
        }) || 0;

        // Get total amount of pending transactions
        const totalPendingAmount = await Transaction.sum('amount', {
            where: { status: 'pending' }
        }) || 0;

        // Get total count
        const totalTransactions = await Transaction.count();

        // Get today's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTransactions = await Transaction.count({
            where: {
                createdAt: {
                    $gte: today
                }
            }
        });

        // Get today's successful amount
        const todaySuccessfulAmount = await Transaction.sum('amount', {
            where: {
                status: 'approved',
                createdAt: {
                    $gte: today
                }
            }
        }) || 0;

        res.status(200).json({
            success: true,
            message: "Transaction statistics retrieved successfully",
            data: {
                totalTransactions,
                totalSuccessfulAmount: parseFloat(totalSuccessfulAmount.toFixed(2)),
                totalPendingAmount: parseFloat(totalPendingAmount.toFixed(2)),
                todayTransactions,
                todaySuccessfulAmount: parseFloat(todaySuccessfulAmount.toFixed(2)),
                statusCounts
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

        // Validate required fields
        if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
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

        // If approving, check for approvedBy
        if ((status.toLowerCase() === 'approved' || status.toLowerCase() === 'success') && !approvedBy) {
            return res.status(400).json({
                success: false,
                message: "approvedBy field is required when approving transactions",
            });
        }

        // Prepare update data
        const updateData = { status };
        
        if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'success') {
            updateData.approvedBy = approvedBy;
            updateData.approvedAt = new Date();
            updateData.approvalRemark = approvalRemark || '';
            // Clear rejection fields
            updateData.rejectedBy = null;
            updateData.rejectedAt = null;
            updateData.rejectionReason = null;
        }

        // Update multiple transactions
        const [affectedRows] = await Transaction.update(updateData, {
            where: {
                id: transactionIds
            }
        });

        // Get updated transactions
        const updatedTransactions = await Transaction.findAll({
            where: {
                id: transactionIds
            }
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

module.exports = { 
    createTransaction, 
    getTransactionsByUserId,
    updateTransactionStatus,
    getAllTransactions,
    getTransactionById,
    getTransactionStats,
    bulkUpdateTransactionStatus
};