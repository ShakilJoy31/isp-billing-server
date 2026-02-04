// models/contact/contact.model.js
const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const PublicMessageContact = sequelize.define(
  "PublicMessageContact",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: dt.STRING,
      allowNull: false,
    },
    email: {
      type: dt.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: dt.STRING,
      allowNull: true,
    },
    subject: {
      type: dt.STRING,
      allowNull: true,
    },
    message: {
      type: dt.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "public_contacts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = PublicMessageContact;