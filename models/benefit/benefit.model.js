const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Benefit = sequelize.define("Benefit", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: dt.STRING,
    allowNull: false,
  },
  description: {
    type: dt.TEXT,
    allowNull: true,
  },
  type: {
    type: dt.ENUM(
      'Internet Package',
      'Bundle Offer', 
      'Promotional Offer',
      'Loyalty Benefit',
      'Seasonal Offer',
      'Corporate Package',
      'Custom Package'
    ),
    allowNull: false,
  },
  category: {
    type: dt.ENUM(
      'Residential',
      'Business',
      'Student',
      'Senior Citizen',
      'Low Income',
      'General'
    ),
    allowNull: false,
    defaultValue: 'General'
  },
  // Pricing Information
  basePrice: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
  },
  discountPrice: {
    type: dt.DECIMAL(10, 2),
    allowNull: true,
  },
  currency: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: 'BDT'
  },
  billingCycle: {
    type: dt.ENUM('Monthly', 'Quarterly', 'Yearly', 'One-time'),
    allowNull: false,
    defaultValue: 'Monthly'
  },
  // Service Specifications
  internetSpeed: {
    type: dt.STRING, // e.g., "100 Mbps", "1 Gbps"
    allowNull: true,
  },
  dataLimit: {
    type: dt.STRING, // e.g., "Unlimited", "500 GB"
    allowNull: true,
  },
  uploadSpeed: {
    type: dt.STRING,
    allowNull: true,
  },
  downloadSpeed: {
    type: dt.STRING,
    allowNull: true,
  },
  // Additional Services
  includesTv: {
    type: dt.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  includesPhone: {
    type: dt.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  includesWifi: {
    type: dt.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  tvChannels: {
    type: dt.INTEGER,
    allowNull: true,
  },
  phoneMinutes: {
    type: dt.INTEGER,
    allowNull: true,
  },
  // Contract Details
  contractLength: {
    type: dt.INTEGER, // Months
    allowNull: true,
  },
  installationFee: {
    type: dt.DECIMAL(10, 2),
    allowNull: true,
  },
  equipmentFee: {
    type: dt.DECIMAL(10, 2),
    allowNull: true,
  },
  // Offer Period
  startDate: {
    type: dt.DATE,
    allowNull: false,
  },
  endDate: {
    type: dt.DATE,
    allowNull: true,
  },
  isActive: {
    type: dt.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isFeatured: {
    type: dt.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  // Eligibility Criteria
  minContractLength: {
    type: dt.INTEGER,
    allowNull: true,
  },
  eligibilityCriteria: {
    type: dt.TEXT,
    allowNull: true,
  },
  // Additional Features
  features: {
    type: dt.JSON,
    allowNull: true,
  },
  termsConditions: {
    type: dt.TEXT,
    allowNull: true,
  },
  // Metadata
  createdBy: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: 'admin'
  },
  updatedBy: {
    type: dt.STRING,
    allowNull: true,
  }
}, {
  hooks: {
    beforeValidate: (benefit) => {
      
      // Calculate discount percentage if discountPrice is provided
      if (benefit.discountPrice && benefit.basePrice) {
        const discountPercent = ((benefit.basePrice - benefit.discountPrice) / benefit.basePrice * 100).toFixed(1);
        if (!benefit.features) benefit.features = {};
        benefit.features.discountPercent = parseFloat(discountPercent);
      }
      
      // Set default end date if not provided (1 year from start)
      if (benefit.startDate && !benefit.endDate) {
        const endDate = new Date(benefit.startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        benefit.endDate = endDate;
      }
    }
  },
  indexes: [
    {
      fields: ['type', 'isActive']
    },
    {
      fields: ['category']
    },
    {
      fields: ['startDate', 'endDate']
    }
  ]
});

module.exports = Benefit;