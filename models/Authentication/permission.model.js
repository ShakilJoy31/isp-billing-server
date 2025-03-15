const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const RolePermission = sequelize.define("role-permissions", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  roleName: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  permissions: {
    type: dt.TEXT, // Store permissions as a JSON string
    allowNull: false,
    get() {
      // Parse the JSON string when retrieving the data
      const rawValue = this.getDataValue("permissions");
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      // Stringify the array when saving to the database
      this.setDataValue("permissions", JSON.stringify(value));
    },
  },
});

module.exports = RolePermission;