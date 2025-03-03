const express = require("express");
const { addHospitalGalleryImages, getHospitalGalleryImages, updateHospitalGalleryImages, addOrUpdateHospitalGalleryImages } = require("../controller/about-hospital/galleryController");
const { addOrUpdateAboutSuperMedical, getAboutSuperMedical } = require("../controller/about-hospital/aboutController");
const { addBoardOfDirector, getBoardOfDirector, updateBoardOfDirector, deleteBoardOfDirector } = require("../controller/about-hospital/boardOfDirectors");
const { addManagement, getManagement, updateManagement, deletemanagement } = require("../controller/about-hospital/management");
const { addAward, getAwards, updateAward, deleteAward } = require("../controller/about-hospital/award");
const { upsertMissionVision, getMissionVision } = require("../controller/about-hospital/missionAndVission");
const { addMilestone, getMilestones, updateMilestone, deleteMilestone } = require("../controller/about-hospital/milestone");
const { addNewsImage, getNewsImages, deleteNewsImage } = require("../controller/about-hospital/newsAndMedia");
const { upsertHomePageData, getHomePageData } = require("../controller/homePageController");

const router = express.Router();

// The gallery
router.post("/gallery-images", addOrUpdateHospitalGalleryImages);

router.get("/get-gallery-images", getHospitalGalleryImages);

router.put("/update-gallery-images", updateHospitalGalleryImages);


// The about super medical hospital.
router.post("/post-about-supermedical-hospital", addOrUpdateAboutSuperMedical);
router.get("/get-about-supermedical-hospital", getAboutSuperMedical);

// Board of derectors
router.post("/post-board-of-directors", addBoardOfDirector);
router.get("/get-board-of-directors", getBoardOfDirector);
router.put("/update-board-of-directors/:id", updateBoardOfDirector);
router.delete("/delete-board-of-director/:id", deleteBoardOfDirector);


// Management
router.post("/post-management", addManagement);
router.get("/get-management", getManagement);
router.put("/update-management/:id", updateManagement);
router.delete("/delete-management/:id", deletemanagement);

// Award 
router.post("/post-award", addAward);
router.get("/get-award", getAwards);
router.put("/update-award/:id", updateAward);
router.delete("/delete-award/:id", deleteAward);

// Mission and vission 
router.post("/post-mission-and-vission", upsertMissionVision);
router.get("/get-mission-and-vission", getMissionVision);

// Milestone 
router.post("/post-milestone", addMilestone);
router.get("/get-milestone", getMilestones);
router.put("/update-milestone/:id", updateMilestone);
router.delete("/delete-milestone/:id", deleteMilestone);

// News and Media 
router.post("/post-news-and-media", addNewsImage);
router.get("/get-news-and-media", getNewsImages);
router.delete("/delete-news-and-media/:id", deleteNewsImage);

// Client home page.
router.post("/home-page", upsertHomePageData);
router.get("/get-home-page", getHomePageData);

module.exports = hospitalRoutes = router;
