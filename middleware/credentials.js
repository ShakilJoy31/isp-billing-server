const allowedOrigins = require("../config/allowedOrigin");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, PATCH, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Accept"
    );
  }

  next();
};

module.exports = credentials;



// const allowedOrigins = require("../config/allowedOrigin");

// const credentials = (req, res, next) => {
//     const origin = req.headers.origin;

//     if (allowedOrigins.includes(origin)) {
//         console.log(origin)
//         res.setHeader("Access-Control-Allow-Credentials", "true");
//         res.setHeader("Access-Control-Allow-Origin", origin); // Use the request's origin
//         res.setHeader("Access-Control-Max-Age", "1800");
//         res.setHeader(
//             "Access-Control-Allow-Headers",
//             "Origin, X-Requested-With, Content-Type, Authorization, Accept"
//         );
//         res.setHeader(
//             "Access-Control-Allow-Methods",
//             "PUT, POST, GET, DELETE, PATCH, OPTIONS"
//         );
//         res.setHeader("Vary", "Origin"); // Ensure proper caching for multiple origins
//     }

//     if (req.method === "OPTIONS") {
//         return res.sendStatus(204); // Respond to preflight requests
//     }

//     next();
// };

// module.exports = credentials;
