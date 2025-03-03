const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const Inquery = sequelize.define("inquery", {
    name: {
        type: dt.STRING,
        allowNull: false,
    },
    email: {
        type: dt.STRING,
        allowNull: false,
    },
    phone: {
        type: dt.STRING,
        allowNull: false,
    },
    message: {
        type: dt.TEXT,
        allowNull: false,
    },
});

module.exports = Inquery;