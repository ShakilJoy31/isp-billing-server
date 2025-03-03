const jwt = require("jsonwebtoken");

exports.create_access_token = (object) =>
  jwt.sign(object, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "365d",
  });

exports.create_refresh_token = (object) =>
  jwt.sign(object, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "365d",
  });
