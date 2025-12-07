const multer = require("multer");
const { uid } = require("uid");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set the storage engine and file size limit
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueId = uid(16); // Generate 16 character unique ID
    const extension = path.extname(file.originalname);
    const filename = `${uniqueId}${extension}`;
    const filelink = `${process.env.API || "http://localhost:5000"}/uploads/${filename}`;
    
    // Set filelink on request object
    req.filelink = filelink;
    req.filename = filename;
    
    cb(null, filename);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only! (jpeg, jpg, png, gif)"));
  }
};

const uploadWithMulter = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = uploadWithMulter;