const User = require("../../models/User");
const modelFiltering = require('../../utils/databases/modelFiltering')
module.exports = async (req, res, next) => {
  try {
    const { conditions, limit, page } = modelFiltering.filter(req);

    const users = await User.findAndCountAll({
      ...conditions,
    });
    res.json({
      totalPages: Math.ceil(users.count / limit),
      totalItems: users.count,
      currentPage: page,
      users: users.rows,
      limit,
    });
  } catch (error) {
    next(error);
  }
};
