const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Email = sequelize.define("Email", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  appName: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 100],
        msg: "App name must be between 2 and 100 characters"
      }
    }
  },
  email: {
    type: dt.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Please enter a valid email address"
      }
    }
  },
  emailAppPassword: {
    type: dt.STRING,
    allowNull: false,
  },
  isActive: {
    type: dt.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: dt.DATE,
    allowNull: false,
    defaultValue: dt.NOW,
  },
  updatedAt: {
    type: dt.DATE,
    allowNull: false,
    defaultValue: dt.NOW,
  },
}, {
  tableName: 'emails',
  timestamps: true,
});

module.exports = Email;