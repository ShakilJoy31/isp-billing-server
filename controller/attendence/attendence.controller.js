
const { Op } = require("sequelize");
const EmployeeAttendance = require("../../models/attendence/attendence.model");
const sequelize = require("../../database/connection");

// Create multiple employee attendance records
const createMultipleEmployeeAttendance = async (req, res, next) => {
  try {
    const { employeeAttendance } = req.body;

    if (!employeeAttendance || !Array.isArray(employeeAttendance) || employeeAttendance.length === 0) {
      return res.status(400).json({ 
        message: "employeeAttendance array is required and cannot be empty" 
      });
    }

    // Validate each attendance record
    for (const attendance of employeeAttendance) {
      if (!attendance.employeeId || !attendance.date) {
        return res.status(400).json({ 
          message: "Each attendance record must have employeeId and date" 
        });
      }

      // Check if attendance already exists for this employee and date
      const existingAttendance = await EmployeeAttendance.findOne({
        where: {
          employeeId: attendance.employeeId,
          date: attendance.date
        }
      });

      if (existingAttendance) {
        return res.status(400).json({ 
          message: `Attendance already exists for employee ${attendance.employeeId} on ${attendance.date}` 
        });
      }
    }

    // Create all attendance records
    const createdAttendances = await EmployeeAttendance.bulkCreate(employeeAttendance);

    return res.status(201).json({
      message: "Employee attendance records created successfully!",
      data: createdAttendances,
      count: createdAttendances.length
    });
  } catch (error) {
    console.error("Error creating employee attendance:", error);
    next(error);
  }
};

// Get all employee attendance records with pagination and filtering
const getAllEmployeeAttendance = async (req, res, next) => {
  try {
    const { 
      page = 1,
      limit = 10,
      search,
      employeeId,
      date,
      startDate,
      endDate,
      status,
      sortBy = 'date',
      sortOrder = 'DESC'
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};
    
    if (employeeId) whereClause.employeeId = employeeId;
    if (date) whereClause.date = date;
    if (status) whereClause.status = status;
    
    // Date range filter
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: endDate
      };
    }

    // Search filter (you might want to join with employee table for name search)
    if (search) {
      whereClause[Op.or] = [
        { attendanceId: { [Op.like]: `%${search}%` } },
        { note: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const attendance = await EmployeeAttendance.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      message: "Employee attendance records retrieved successfully!",
      data: attendance.rows,
      meta: {
        totalItems: attendance.count,
        totalPages: Math.ceil(attendance.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving employee attendance:", error);
    next(error);
  }
};

// Get employee attendance by ID
const getEmployeeAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const attendance = await EmployeeAttendance.findOne({ where: { id } });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json({
      message: "Attendance record retrieved successfully!",
      data: attendance
    });
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    next(error);
  }
};

// Get attendance by employee ID
const getAttendanceByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { 
      page = 1, 
      limit = 10,
      startDate,
      endDate,
      month,
      year
    } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const whereClause = { employeeId };
    
    // Month and year filter
    if (month && year) {
      whereClause.date = {
        [Op.and]: [
          sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
          sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
        ]
      };
    }
    
    // Date range filter
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const attendance = await EmployeeAttendance.findAndCountAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      message: "Employee attendance records retrieved successfully!",
      data: attendance.rows,
      meta: {
        totalItems: attendance.count,
        totalPages: Math.ceil(attendance.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving employee attendance:", error);
    next(error);
  }
};

// Update employee attendance record
const updateEmployeeAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    // Find the attendance record
    const attendance = await EmployeeAttendance.findOne({ where: { id } });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Remove id and attendanceId from update data to prevent modification
    delete updateData.id;
    delete updateData.attendanceId;

    // Check if updating would create duplicate for same employee and date
    if (updateData.employeeId || updateData.date) {
      const existingAttendance = await EmployeeAttendance.findOne({
        where: {
          employeeId: updateData.employeeId || attendance.employeeId,
          date: updateData.date || attendance.date,
          id: { [Op.ne]: id }
        }
      });

      if (existingAttendance) {
        return res.status(400).json({ 
          message: "Attendance record already exists for this employee on the specified date" 
        });
      }
    }

    // Update the attendance record
    await attendance.update(updateData);

    return res.status(200).json({
      message: "Attendance record updated successfully!",
      data: attendance
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    next(error);
  }
};

// Delete employee attendance record
const deleteEmployeeAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const attendance = await EmployeeAttendance.findOne({ where: { id } });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await attendance.destroy();

    return res.status(200).json({
      message: "Attendance record deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    next(error);
  }
};

// Get attendance summary
const getAttendanceSummary = async (req, res, next) => {
  try {
    const { date, startDate, endDate, employeeId } = req.query;

    const whereClause = {};
    if (employeeId) whereClause.employeeId = employeeId;
    
    if (date) {
      whereClause.date = date;
    } else if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const summary = await EmployeeAttendance.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const totalRecords = await EmployeeAttendance.count({ where: whereClause });

    return res.status(200).json({
      message: "Attendance summary retrieved successfully!",
      data: {
        totalRecords,
        summary: summary
      }
    });
  } catch (error) {
    console.error("Error retrieving attendance summary:", error);
    next(error);
  }
};

module.exports = {
  createMultipleEmployeeAttendance,
  getAllEmployeeAttendance,
  getEmployeeAttendanceById,
  getAttendanceByEmployee,
  updateEmployeeAttendance,
  deleteEmployeeAttendance,
  getAttendanceSummary
};