const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");


const Message = sequelize.define("message", {
    id: {
        type: dt.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: dt.STRING,
        allowNull: false,
    },
    email: {
        type: dt.STRING,
        allowNull: false,
    },
    message: {
        type: dt.TEXT,
        allowNull: false,
    },
});

module.exports = Message;
