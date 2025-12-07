const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const AuthorityInformation = sequelize.define("authority-information", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  address: {
    type: dt.STRING,
    allowNull: false, 
  },
  age: {
    type: dt.INTEGER,
    allowNull: false,
  },
  bloodGroup: {
    type: dt.STRING,
    allowNull: true,
    defaultValue: '',
  },
  dateOfBirth: {
    type: dt.DATE,
    allowNull: false,
  },
  email: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  photo: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  fatherOrSpouseName: {
    type: dt.STRING,
    allowNull: false,
  },
  fullName: {
    type: dt.STRING,
    allowNull: false,
  },
  jobCategory: {
    type: dt.STRING,
    allowNull: true,
    defaultValue: '',
  },
  jobType: {
    type: dt.STRING,
    allowNull: false,
  },
  maritalStatus: {
    type: dt.STRING,
    allowNull: false,
  },
  mobileNo: {
    type: dt.STRING,
    allowNull: false,
  },
  nidOrPassportNo: {
    type: dt.STRING,
    allowNull: false,
  },
  religion: {
    type: dt.STRING,
    allowNull: true,
    defaultValue: '',
  },
  role: {
    type: dt.STRING,
    allowNull: false,
  },
  sex: {
    type: dt.STRING,
    allowNull: false,
  },
  userId: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: dt.STRING,
    allowNull: false,
  },
  status: {
    type: dt.ENUM('active', 'inactive', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
  },
  baseSalary: {
    type: dt.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
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
  tableName: 'authority-informations',
  timestamps: true,
});

module.exports = AuthorityInformation;