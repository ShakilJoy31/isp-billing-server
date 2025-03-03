const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const FooterSettings = sequelize.define("footer_settings", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: false,
    allowNull: false,
  },
  copyright: {
    type: dt.STRING,
    allowNull: false,
  },
  rightsReserved: {
    type: dt.STRING,
    allowNull: false,
  },
  craftedBy: {
    type: dt.STRING,
    allowNull: false,
  },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  });

module.exports = FooterSettings;
