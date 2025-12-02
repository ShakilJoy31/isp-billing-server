const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const EmployeeAttendance = sequelize.define("EmployeeAttendance", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  employeeId: {
    type: dt.INTEGER,
    allowNull: false,
  },
  checkIn: {
    type: dt.STRING,
    allowNull: true,
  },
  checkOut: {
    type: dt.STRING,
    allowNull: true,
  },
  date: {
    type: dt.DATEONLY,
    allowNull: false,
  },
  status: {
    type: dt.ENUM('Present', 'Absent', 'Leave', 'Half Day'),
    allowNull: false,
    defaultValue: 'Present',
  },
  workingHours: {
    type: dt.FLOAT,
    allowNull: true,
  },
  lateMinutes: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  earlyDeparture: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  note: {
    type: dt.TEXT,
    allowNull: true,
  },
  createdBy: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: 'Super-Admin',
  },
}, {
  hooks: {
    beforeValidate: (attendance) => {
      // Auto-generate attendanceId if not provided
      if (!attendance.attendanceId) {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        attendance.attendanceId = `ATT-${date}-${random}`;
      }
      
      // Calculate working hours if both checkIn and checkOut are provided
      if (attendance.checkIn && attendance.checkOut) {
        const parseTime = (timeStr) => {
          const [time, modifier] = timeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          
          if (modifier === 'PM' && hours !== 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          
          return hours + minutes / 60;
        };
        
        const start = parseTime(attendance.checkIn);
        const end = parseTime(attendance.checkOut);
        attendance.workingHours = end - start;
      }
    }
  },
  indexes: [
    {
      unique: true,
      fields: ['employeeId', 'date']
    }
  ]
});

module.exports = EmployeeAttendance;