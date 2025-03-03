const Milestone = require("../../models/milestone");

const addMilestone = async (req, res) => {
  try {
    const { milestoneImage, milestoneDescription, imageDescription } = req.body;

    if (!milestoneImage || !milestoneDescription || !imageDescription) {
      return res.status(400).json({
        message: "Please provide milestoneImage, milestoneDescription, and imageDescription.",
      });
    }

    const newMilestone = await Milestone.create({
      milestoneImage,
      milestoneDescription,
      imageDescription,
    });

    return res.status(201).json({
      message: "Milestone successfully added!",
      data: newMilestone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding the milestone!",
      error: error.message,
    });
  }
};

const getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.findAll();

    if (milestones.length === 0) {
      return res.status(404).json({
        message: "No milestones found!",
      });
    }

    return res.status(200).json(milestones);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching milestones!",
      error: error.message,
    });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { milestoneImage, milestoneDescription, imageDescription } = req.body;

    const existingMilestone = await Milestone.findByPk(id);

    if (!existingMilestone) {
      return res.status(404).json({ message: "Milestone not found!" });
    }

    existingMilestone.milestoneImage = milestoneImage || existingMilestone.milestoneImage;
    existingMilestone.milestoneDescription = milestoneDescription || existingMilestone.milestoneDescription;
    existingMilestone.imageDescription = imageDescription || existingMilestone.imageDescription;

    await existingMilestone.save();

    return res.status(200).json({
      message: "Milestone successfully updated!",
      data: existingMilestone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the milestone!",
      error: error.message,
    });
  }
};

const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMilestone = await Milestone.findByPk(id);

    if (!existingMilestone) {
      return res.status(404).json({ message: "Milestone not found!" });
    }

    await existingMilestone.destroy();

    return res.status(200).json({ message: "Milestone successfully deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while deleting the milestone!",
      error: error.message,
    });
  }
};

module.exports = {
  addMilestone,
  getMilestones,
  updateMilestone,
  deleteMilestone,
};
