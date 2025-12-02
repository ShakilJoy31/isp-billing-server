const { Op } = require("sequelize");
const EmployeeAttendance = require("../../models/attendence/attendence.model");
const AuthorityInformation = require("../../models/Authentication/authority.model"); // Import authority model
const sequelize = require("../../database/connection");

// Create multiple employee attendance records
const createMultipleEmployeeAttendance = async (req, res, next) => {
  try {
    const { employeeAttendance } = req.body;

    if (
      !employeeAttendance ||
      !Array.isArray(employeeAttendance) ||
      employeeAttendance.length === 0
    ) {
      return res.status(400).json({
        message: "employeeAttendance array is required and cannot be empty",
      });
    }

    // Validate each attendance record
    for (const attendance of employeeAttendance) {
      if (!attendance.employeeId || !attendance.date) {
        return res.status(400).json({
          message: "Each attendance record must have employeeId and date",
        });
      }

      // Check if attendance already exists for this employee and date
      const existingAttendance = await EmployeeAttendance.findOne({
        where: {
          employeeId: attendance.employeeId,
          date: attendance.date,
        },
      });

      if (existingAttendance) {
        return res.status(400).json({
          message: `Attendance already exists for employee ${attendance.employeeId} on ${attendance.date}`,
        });
      }
    }

    // Create all attendance records
    const createdAttendances = await EmployeeAttendance.bulkCreate(
      employeeAttendance
    );

    return res.status(201).json({
      message: "Employee attendance records created successfully!",
      data: createdAttendances,
      count: createdAttendances.length,
    });
  } catch (error) {
    console.error("Error creating employee attendance:", error);
    next(error);
  }
};

// Get all employee attendance records with pagination and filtering (UPDATED)
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
      sortBy = "date",
      sortOrder = "DESC",
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};

    if (employeeId) whereClause.employeeId = employeeId;
    if (date) whereClause.date = date;
    if (status) whereClause.status = status;

    // Date range filter
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: endDate,
      };
    }

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { attendanceId: { [Op.like]: `%${search}%` } },
        { note: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get attendance with employee information
    const attendance = await EmployeeAttendance.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: AuthorityInformation,
          as: "employee", // Make sure your association is set up correctly
          attributes: ["id", "fullName", "mobileNo", "email", "userId"],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
    });

    return res.status(200).json({
      message: "Employee attendance records retrieved successfully!",
      data: attendance.rows,
      meta: {
        totalItems: attendance.count,
        totalPages: Math.ceil(attendance.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving employee attendance:", error);
    next(error);
  }
};

// Get employee attendance by ID (UPDATED)
const getEmployeeAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }

    const attendance = await EmployeeAttendance.findOne({
      where: { id },
      include: [
        {
          model: AuthorityInformation,
          as: "employee",
          attributes: ["id", "fullName", "mobileNo", "email", "userId"],
        },
      ],
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json({
      message: "Attendance record retrieved successfully!",
      data: attendance,
    });
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    next(error);
  }
};

// Get attendance by employee ID (UPDATED)
const getAttendanceByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10, startDate, endDate, month, year } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const whereClause = { employeeId };

    // Month and year filter
    if (month && year) {
      whereClause.date = {
        [Op.and]: [
          sequelize.where(sequelize.fn("MONTH", sequelize.col("date")), month),
          sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year),
        ],
      };
    }

    // Date range filter
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const attendance = await EmployeeAttendance.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: AuthorityInformation,
          as: "employee",
          attributes: ["id", "fullName", "mobileNo", "email", "userId"],
        },
      ],
      order: [["date", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    return res.status(200).json({
      message: "Employee attendance records retrieved successfully!",
      data: attendance.rows,
      meta: {
        totalItems: attendance.count,
        totalPages: Math.ceil(attendance.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
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
          id: { [Op.ne]: id },
        },
      });

      if (existingAttendance) {
        return res.status(400).json({
          message:
            "Attendance record already exists for this employee on the specified date",
        });
      }
    }

    // Update the attendance record
    await attendance.update(updateData);

    return res.status(200).json({
      message: "Attendance record updated successfully!",
      data: attendance,
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
      message: "Attendance record deleted successfully!",
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
        [Op.between]: [startDate, endDate],
      };
    }

    const summary = await EmployeeAttendance.findAll({
      where: whereClause,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    const totalRecords = await EmployeeAttendance.count({ where: whereClause });

    return res.status(200).json({
      message: "Attendance summary retrieved successfully!",
      data: {
        totalRecords,
        summary: summary,
      },
    });
  } catch (error) {
    console.error("Error retrieving attendance summary:", error);
    next(error);
  }
};

// Get employee attendance statistics by userId
const getEmployeeAttendanceStatistics = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Parse month and year from query parameters
    const currentMonth = month ? parseInt(month) : null;
    const currentYear = year ? parseInt(year) : null;

    if (!currentMonth || !currentYear) {
      return res.status(400).json({
        message: "Both month and year query parameters are required",
      });
    }

    // Validate month and year
    if (currentMonth < 1 || currentMonth > 12) {
      return res
        .status(400)
        .json({ message: "Month must be between 1 and 12" });
    }

    if (currentYear < 2000 || currentYear > 2100) {
      return res
        .status(400)
        .json({ message: "Year must be between 2000 and 2100" });
    }

    // Calculate the first and last day of the month
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0); // Last day of the month

    // Format dates to YYYY-MM-DD
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    // Calculate total working days in the month (excluding weekends - Saturday and Sunday)
    const getWorkingDaysInMonth = (year, month) => {
      let workingDays = 0;
      const daysInMonth = new Date(year, month, 0).getDate(); // Get last day of month

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day);
        const dayOfWeek = currentDate.getDay();
        // 0 = Sunday, 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          workingDays++;
        }
      }

      return workingDays;
    };

    const totalWorkingDays = getWorkingDaysInMonth(currentYear, currentMonth);

    // First, find the employee by userId
    const employee = await AuthorityInformation.findOne({
      where: { userId: userId },
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found with the provided user ID",
      });
    }

    // Get all attendance records for this employee for the month
    const attendanceRecords = await EmployeeAttendance.findAll({
      where: {
        employeeId: employee.id,
        date: {
          [Op.between]: [startDateStr, endDateStr],
        },
      },
      order: [["date", "ASC"]],
    });

    // Calculate statistics
    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let leaveDays = 0;

    attendanceRecords.forEach((record) => {
      switch (record.status) {
        case "Present":
          presentDays++;
          break;
        case "Absent":
          absentDays++;
          break;
        case "Leave":
          leaveDays++;
          break;
        case "Half Day":
          halfDays++;
          presentDays += 0.5;
          break;
      }
    });

    // Get employee leave policy (you might have a separate model for this)
    // For now, using default values
    const maxPaidLeavesPerMonth = 2; // Maximum paid leaves allowed per month
    const unpaidLeaves =
      leaveDays > maxPaidLeavesPerMonth ? leaveDays - maxPaidLeavesPerMonth : 0;
    const paidLeaves =
      leaveDays > maxPaidLeavesPerMonth ? maxPaidLeavesPerMonth : leaveDays;

    // Calculate attendance percentage
    const attendancePercentage =
      totalWorkingDays > 0
        ? (
            ((presentDays + halfDays * 0.5 + paidLeaves) / totalWorkingDays) *
            100
          ).toFixed(2)
        : 0;

    return res.status(200).json({
      message: "Employee attendance statistics retrieved successfully!",
      data: {
        employeeId: employee.id,
        userId: employee.userId,
        fullName: employee.fullName,
        email: employee.email,
        mobileNo: employee.mobileNo,
        period: {
          startDate: startDateStr,
          endDate: endDateStr,
          month: currentMonth,
          year: currentYear,
          monthName: startDate.toLocaleString("default", { month: "long" }),
        },
        statistics: {
          totalWorkingDays,
          presentDays: presentDays.toFixed(1),
          halfDays,
          absentDays,
          leaveDays,
          paidLeaves,
          unpaidLeaves,
          attendancePercentage: `${attendancePercentage}%`,
          totalRecords: attendanceRecords.length,
        },
        breakdown: {
          totalDaysInMonth: new Date(currentYear, currentMonth, 0).getDate(),
          weekends:
            totalWorkingDays - new Date(currentYear, currentMonth, 0).getDate(),
          holidays: 0, // You might want to add holiday calculation
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving attendance statistics:", error);
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
  getAttendanceSummary,
  getEmployeeAttendanceStatistics,
};
