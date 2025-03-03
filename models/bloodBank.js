const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");


const BloodBank = sequelize.define(
    "blood_bank_table",
    {
      id: {
        type: dt.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bloodBank: {
        type: dt.TEXT, // Use TEXT to store HTML content
        allowNull: false,
      },
      bannerImage: {
        type: dt.STRING, // Store the URL of the banner image
        allowNull: false,
        validate: {
          isUrl: true, // Ensure the value is a valid URL
        },
      },
    },
    {
      tableName: "blood_bank_table",
      timestamps: true,
    }
  );
  
  module.exports = BloodBank;