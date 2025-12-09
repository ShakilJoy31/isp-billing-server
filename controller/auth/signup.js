const { Op } = require("sequelize");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");
const generateUniqueUserId = require("../../utils/helper/generateUniqueId");

// Create new client
const createClient = async (req, res, next) => {
  try {
    const {
      fullName,
      fatherOrSpouseName,
      dateOfBirth,
      age,
      sex,
      maritalStatus,
      nidOrPassportNo,
      jobPlaceName,
      jobCategory,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails,
      referId,
      photo,
      password,
    } = req.body;

    // Generate unique IDs
    const customerId = await generateUniqueUserId(fullName);
    const userId = customerId;

    // Create new client
    const newClient = await ClientInformation.create({
      customerId,
      userId,
      fullName,
      photo: photo || null,
      fatherOrSpouseName,
      dateOfBirth: dateOfBirth || null,
      age: parseInt(age),
      sex,
      maritalStatus,
      nidOrPassportNo,
      jobPlaceName: jobPlaceName || null,
      jobCategory: jobCategory || null,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails: connectionDetails || null,
      referId: referId || null,
      role: "client",
      status: "pending",
      password: password || mobileNo,
    });

    return res.status(201).json({
      message: "Client created successfully!",
      data: newClient,
    });
  } catch (error) {
    next(error);
  }
};

// Update client
const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      fatherOrSpouseName,
      dateOfBirth,
      age,
      sex,
      maritalStatus,
      nidOrPassportNo,
      jobPlaceName,
      jobCategory,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails,
      referId,
      photo,
      status,
      password,
    } = req.body;

    // Check if client exists
    const existingClient = await ClientInformation.findOne({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Check if new email already exists (if changed)
    if (email && email !== existingClient.email) {
      const emailExists = await ClientInformation.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          message: "This email already exists!",
        });
      }
    }

    // Check if new NID already exists (if changed)
    if (nidOrPassportNo && nidOrPassportNo !== existingClient.nidOrPassportNo) {
      const nidExists = await ClientInformation.findOne({ where: { nidOrPassportNo } });
      if (nidExists) {
        return res.status(409).json({
          message: "This NID/Passport number already exists!",
        });
      }
    }

    // Check if new mobile already exists (if changed)
    if (mobileNo && mobileNo !== existingClient.mobileNo) {
      const mobileExists = await ClientInformation.findOne({ where: { mobileNo } });
      if (mobileExists) {
        return res.status(409).json({
          message: "This mobile number already exists!",
        });
      }
    }

    // Update client data
    const updateData = {
      fullName,
      fatherOrSpouseName,
      dateOfBirth,
      age: parseInt(age),
      sex,
      maritalStatus,
      nidOrPassportNo,
      jobPlaceName,
      jobCategory,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails,
      referId,
      photo,
      status,
    };

    // Update password if provided
    if (password) {
      updateData.password = password;
    }

    await ClientInformation.update(updateData, {
      where: { id },
    });

    const updatedClient = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      message: "Client updated successfully!",
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

// Get client by ID
const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    return res.status(200).json({
      message: "Client retrieved successfully!",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// Delete client
const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingClient = await ClientInformation.findOne({ where: { id } });

    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    await ClientInformation.destroy({ where: { id } });

    return res.status(200).json({
      message: "Client deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// Get all clients with pagination and filtering
const getAllClients = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search = "",
      status = "",
      customerType = "",
      location = "",
      package = ""
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { customerId: { [Op.like]: `%${search}%` } },
        { userId: { [Op.like]: `%${search}%` } },
        { mobileNo: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    
    if (status) whereClause.status = status;
    if (customerType) whereClause.customerType = customerType;
    if (location) whereClause.location = location;
    if (package) whereClause.package = package;

    const { count, rows: clients } = await ClientInformation.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset: offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ["password"] },
    });

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Clients retrieved successfully!",
      data: clients,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get clients by refer ID
const getClientsByReferCode = async (req, res, next) => {
  try {
    const { referId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows: clients } = await ClientInformation.findAndCountAll({
      where: { referId },
      limit: limitNumber,
      offset: offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ["password"] },
    });

    if (clients.length === 0) {
      return res.status(404).json({
        message: "No clients found with this refer ID",
      });
    }

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Clients retrieved successfully!",
      data: clients,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get client statistics
const getClientStats = async (req, res, next) => {
  try {
    const totalClients = await ClientInformation.count();
    const activeClients = await ClientInformation.count({ where: { status: 'active' } });
    const pendingClients = await ClientInformation.count({ where: { status: 'pending' } });
    const inactiveClients = await ClientInformation.count({ where: { status: 'inactive' } });

    // Count by customer type
    const customerTypes = await ClientInformation.findAll({
      attributes: [
        'customerType',
        [sequelize.fn('COUNT', sequelize.col('customerType')), 'count']
      ],
      group: ['customerType']
    });

    // Count by package
    const packages = await ClientInformation.findAll({
      attributes: [
        'package',
        [sequelize.fn('COUNT', sequelize.col('package')), 'count']
      ],
      group: ['package']
    });

    // Count by location
    const locations = await ClientInformation.findAll({
      attributes: [
        'location',
        [sequelize.fn('COUNT', sequelize.col('location')), 'count']
      ],
      group: ['location']
    });

    return res.status(200).json({
      message: "Client statistics retrieved successfully!",
      data: {
        totalClients,
        activeClients,
        pendingClients,
        inactiveClients,
        customerTypes,
        packages,
        locations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update client status (approve/reject)
const updateClientStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const client = await ClientInformation.findOne({ where: { id } });
    if (!client) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    await ClientInformation.update({ status }, { where: { id } });

    const updatedClient = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      message: `Client ${status} successfully!`,
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};




















//! Helper function to generate unique employee ID
const generateUniqueEmployeeId = async (fullName) => {
  try {
    // Extract initials from full name
    const initials = fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('');

    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    let userId = `${initials}${randomNum}`;

    // Check if userId already exists
    let existingEmployee = await AuthorityInformation.findOne({
      where: { userId }
    });

    // If exists, generate new one
    let counter = 1;
    while (existingEmployee) {
      const newRandomNum = Math.floor(1000 + Math.random() * 9000);
      userId = `${initials}${newRandomNum}`;
      existingEmployee = await AuthorityInformation.findOne({
        where: { userId }
      });
      counter++;
      if (counter > 10) {
        // Fallback: use timestamp
        userId = `${initials}${Date.now().toString().slice(-4)}`;
        break;
      }
    }

    return userId;
  } catch (error) {
    console.error("Error generating employee ID:", error);
    // Fallback ID
    return `EMP${Date.now().toString().slice(-6)}`;
  }
};

//! Create Authority/Employee
const createAuthority = async (req, res, next) => {
  try {
    const {
      address,
      age,
      bloodGroup,
      dateOfBirth,
      email,
      photo,
      fatherOrSpouseName,
      fullName,
      jobCategory,
      jobType,
      maritalStatus,
      mobileNo,
      nidOrPassportNo,
      religion,
      role,
      sex,
      baseSalary,
      status = 'active' // Default to active from frontend
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobileNo || !role || !dateOfBirth) {
      return res.status(400).json({
        message: "Full name, email, mobile number, role, and date of birth are required!",
      });
    }

    // Check if the email already exists
    const existingEntry = await AuthorityInformation.findOne({
      where: { email },
    });
    if (existingEntry) {
      return res.status(409).json({
        message: "This email already exists! Try different.",
      });
    }

    // Generate a unique userId
    const userId = await generateUniqueEmployeeId(fullName);

    // Create a new employee
    const newEntry = await AuthorityInformation.create({
      address,
      age: parseInt(age) || 0,
      bloodGroup: bloodGroup || '',
      dateOfBirth,
      email,
      photo,
      fatherOrSpouseName,
      fullName,
      jobCategory: jobCategory || '',
      jobType: jobType || 'Full Time',
      maritalStatus,
      mobileNo,
      nidOrPassportNo,
      religion: religion || '',
      role,
      sex,
      baseSalary: parseFloat(baseSalary) || 0.00,
      userId,
      password: mobileNo, // Default password is mobile number
      status: status || 'active',
    });

    return res.status(201).json({
      message: "Employee created successfully!",
      data: newEntry,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//! Get All Employees with Filters
const getAllAuthorities = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search = '',
      role = '',
      status = '',
      jobType = ''
    } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions for filters
    const whereConditions = {};
    
    // Search filter
    if (search) {
      whereConditions[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobileNo: { [Op.like]: `%${search}%` } },
        { userId: { [Op.like]: `%${search}%` } },
      ];
    }
    
    // Role filter
    if (role) {
      whereConditions.role = role;
    }
    
    // Status filter
    if (status) {
      whereConditions.status = status;
    }
    
    // Job Type filter
    if (jobType) {
      whereConditions.jobType = jobType;
    }

    // Fetch all employees with pagination and filters
    const { count, rows: employees } = await AuthorityInformation.findAndCountAll({
      where: whereConditions,
      limit: limitNumber,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Employees retrieved successfully!",
      data: employees,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

//! Get Employee Statistics
const getEmployeeStats = async (req, res, next) => {
  try {
    // Get total employees count
    const totalEmployees = await AuthorityInformation.count();
    
    // Get active employees count
    const activeEmployees = await AuthorityInformation.count({
      where: { status: 'active' }
    });
    
    // Get role breakdown
    const roleBreakdown = await AuthorityInformation.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true,
    });
    
    // Get status breakdown
    const statusBreakdown = await AuthorityInformation.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true,
    });
    
    // Get job type breakdown
    const jobTypeBreakdown = await AuthorityInformation.findAll({
      attributes: [
        'jobType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['jobType'],
      raw: true,
    });

    return res.status(200).json({
      message: "Employee statistics retrieved successfully!",
      data: {
        totalEmployees,
        activeEmployees,
        roleBreakdown,
        statusBreakdown,
        jobTypeBreakdown,
      },
    });
  } catch (error) {
    console.error("Error getting employee stats:", error);
    next(error);
  }
};

//! Get Employee by ID
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the employee exists
    const employee = await AuthorityInformation.findOne({ 
      where: { id } 
    });
    
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    return res.status(200).json({
      message: "Employee data retrieved successfully!",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

//! Update Employee
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      address,
      age,
      bloodGroup,
      dateOfBirth,
      email,
      photo,
      fatherOrSpouseName,
      fullName,
      jobCategory,
      jobType,
      maritalStatus,
      mobileNo,
      nidOrPassportNo,
      religion,
      role,
      sex,
      baseSalary,
      status
    } = req.body;

    // Check if the employee exists
    const existingEmployee = await AuthorityInformation.findOne({
      where: { id },
    });
    
    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Check if the new email already exists (if email is being updated)
    if (email && email !== existingEmployee.email) {
      const emailExists = await AuthorityInformation.findOne({
        where: { email },
      });
      if (emailExists) {
        return res.status(409).json({
          message: "This email already exists! Try a different one.",
        });
      }
    }

    // Prepare update data
    const updateData = {
      address: address || existingEmployee.address,
      age: parseInt(age) || existingEmployee.age,
      bloodGroup: bloodGroup || existingEmployee.bloodGroup,
      dateOfBirth: dateOfBirth || existingEmployee.dateOfBirth,
      email: email || existingEmployee.email,
      fatherOrSpouseName: fatherOrSpouseName || existingEmployee.fatherOrSpouseName,
      fullName: fullName || existingEmployee.fullName,
      jobCategory: jobCategory || existingEmployee.jobCategory,
      jobType: jobType || existingEmployee.jobType,
      maritalStatus: maritalStatus || existingEmployee.maritalStatus,
      mobileNo: mobileNo || existingEmployee.mobileNo,
      nidOrPassportNo: nidOrPassportNo || existingEmployee.nidOrPassportNo,
      religion: religion || existingEmployee.religion,
      role: role || existingEmployee.role,
      sex: sex || existingEmployee.sex,
      baseSalary: parseFloat(baseSalary) || existingEmployee.baseSalary,
      status: status || existingEmployee.status,
      photo: photo || existingEmployee.photo,
    };

    // Update the employee
    await AuthorityInformation.update(updateData, {
      where: { id },
    });

    // Fetch the updated employee data
    const updatedEmployee = await AuthorityInformation.findOne({ 
      where: { id } 
    });

    return res.status(200).json({
      message: "Employee information updated successfully!",
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

//! Toggle Employee Status
const toggleEmployeeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status! Status must be one of: active, inactive, pending",
      });
    }

    // Check if the employee exists
    const employee = await AuthorityInformation.findOne({
      where: { id },
    });
    
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Update the status
    await AuthorityInformation.update(
      { status },
      { where: { id } }
    );

    // Fetch the updated employee
    const updatedEmployee = await AuthorityInformation.findOne({ 
      where: { id } 
    });

    return res.status(200).json({
      message: `Employee status updated to ${status} successfully!`,
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

//! Delete Employee
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the employee exists
    const existingEmployee = await AuthorityInformation.findOne({
      where: { id },
    });
    
    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Delete the employee
    await AuthorityInformation.destroy({
      where: { id },
    });

    return res.status(200).json({
      message: "Employee deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

//! Search Employees Advanced
const searchEmployeeAdvanced = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    // Check if search query is provided
    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Please provide a search query.",
      });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;
    const searchQuery = query.trim();

    // Search conditions
    const searchConditions = {
      [Op.or]: [
        { fullName: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
        { mobileNo: { [Op.like]: `%${searchQuery}%` } },
        { userId: { [Op.like]: `%${searchQuery}%` } },
        { nidOrPassportNo: { [Op.like]: `%${searchQuery}%` } },
        { role: { [Op.like]: `%${searchQuery}%` } },
      ],
    };

    // Search for employees
    const { count, rows: employees } = await AuthorityInformation.findAndCountAll({
      where: searchConditions,
      limit: limitNumber,
      offset: offset,
      order: [["fullName", "ASC"]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Employees retrieved successfully!",
      data: employees,
      searchQuery: searchQuery,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Advanced search error:", error);
    next(error);
  }
};

//! Get Employee by User ID
const getEmployeeByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        message: "Please provide a userId.",
      });
    }

    const employee = await AuthorityInformation.findOne({
      where: { userId: userId.trim() },
    });

    if (!employee) {
      return res.status(404).json({
        message: `Employee with userId "${userId}" not found!`,
      });
    }

    return res.status(200).json({
      message: "Employee data retrieved successfully!",
      data: employee,
    });
  } catch (error) {
    console.error("Get by userId error:", error);
    next(error);
  }
};























const checkUserCredentials = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    // Check if userId and password are provided
    if (!userId || !password) {
      return res.status(400).json({
        message: "Both userId and password are required.",
      });
    }

    // Find the user by userId in ClientInformation table
    let user = await ClientInformation.findOne({ where: { userId } });

    // If user is not found in ClientInformation, search in AuthorityInformation
    if (!user) {
      user = await AuthorityInformation.findOne({ where: { userId } });

      // If user is not found in AuthorityInformation either
      if (!user) {
        return res.status(404).json({
          message: "User not found. Please check your userId.",
        });
      }
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    // If everything is correct, return success
    return res.status(200).json({
      message: "Login successful!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};




module.exports = {
  createAuthority,
  deleteEmployee,
  updateEmployee,
  getEmployeeById,
  toggleEmployeeStatus,
  getEmployeeByUserId,
  searchEmployeeAdvanced,
  getAllAuthorities,


  getClientById,
  createClient,
  getClientStats,
  getClientsByReferCode,
  getAllClients,
  updateClientStatus,
  updateClient,
  deleteClient,


  checkUserCredentials,

};
