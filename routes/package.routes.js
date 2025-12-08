const express = require("express");
const {
  createPackage,
  getAllPackages,
  getPackageStats,
  getPackageById,
  deletePackage,
  updatePackage,
  bulkUpdateStatus,
} = require("../controller/package/package");

const router = express.Router();

router.post("/add-new-package", createPackage);
router.get("/get-packages", getAllPackages);
router.get("/package-stats", getPackageStats);
router.get("/get-package/:id", getPackageById);
router.delete("/delete-package/:id", deletePackage);
router.put("/update-package/:id", updatePackage);
router.put("/bulk-update-status", bulkUpdateStatus);

module.exports = router;
