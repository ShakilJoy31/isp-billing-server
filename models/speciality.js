const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const SpecialityInformation = sequelize.define("speciality_information", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  speciality: {
    type: dt.STRING,
    allowNull: false,
  },
  specialityContent: {
    type: dt.TEXT, // Storing HTML content as TEXT
    allowNull: false,
  },
});

module.exports = SpecialityInformation;
