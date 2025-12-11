const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const BankAccount = sequelize.define(
  "BankAccount",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    bankName: {
      type: dt.STRING,
      allowNull: false,
    },
    accountHolderName: {
      type: dt.STRING,
      allowNull: false,
    },
    accountName: {
      type: dt.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
    },
    accountType: {
      type: dt.ENUM(
        "Bank",
        "MobileBanking",
        "AgentBanking",
        "DigitalWallet",
        "Other"
      ),
      allowNull: false,
      defaultValue: "Bank",
    },
    branchId: {
      type: dt.INTEGER,
      allowNull: true,
    },
    branchName: {
      type: dt.STRING,
      allowNull: true,
    },
    routingNumber: {
      type: dt.STRING,
      allowNull: true,
    },
    swiftCode: {
      type: dt.STRING,
      allowNull: true,
    },
    iban: {
      type: dt.STRING,
      allowNull: true,
    },
    openingBalance: {
      type: dt.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currentBalance: {
      type: dt.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: dt.STRING,
      allowNull: false,
      defaultValue: "BDT",
    },
    isActive: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isPrimary: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastTransactionDate: {
      type: dt.DATE,
      allowNull: true,
    },
    transactionLimit: {
      type: dt.DECIMAL(15, 2),
      allowNull: true,
    },
    dailyLimit: {
      type: dt.DECIMAL(15, 2),
      allowNull: true,
    },
    monthlyLimit: {
      type: dt.DECIMAL(15, 2),
      allowNull: true,
    },
    notes: {
      type: dt.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: dt.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    updatedBy: {
      type: dt.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeValidate: (account) => {
        // Ensure currentBalance matches openingBalance for new accounts
        if (account.isNewRecord && !account.currentBalance) {
          account.currentBalance = account.openingBalance || 0;
        }
        
        // Validate account number format based on type
        if (account.accountNumber) {
          // Remove any spaces or dashes
          account.accountNumber = account.accountNumber.replace(/[\s-]/g, '');
        }
      },
      beforeCreate: (account) => {
        // Set current balance equal to opening balance for new accounts
        if (account.openingBalance && !account.currentBalance) {
          account.currentBalance = account.openingBalance;
        }
      }
    },
    indexes: [
      {
        fields: ["accountNumber"],
        unique: true,
      },
      {
        fields: ["bankName", "branchId"],
      },
      {
        fields: ["accountHolderName"],
      },
      {
        fields: ["accountType", "isActive"],
      },
      {
        fields: ["createdAt"],
      },
    ],
    tableName: "bank_accounts",
    timestamps: true,
  }
);

module.exports = BankAccount;