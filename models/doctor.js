const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const DoctorsInformation = sequelize.define("doctors_information", {
  id: {
    type: dt.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: dt.STRING,
    allowNull: false,
  },
  degree: {
    type: dt.STRING,
    allowNull: false,
  },
  speciality: {
    type: dt.TEXT, // Store as TEXT to handle JSON string
    allowNull: false,
    get() {
      const rawValue = this.getDataValue("speciality");
      try {
        return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      } catch (error) {
        // Return rawValue if it's not parsable
        return rawValue;
      }
    },
    set(value) {
      // Convert the array to a JSON string before saving
      this.setDataValue("speciality", JSON.stringify(value));
    },
  },
  visitFee: {
    type: dt.INTEGER,
    allowNull: false,
  },
  branch: {
    type: dt.STRING,
    allowNull: false,
  },
  practiceDays: {
    type: dt.TEXT, // Store as TEXT to handle JSON string
    allowNull: false,
    get() {
      const rawValue = this.getDataValue("practiceDays");
      try {
        // Clean the string if it's malformed
        if (typeof rawValue === "string") {
          // Remove trailing invalid characters
          let cleanedValue = rawValue.trim();
          if (!cleanedValue.endsWith("}]")) {
            // Find the last valid closing bracket
            const lastValidIndex = cleanedValue.lastIndexOf("}");
            if (lastValidIndex !== -1) {
              cleanedValue = cleanedValue.substring(0, lastValidIndex + 1) + "]";
            } else {
              // If no valid object is found, return an empty array
              return [];
            }
          }
          // Parse the cleaned JSON string
          return JSON.parse(cleanedValue);
        } else if (Array.isArray(rawValue)) {
          // If it's already an array, return it
          return rawValue;
        } else {
          // If it's neither, return an empty array
          return [];
        }
      } catch (error) {
        // Return an empty array if parsing fails
        return [];
      }
    },
    set(value) {
      // Convert the array or string to a JSON string before saving
      if (typeof value === "string") {
        // If it's a string, parse it first to ensure it's valid JSON
        try {
          const parsedValue = JSON.parse(value);
          this.setDataValue("practiceDays", JSON.stringify(parsedValue));
        } catch (error) {
          // If parsing fails, save it as an empty array
          this.setDataValue("practiceDays", JSON.stringify([]));
        }
      } else if (Array.isArray(value)) {
        // If it's an array, stringify it directly
        this.setDataValue("practiceDays", JSON.stringify(value));
      } else {
        // If it's neither, save it as an empty array
        this.setDataValue("practiceDays", JSON.stringify([]));
      }
    },
  },
  phoneNumber: {
    type: dt.STRING,
    allowNull: false,
  },
  yearsOfExperience: {
    type: dt.INTEGER,
    allowNull: false,
  },
  roomNo: {
    type: dt.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: dt.STRING,
    allowNull: true,
  },
  address: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = DoctorsInformation;