const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");
const ClientInformation = require("../Authentication/client.model");

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
  },
  packageBandwidth: {
    type: dt.STRING,
    allowNull: false,
  },
  packagePrice: {
    type: dt.DECIMAL(10, 2), // Changed to DECIMAL for proper price handling
    allowNull: false,
  },
  packageDetails: {
    type: dt.TEXT,
    allowNull: true,
  },
  packageFeatures: {
    type: dt.TEXT, // New field for features (JSON string or comma separated)
    allowNull: true,
  },
  packageType: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "Residential",
  },
  duration: {
    type: dt.STRING, // Monthly, Quarterly, Yearly, etc.
    allowNull: false,
    defaultValue: "Monthly",
  },
  downloadSpeed: {
    type: dt.STRING,
    allowNull: true,
  },
  uploadSpeed: {
    type: dt.STRING,
    allowNull: true,
  },
  dataLimit: {
    type: dt.STRING, // Unlimited, 100GB, etc.
    allowNull: true,
    defaultValue: "Unlimited",
  },
  installationFee: {
    type: dt.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  discount: {
    type: dt.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
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
  tableName: 'packages',
  timestamps: true,
  hooks: {
    beforeUpdate: (package) => {
      package.updatedAt = new Date();
    }
  }
});


module.exports = Package;