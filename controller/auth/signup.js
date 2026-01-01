const { Op } = require("sequelize");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");
const generateUniqueUserId = require("../../utils/helper/generateUniqueId");
const Package = require("../../models/package/package.model");
const sequelize = require("../../database/connection");

//! Helper function to get package details
const getPackageDetails = async (packageId) => {
  try {
    const package = await Package.findOne({
      where: { id: packageId },
      attributes: [
        "id",
        "packageName",
        "packageBandwidth",
        "packagePrice",
        "packageDetails",
        "duration",
        "status",
      ],
    });
    return package ? package.toJSON() : null;
  } catch (error) {
    console.error("Error fetching package details:", error);
    return null;
  }
};

//! Helper function to transform client with package details
const transformClientWithPackage = async (client) => {
  const clientData = client.toJSON ? client.toJSON() : client;

  // Get package details
  const packageDetails = await getPackageDetails(clientData.package);

  if (packageDetails) {
    clientData.package = packageDetails.packageName; // Replace ID with name
    clientData.packageId = clientData.package; // Store original ID
    clientData.packageDetails = packageDetails; // Add full package details
  }

  return clientData;
};




//! Create new client
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
      customerId,
      jobType,
      mobileNo,
      email,
      customerType,
      package,
      location,
      area,
      flatAptNo,
      houseNo,
      isFreeClient,
      roadNo,
      landmark,
      connectionDetails,
      costForPackage,
      referId,
      photo,
      password,
      status,
      role,
      routerLoginId,
      routerLoginPassword,
    } = req.body;

    // Generate unique IDs
    const userId = await generateUniqueUserId(fullName);

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
      isFreeClient,
      houseNo,
      roadNo,
      landmark,
      connectionDetails: connectionDetails || null,
      costForPackage,
      referId: referId || null,
      role: role,
      status: status,
      password: password || mobileNo,
      // New fields
      routerLoginId: routerLoginId || null,
      routerLoginPassword: routerLoginPassword || null,
    });

    // Transform response with package details
    const clientData = await transformClientWithPackage(newClient);

    return res.status(201).json({
      message: "Client created successfully!",
      data: clientData,
    });
  } catch (error) {
    next(error);
  }
};

//! Get all clients with pagination and filtering
const getAllClients = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      customerType = "",
      location = "",
      package = "",
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
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    // Transform each client with package details
    const transformedClients = await Promise.all(
      clients.map((client) => transformClientWithPackage(client))
    );

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Clients retrieved successfully!",
      data: transformedClients,
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

//! Get client by ID
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

    // Transform response
    const clientData = await transformClientWithPackage(client);

    return res.status(200).json({
      message: "Client retrieved successfully!",
      data: clientData,
    });
  } catch (error) {
    next(error);
  }
};

//! Update client
const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      fatherOrSpouseName,
      dateOfBirth,
      customerId,
      age,
      sex,
      maritalStatus,
      nidOrPassportNo,
      jobPlaceName,
      jobCategory,
      jobType,
      isFreeClient,
      mobileNo,
      email,
      customerType,
      package, // This should be package ID
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails,
      costForPackage,
      referId,
      photo,
      status,
      password,
      // New fields
      routerLoginId,
      routerLoginPassword,
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
      const nidExists = await ClientInformation.findOne({
        where: { nidOrPassportNo },
      });
      if (nidExists) {
        return res.status(409).json({
          message: "This NID/Passport number already exists!",
        });
      }
    }

    // Check if new mobile already exists (if changed)
    if (mobileNo && mobileNo !== existingClient.mobileNo) {
      const mobileExists = await ClientInformation.findOne({
        where: { mobileNo },
      });
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
      isFreeClient,
      mobileNo,
      customerId,
      email,
      customerType,
      package, // Store the package ID
      location,
      area,
      flatAptNo,
      houseNo,
      roadNo,
      landmark,
      connectionDetails,
      costForPackage,
      referId,
      photo,
      status,
      // New fields
      routerLoginId: routerLoginId || existingClient.routerLoginId,
      routerLoginPassword: routerLoginPassword || existingClient.routerLoginPassword,
    };

    // Update password if provided
    if (password) {
      updateData.password = password;
    }

    await ClientInformation.update(updateData, {
      where: { id },
    });

    // Fetch updated client
    const updatedClient = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    // Transform response
    const clientData = await transformClientWithPackage(updatedClient);

    return res.status(200).json({
      message: "Client updated successfully!",
      data: clientData,
    });
  } catch (error) {
    next(error);
  }
};

//! Delete client
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

//! Get clients by refer ID
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
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    if (clients.length === 0) {
      return res.status(404).json({
        message: "No clients found with this refer ID",
      });
    }

    // Transform response
    const transformedClients = await Promise.all(
      clients.map((client) => transformClientWithPackage(client))
    );

    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Clients retrieved successfully!",
      data: transformedClients,
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

//! Update client status (approve/reject)
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

    // Fetch updated client
    const updatedClient = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    // Transform response
    const clientData = await transformClientWithPackage(updatedClient);

    return res.status(200).json({
      message: `Client ${status} successfully!`,
      data: clientData,
    });
  } catch (error) {
    next(error);
  }
};

//! Get client statistics
const getClientStats = async (req, res, next) => {
  try {
    const totalClients = await ClientInformation.count();
    const activeClients = await ClientInformation.count({
      where: { status: "active" },
    });
    const pendingClients = await ClientInformation.count({
      where: { status: "pending" },
    });
    const inactiveClients = await ClientInformation.count({
      where: { status: "inactive" },
    });

    // Count by customer type
    const customerTypes = await ClientInformation.findAll({
      attributes: [
        "customerType",
        [sequelize.fn("COUNT", sequelize.col("customerType")), "count"],
      ],
      group: ["customerType"],
    });

    // Count by package
    const packageCounts = await ClientInformation.findAll({
      attributes: [
        "package",
        [sequelize.fn("COUNT", sequelize.col("package")), "count"],
      ],
      group: ["package"],
      raw: true,
    });

    // Get package details for each package ID
    const packagesWithDetails = await Promise.all(
      packageCounts.map(async (pkg) => {
        const packageDetails = await Package.findOne({
          where: { id: pkg.package },
          attributes: ["packageName", "packageBandwidth", "packagePrice"],
        });

        return {
          packageId: pkg.package,
          packageName: packageDetails ? packageDetails.packageName : "Unknown",
          packageBandwidth: packageDetails
            ? packageDetails.packageBandwidth
            : null,
          packagePrice: packageDetails ? packageDetails.packagePrice : null,
          count: pkg.count,
        };
      })
    );

    // Count by location
    const locations = await ClientInformation.findAll({
      attributes: [
        "location",
        [sequelize.fn("COUNT", sequelize.col("location")), "count"],
      ],
      group: ["location"],
    });

    return res.status(200).json({
      message: "Client statistics retrieved successfully!",
      data: {
        totalClients,
        activeClients,
        pendingClients,
        inactiveClients,
        customerTypes,
        packages: packagesWithDetails,
        locations,
      },
    });
  } catch (error) {
    next(error);
  }
};





















































































//! Helper function to generate unique employee ID
const generateUniqueEmployeeId = async (fullName) => {
  try {
    // Extract first name (first word from full name)
    const firstName = fullName.trim().split(" ")[0].toLowerCase();
    
    // Generate a 4-digit random number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    let userId = `${firstName}${randomNum}@ringtel`;

    // Check if userId already exists
    let existingEmployee = await AuthorityInformation.findOne({
      where: { userId },
    });

    // If exists, generate new one with different random number
    let counter = 1;
    while (existingEmployee) {
      const newRandomNum = Math.floor(1000 + Math.random() * 9000);
      userId = `${firstName}${newRandomNum}@ringtel`;
      existingEmployee = await AuthorityInformation.findOne({
        where: { userId },
      });
      counter++;
      if (counter > 10) {
        // Fallback: use timestamp last 4 digits
        const timestamp = Date.now().toString().slice(-4);
        userId = `${firstName}${timestamp}@ringtel`;
        break;
      }
    }

    return userId;
  } catch (error) {
    console.error("Error generating employee ID:", error);
    // Fallback ID using timestamp
    const timestamp = Date.now().toString().slice(-6);
    return `employee${timestamp}@ringtel`;
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
      status = "active", // Default to active from frontend
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobileNo || !role || !dateOfBirth) {
      return res.status(400).json({
        message:
          "Full name, email, mobile number, role, and date of birth are required!",
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
      bloodGroup: bloodGroup || "",
      dateOfBirth,
      email,
      photo,
      fatherOrSpouseName,
      fullName,
      jobCategory: jobCategory || "",
      jobType: jobType || "Full Time",
      maritalStatus,
      mobileNo,
      nidOrPassportNo,
      religion: religion || "",
      role,
      sex,
      baseSalary: parseFloat(baseSalary) || 0.0,
      userId,
      password: mobileNo, // Default password is mobile number
      status: status || "active",
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
      search = "",
      role = "",
      status = "",
      jobType = "",
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
    const { count, rows: employees } =
      await AuthorityInformation.findAndCountAll({
        where: whereConditions,
        limit: limitNumber,
        offset: offset,
        order: [["createdAt", "DESC"]],
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
      where: { status: "active" },
    });

    // Get role breakdown
    const roleBreakdown = await AuthorityInformation.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["role"],
      raw: true,
    });

    // Get status breakdown
    const statusBreakdown = await AuthorityInformation.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Get job type breakdown
    const jobTypeBreakdown = await AuthorityInformation.findAll({
      attributes: [
        "jobType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["jobType"],
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
      where: { id },
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
      status,
      password,
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
      fatherOrSpouseName:
        fatherOrSpouseName || existingEmployee.fatherOrSpouseName,
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
      password: password || existingEmployee.password,
    };

    // Update the employee
    await AuthorityInformation.update(updateData, {
      where: { id },
    });

    // Fetch the updated employee data
    const updatedEmployee = await AuthorityInformation.findOne({
      where: { id },
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
    const validStatuses = ["active", "inactive", "pending"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status! Status must be one of: active, inactive, pending",
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
    await AuthorityInformation.update({ status }, { where: { id } });

    // Fetch the updated employee
    const updatedEmployee = await AuthorityInformation.findOne({
      where: { id },
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
    const { count, rows: employees } =
      await AuthorityInformation.findAndCountAll({
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






































































//! Check user credentials (login) - Simplified version
const checkUserCredentials = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    // Check if userId and password are provided
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "Both userId and password are required.",
      });
    }

    // Find the user by userId in ClientInformation table with password
    let user = await ClientInformation.findOne({
      where: { userId },
    });

    let userType = "client";

    // If user is not found in ClientInformation, search in AuthorityInformation
    if (!user) {
      user = await AuthorityInformation.findOne({
        where: { userId },
      });
      userType = "authority";

      // If user is not found in AuthorityInformation either
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please check your userId.",
        });
      }
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // Check user status - Only allow login if status is 'active'
    if (user.status.toLowerCase() !== "active") {
      let statusMessage = "";

      if (user.status.toLowerCase() === "pending") {
        statusMessage =
          "Your account is pending approval. You will be able to login once your account is approved by admin.";
      } else if (user.status.toLowerCase() === "inactive") {
        statusMessage =
          "Your account is currently inactive. Please contact support to reactivate your account.";
      } else {
        statusMessage = `Your account status is "${user.status}". Please contact support for assistance.`;
      }

      return res.status(403).json({
        success: false,
        message: statusMessage,
        accountInfo: {
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
          status: user.status,
          userType: userType,
        },
      });
    }

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Add package details for clients
    if (userType === "client" && userResponse.package) {
      const packageDetails = await Package.findOne({
        where: { id: userResponse.package },
        attributes: [
          "id",
          "packageName",
          "packageBandwidth",
          "packagePrice",
          "packageDetails",
          "duration",
          "status",
        ],
      });

      if (packageDetails) {
        userResponse.package = packageDetails.packageName; // Replace ID with name
        userResponse.packageDetails = packageDetails.toJSON(); // Add full package details
      }
    }

    // Add user type to response
    userResponse.userType = userType;

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: userResponse,
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
  // getPackageDataByClientId,

  checkUserCredentials,
};
