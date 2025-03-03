const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const HomePageData = sequelize.define(
  "home_page_data_table",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bannerImages: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (Array.isArray(value) && value.every((img) => img.imageUrl && typeof img.imageUrl === "string")) {
          this.setDataValue("bannerImages", value);
        } else {
          throw new Error("bannerImages must be an array of objects containing 'imageUrl' as a string.");
        }
      },
      get() {
        const rawValue = this.getDataValue("bannerImages");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    doctorContacts: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (Array.isArray(value) && value.every((contact) => contact.serialNo !== undefined && contact.hotline !== undefined)) {
          this.setDataValue("doctorContacts", value);
        } else {
          throw new Error("doctorContacts must be an array of objects containing 'serialNo' and 'hotline'.");
        }
      },
      get() {
        const rawValue = this.getDataValue("doctorContacts");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    aboutUs: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (
          value &&
          typeof value === "object" &&
          value.description &&
          value.title &&
          Array.isArray(value.images) &&
          value.images.every((img) => img.imageUrl && typeof img.imageUrl === "string")
        ) {
          this.setDataValue("aboutUs", value);
        } else {
          throw new Error("aboutUs must be an object containing 'description', 'title', and 'images' array.");
        }
      },
      get() {
        const rawValue = this.getDataValue("aboutUs");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    femaleDoctorMonitoring: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (
          value &&
          typeof value === "object" &&
          value.description &&
          Array.isArray(value.images) &&
          value.images.every((img) => img.imageUrl && typeof img.imageUrl === "string")
        ) {
          this.setDataValue("femaleDoctorMonitoring", value);
        } else {
          throw new Error("femaleDoctorMonitoring must be an object containing 'description' and 'images' array.");
        }
      },
      get() {
        const rawValue = this.getDataValue("femaleDoctorMonitoring");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    labAndPathology: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (
          value &&
          typeof value === "object" &&
          value.description &&
          Array.isArray(value.images) &&
          value.images.every((img) => img.imageUrl && typeof img.imageUrl === "string")
        ) {
          this.setDataValue("labAndPathology", value);
        } else {
          throw new Error("labAndPathology must be an object containing 'description' and 'images' array.");
        }
      },
      get() {
        const rawValue = this.getDataValue("labAndPathology");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    pharmacy: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (
          value &&
          typeof value === "object" &&
          value.description &&
          Array.isArray(value.image) &&
          value.image.every((img) => img.imageUrl && typeof img.imageUrl === "string")
        ) {
          this.setDataValue("pharmacy", value);
        } else {
          throw new Error("pharmacy must be an object containing 'description' and 'image' array.");
        }
      },
      get() {
        const rawValue = this.getDataValue("pharmacy");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
  },
  {
    tableName: "home_page_data_table",
    timestamps: true,
  }
);

module.exports = HomePageData;