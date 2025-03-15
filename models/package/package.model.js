const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Package = sequelize.define("Package", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  packageName: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  packageBandwidth: {
    type: dt.STRING,
    allowNull: false,
  },
  packagePrice: {
    type: dt.STRING,
    allowNull: false,
  },
  packageDetails: {
    type: dt.TEXT,
    allowNull: true, // Optional field
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "Active", // Default value
  },
});

module.exports = Package;