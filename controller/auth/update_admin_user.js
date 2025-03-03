const User = require("../../models/User");

module.exports = async (req, res, next) => {
  try {
    const id = req?.params?.id;

    await User.update(
      { ...req.body },
      {
        where: { id },
      }
    );

    const user = await User.findOne({ where: { id } });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
