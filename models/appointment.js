const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const DoctorInformation = require("./doctor");
const User = require("./User");

const Appointment = sequelize.define("appointment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    appointmentBookedBy: {
        type: DataTypes.JSON, // Use JSON type
        allowNull: false,
        get() {
            const rawValue = this.getDataValue("appointmentBookedBy");
            try {
                return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
            } catch (error) {
                // Return rawValue if it's not parsable
                return rawValue;
            }
        },
    },
    branch: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    doctor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userNote: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Define the associations
Appointment.belongsTo(DoctorInformation, {
    foreignKey: "doctor", // Corresponds to the "doctor" field in Appointment
    as: "doctorInfo", // Renamed alias to avoid naming collision
});

module.exports = Appointment;