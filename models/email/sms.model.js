const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const SMS = sequelize.define("SMS", {
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
  apiKey: {
    type: dt.STRING,
    allowNull: false,
  },
  type: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "unicode",
    validate: {
      isIn: {
        args: [["unicode", "text", "flash"]],
        msg: "Type must be either 'unicode', 'text', or 'flash'"
      }
    }
  },
  senderId: {
    type: dt.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 20],
        msg: "Sender ID must be between 3 and 20 characters"
      }
    }
  },
  service: {
    type: dt.STRING,
    allowNull: false,
  },
  message: {
    type: dt.TEXT,
    allowNull: false,
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
  tableName: 'sms_configs',
  timestamps: true,
});

module.exports = SMS; 