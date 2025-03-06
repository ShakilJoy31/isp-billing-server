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
      phoneNo,
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
      phoneNo,
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

    console.log(user.password, password)

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






module.exports = { createClient, checkUserCredentials};
