const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const City = sequelize.define("City", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  cityName: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  cityDetails: {
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
  tableName: 'cities',
  timestamps: true,
});

module.exports = City;