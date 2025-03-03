
const AdmissionAndPayment = require("../../models/admissionAndPayment");
const BloodBank = require("../../models/bloodBank");
const HelathTips = require("../../models/healthTips");
const TestList = require("../../models/testList");
const VaccinationModel = require("../../models/vaccination");

const upsertAdmissionAndPaymentData = async (req, res) => {
    try {
      const { admissionAndPaymentContent, bannerImage } = req.body;
  
      // Validate required fields
      if (!admissionAndPaymentContent || !bannerImage) {
        return res.status(400).json({
          message: "Please provide all required fields: admissionAndPaymentContent and bannerImage.",
        });
      }
  
      // Find existing entry
      const existingData = await AdmissionAndPayment.findOne();
  
      let homePageData;
  
      if (existingData) {
        // Update existing data
        homePageData = await existingData.update({
          admissionAndPaymentContent,
          bannerImage,
        });
        return res.status(200).json({
          message: "Admission and payment data successfully updated!",
          data: homePageData,
        });
      } else {
        // Create new data
        homePageData = await AdmissionAndPayment.create({
          admissionAndPaymentContent,
          bannerImage,
        });
        return res.status(201).json({
          message: "Admission and payment data successfully added!",
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

  const getAdmissionAndPaymentData = async (req, res) => {
    try {
      // Find the existing data in the database
      const homePageData = await AdmissionAndPayment.findOne();
  
      // If no data is found, return a 404 error
      if (!homePageData) {
        return res.status(404).json({
          message: "No home page data found.",
        });
      }
  
      // Return the data in the response
      return res.status(200).json({
        message: "Admission and Payment data retrieved successfully!",
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





  const upsertBloodBank = async (req, res) => {
    try {
      const { bloodBank, bannerImage } = req.body;
  
      // Validate required fields
      if (!bloodBank || !bannerImage) {
        return res.status(400).json({
          message: "Please provide all required fields: bloodBank and bannerImage.",
        });
      }
  
      // Find existing entry
      const existingData = await BloodBank.findOne();
  
      let homePageData;
  
      if (existingData) {
        // Update existing data
        homePageData = await existingData.update({
            bloodBank,
          bannerImage,
        });
        return res.status(200).json({
          message: "Blood Bank data successfully updated!",
          data: homePageData,
        });
      } else {
        // Create new data
        homePageData = await BloodBank.create({
            bloodBank,
          bannerImage,
        });
        return res.status(201).json({
          message: "Blood Bank data successfully added!",
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


  const getBloodBankData = async (req, res) => {
    try {
      // Find the existing data in the database
      const homePageData = await BloodBank.findOne();
  
      // If no data is found, return a 404 error
      if (!homePageData) {
        return res.status(404).json({
          message: "No home page data found.",
        });
      }
  
      // Return the data in the response
      return res.status(200).json({
        message: "Blood bank data retrieved successfully!",
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




  const upsertHealthTips = async (req, res) => {
    try {
      const { healthTipsContent, bannerImage } = req.body;
  
      // Validate required fields
      if (!healthTipsContent || !bannerImage) {
        return res.status(400).json({
          message: "Please provide all required fields: healthTipsContent and bannerImage.",
        });
      }
  
      // Find existing entry
      const existingData = await HelathTips.findOne();
  
      let homePageData;
  
      if (existingData) {
        // Update existing data
        homePageData = await existingData.update({
            healthTipsContent,
          bannerImage,
        });
        return res.status(200).json({
          message: "Health tips data successfully updated!",
          data: homePageData,
        });
      } else {
        // Create new data
        homePageData = await HelathTips.create({
            healthTipsContent,
          bannerImage,
        });
        return res.status(201).json({
          message: "Health tips data successfully added!",
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


  const getHealthTipsData = async (req, res) => {
    try {
      // Find the existing data in the database
      const homePageData = await HelathTips.findOne();
  
      // If no data is found, return a 404 error
      if (!homePageData) {
        return res.status(404).json({
          message: "No home page data found.",
        });
      }
  
      // Return the data in the response
      return res.status(200).json({
        message: "Blood bank data retrieved successfully!",
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


  // For vaccination
  const upsertVaccination = async (req, res) => {
    try {
      const { vaccinationContent, bannerImage } = req.body;
  
      // Validate required fields
      if (!vaccinationContent || !bannerImage) {
        return res.status(400).json({
          message: "Please provide all required fields: vaccinationContent and bannerImage.",
        });
      }
  
      // Find existing entry
      const existingData = await VaccinationModel.findOne();
  
      let homePageData;
  
      if (existingData) {
        // Update existing data
        homePageData = await existingData.update({
          vaccinationContent,
          bannerImage,
        });
        return res.status(200).json({
          message: "Vaccination data successfully updated!",
          data: homePageData,
        });
      } else {
        // Create new data
        homePageData = await VaccinationModel.create({
          vaccinationContent,
          bannerImage,
        });
        return res.status(201).json({
          message: "Vaccination data successfully added!",
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


  const getVaccinationData = async (req, res) => {
    try {
      // Find the existing data in the database
      const homePageData = await VaccinationModel.findOne();
  
      // If no data is found, return a 404 error
      if (!homePageData) {
        return res.status(404).json({
          message: "No home page data found.",
        });
      }
  
      // Return the data in the response
      return res.status(200).json({
        message: "Vaccination data retrieved successfully!",
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



//   Test list
const upsertTestList = async (req, res) => {
    try {
        const { tests } = req.body;

        // Validate required fields
        if (!tests || !Array.isArray(tests)) {
            return res.status(400).json({
                message: "Please provide a valid 'tests' array in the request body.",
            });
        }

        // Delete all existing entries (optional, depending on your use case)
        await TestList.destroy({ where: {} });

        // Insert new test list data
        const createdTests = await TestList.bulkCreate(tests);

        return res.status(200).json({
            message: "Test list data successfully added!",
            data: createdTests,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing test list data!",
            error: error.message,
        });
    }
};


const getTestListData = async (req, res) => {
    try {
        // Find all test list entries
        const testListData = await TestList.findAll();

        // If no data is found, return a 404 error
        if (!testListData || testListData.length === 0) {
            return res.status(404).json({
                message: "No test list data found.",
            });
        }

        // Parse the `items` field from a JSON string to an array
        const parsedTestListData = testListData.map((test) => ({
            ...test.toJSON(),
            items: JSON.parse(test.items), // Parse the items field
        }));

        // Return the data in the response
        return res.status(200).json({
            message: "Test list data retrieved successfully!",
            data: parsedTestListData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while retrieving test list data!",
            error: error.message,
        });
    }
};



  module.exports = {
    upsertAdmissionAndPaymentData,
    getAdmissionAndPaymentData,
    getBloodBankData,
    upsertBloodBank,
    upsertHealthTips,
    getHealthTipsData,
    upsertTestList,
    getTestListData,
    upsertVaccination,
    getVaccinationData
};
