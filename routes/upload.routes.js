const express = require("express");
const uploadWithMulter = require("../middleware/uploadWithMulter");
const router = express.Router();

router.post("/single", uploadWithMulter.single("file"), (req, res) => {
  res.status(201).json({ url: req.filelink });
});

module.exports = uploadRoutes = router;