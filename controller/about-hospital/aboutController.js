const AboutSuperMedical = require("../../models/aboutSuperMedicalHospital");


const addOrUpdateAboutSuperMedical = async (req, res) => {
  try {
    const { title, aboutHospital, whatWeHave, whatWeOffer, bannerImage, slidingImages } = req.body;

    if (!title || !aboutHospital || !Array.isArray(whatWeOffer) || whatWeOffer.length !== 3) {
      return res.status(400).json({
        message: "Please provide all required fields and ensure `whatWeOffer` contains exactly 3 entries.",
      });
    }

    let existingEntry = await AboutSuperMedical.findOne();

    if (existingEntry) {
      // Update existing entry
      existingEntry.title = title;
      existingEntry.aboutHospital = aboutHospital;
      existingEntry.whatWeHave = whatWeHave;
      existingEntry.whatWeOffer = whatWeOffer;
      existingEntry.bannerImage = bannerImage;
      existingEntry.slidingImages = slidingImages;
      await existingEntry.save();

      return res.status(200).json({
        message: "Information successfully updated!",
        data: existingEntry,
      });
    } else {
      // Create new entry
      const newData = await AboutSuperMedical.create({
        title,
        aboutHospital,
        whatWeHave,
        whatWeOffer,
        bannerImage,
        slidingImages,
      });

      return res.status(201).json({
        message: "Information successfully added!",
        data: newData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding or updating hospital information!",
      error: error.message,
    }); 
  }
};

const getAboutSuperMedical = async (req, res) => {
  try {
    const existingEntry = await AboutSuperMedical.findOne();

    if (!existingEntry) {
      return res.status(404).json({
        message: "No hospital information found!",
      });
    }

    return res.status(200).json(existingEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching hospital information!",
      error: error.message,
    });
  }
};

module.exports = {
  addOrUpdateAboutSuperMedical,
  getAboutSuperMedical,
};
