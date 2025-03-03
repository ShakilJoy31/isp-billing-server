const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const BoardOfDirector = sequelize.define(
  "board-of-director",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: dt.STRING,
      allowNull: false,
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
    tableName: "board-of-director",
    timestamps: true,
  }
);

module.exports = BoardOfDirector;
