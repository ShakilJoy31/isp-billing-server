const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { roles } = require("../../config/roles");

module.exports = async (req, res, next) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password)
      return next("name, email & password is required!");

    const exist = await User.findOne({ where: { email } });
    if (exist) throw new Error("This email is already in use!");

    const hash = await bcrypt.hash(password, 9);

    const user = await User.create({
      ...req?.body,
      password: hash,
      role: role || roles.user,
    });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};
