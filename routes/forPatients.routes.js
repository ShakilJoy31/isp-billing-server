const express = require("express");
const { upsertAdmissionAndPaymentData, getAdmissionAndPaymentData, upsertBloodBank, getBloodBankData, upsertHealthTips, getHealthTipsData, upsertTestList, getTestListData, upsertVaccination, getVaccinationData } = require("../controller/for-patient/admissionAndPaymentController");

const router = express.Router();

// Admission and payment
router.post("/admission-and-payments", upsertAdmissionAndPaymentData);
router.get("/get-admission-and-payment", getAdmissionAndPaymentData); 


// Blood bank
router.post("/blood-bank", upsertBloodBank);
router.get("/get-blood-bank", getBloodBankData); 


// Health tips
router.post("/health-tips", upsertHealthTips);
router.get("/get-health-tips", getHealthTipsData);


router.post("/post-vaccination", upsertVaccination);
router.get("/get-vaccination", getVaccinationData);


// Test List
router.post("/test-list", upsertTestList);
router.get("/get-test-list", getTestListData);

module.exports = forPatientsRoutes = router;
