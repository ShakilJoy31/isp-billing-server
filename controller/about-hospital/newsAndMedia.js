const NewsMediaImage = require("../../models/newsAndMedia");


const addNewsImage = async (req, res) => {
  try {
    const { imageUrl } = req.body; // Expecting just the URL of the image
    
    if (!imageUrl) {
      return res.status(400).json({
        message: "Please provide the image URL.",
      });
    }

    // Save the image URL to the database
    const newImage = await NewsMediaImage.create({
      imageUrl,
    });

    return res.status(201).json({
      message: "Image successfully added!",
      data: newImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while saving the image.",
      error: error.message,
    });
  }
};

const getNewsImages = async (req, res) => {
  try {
    const images = await NewsMediaImage.findAll();

    if (images.length === 0) {
      return res.status(404).json({
        message: "No images found!",
      });
    }

    return res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching images.",
      error: error.message,
    });
  }
};

const deleteNewsImage = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter

    // Find the image by ID
    const image = await NewsMediaImage.findByPk(id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found!",
      });
    }

    // Delete the image record from the database
    await image.destroy();

    return res.status(200).json({
      message: "Image successfully deleted!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while deleting the image.",
      error: error.message,
    });
  }
};

module.exports = {
  addNewsImage,
  getNewsImages,
  deleteNewsImage, // Add deleteImage to the exported object
};
