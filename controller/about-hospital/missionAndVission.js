const MissionVision = require("../../models/missionAndVission");


// Add or Update Mission and Vision
const upsertMissionVision = async (req, res) => {
  try {
    const { bannerImage, mission, vision } = req.body;

    // Validate required fields
    if (!bannerImage?.url || !mission || !vision) {
      return res.status(400).json({
        message: "Please provide bannerImage, mission, and vision.",
      });
    }

    // Find existing entry
    const existingData = await MissionVision.findOne();

    let missionVisionData;

    if (existingData) {
      // Update existing data
      missionVisionData = await existingData.update({
        bannerImage,
        mission,
        vision,
      });
      return res.status(200).json({
        message: "Mission and Vision successfully updated!",
        data: missionVisionData,
      });
    } else {
      // Create new data
      missionVisionData = await MissionVision.create({
        bannerImage,
        mission,
        vision,
      });
      return res.status(201).json({
        message: "Mission and Vision successfully added!",
        data: missionVisionData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while processing mission and vision data!",
      error: error.message,
    });
  }
};

// Get Mission and Vision
const getMissionVision = async (req, res) => {
  try {
    const data = await MissionVision.findOne();

    if (!data) {
      return res.status(404).json({
        message: "No Mission and Vision data found!",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching mission and vision data!",
      error: error.message,
    });
  }
};

module.exports = {
  upsertMissionVision,
  getMissionVision,
};
