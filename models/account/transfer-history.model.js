const { DataTypes } = require("sequelize");
const sequelize = require("../../database/connection");

const TransferHistory = sequelize.define(
  "TransferHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fromAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    toAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fromAccountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toAccountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fromBankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toBankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fromAccountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toAccountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("amount");
        return value === null ? null : parseFloat(value);
      },
    },
    previousFromBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("previousFromBalance");
        return value === null ? null : parseFloat(value);
      },
    },
    previousToBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("previousToBalance");
        return value === null ? null : parseFloat(value);
      },
    },
    newFromBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("newFromBalance");
        return value === null ? null : parseFloat(value);
      },
    },
    newToBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("newToBalance");
        return value === null ? null : parseFloat(value);
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('completed', 'failed', 'pending'),
      defaultValue: 'completed',
    },
    transferDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    initiatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    receiptPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "transfer_history",
    timestamps: true,
  }
);

module.exports = TransferHistory;