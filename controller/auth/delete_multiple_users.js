const User = require("../../models/User");

module.exports = async (req, res, next) => {
  const ids = req.body.ids || [];

  try {
    if (ids?.length < 1) return next("Not found!.");

    await User.destroy({
      where: {
        id: ids,
      },
    });

    res.status(200).json({ message: "Users deleted!" });
  } catch (error) {
    next(error);
  }
};
