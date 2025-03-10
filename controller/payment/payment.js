const Transaction = require("../../models/payment/payment");


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



module.exports = { createTransaction, getTransactionsByUserId };