const express = require("express");
const { createPackage, getAllPackages } = require("../controller/package/package");

const router = express.Router();

router.post("/add-new-package", createPackage);
router.get("/get-packages", getAllPackages)


module.exports = packageRoutes = router;