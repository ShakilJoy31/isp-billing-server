const PostImages = require("../../models/gallery");

const addOrUpdateHospitalGalleryImages = async (req, res, next) => {
    try {
      const { gallery } = req.body;
  
      // Validate the gallery array
      if (!Array.isArray(gallery)) {
        return res.status(400).json({
          message: "Please provide a valid array of gallery.",
        });
      }
  
      // Check if an entry already exists
      let existingEntry = await PostImages.findOne();
  
      if (existingEntry) {
        // Update the existing entry
        existingEntry.gallery = gallery;
        await existingEntry.save();
  
        res.status(200).json({
          message: "Gallery updated successfully!",
          gallery: existingEntry.gallery,
        });
      } else {
        // Create a new entry if none exists
        const data = await PostImages.create({ gallery });
  
        res.status(201).json({
          message: "New gallery added!",
          data,
        });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while adding or updating images!",
        error: error.message,
      });
    }
  };
  

const getHospitalGalleryImages = async (req, res, next) => {
    try {
      // Fetch the single existing gallery entry
      const existingEntry = await PostImages.findOne({
        attributes: ['gallery'],
      });
  
      if (!existingEntry) {
        return res.status(404).json({
          message: "No gallery images found!"
        });
      }
  
      res.status(200).json(existingEntry.gallery);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching images!",
        error: error.message,
      });
    }
  };
  

  const updateHospitalGalleryImages = async (req, res, next) => {
    try {
      const { gallery } = req.body;
  
      if (!Array.isArray(gallery)) {
        return res.status(400).json({
          message: "Gallery must be an array!",
        });
      }
  
      // Ensure there's exactly one entry in the database
      let existingEntry = await PostImages.findOne();
  
      if (!existingEntry) {
        // Create a new entry if none exists
        existingEntry = await PostImages.create({ gallery });
      } else {
        // Overwrite the existing gallery entry
        existingEntry.gallery = gallery;
        await existingEntry.save();
      }
  
      res.status(200).json({
        message: "Gallery updated successfully!",
        gallery: existingEntry.gallery,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while updating the gallery!",
        error: error.message,
      });
    }
  };
  
  
  


module.exports = {
    addOrUpdateHospitalGalleryImages,
    getHospitalGalleryImages,
    updateHospitalGalleryImages
}
