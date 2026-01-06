const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const FTPServer = sequelize.define("FTPServer", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  serverName: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  serverLink: {
    type: dt.STRING,
    allowNull: false,
    validate: {
      isUrl: {
        msg: "Please enter a valid server URL"
      }
    }
  },
  description: {
    type: dt.TEXT,
    allowNull: true,
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "Active",
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
  tableName: 'ftp_servers',
  timestamps: true,
  hooks: {
    beforeCreate: (ftpserver) => {
      // Ensure serverLink starts with https://
      if (ftpserver.serverLink && !ftpserver.serverLink.startsWith('https://')) {
        ftpserver.serverLink = `https://${ftpserver.serverLink.replace(/^https?:\/\//, '')}`;
      }
    },
    beforeUpdate: (ftpserver) => {
      // Ensure serverLink starts with https:// when updating
      if (ftpserver.serverLink && !ftpserver.serverLink.startsWith('https://')) {
        ftpserver.serverLink = `https://${ftpserver.serverLink.replace(/^https?:\/\//, '')}`;
      }
    }
  }
});

module.exports = FTPServer;