const { Op } = require("sequelize");
const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");
const generateUniqueUserId = require("../../utils/helper/generateUniqueId");

const createClient = async (req, res, next) => {
  try {
    const {
      package,
      location,
      flatAptNo,
      houseNo,
      roadNo,
      area,
      email,
      role,
      fullName,
      landmark,
      mobileNo,
      nidNo,
      referCode,
    } = req.body;

    // Check if the entry already exists based on email
    const existingEntry = await ClientInformation.findOne({ where: { email } });
    if (existingEntry) {
      return res.status(409).json({
        message: "This email already exists! Try different.",
      });
    }

    // Generate a unique userId based on the full name
    const userId = await generateUniqueUserId(fullName);

    // Create a new entry
    const newEntry = await ClientInformation.create({
      package,
      location,
      flatAptNo,
      houseNo,
      roadNo,
      area,
      email,
      role,
      userId,
      fullName,
      landmark,
      mobileNo,
      password: mobileNo,
      status: "pending",
      nidNo,
      referCode,
    });

    return res.status(201).json({
      message: "Client information created successfully!",
      data: newEntry,
    });
  } catch (error) {
    next(error);
  }
};

// Update client to approve or reject.
const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the client ID from the request parameters
    const {
      package,
      location,
      flatAptNo,
      houseNo,
      roadNo,
      area,
      email,
      role,
      fullName,
      landmark,
      mobileNo,
      nidNo,
      status,
      referCode,
      password, // Add password to destructuring
      currentPassword, // Optional: if you want to verify current password
    } = req.body; // Get updated data from the request body

    // Check if the client exists
    const existingClient = await ClientInformation.findOne({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Check if the new email already exists (if email is being updated)
    if (email && email !== existingClient.email) {
      const emailExists = await ClientInformation.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          message: "This email already exists! Try a different one.",
        });
      }
    }

    // Prepare update data
    const updateData = {
      package,
      location,
      flatAptNo,
      houseNo,
      roadNo,
      area,
      email,
      role,
      fullName,
      landmark,
      mobileNo,
      nidNo,
      status,
      referCode,
    };

    // Handle password update if provided
    if (password) {
      if (currentPassword === existingClient.password) {
        updateData.password = password;
      } else {
        return res.status(200).json({
          message: "Password update failed! Current password is incorrect."
        });
      }
    }

    // Update the client's information
    await ClientInformation.update(updateData, {
      where: { id }, // Update the client with the specified ID
      returning: true, // Return the updated record
      plain: true,
    });

    // Fetch the updated client data
    const updatedData = await ClientInformation.findOne({
      where: { id },
      attributes: { exclude: ["password"] }, // Exclude password from response for security
    });

    return res.status(200).json({
      message: "Client information updated successfully!",
      data: updatedData,
    });
  } catch (error) {
    next(error);
  }
};

// Get specific client according to id
const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the client ID from the request parameters

    // Check if the client exists
    const client = await ClientInformation.findOne({ where: { id } });
    if (!client) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Return the client data
    return res.status(200).json({
      message: "Client data retrieved successfully!",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// Deleet client according to id....
const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the client ID from the request parameters

    // Check if the client exists
    const existingClient = await ClientInformation.findOne({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Delete the client
    await ClientInformation.destroy({
      where: { id }, // Delete the client with the specified ID
    });

    return res.status(200).json({
      message: "Client deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};








//! The Authority
const createAuthority = async (req, res, next) => {
  try {
    const {
      address,
      age,
      bloodGroup,
      dateOfBirth,
      email,
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
    } = req.body;

    // Check if the entry already exists based on email
    const existingEntry = await AuthorityInformation.findOne({
      where: { email },
    });
    if (existingEntry) {
      return res.status(409).json({
        message: "This email already exists! Try different.",
      });
    }

    // Generate a unique 7-digit userId
    const userId = await generateUniqueEmployeeId(fullName);

    // Create a new entry
    const newEntry = await AuthorityInformation.create({
      address,
      age,
      bloodGroup,
      dateOfBirth,
      email,
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
      userId,
      password: mobileNo,
      status: "pending",
    });

    return res.status(201).json({
      message: "Authority information created successfully!",
      data: newEntry,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllAuthorities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch all authorities with pagination
    const { count, rows: authorities } =
      await AuthorityInformation.findAndCountAll({
        limit: limitNumber,
        offset: offset,
      });

    // If no authorities are found
    if (authorities.length === 0) {
      return res.status(404).json({
        message: "No authorities found.",
      });
    }

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber);

    return res.status(200).json({
      message: "Authorities retrieved successfully!",
      data: authorities,
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

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the client ID from the request parameters

    // Check if the client exists
    const client = await AuthorityInformation.findOne({ where: { id } });
    if (!client) {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }

    // Return the client data
    return res.status(200).json({
      message: "Employee data retrieved successfully!",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the employee ID from the request parameters
    const {
      address,
      age,
      bloodGroup,
      dateOfBirth,
      email,
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
      userId,
      password,
      status,
    } = req.body; // Get updated data from the request body

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

    // Check if the new userId already exists (if userId is being updated)
    if (userId && userId !== existingEmployee.userId) {
      const userIdExists = await AuthorityInformation.findOne({
        where: { userId },
      });
      if (userIdExists) {
        return res.status(409).json({
          message: "This user ID already exists! Try a different one.",
        });
      }
    }

    // Update the employee's information
    await AuthorityInformation.update(
      {
        address,
        age,
        bloodGroup,
        dateOfBirth,
        email,
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
        userId,
        password,
        status,
      },
      {
        where: { id }, // Update the employee with the specified ID
        returning: true, // Return the updated record
        plain: true,
      }
    );

    // Fetch the updated employee data
    const updatedData = await AuthorityInformation.findOne({ where: { id } });

    return res.status(200).json({
      message: "Employee information updated successfully!",
      data: updatedData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the client ID from the request parameters

    // Check if the client exists
    const existingClient = await AuthorityInformation.findOne({
      where: { id },
    });
    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found!",
      });
    }

    // Delete the client
    await AuthorityInformation.destroy({
      where: { id }, // Delete the client with the specified ID
    });

    return res.status(200).json({
      message: "Client deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from request parameters

    // Check if userId is provided
    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        message: "Please provide a userId.",
      });
    }

    // Find employee by userId
    const employee = await AuthorityInformation.findOne({
      where: { userId: userId.trim() },
    });

    // If no employee found
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

    // For MySQL/MariaDB with hyphenated table names, use Op.like directly
    // This is simpler and avoids the sequelize.col() issues
    const searchConditions = {
      [Op.or]: [
        { fullName: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
        { mobileNo: { [Op.like]: `%${searchQuery}%` } },
        { userId: { [Op.like]: `%${searchQuery}%` } },
        { nidOrPassportNo: { [Op.like]: `%${searchQuery}%` } },
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

    // If no employees found
    if (employees.length === 0) {
      return res.status(404).json({
        message: `No employees found matching "${searchQuery}".`,
      });
    }

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

const getClientsByReferCode = async (req, res, next) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Find all clients where referCode matches the provided userId with pagination
    const { count, rows: clients } = await ClientInformation.findAndCountAll({
      where: { referCode: userId },
      limit: limitNumber,
      offset: offset,
    });

    if (clients.length === 0) {
      return res.status(404).json({
        message: "No clients found with the provided referCode.",
      });
    }

    // Calculate total pages
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

// Getting users, client and authority
const getAllClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch all clients with pagination
    const { count, rows: clients } = await ClientInformation.findAndCountAll({
      limit: limitNumber,
      offset: offset,
    });

    // If no clients are found
    if (clients.length === 0) {
      return res.status(404).json({
        message: "No clients found.",
      });
    }

    // Calculate total pages
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

module.exports = {
  deleteEmployee,
  updateEmployee,
  getEmployeeById,
  getEmployeeByUserId,
  searchEmployeeAdvanced,
  getClientById,
  createClient,
  createAuthority,
  checkUserCredentials,
  getClientsByReferCode,
  getAllClients,
  getAllAuthorities,
  updateClient,
  deleteClient,
};
