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
      allowNull: true,
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
      allowNull: true,
    },
    dateOfBirth: {
      type: dt.DATE,
      allowNull: true,
    },
    age: {
      type: dt.INTEGER,
      allowNull: true,
    },
    sex: {
      type: dt.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: dt.STRING,
      allowNull: true,
    },
    nidOrPassportNo: {
      type: dt.STRING,
      allowNull: true,
    },
    // New fields for NID photos
    nidPhotoFrontSide: {
      type: dt.STRING,
      allowNull: true,
      defaultValue: "",
    },
    nidPhotoBackSide: {
      type: dt.STRING,
      allowNull: true,
      defaultValue: "",
    },
    isFreeClient: {
      type: dt.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
      allowNull: true,
    },
    mobileNo: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
    },
    customerType: {
      type: dt.STRING,
      allowNull: true,
    },
    package: {
      type: dt.STRING,
      allowNull: true,
    },
    location: {
      type: dt.STRING,
      allowNull: true,
    },
    area: {
      type: dt.STRING,
      allowNull: true,
    },
    flatAptNo: {
      type: dt.STRING,
      allowNull: true,
    },
    houseNo: {
      type: dt.STRING,
      allowNull: true,
    },
    roadNo: {
      type: dt.STRING,
      allowNull: true,
    },
    landmark: {
      type: dt.STRING,
      allowNull: true,
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
    userAddedBy: {
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
