const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");
const ExpenseCategory = require("./category.model");

const ExpenseSubCategory = sequelize.define(
  "ExpenseSubCategory",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    subCategoryName: {
      type: dt.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    subCategoryCode: {
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
    categoryId: {
      type: dt.INTEGER,
      allowNull: false,
      references: {
        model: ExpenseCategory,
        key: 'id'
      }
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
      beforeValidate: (subCategory) => {
        // Generate sub-category code if not provided
        if (!subCategory.subCategoryCode) {
          // Generate random 6-digit number
          subCategory.subCategoryCode = Math.floor(100000 + Math.random() * 900000).toString();
        }
      }
    },
    indexes: [
      {
        fields: ["subCategoryCode"],
        unique: true,
      },
      {
        fields: ["subCategoryName"],
      },
      {
        fields: ["categoryId"],
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
    tableName: "expense_sub_categories",
    timestamps: true,
  }
);

// Define associations
ExpenseSubCategory.belongsTo(ExpenseCategory, {
  foreignKey: 'categoryId',
  as: 'category'
});

ExpenseCategory.hasMany(ExpenseSubCategory, {
  foreignKey: 'categoryId',
  as: 'subCategories'
});

module.exports = ExpenseSubCategory;


