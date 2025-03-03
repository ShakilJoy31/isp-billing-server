const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");


const HelathTips = sequelize.define(
    "health-tips-table",
    {
      id: {
        type: dt.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      healthTipsContent: {
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
      tableName: "health-tips-table",
      timestamps: true,
    }
  );
  
  module.exports = HelathTips;