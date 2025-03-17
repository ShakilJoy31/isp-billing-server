const Zone = require("../../models/area/zone");

const createZone = async (req, res, next) => {
    try {
      const { zoneName, city, zoneDetails, status } = req.body;
  
      // Check if the zone already exists based on zoneName
      const existingZone = await Zone.findOne({ where: { zoneName } });
      if (existingZone) {
        return res.status(409).json({
          message: "This zone already exists! Try a different name.",
        });
      }
  
      // Create a new zone entry
      const newZone = await Zone.create({
        zoneName,
        city,
        zoneDetails,
        status,
      });
  
      return res.status(201).json({
        message: "Zone created successfully!",
        data: newZone,
      });
    } catch (error) {
      next(error);
    }
  };


  const getAllZones = async (req, res, next) => {
    try {
      // Extract pagination parameters from the query string
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
      const offset = (page - 1) * limit; // Calculate the offset
  
      // Fetch paginated zones from the database
      const { count, rows: zones } = await Zone.findAndCountAll({
        limit, // Number of records to fetch
        offset, // Starting point for fetching records
      });
  
      // If no zones are found, return a 404 response
      if (!zones || zones.length === 0) {
        return res.status(404).json({
          message: "No zones found in the database.",
        });
      }
  
      // Calculate total pages
      const totalPages = Math.ceil(count / limit);
  
      // Return the paginated list of zones
      return res.status(200).json({
        message: "Zones retrieved successfully!",
        data: zones,
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


  const updateZone = async (req, res, next) => {
    try {
      const { id } = req.params; // Extract the zone ID from the request parameters
      const { zoneName, city, zoneDetails, status } = req.body; // Extract updated fields from the request body
  
      // Find the zone by ID
      const zoneToUpdate = await Zone.findOne({ where: { id } });
  
      // If the zone doesn't exist, return a 404 response
      if (!zoneToUpdate) {
        return res.status(404).json({
          message: "Zone not found!",
        });
      }
  
      // Check if the new zoneName already exists (if it's being updated)
      if (zoneName && zoneName !== zoneToUpdate.zoneName) {
        const existingZone = await Zone.findOne({ where: { zoneName } });
        if (existingZone) {
          return res.status(409).json({
            message: "A zone with this name already exists! Try a different name.",
          });
        }
      }
  
      // Update the zone fields
      if (zoneName) zoneToUpdate.zoneName = zoneName;
      if (city) zoneToUpdate.city = city;
      if (zoneDetails) zoneToUpdate.zoneDetails = zoneDetails;
      if (status) zoneToUpdate.status = status;
  
      // Save the updated zone
      await zoneToUpdate.save();
  
      return res.status(200).json({
        message: "Zone updated successfully!",
        data: zoneToUpdate,
      });
    } catch (error) {
      next(error);
    }
  };


  const deleteZone = async (req, res, next) => {
    try {
      const { id } = req.params; // Extract the zone ID from the request parameters
  
      // Find the zone by ID
      const zoneToDelete = await Zone.findOne({ where: { id } });
  
      // If the zone doesn't exist, return a 404 response
      if (!zoneToDelete) {
        return res.status(404).json({
          message: "Zone not found!",
        });
      }
  
      // Delete the zone
      await zoneToDelete.destroy();
  
      return res.status(200).json({
        message: "Zone deleted successfully!",
      });
    } catch (error) {
      next(error);
    }
  };


  module.exports = {
    createZone,
    getAllZones,
    updateZone,
    deleteZone,
  };