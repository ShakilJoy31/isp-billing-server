const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");
const AuthorityInformation = require("../Authentication/authority.model");

const Salary = sequelize.define("salary", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Employee Information
  employeeId: {
    type: dt.STRING,
    allowNull: false,
    unique: true, // This already creates an index
    references: {
      model: AuthorityInformation,
      key: 'userId'
    }
  },
  employeeName: {
    type: dt.STRING,
    allowNull: false,
  },
  department: {
    type: dt.STRING,
    allowNull: false,
  },
  designation: {
    type: dt.STRING,
    allowNull: false,
  },
  
  // Salary Period (Optional)
  salaryMonth: {
    type: dt.STRING,
    allowNull: true,
  },
  salaryYear: {
    type: dt.INTEGER,
    allowNull: true,
  },
  
  // Earnings
  basicSalary: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  houseRent: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  medicalAllowance: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  travelAllowance: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  otherAllowances: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  
  // Deductions
  providentFund: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  taxDeduction: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  otherDeductions: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  
  // Attendance
  totalWorkingDays: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 26,
  },
  presentDays: {
    type: dt.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  absentDays: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  paidLeaves: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  unpaidLeaves: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  // Overtime
  overtimeHours: {
    type: dt.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  overtimeRate: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 200.00,
  },
  overtimeAmount: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  
  // Bonuses
  performanceBonus: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  festivalBonus: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  otherBonuses: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  
  // Calculations
  grossSalary: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  totalDeductions: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  netSalary: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  
  // Payment Information
  paymentStatus: {
    type: dt.ENUM('pending', 'paid', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  paymentDate: {
    type: dt.DATE,
    allowNull: true,
  },
  paymentMethod: {
    type: dt.ENUM('bank', 'cash', 'mobile_banking'),
    allowNull: false,
    defaultValue: 'bank',
  },
  bankAccount: {
    type: dt.STRING,
    allowNull: true,
    defaultValue: '',
  },
  
  // Additional Information
  salaryId: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  createdBy: {
    type: dt.STRING,
    allowNull: true,
    defaultValue: 'admin',
  },
  note: {
    type: dt.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  
  // Timestamps
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
  tableName: 'salaries',
  timestamps: true,
  indexes: [
    // Only need indexes for fields that don't already have unique constraint
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['department']
    },
    {
      fields: ['designation']
    },
    {
      fields: ['salaryId']
    }
  ]
});

// Associate with AuthorityInformation
Salary.belongsTo(AuthorityInformation, {
  foreignKey: 'employeeId',
  targetKey: 'userId',
  as: 'employee'
});

// Set up the inverse association
AuthorityInformation.hasMany(Salary, {
  foreignKey: 'employeeId',
  sourceKey: 'userId',
  as: 'salaries'
});

module.exports = Salary;