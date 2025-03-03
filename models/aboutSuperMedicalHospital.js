const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const AboutSuperMedical = sequelize.define(
  "about-super-medical",
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
    aboutHospital: {
      type: dt.TEXT,
      allowNull: false,
    },
    whatWeHave: {
      type: dt.TEXT,
      allowNull: true,
    },
    whatWeOffer: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (Array.isArray(value) && value.length === 3) {
          this.setDataValue("whatWeOffer", value);
        } else {
          throw new Error("whatWeOffer must be an array containing exactly 3 objects.");
        }
      },
      get() {
        const rawValue = this.getDataValue("whatWeOffer");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    bannerImage: {
      type: dt.STRING,
      allowNull: true,
    },
    slidingImages: {
      type: dt.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("slidingImages");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
  },
  {
    tableName: "about-super-medical",
    timestamps: true,
  }
);

module.exports = AboutSuperMedical;
