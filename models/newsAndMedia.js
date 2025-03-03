const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const NewsMediaImage = sequelize.define(
  "newsMediaImage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "news_media_images",
    timestamps: true,
  }
);

module.exports = NewsMediaImage;
