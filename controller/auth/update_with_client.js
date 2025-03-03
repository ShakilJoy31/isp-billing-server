const User = require("../../models/User");

module.exports = async (req, res, next) => {
  const id = req?.query?.id;
  try {
    await User.update(
      { ...req.body, picture: req.filelink },

      {
        where: { id },

      }
    );

    res.cookie("message", "Profile Data Updated!");
    res.redirect("/my-profile");
  } catch (error) {
    next(error);
  }
};
