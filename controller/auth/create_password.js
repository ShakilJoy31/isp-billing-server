const User = require("../../models/User");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  try {
    const id = req?.query?.id;
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");

    const { password } = req?.body;

    const hash = await bcrypt.hash(password, 9);

    user.password = hash;
    await user.save();

    res.cookie("message", "Successfully saved new password!");
    res.redirect("/change-password");
  } catch (error) {
    res.cookie("error", error?.message);
    res.redirect("/change-password");
  }
};
