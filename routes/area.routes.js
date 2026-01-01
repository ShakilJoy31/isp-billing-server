const express = require("express");
const { createPackage, getAllPackages, deletePackage, updatePackage } = require("../controller/package/package.controller");
const { getCityNames, createCity, getAllCities, deleteCity, updateCity, getCityStats } = require("../controller/area/area");
const { createZone, getAllZones, deleteZone, updateZone, getZoneStats, getZoneById } = require("../controller/area/zone");
const { createJobCategory, getAllJobCategories, deleteJobCategory, updateJobCategory, getJobCategoryNames, getJobCategoryStats } = require("../controller/area/jobCategoryController");

const router = express.Router();

//! City

router.post("/add-new-city", createCity);
router.get("/get-cities", getAllCities);
router.delete("/delete-city/:id", deleteCity);
router.put("/update-city/:id", updateCity);
router.get("/get-city-names", getCityNames);
router.get("/stats", getCityStats);









//! Zone
router.post("/add-new-zone", createZone);
router.get("/get-zones", getAllZones);
router.get("/zone-stats", getZoneStats);
router.get("/get-zone/:id", getZoneById);
router.delete("/delete-zone/:id", deleteZone);
router.put("/update-zone/:id", updateZone);








//! Job Category
router.post("/add-new-job-category", createJobCategory);
router.get("/get-job-categories", getAllJobCategories);
router.delete("/delete-job-category/:id", deleteJobCategory);
router.put("/update-job-category/:id", updateJobCategory);
router.get("/get-job-category-names", getJobCategoryNames);
router.get("/job-stats", getJobCategoryStats);


module.exports = areaRoutes = router;