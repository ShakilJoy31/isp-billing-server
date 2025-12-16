const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const EmployeePayment = sequelize.define(
  "EmployeePayment",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Client Information
    clientId: {
      type: dt.STRING,
      allowNull: false,
      references: {
        model: "client-informations",
        key: "userId",
      },
    },
    clientName: {
      type: dt.STRING,
      allowNull: false,
    },
    clientPhone: {
      type: dt.STRING,
      allowNull: false,
    },
    clientAddress: {
      type: dt.TEXT,
      allowNull: true,
    },

    // Employee Information
    employeeId: {
      type: dt.STRING,
      allowNull: false,
      references: {
        model: "authority-informations",
        key: "userId",
      },
    },
    employeeName: {
      type: dt.STRING,
      allowNull: false,
    },

    // Payment Information
    invoiceId: {
      type: dt.STRING,
      allowNull: true,
      comment: "Optional invoice ID for reference",
    },
    billingMonth: {
      type: dt.STRING,
      allowNull: false,
      comment: "Format: YYYY-MM e.g., 2025-01",
    },
    amount: {
      type: dt.DECIMAL(10, 2),
      allowNull: false,
    },

    // Payment Method
    paymentMethod: {
      type: dt.ENUM(
        "cash",
        "bkash",
        "nagad",
        "rocket",
        "card",
        "bank_transfer"
      ),
      defaultValue: "cash",
      allowNull: false,
    },
    transactionId: {
      type: dt.STRING,
      allowNull: true,
      comment: "Transaction ID for mobile banking/bank transfers",
    },
    referenceNote: {
      type: dt.TEXT,
      allowNull: true,
    },
    collectionDate: {
      type: dt.DATE,
      defaultValue: dt.NOW,
      allowNull: false,
    },
    collectionTime: {
      type: dt.TIME,
      allowNull: true,
    },

    // Receipt Information
    receiptNumber: {
      type: dt.STRING,
      unique: true,
      allowNull: false,
    },

    // Status
    status: {
      type: dt.ENUM(
        "collected",
        "verified",
        "deposited",
        "cancelled",
        "refunded"
      ),
      defaultValue: "collected",
      allowNull: false,
    },
    // Metadata
    notes: {
      type: dt.TEXT,
      allowNull: true,
    },
    attachment: {
      type: dt.STRING,
      allowNull: true,
      comment: "Receipt/transaction slip image path",
    },


    
    // Add these fields to your EmployeePayment model if not already present:
    verifiedBy: {
      type: dt.STRING,
      allowNull: true,
    },
    verifiedAt: {
      type: dt.DATE,
      allowNull: true,
    },
    verificationRemark: {
      type: dt.STRING,
      allowNull: true,
    },
    depositedBy: {
      type: dt.STRING,
      allowNull: true,
    },
    depositedAt: {
      type: dt.DATE,
      allowNull: true,
    },
    depositSlipNumber: {
      type: dt.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "employee_bill_collection",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["receiptNumber"],
      },
      {
        fields: ["clientId", "billingMonth"],
      },
      {
        fields: ["employeeId"],
      },
      {
        fields: ["collectionDate"],
      },
    ],
  }
);

// Association with Client
EmployeePayment.associate = (models) => {
  EmployeePayment.belongsTo(models.ClientInformation, {
    foreignKey: "clientId",
    targetKey: "userId",
    as: "client",
  });

  EmployeePayment.belongsTo(models.AuthorityInformation, {
    foreignKey: "employeeId",
    targetKey: "userId",
    as: "employee",
  });
};

module.exports = EmployeePayment;
