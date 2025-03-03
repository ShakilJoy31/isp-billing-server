const FooterSettings = require("../../models/settings/FooterSettings");


// Function to update or create footer settings
const postFooterSettings = async (req, res) => {
  try {
    const id = 1; // ID will always be 1
    const { copyright, rightsReserved, craftedBy } = req.body;

    // Find the record with id = 1
    const existingSettings = await FooterSettings.findByPk(id);

    let result;

    if (existingSettings) {
      // Update the existing record with id = 1
      result = await existingSettings.update({
        copyright,
        rightsReserved,
        craftedBy,
      });
      res.status(200).json({
        message: "Footer settings updated successfully!",
        data: result,
      });
    } else {
      // Create the record with id = 1 if it doesn't exist
      result = await FooterSettings.create({
        id, // This ensures the id is always 1
        copyright,
        rightsReserved,
        craftedBy,
      });
      res.status(201).json({
        message: "Footer settings added successfully!",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating footer settings!",
      error: error.message,
    });
  }
};

// Function to get the footer settings
const getFooterSettings = async (req, res) => {
  try {
    // Fetch the record with id = 1
    const settings = await FooterSettings.findByPk(1);

    if (!settings) {
      return res.status(404).json({
        message: "Footer settings not found!",
      });
    }

    res.status(200).json({
      message: "Footer settings fetched successfully!",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching footer settings!",
      error: error.message,
    });
  }
};

// Export both functions
module.exports = { postFooterSettings, getFooterSettings };
