const { Op } = require("sequelize");
const City = require("../../models/area/area");

const createCity = async (req, res, next) => {
  try {
    const { cityName, cityDetails, status } = req.body;

    // Check if the city already exists
    const existingCity = await City.findOne({ where: { cityName } });
    if (existingCity) {
      return res.status(409).json({
        message: "This city already exists! Try a different name.",
      });
    }

    // Create a new city
    const newCity = await City.create({
      cityName,
      cityDetails,
      status: status || "Active",
    });

    return res.status(201).json({
      message: "City created successfully!",
      data: newCity,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCities = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Extract filters
    const { search, status } = req.query;
    let whereCondition = {};

    // Add search filter
    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { cityName: { [Op.like]: `%${search}%` } },
          { cityDetails: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Add status filter
    if (status) {
      whereCondition.status = status;
    }

    // Fetch paginated cities
    const { count, rows: cities } = await City.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        message: "No cities found in the database.",
      });
    }

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "Cities retrieved successfully!",
      data: cities,
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

const updateCity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cityName, cityDetails, status } = req.body;

    // Find the city by ID
    const cityToUpdate = await City.findOne({ where: { id } });

    if (!cityToUpdate) {
      return res.status(404).json({
        message: "City not found!",
      });
    }

    // Check if the new cityName already exists (if it's being updated)
    if (cityName && cityName !== cityToUpdate.cityName) {
      const existingCity = await City.findOne({ where: { cityName } });
      if (existingCity) {
        return res.status(409).json({
          message: "A city with this name already exists! Try a different name.",
        });
      }
    }

    // Update the city fields
    if (cityName) cityToUpdate.cityName = cityName;
    if (cityDetails !== undefined) cityToUpdate.cityDetails = cityDetails;
    if (status) cityToUpdate.status = status;

    // Save the updated city
    await cityToUpdate.save();

    return res.status(200).json({
      message: "City updated successfully!",
      data: cityToUpdate,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the city by ID
    const cityToDelete = await City.findOne({ where: { id } });

    if (!cityToDelete) {
      return res.status(404).json({
        message: "City not found!",
      });
    }

    // Delete the city
    await cityToDelete.destroy();

    return res.status(200).json({
      message: "City deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const getCityNames = async (req, res, next) => {
  try {
    const cities = await City.findAll({
      attributes: ['cityName'],
      where: { status: 'Active' },
      group: ['cityName'],
      order: [['cityName', 'ASC']],
    });

    const cityNames = cities.map(city => city.cityName);

    if (!cityNames || cityNames.length === 0) {
      return res.status(404).json({
        message: "No city names found in the database.",
      });
    }

    return res.status(200).json({
      message: "City names retrieved successfully!",
      data: cityNames,
    });
  } catch (error) {
    next(error);
  }
};

const getCityStats = async (req, res, next) => {
  try {
    // Get total cities count
    const totalCities = await City.count();
    
    // Get active cities count
    const activeCities = await City.count({ where: { status: 'Active' } });
    
    // Get inactive cities count
    const inactiveCities = await City.count({ where: { status: 'Inactive' } });

    return res.status(200).json({
      message: "City statistics retrieved successfully!",
      data: {
        totalCities,
        activeCities,
        inactiveCities,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCity,
  getAllCities,
  deleteCity,
  updateCity,
  getCityNames,
  getCityStats
};