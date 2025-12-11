const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");
const ExpenseCategory = require("./category.model");
const ExpenseSubCategory = require("./sub-category.model");
const BankAccount = require("../account/account.model");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    expenseCode: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [6, 20]
      }
    },
    note: {
      type: dt.TEXT,
      allowNull: true,
    },
    expenseCategoryId: {
      type: dt.INTEGER,
      allowNull: false,
      references: {
        model: ExpenseCategory,
        key: 'id'
      }
    },
    expenseSubcategoryId: {
      type: dt.INTEGER,
      allowNull: true,
      references: {
        model: ExpenseSubCategory,
        key: 'id'
      }
    },
    totalAmount: {
      type: dt.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    date: {
      type: dt.DATEONLY,
      allowNull: false,
    },
    image: {
      type: dt.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    status: {
      type: dt.ENUM("Pending", "Approved", "Rejected", "Partially_Paid", "Paid"),
      allowNull: false,
      defaultValue: "Pending",
    },
    paymentStatus: {
      type: dt.ENUM("Pending", "Partially_Paid", "Paid"),
      allowNull: false,
      defaultValue: "Pending",
    },
    approvedBy: {
      type: dt.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: dt.DATE,
      allowNull: true,
    },
    rejectionReason: {
      type: dt.TEXT,
      allowNull: true,
    },
    isActive: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    hooks: {
      beforeValidate: (expense) => {
        // Generate expense code if not provided
        if (!expense.expenseCode) {
          const timestamp = Date.now().toString().slice(-6);
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          expense.expenseCode = `EXP-${timestamp}-${random}`;
        }
        
        // Set date to current date if not provided
        if (!expense.date) {
          expense.date = new Date().toISOString().split('T')[0];
        }
      }
      // REMOVED: afterUpdate hook
    },
    indexes: [
      {
        fields: ["expenseCode"],
        unique: true,
      },
      {
        fields: ["expenseCategoryId"],
      },
      {
        fields: ["expenseSubcategoryId"],
      },
      {
        fields: ["date"],
      },
      {
        fields: ["status", "paymentStatus"],
      },
      {
        fields: ["isActive"],
      },
      {
        fields: ["createdAt"],
      },
    ],
    tableName: "expenses",
    timestamps: true,
  }
);

// Expense Payment Model (for multiple payment accounts)
const ExpensePayment = sequelize.define(
  "ExpensePayment",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    expenseId: {
      type: dt.INTEGER,
      allowNull: false,
      references: {
        model: Expense,
        key: 'id'
      }
    },
    accountId: {
      type: dt.INTEGER,
      allowNull: false,
      references: {
        model: BankAccount,
        key: 'id'
      }
    },
    paymentAmount: {
      type: dt.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    status: {
      type: dt.ENUM("Pending", "Processed", "Failed"),
      allowNull: false,
      defaultValue: "Pending",
    },
    processedAt: {
      type: dt.DATE,
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
  },
  {
    tableName: "expense_payments",
    timestamps: true,
  }
);

// Define associations (keep these)
Expense.belongsTo(ExpenseCategory, {
  foreignKey: 'expenseCategoryId',
  as: 'category'
});

Expense.belongsTo(ExpenseSubCategory, {
  foreignKey: 'expenseSubcategoryId',
  as: 'subcategory'
});

Expense.hasMany(ExpensePayment, {
  foreignKey: 'expenseId',
  as: 'payments',
  onDelete: 'CASCADE'
});

ExpensePayment.belongsTo(Expense, {
  foreignKey: 'expenseId',
  as: 'expense'
});

ExpensePayment.belongsTo(BankAccount, {
  foreignKey: 'accountId',
  as: 'account'
});

BankAccount.hasMany(ExpensePayment, {
  foreignKey: 'accountId',
  as: 'expensePayments'
});

ExpenseCategory.hasMany(Expense, {
  foreignKey: 'expenseCategoryId',
  as: 'expenses'
});

ExpenseSubCategory.hasMany(Expense, {
  foreignKey: 'expenseSubcategoryId',
  as: 'expenses'
});

module.exports = { Expense, ExpensePayment };