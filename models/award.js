const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const Award = sequelize.define(
  "award-table",
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
    awardDescription: {
      type: dt.STRING,
      allowNull: false,
    },
    awardImage: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (value && typeof value.url === "string") {
          this.setDataValue("awardImage", value);
        } else {
          throw new Error("awardImage must be an object containing a 'url' property as a string.");
        }
      },
      get() {
        const rawValue = this.getDataValue("awardImage");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    awardTitle: {
      type: dt.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "award-table",
    timestamps: true,
  }
);

module.exports = Award;
