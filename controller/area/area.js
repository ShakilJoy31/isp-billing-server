const City = require("../../models/area/area");

const createArea = async (req, res, next) => {
  try {
    const { cityName, cityDetails, status } = req.body;

    // Check if the area already exists based on cityName
    const existingArea = await City.findOne({ where: { cityName } });
    if (existingArea) {
      return res.status(409).json({
        message: "This area already exists! Try a different name.",
      });
    }

    // Create a new area entry
    const newArea = await City.create({
      cityName,
      cityDetails,
      status,
    });

    return res.status(201).json({
      message: "Area created successfully!",
      data: newArea,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAreas = async (req, res, next) => {
    try {
      // Extract pagination parameters from the query string
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
      const offset = (page - 1) * limit; // Calculate the offset
  
      // Fetch paginated areas from the database
      const { count, rows: areas } = await City.findAndCountAll({
        limit, // Number of records to fetch
        offset, // Starting point for fetching records
      });
  
      // If no areas are found, return a 404 response
      if (!areas || areas.length === 0) {
        return res.status(404).json({
          message: "No areas found in the database.",
        });
      }
  
      // Calculate total pages
      const totalPages = Math.ceil(count / limit);
  
      // Return the paginated list of areas
      return res.status(200).json({
        message: "Areas retrieved successfully!",
        data: areas,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: count,
        },
      });
    } catch (error) {
      next(error);
    }
  };


  const updateArea = async (req, res, next) => {
    try {
      const { id } = req.params; // Extract the area ID from the request parameters
      const { cityName, cityDetails, status } = req.body; // Extract updated fields from the request body
  
      // Find the area by ID
      const areaToUpdate = await City.findOne({ where: { id } });
  
      // If the area doesn't exist, return a 404 response
      if (!areaToUpdate) {
        return res.status(404).json({
          message: "Area not found!",
        });
      }
  
      // Check if the new cityName already exists (if it's being updated)
      if (cityName && cityName !== areaToUpdate.cityName) {
        const existingArea = await City.findOne({ where: { cityName } });
        if (existingArea) {
          return res.status(409).json({
            message: "An area with this name already exists! Try a different name.",
          });
        }
      }
  
      // Update the area fields
      if (cityName) areaToUpdate.cityName = cityName;
      if (cityDetails) areaToUpdate.cityDetails = cityDetails;
      if (status) areaToUpdate.status = status;
  
      // Save the updated area
      await areaToUpdate.save();
  
      return res.status(200).json({
        message: "Area updated successfully!",
        data: areaToUpdate,
      });
    } catch (error) {
      next(error);
    }
  };

  const deleteArea = async (req, res, next) => {
    try {
      const { id } = req.params; // Extract the area ID from the request parameters
  
      // Find the area by ID
      const areaToDelete = await City.findOne({ where: { id } });
  
      // If the area doesn't exist, return a 404 response
      if (!areaToDelete) {
        return res.status(404).json({
          message: "Area not found!",
        });
      }
  
      // Delete the area
      await areaToDelete.destroy();
  
      return res.status(200).json({
        message: "Area deleted successfully!",
      });
    } catch (error) {
      next(error);
    }
  };


  // Getting only cities name
  const getCityNames = async (req, res, next) => {
    try {
      // Fetch all areas from the database
      const areas = await City.findAll({
        attributes: ['cityName'], // Only fetch the cityName field
        group: ['cityName'], // Group by cityName to avoid duplicates
      });
  
      // Extract city names from the result
      const cityNames = areas.map(area => area.cityName);
  
      // If no city names are found, return a 404 response
      if (!cityNames || cityNames.length === 0) {
        return res.status(404).json({
          message: "No city names found in the database.",
        });
      }
  
      // Return the list of city names
      return res.status(200).json({
        message: "City names retrieved successfully!",
        data: cityNames,
      });
    } catch (error) {
      next(error);
    }
  };


  module.exports = {
    createArea,
    getAllAreas,
    deleteArea,
    updateArea,
    getCityNames
  };