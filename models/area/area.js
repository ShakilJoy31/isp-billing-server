const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Area = sequelize.define("City", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  cityName: {
    type: dt.STRING,
    allowNull: false,
    unique: true, // Ensure area names are unique
  },
  cityDetails: {
    type: dt.TEXT,
    allowNull: true, // Optional field
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "Active", // Default value
  },
});

module.exports = Area;