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
    type: dt.STRING,
    allowNull: false,
  },
  bloodGroup: {
    type: dt.STRING,
    allowNull: false,
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
    allowNull: false,
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
    allowNull: false,
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
    type: dt.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
});

module.exports = AuthorityInformation;