const Management = require("../../models/management");


const addManagement = async (req, res) => {
  try {
    const { bannerImage, designation, imageUrl, name } = req.body;

    if (!bannerImage || !designation || !imageUrl || !name) {
      return res.status(400).json({
        message: "Please provide all required fields: bannerImage, designation, imageUrl, and name.",
      });
    }

    const newData = await Management.create({
      bannerImage,
      designation,
      imageUrl,
      name,
    });

    return res.status(201).json({
      message: "Information successfully added!",
      data: newData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding board information!",
      error: error.message,
    });
  }
};

const getManagement = async (req, res) => {
  try {
    const data = await Management.findAll();

    if (data.length === 0) {
      return res.status(404).json({
        message: "No board information found!",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching board information!",
      error: error.message,
    });
  }
};

const updateManagement = async (req, res) => {
  try {
    const { id } = req.params;
    const { bannerImage, designation, imageUrl, name } = req.body;

    const existingEntry = await Management.findByPk(id);

    if (!existingEntry) {
      return res.status(404).json({ message: "Board entry not found!" });
    }

    existingEntry.bannerImage = bannerImage || existingEntry.bannerImage;
    existingEntry.designation = designation || existingEntry.designation;
    existingEntry.imageUrl = imageUrl || existingEntry.imageUrl;
    existingEntry.name = name || existingEntry.name;

    await existingEntry.save();

    return res.status(200).json({
      message: "Information successfully updated!",
      data: existingEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating board information!",
      error: error.message,
    });
  }
};

const deletemanagement = async (req, res) => {
  try {
    const { id } = req.params;

    const existingEntry = await Management.findByPk(id);

    if (!existingEntry) {
      return res.status(404).json({ message: "Entry not found!" });
    }

    await existingEntry.destroy();

    return res.status(200).json({ message: "Entry successfully deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while deleting the entry!",
      error: error.message,
    });
  }
};

module.exports = {
  addManagement,
  updateManagement,
  getManagement,
  deletemanagement,
};
