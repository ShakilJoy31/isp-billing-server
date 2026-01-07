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
  
  // Earnings - Use INTEGER for exact calculations
  basicSalary: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  houseRent: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  medicalAllowance: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  travelAllowance: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  otherAllowances: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  // Deductions
  providentFund: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  taxDeduction: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  otherDeductions: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 200,
  },
  overtimeAmount: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  // Bonuses
  performanceBonus: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  festivalBonus: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  otherBonuses: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  totalDeductions: {
    type: dt.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  netSalary: {
    type: dt.BIGINT,
    allowNull: false,
    defaultValue: 0,
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
    {
      fields: ['employeeId']
    },
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
    },
    {
      fields: ['salaryMonth', 'salaryYear']
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