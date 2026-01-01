const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const JobCategory = sequelize.define("JobCategory", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  categoryName: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  categoryDetails: {
    type: dt.TEXT,
    allowNull: true,
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "Active",
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
  tableName: 'job_categories',
  timestamps: true,
});

module.exports = JobCategory;