const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const MissionVision = sequelize.define(
  "mission_vision_table",
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
        if (value && typeof value === "object" && typeof value.url === "string") {
          this.setDataValue("bannerImage", value);
        } else {
          throw new Error("bannerImage must be a JSON object containing a 'url' property as a string.");
        }
      },
      get() {
        const rawValue = this.getDataValue("bannerImage");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    mission: {
      type: dt.STRING,
      allowNull: false,
    },
    vision: {
      type: dt.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "mission_vision_table",
    timestamps: true,
  }
);

module.exports = MissionVision;
