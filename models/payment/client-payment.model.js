// models/payment/payment.js
const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Transaction = sequelize.define("Transaction", {
    id: {
        type: dt.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: dt.STRING,
        allowNull: false,
    },
    trxId: {
        type: dt.STRING,
        allowNull: false,
        unique: true,
    },
    amount: {
        type: dt.FLOAT,
        allowNull: false,
    },
    phoneNumber: {
        type: dt.STRING,
        allowNull: false,
    },
    status: {
        type: dt.STRING,
        defaultValue: "pending",
        allowNull: false,
    },
    remark: {
        type: dt.STRING,
        defaultValue: "",
        allowNull: false,
    },
    // New fields for approval tracking
    approvedBy: {
        type: dt.STRING,
        allowNull: true,
        comment: "User ID or name of the person who approved this transaction"
    },
    approvedAt: {
        type: dt.DATE,
        allowNull: true,
        comment: "Timestamp when the transaction was approved"
    },
    approvalRemark: {
        type: dt.STRING,
        allowNull: true,
        comment: "Additional remarks from approver"
    },
    // Optional: Add rejection fields
    rejectedBy: {
        type: dt.STRING,
        allowNull: true,
    },
    rejectedAt: {
        type: dt.DATE,
        allowNull: true,
    },
    rejectionReason: {
        type: dt.STRING,
        allowNull: true,
    }
}, {
    tableName: 'transactions',
    timestamps: true,
});

module.exports = Transaction;