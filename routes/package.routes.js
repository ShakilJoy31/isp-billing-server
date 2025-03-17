const express = require("express");
const { createPackage, getAllPackages, deletePackage, updatePackage } = require("../controller/package/package");

const router = express.Router();

router.post("/add-new-package", createPackage);
router.get("/get-packages", getAllPackages);
router.delete("/delete-package/:id", deletePackage);
router.put("/update-package/:id", updatePackage)



module.exports = packageRoutes = router;