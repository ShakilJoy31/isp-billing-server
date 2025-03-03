const User = require("../../models/User");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  try {
    const id = req?.query?.id;
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");
    if (user?.email === "admin@gmail.com") throw Error("You're not allow");

    const { old_password, new_password } = req?.body;
    const matched = await bcrypt.compare(old_password, user.password);
    if (!matched) throw Error("Invalid credentials!");

    const hash = await bcrypt.hash(new_password, 9);

    user.password = hash;
    await user.save();

    res.cookie("message", "Password successfully updated!");
    res.json({ message: "Password successfully updated!" });
    // res.redirect("/change-password");
  } catch (error) {
    res.cookie("error", error?.message);
    // res.redirect("/change-password");
    res.json({ error: error?.message });
  }
};
