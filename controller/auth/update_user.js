const User = require("../../models/User");

const updateUserAccount = async (req, res, next) => {
  try {
    const id = req.params.id;

    console.log(id);
    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the current user data
    const currentUser = await User.findOne({ where: { id } });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user data
    await User.update(
      { ...req.body, picture: req.filelink }, // Merge request body and filelink
      {
        where: { id },
      }
    );

    // Fetch the updated user data
    const user = await User.findOne({ where: { id } });
    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUserAccount };
