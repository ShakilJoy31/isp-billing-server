const AuthorityUser = require("../../models/authorityUser");
const User = require("../../models/User");

const createUser = async (req, res, next) => {
  try {
    const {
      dateOfBirth,
      district,
      email,
      gender,
      houseNo,
      mobileNumber,
      name,
      password,
      thana,
      role,
    } = req.body;

    // Check if the user already exists based on email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // Create a new user entry
    const newUser = await User.create({
      dateOfBirth,
      district,
      email,
      gender,
      houseNo,
      mobileNumber,
      name,
      password, // Ideally, hash the password before saving
      thana,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const createAuthorityUser = async (req, res, next) => {
  try {
    const {
      dateOfBirth,
      email,
      image,
      gender,
      mobileNumber,
      name,
      password,
      role,
      doctorId,
    } = req.body;

    // Check if the user already exists based on email
    const existingUser = await AuthorityUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists!",
      });
    }

    // Validation: Ensure doctorId is provided if the role is doctor
    if (role === "doctor" && !doctorId) {
      return res.status(400).json({
        message: "Doctor ID is required for doctor or doctor assistant role",
      });
    }

    // Create a new user entry
    const newUser = await AuthorityUser.create({
      dateOfBirth,
      email,
      image,
      gender,
      mobileNumber,
      name,
      password,
      role,
      doctorId: (role === "doctor" || role === 'doctor-assistant') ? doctorId : null,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};



const updateAuthorityUserAccount = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the current user data
    const currentUser = await AuthorityUser.findOne({ where: { id } });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user data
    await AuthorityUser.update(
      { ...req.body, picture: req.filelink }, // Merge request body and filelink
      {
        where: { id },
      }
    );

    // Fetch the updated user data from AuthorityUser
    const updatedUser = await AuthorityUser.findOne({ where: { id } });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { createUser, createAuthorityUser, updateAuthorityUserAccount };
