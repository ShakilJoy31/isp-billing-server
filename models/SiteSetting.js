// models/SiteSetting.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const SiteSetting = sequelize.define("SiteSetting", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: "site_settings",
  timestamps: false, // Since we are using createdAt explicitly
});

module.exports = SiteSetting;
