const User = require("../../models/User");

module.exports = async (req, res) => {
  const id = req.params?.id;

  try {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password", "refresh_token", "access_token"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
