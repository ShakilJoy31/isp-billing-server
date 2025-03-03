const UserInformation = require("../../models/UserInformation");

const uploadUserInformation = async (req, res, next) => {
  try {
    const {
      name,
      profession,
      wordDescription,
      slidingDescription,
      availableFor,
      biography,
      socialMedia,
      profilePicture,
      address,
      officeAddress,
      contactNo,
      businessEmail
    } = req.body;

    let user = await UserInformation.findByPk(1);
    if (user) {
      // If the user exists, update the document with the new information
      user = await user.update({
        name,
        profession,
        wordDescription,
        slidingDescription,
        slidingDescription,
        availableFor,
        biography,
        socialMedia,
        profilePicture,
        address,
        officeAddress,
        contactNo,
        businessEmail
      });

      return res.status(200).json({
        message: "User information updated successfully",
        user,
      });
    } else {
      // If the user does not exist, create the first record
      const newUser = await UserInformation.create({
        name,
        profession,
        wordDescription,
        slidingDescription,
        availableFor,
        biography,
        socialMedia,
        profilePicture,
        address,
        officeAddress,
        contactNo,
        businessEmail
      });

      return res.status(201).json({
        message: "User information uploaded successfully",
        user: newUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getUserInformation = async (req, res, next) => {
  try {
    const user = await UserInformation.findByPk(1);
    if (user) {
      // Parse socialMedia string into an object
      if (user.socialMedia) {
        user.socialMedia = JSON.parse(user.socialMedia);
      }

      return res.status(200).json({
        message: "User information fetched successfully",
        user,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

  

module.exports = { uploadUserInformation, getUserInformation };
