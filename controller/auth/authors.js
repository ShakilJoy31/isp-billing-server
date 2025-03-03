const User = require("../../models/User");

module.exports = async (_req, res, next) => {
  try {
    const authors = await User.findAll({
      where: { author: "yes" },
    });
    res.json({
      authors
    });
  } catch (error) {
    next(error);
  }
};
