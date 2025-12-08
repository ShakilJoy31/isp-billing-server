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
    unique: true,
  },
  city: {
    type: dt.STRING,
    allowNull: false,
  },
  zoneDetails: {
    type: dt.TEXT,
    allowNull: true,
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "Active",
  },
}, {
  tableName: 'zones',
  timestamps: true,
});

module.exports = Zone;