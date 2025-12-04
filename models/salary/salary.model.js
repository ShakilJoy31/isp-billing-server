const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Salary = sequelize.define(
  "Salary",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    salaryId: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
    },
    employeeId: {
      type: dt.STRING,
      allowNull: false,
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
    salaryMonth: {
      type: dt.STRING,
      allowNull: false,
    },
    salaryYear: {
      type: dt.INTEGER,
      allowNull: false,
    },

    // Earnings
    basicSalary: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    houseRent: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    medicalAllowance: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    travelAllowance: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    otherAllowances: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    // Deductions
    providentFund: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    taxDeduction: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    otherDeductions: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    // Attendance
    totalWorkingDays: {
      type: dt.INTEGER,
      allowNull: false,
    },
    presentDays: {
      type: dt.INTEGER,
      allowNull: false,
    },
    absentDays: {
      type: dt.INTEGER,
      allowNull: false,
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
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    overtimeRate: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    overtimeAmount: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    // Bonuses
    performanceBonus: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    festivalBonus: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    otherBonuses: {
      type: dt.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    // Calculations
    grossSalary: {
      type: dt.FLOAT,
      allowNull: false,
    },
    totalDeductions: {
      type: dt.FLOAT,
      allowNull: false,
    },
    netSalary: {
      type: dt.FLOAT,
      allowNull: false,
    },

    // Payment Info
    paymentStatus: {
      type: dt.ENUM("pending", "paid", "failed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentDate: {
      type: dt.DATE,
      allowNull: true,
    },
    paymentMethod: {
      type: dt.ENUM("bank", "cash", "mobile_banking"),
      allowNull: true,
    },
    bankAccount: {
      type: dt.STRING,
      allowNull: true,
    },

    // Metadata
    createdBy: {
      type: dt.STRING,
      allowNull: false,
    },
    note: {
      type: dt.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "salaries",
    timestamps: true,
    hooks: {
      beforeValidate: (salary) => {
        // Auto-generate salaryId if not provided
        if (!salary.salaryId) {
          const monthYear = salary.salaryMonth || "0000-00";
          const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
          salary.salaryId = `SAL-${monthYear}-${random}`;
        }

        // Calculate derived fields
        salary.grossSalary =
          salary.basicSalary +
          salary.houseRent +
          salary.medicalAllowance +
          salary.travelAllowance +
          salary.otherAllowances +
          salary.overtimeAmount +
          salary.performanceBonus +
          salary.festivalBonus +
          salary.otherBonuses;

        salary.totalDeductions =
          salary.providentFund + salary.taxDeduction + salary.otherDeductions;

        salary.netSalary = salary.grossSalary - salary.totalDeductions;

        // Calculate overtime amount if not provided
        if (
          salary.overtimeHours > 0 &&
          salary.overtimeRate > 0 &&
          !salary.overtimeAmount
        ) {
          salary.overtimeAmount = salary.overtimeHours * salary.overtimeRate;
        }
      },
    },
  }
);

module.exports = Salary;
