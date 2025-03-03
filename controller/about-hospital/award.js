const Award = require("../../models/award");

const addAward = async (req, res) => {
  try {
    const { bannerImage, awardDescription, awardImage, awardTitle } = req.body;

    // Check if all required fields are provided
    if (!bannerImage || !awardDescription || !awardImage || !awardTitle) {
      return res.status(400).json({
        message: "Please provide all required fields: bannerImage, awardDescription, awardImage, and awardTitle.",
      });
    }

    // Create new award data in the database
    const newData = await Award.create({
      bannerImage,
      awardDescription,
      awardImage,
      awardTitle,
    });

    return res.status(201).json({
      message: "Award successfully added!",
      data: newData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding award information!",
      error: error.message,
    });
  }
};

const getAwards = async (req, res) => {
  try {
    const data = await Award.findAll();

    // Check if any data is found
    if (data.length === 0) {
      return res.status(404).json({
        message: "No awards found!",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching awards!",
      error: error.message,
    });
  }
};

const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { bannerImage, awardDescription, awardImage, awardTitle } = req.body;

    // Find existing award by ID
    const existingEntry = await Award.findByPk(id);

    // If award not found
    if (!existingEntry) {
      return res.status(404).json({ message: "Award entry not found!" });
    }

    // Update award details with the provided data
    existingEntry.bannerImage = bannerImage || existingEntry.bannerImage;
    existingEntry.awardDescription = awardDescription || existingEntry.awardDescription;
    existingEntry.awardImage = awardImage || existingEntry.awardImage;
    existingEntry.awardTitle = awardTitle || existingEntry.awardTitle;

    // Save the updated data
    await existingEntry.save();

    return res.status(200).json({
      message: "Award successfully updated!",
      data: existingEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating award information!",
      error: error.message,
    });
  }
};

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;

    // Find award by ID
    const existingEntry = await Award.findByPk(id);

    // If award not found
    if (!existingEntry) {
      return res.status(404).json({ message: "Award not found!" });
    }

    // Delete award entry from the database
    await existingEntry.destroy();

    return res.status(200).json({ message: "Award successfully deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while deleting the award!",
      error: error.message,
    });
  }
};

module.exports = {
  addAward,
  updateAward,
  getAwards,
  deleteAward,
};
