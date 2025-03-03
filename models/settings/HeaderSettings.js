const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const SiteSettings = sequelize.define("header-settings", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    allowNull: false,
    defaultValue: 1, // Ensure the default value is 1
  },
  favicon: {
    type: dt.STRING,
    allowNull: false,
  },
  headerLogo: {
    type: dt.STRING,
    allowNull: false,
  },
  siteTitle: {
    type: dt.STRING,
    allowNull: false,
  },
  siteURL: {
    type: dt.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` fields
});

module.exports = SiteSettings;
