const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Milestone = sequelize.define(
  "milestone",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    milestoneImage: {
      type: DataTypes.JSON,
      allowNull: false,
      set(value) {
        if (value && typeof value.url === "string") {
          this.setDataValue("milestoneImage", value);
        } else {
          throw new Error("milestoneImage must be an object containing a 'url' property as a string.");
        }
      },
      get() {
        const rawValue = this.getDataValue("milestoneImage");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
    milestoneDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "milestones",
    timestamps: true,
  }
);

module.exports = Milestone;
