// Model Update
const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const Management = sequelize.define(
  "management",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bannerImage: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (value && typeof value.url === "string") {
          this.setDataValue("bannerImage", value);
        } else {
          throw new Error("bannerImage must be an object containing a 'url' property as a string.");
        }
      },
      get() {
        const rawValue = this.getDataValue("bannerImage");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    designation: {
      type: dt.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (value && typeof value.url === "string") {
          this.setDataValue("imageUrl", value);
        } else {
          throw new Error("imageUrl must be an object containing a 'url' property as a string.");
        }
      },
      get() {
        const rawValue = this.getDataValue("imageUrl");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    name: {
      type: dt.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "management",
    timestamps: true,
  }
);

module.exports = Management;