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



const checkUserCredentials = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    // Check if userId and password are provided
    if (!userId || !password) {
      return res.status(400).json({
        message: "Both userId and password are required.",
      });
    }

    // Find the user by userId
    const user = await ClientInformation.findOne({ where: { userId } });

    // If user does not exist
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please check your userId.",
      });
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


module.exports = { createClient, checkUserCredentials, getClientsByReferCode};
