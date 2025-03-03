const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const HospitalContactInfo = sequelize.define(
  "hospital_contact_info_table",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: dt.STRING,
      allowNull: false,
    },
    description: {
      type: dt.STRING,
      allowNull: false,
    },
    address: {
      type: dt.STRING,
      allowNull: false,
    },
    phoneNumbers: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue("phoneNumbers", value);
        } else {
          throw new Error("phoneNumbers must be an array of strings.");
        }
      },
    },
    email: {
      type: dt.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    businessHours: {
      type: dt.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "hospital_contact_info_table",
    timestamps: true,
  }
);

module.exports = HospitalContactInfo;