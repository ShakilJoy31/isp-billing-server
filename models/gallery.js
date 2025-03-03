const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const PostImages = sequelize.define(
  "hospital-gallery",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },

    gallery: {
      type: dt.JSON,
      allowNull: false,
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue("gallery", value);
        } else {
          throw new Error("Gallery must be an array of objects with imageUrl and imageDescription.");
        }
      },
      get() {
        const rawValue = this.getDataValue("gallery");
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      },
    },
   
  },
  {
    tableName: "hospital-gallery",
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

module.exports = PostImages;
