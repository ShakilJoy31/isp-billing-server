const { DataTypes: dt } = require("sequelize");
const sequelize = require("../database/connection");

const AuthorityUser = sequelize.define("authority-user", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  name: { 
    type: dt.STRING, 
    allowNull: false 
  },
  email: { 
    type: dt.STRING, 
    allowNull: false, 
    unique: true 
  },
  image: { 
    type: dt.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: { 
    type: dt.STRING, 
    allowNull: false 
  },
  mobileNumber: { 
    type: dt.STRING, 
    allowNull: false 
  },
  dateOfBirth: { 
    type: dt.DATEONLY, 
    allowNull: false 
  },
  gender: { 
    type: dt.ENUM(["male", "female", "other"]), 
    allowNull: false 
  },
  role: { 
    type: dt.STRING, 
    defaultValue: "user", 
    allowNull: false 
  },
  doctorId: { 
    type: dt.INTEGER, 
    allowNull: true,
  }
});

module.exports = AuthorityUser;
