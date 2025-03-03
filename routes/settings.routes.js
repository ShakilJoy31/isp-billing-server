const express = require("express");
const { postHeaderSettings, getHeaderSettings} = require("../controller/settings/settingsController");
const { postFooterSettings, getFooterSettings } = require("../controller/settings/footerSettingsController");
const router = express.Router();

router.put("/header", postHeaderSettings);
router.get("/get-header-settings", getHeaderSettings);

// Routes for footer
router.put("/footer", postFooterSettings);
router.get("/get-footer-settings", getFooterSettings);

// Theme settings 

module.exports = settingsRoutes = router;