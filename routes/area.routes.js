const express = require("express");
const { createPackage, getAllPackages, deletePackage, updatePackage } = require("../controller/package/package");
const { createArea, getAllAreas, deleteArea, updateArea, getCityNames } = require("../controller/area/area");
const { createZone, getAllZones, deleteZone, updateZone } = require("../controller/area/zone");

const router = express.Router();

// Add City
router.post("/add-new-area", createArea)
router.get("/get-areas", getAllAreas);
router.delete("/delete-area/:id", deleteArea);
router.put("/update-area/:id", updateArea)
router.get("/get-only-cities", getCityNames)


// Add Zone
router.post("/add-new-zone", createZone);
router.get("/get-zones", getAllZones);
router.delete("/delete-zone/:id", deleteZone);
router.put("/update-zone/:id", updateZone);


module.exports = areaRoutes = router;