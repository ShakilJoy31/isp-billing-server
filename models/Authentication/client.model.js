const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");
const Package = require("../package/package.model");

const ClientInformation = sequelize.define(
  "client-information",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    customerId: {
      type: dt.STRING,
      allowNull: false,
    },
    userId: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: dt.STRING,
      allowNull: false,
    },
    photo: {
      type: dt.STRING,
      allowNull: true,
    },
    fatherOrSpouseName: {
      type: dt.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: dt.DATE,
      allowNull: true,
    },
    age: {
      type: dt.INTEGER,
      allowNull: false,
    },
    sex: {
      type: dt.STRING,
      allowNull: false,
    },
    maritalStatus: {
      type: dt.STRING,
      allowNull: false,
    },
    nidOrPassportNo: {
      type: dt.STRING,
      allowNull: false,
    },
    jobPlaceName: {
      type: dt.STRING,
      allowNull: true,
    },
    jobCategory: {
      type: dt.STRING,
      allowNull: true,
    },
    jobType: {
      type: dt.STRING,
      allowNull: false,
    },
    mobileNo: {
      type: dt.STRING,
      allowNull: false,
    },
    email: {
      type: dt.STRING,
      allowNull: false,
    },
    customerType: {
      type: dt.STRING,
      allowNull: false,
    },
    package: {
      type: dt.STRING,
      allowNull: false,
    },
    location: {
      type: dt.STRING,
      allowNull: false,
    },
    area: {
      type: dt.STRING,
      allowNull: false,
    },
    flatAptNo: {
      type: dt.STRING,
      allowNull: false,
    },
    houseNo: {
      type: dt.STRING,
      allowNull: false,
    },
    roadNo: {
      type: dt.STRING,
      allowNull: false,
    },
    landmark: {
      type: dt.STRING,
      allowNull: false,
    },
    connectionDetails: {
      type: dt.TEXT,
      allowNull: true,
    },
    costForPackage: {
      type: dt.INTEGER,
      allowNull: true,
    },
    referId: {
      type: dt.STRING,
      allowNull: true,
    },
    role: {
      type: dt.STRING,
      allowNull: false,
      defaultValue: "client",
    },
    status: {
      type: dt.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    password: {
      type: dt.STRING,
      allowNull: false,
    },
    // New fields
    routerLoginId: {
      type: dt.STRING,
      allowNull: true,
      defaultValue: null,
    },
    routerLoginPassword: {
      type: dt.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "client-informations",
    timestamps: true,
  }
);

module.exports = ClientInformation;