const express = require("express");
const { createBenefit, getAllBenefits, getBenefitById, updateBenefit, deleteBenefit, getActiveBenefits, getBenefitStats, toggleBenefitStatus } = require("../controller/benefit/benefit.controller");
const router = express.Router();


// Benefit routes
router.post("/create-benefit", createBenefit);
router.get("/get-all-benefits", getAllBenefits);
router.get("/get-benefit/:id", getBenefitById);
router.put("/update-benefit/:id", updateBenefit);
router.delete("/delete-benefit/:id", deleteBenefit);
router.get("/active-benefits", getActiveBenefits);
router.get("/benefit-stats", getBenefitStats);
router.patch("/toggle-benefit-status/:id", toggleBenefitStatus);

module.exports = benefitRoutes = router;