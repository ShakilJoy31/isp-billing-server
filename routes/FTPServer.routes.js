const express = require("express");
const { createFTPServer, getAllFTPServers, getFTPServerById, updateFTPServer, toggleFTPServerStatus, deleteFTPServer, getActiveFTPServerNames, getFTPServerStats } = require("../controller/ftpServer/FTPServer.controller");
const router = express.Router();

// FTP Server Routes
router.post("/add-new-server", createFTPServer);
router.get("/get-servers", getAllFTPServers);
router.get("/get-server/:id", getFTPServerById);
router.put("/update-server/:id", updateFTPServer);
router.put("/toggle-status/:id", toggleFTPServerStatus);
router.delete("/delete-server/:id", deleteFTPServer);
router.get("/get-active-servers", getActiveFTPServerNames);
router.get("/stats", getFTPServerStats);

module.exports = FTPServerRoutes = router;