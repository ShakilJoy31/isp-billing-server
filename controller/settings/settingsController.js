const SiteSettings = require("../../models/settings/HeaderSettings");

// Function to update or create header settings
const postHeaderSettings = async (req, res) => {
  try {
    const id = 1; // ID will always be 1
    const { favicon, headerLogo, siteTitle, siteURL } = req.body;

    // Find the record with id = 1
    const existingSettings = await SiteSettings.findByPk(id);

    let result;

    if (existingSettings) {
      // Update the existing record with id = 1
      result = await existingSettings.update({
        favicon,
        headerLogo,
        siteTitle,
        siteURL,
      });
      res.status(200).json({
        message: "Header settings updated successfully!",
        data: result,
      });
    } else {
      // Create the record with id = 1 if it doesn't exist
      result = await SiteSettings.create({
        id, // This ensures the id is always 1
        favicon,
        headerLogo,
        siteTitle,
        siteURL,
      });
      res.status(201).json({
        message: "Header settings added successfully!",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating header settings!",
      error: error.message,
    });
  }
};

// Function to get the header settings
const getHeaderSettings = async (req, res) => {
  try {
    // Fetch the record with id = 1
    const settings = await SiteSettings.findByPk(1);

    if (!settings) {
      return res.status(404).json({
        message: "Header settings not found!",
      });
    }

    res.status(200).json({
      message: "Header settings fetched successfully!",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching header settings!",
      error: error.message,
    });
  }
};

// Export both functions
module.exports = { postHeaderSettings, getHeaderSettings };
