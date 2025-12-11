const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const ExpenseCategory = sequelize.define(
  "ExpenseCategory",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    categoryName: {
      type: dt.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    categoryCode: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 20]
      }
    },
    description: {
      type: dt.TEXT,
      allowNull: true,
    },
    budgetLimit: {
      type: dt.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    isActive: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    requiresApproval: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
      beforeValidate: (category) => {
        // Generate category code if not provided
        if (!category.categoryCode && category.categoryName) {
          const code = category.categoryName
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 10);
          category.categoryCode = code;
        }
      }
    },
    indexes: [
      {
        fields: ["categoryCode"],
        unique: true,
      },
      {
        fields: ["categoryName"],
      },
      {
        fields: ["isActive"],
      },
      {
        fields: ["requiresApproval"],
      },
      {
        fields: ["createdAt"],
      },
    ],
    tableName: "expense_categories",
    timestamps: true,
  }
);

module.exports = ExpenseCategory;