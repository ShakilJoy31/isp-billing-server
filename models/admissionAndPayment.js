const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const AdmissionAndPayment = sequelize.define(
  "admission-and-payment-information",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admissionAndPaymentContent: {
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
    tableName: "admission-and-payment-information",
    timestamps: true,
  }
);

module.exports = AdmissionAndPayment;
