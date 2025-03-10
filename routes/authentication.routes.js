const express = require("express");
const { createClient, checkUserCredentials, getClientsByReferCode } = require("../controller/auth/signup");
const router = express.Router();


router.post("/register-new-client", createClient);
router.post("/login", checkUserCredentials);
router.get("/get-refered-users-according-to-userId/:userId", getClientsByReferCode)


module.exports = authenticationRoutes = router;