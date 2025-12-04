const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection"); // Adjust the path to your Sequelize instance

const Ticket = sequelize.define("Ticket", {
    id: {
        type: dt.INTEGER,
        autoIncrement: true, // Ensure this is set to true
        primaryKey: true,
    },
    ticketMadeBy: {
        type: dt.STRING,
        allowNull: false,
    },
    ticketId: {
        type: dt.STRING,
        allowNull: false,
        unique: true, // Ensure `ticketId` is unique
    },
    status: {
        type: dt.STRING,
        defaultValue: "pending",
        allowNull: false,
    },
    title: {
        type: dt.STRING,
        allowNull: false,
    },
    description: {
        type: dt.TEXT,
        allowNull: false,
    },
    assignedTo: {
        type: dt.STRING,
        allowNull: false,
    },
}, {
    tableName: 'tickets',
    timestamps: true,
});

module.exports = Ticket;