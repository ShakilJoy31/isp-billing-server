const HomePageData = require("../models/homePageModel");


const upsertHomePageData = async (req, res) => {
    try {
        const { bannerImages, doctorContacts, aboutUs, femaleDoctorMonitoring, labAndPathology, pharmacy } = req.body;

        // Validate required fields
        if (
            !bannerImages ||
            !doctorContacts ||
            !aboutUs ||
            !femaleDoctorMonitoring ||
            !labAndPathology ||
            !pharmacy
        ) {
            return res.status(400).json({
                message: "Please provide all required fields.",
            });
        }

        // Find existing entry
        const existingData = await HomePageData.findOne();

        let homePageData;

        if (existingData) {
            // Update existing data
            homePageData = await existingData.update({
                bannerImages,
                doctorContacts,
                aboutUs,
                femaleDoctorMonitoring,
                labAndPathology,
                pharmacy,
            });
            return res.status(200).json({
                message: "Home page data successfully updated!",
                data: homePageData,
            });
        } else {
            // Create new data
            homePageData = await HomePageData.create({
                bannerImages,
                doctorContacts,
                aboutUs,
                femaleDoctorMonitoring,
                labAndPathology,
                pharmacy,
            });
            return res.status(201).json({
                message: "Home page data successfully added!",
                data: homePageData,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing home page data!",
            error: error.message,
        });
    }
};


const getHomePageData = async (req, res) => {
    try {
        // Fetch the home page data from the database
        const homePageData = await HomePageData.findOne();

        if (!homePageData) {
            return res.status(404).json({
                message: "Home page data not found.",
            });
        }

        // Return the data to the client
        return res.status(200).json({
            message: "Home page data retrieved successfully!",
            data: homePageData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while retrieving home page data!",
            error: error.message,
        });
    }
};

module.exports = { upsertHomePageData, getHomePageData };
