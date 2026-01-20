const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Withdraw = sequelize.define("Withdraw", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  withdrawId: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
    comment: "Unique withdrawal ID like WDR_1768845150050"
  },
  amount: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: "Withdrawal amount must be at least 1"
      }
    }
  },
  status: {
    type: dt.ENUM('pending', 'approved', 'rejected', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  requestDate: {
    type: dt.DATE,
    allowNull: false,
    defaultValue: dt.NOW,
  },
  paymentMethod: {
    type: dt.STRING,
    allowNull: false,
  },
  accountDetails: {
    type: dt.TEXT,
    allowNull: false,
    comment: "Bank account number, mobile banking number, or other payment details"
  },
  withdrawRequestBy: {
    type: dt.STRING,
    allowNull: false,
    comment: "Email of the requester"
  },
  withdrawRequestRole: {
    type: dt.ENUM('seller', 'client'),
    allowNull: false,
  },
  approvedBy: {
    type: dt.STRING,
    allowNull: true,
    comment: "Email of admin who approved/rejected"
  },
  approvedAt: {
    type: dt.DATE,
    allowNull: true,
  },
  rejectionReason: {
    type: dt.TEXT,
    allowNull: true,
    comment: "Reason for rejection if applicable"
  },
  completedAt: {
    type: dt.DATE,
    allowNull: true,
  },
  notes: {
    type: dt.TEXT,
    allowNull: true,
    comment: "Additional notes/comments"
  },
  transactionReference: {
    type: dt.STRING,
    allowNull: true,
    comment: "Bank/Mobile banking transaction ID"
  },
  createdAt: {
    type: dt.DATE,
    allowNull: false,
    defaultValue: dt.NOW,
  },
  updatedAt: {
    type: dt.DATE,
    allowNull: false,
    defaultValue: dt.NOW,
  },
}, {
  tableName: 'withdrawals',
  timestamps: true,
  hooks: {
    beforeCreate: (withdraw) => {
      // Generate withdrawId if not provided
      if (!withdraw.withdrawId) {
        withdraw.withdrawId = `WDR_${Date.now()}`;
      }
    },
    beforeUpdate: (withdraw) => {
      // Update timestamps based on status changes
      if (withdraw.changed('status')) {
        const now = new Date();
        if (withdraw.status === 'approved') {
          withdraw.approvedAt = now;
        } else if (withdraw.status === 'completed') {
          withdraw.completedAt = now;
        }
      }
    }
  },
  indexes: [
    {
      fields: ['withdrawId'],
      unique: true
    },
    {
      fields: ['status']
    },
    {
      fields: ['withdrawRequestBy']
    },
    {
      fields: ['requestDate']
    }
  ]
});

module.exports = Withdraw;