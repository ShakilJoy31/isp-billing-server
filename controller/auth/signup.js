const AuthorityInformation = require("../../models/Authentication/authority.model");
const ClientInformation = require("../../models/Authentication/client.model");

const generateUniqueUserId = async () => {
  let userId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 7-digit number
    userId = Math.floor(1000000 + Math.random() * 9000000);

    // Check if the userId already exists in the database
    const existingUser = await ClientInformation.findOne({ where: { userId } });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return userId;
};

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

    // Generate a unique 7-digit userId
    const userId = await generateUniqueUserId();

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
      status: 'pending',
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

    // Update the client's information
    await ClientInformation.update(
      {
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
      },
      {
        where: { id }, // Update the client with the specified ID
        returning: true, // Return the updated record
        plain: true,
      }
    );

    // Fetch the updated client data
    const updatedData = await ClientInformation.findOne({ where: { id } });

    return res.status(200).json({
      message: "Client information updated successfully!",
      data: updatedData,
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
    const existingEntry = await AuthorityInformation.findOne({ where: { email } });
    if (existingEntry) {
      return res.status(409).json({
        message: "This email already exists! Try different.",
      });
    }

    // Generate a unique 7-digit userId
    const userId = await generateUniqueUserId();

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
      status: 'pending',
    });

    return res.status(201).json({
      message: "Authority information created successfully!",
      data: newEntry,
    });
  } catch (error) {
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




const getAllAuthorities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch all authorities with pagination
    const { count, rows: authorities } = await AuthorityInformation.findAndCountAll({
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


module.exports = { createClient, createAuthority, checkUserCredentials, getClientsByReferCode, getAllClients, getAllAuthorities, updateClient, deleteClient};
