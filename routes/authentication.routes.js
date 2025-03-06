const express = require("express");
const { createClient, checkUserCredentials } = require("../controller/auth/signup");
const router = express.Router();


router.post("/register-new-client", createClient);
router.post("/login", checkUserCredentials);


module.exports = authenticationRoutes = router;