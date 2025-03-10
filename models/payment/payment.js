const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection"); // Adjust the path to your Sequelize instance

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
        unique: true, // Ensure `trxId` is unique
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
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = Transaction;