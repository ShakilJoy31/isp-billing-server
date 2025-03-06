const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const ClientInformation = sequelize.define("client-information", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  package: {
    type: dt.STRING,
    allowNull: false,
  },
  userId: {
    type: dt.STRING,
    allowNull: false,
  },
  location: {
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
  area: {
    type: dt.STRING,
    allowNull: false,
  },
  email: {
    type: dt.STRING,
    allowNull: false,
  },
  fullName: {
    type: dt.STRING,
    allowNull: false,
  },
  landmark: {
    type: dt.STRING,
    allowNull: false,
  },
  mobileNo: {
    type: dt.STRING,
    allowNull: false,
  },
  role: {
    type: dt.STRING,
    allowNull: false,
  },
  status: {
    type: dt.STRING,
    allowNull: false,
  },
  password: {
    type: dt.STRING,
    allowNull: false,
  },
  nidNo: {
    type: dt.STRING,
    allowNull: false,
  },
  phoneNo: {
    type: dt.STRING,
    allowNull: false,
  },
});

module.exports = ClientInformation;