const express = require("express");
const { createDoctorInformation, getDoctorInformation, updateDoctorInformation, deleteDoctorInformation, getDoctorInformationById, getDoctorsBySpeciality, getUniqueSpecialties, uploadSpecialityWithContent, getSpecialityInformation, getContentAccordingToSpeciality, updateSpecialityWithContent } = require("../controller/service/doctorInformation");
const router = express.Router();

router.post("/upload-doctor-information", createDoctorInformation);

router.get("/get-doctor-information", getDoctorInformation);
router.get("/get-doctor-information-according-to-id/:id", getDoctorInformationById);
router.get("/get-doctor-by-speciality/:speciality", getDoctorsBySpeciality);

router.put("/update-doctor-information/:id", updateDoctorInformation); // Update by ID
router.delete("/delete-doctor-information/:id", deleteDoctorInformation); // Delete by ID



// Everything about speciality.
router.get("/get-speciality", getUniqueSpecialties);
router.post("/upload-speciality", uploadSpecialityWithContent);
router.get("/specialities", getSpecialityInformation);
router.get("/content-according-to-specialities", getContentAccordingToSpeciality);
router.put("/update-speciality", updateSpecialityWithContent)
module.exports = serviceRoutes = router;
