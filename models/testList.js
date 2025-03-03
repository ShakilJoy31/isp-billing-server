// models/TestList.js
const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const TestList = sequelize.define(
    "test-list-table",
    {
        id: {
            type: dt.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        heading: {
            type: dt.STRING,
            allowNull: false,
        },
        items: {
            type: dt.JSON, // Store items as a JSON array
            allowNull: false,
            get() {
                // Parse the JSON string into an array when retrieving data
                const rawValue = this.getDataValue("items");
                return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
            },
            set(value) {
                // Ensure the value is stored as a JSON string
                this.setDataValue("items", JSON.stringify(value));
            },
        },
    },
    {
        tableName: "test-list-table",
        timestamps: true,
    }
);

module.exports = TestList;