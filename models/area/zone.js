const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Zone = sequelize.define("Zone", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  zoneName: {
    type: dt.STRING,
    allowNull: false,
    unique: true, // Ensure zone names are unique
  },
  city: {
    type: dt.STRING,
    allowNull: false, // Zone must belong to a city
  },
  zoneDetails: {
    type: dt.TEXT,
    allowNull: true, // Optional field
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "Active", // Default value
  },
},{
  tableName: 'zones',
  timestamps: true,
});

module.exports = Zone;