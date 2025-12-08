const { Op } = require("sequelize");
const Zone = require("../../models/area/zone");


// Create new zone
const createZone = async (req, res) => {
  try {
    const { zoneName, city, zoneDetails, status = "Active" } = req.body;

    // Check if zone already exists
    const existingZone = await Zone.findOne({ where: { zoneName } });
    if (existingZone) {
      return res.status(400).json({
        success: false,
        message: "Zone name already exists",
      });
    }

    const zone = await Zone.create({
      zoneName,
      city,
      zoneDetails,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Zone created successfully",
      data: zone,
    });
  } catch (error) {
    console.error("Error creating zone:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all zones with pagination and filters
const getAllZones = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      status = "", 
      city = "" 
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { zoneName: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { zoneDetails: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (city) {
      whereClause.city = city;
    }

    const { count, rows } = await Zone.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
      },
    });
  } catch (error) {
    console.error("Error fetching zones:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get zone statistics
const getZoneStats = async (req, res) => {
  try {
    const zones = await Zone.findAll();

    const totalZones = zones.length;
    const activeZones = zones.filter(zone => zone.status === "Active").length;
    const inactiveZones = totalZones - activeZones;

    // Get unique cities with counts
    const cityCounts = {};
    zones.forEach(zone => {
      cityCounts[zone.city] = (cityCounts[zone.city] || 0) + 1;
    });

    const cities = Object.keys(cityCounts).map(city => ({
      city,
      count: cityCounts[city],
    }));

    // Get zones grouped by city
    const zonesByCity = [];
    zones.forEach(zone => {
      const cityIndex = zonesByCity.findIndex(item => item.city === zone.city);
      if (cityIndex === -1) {
        zonesByCity.push({
          city: zone.city,
          zones: [{
            zoneName: zone.zoneName,
            status: zone.status,
          }]
        });
      } else {
        zonesByCity[cityIndex].zones.push({
          zoneName: zone.zoneName,
          status: zone.status,
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalZones,
        activeZones,
        inactiveZones,
        cities,
        zonesByCity,
      },
    });
  } catch (error) {
    console.error("Error fetching zone stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update zone
const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { zoneName, city, zoneDetails, status } = req.body;

    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    // Check if new zone name already exists (excluding current zone)
    if (zoneName && zoneName !== zone.zoneName) {
      const existingZone = await Zone.findOne({ 
        where: { 
          zoneName,
          id: { [Op.ne]: id }
        } 
      });
      if (existingZone) {
        return res.status(400).json({
          success: false,
          message: "Zone name already exists",
        });
      }
    }

    await zone.update({
      zoneName: zoneName || zone.zoneName,
      city: city || zone.city,
      zoneDetails: zoneDetails || zone.zoneDetails,
      status: status || zone.status,
    });

    return res.status(200).json({
      success: true,
      message: "Zone updated successfully",
      data: zone,
    });
  } catch (error) {
    console.error("Error updating zone:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete zone
const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    await zone.destroy();

    return res.status(200).json({
      success: true,
      message: "Zone deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting zone:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get zone by ID
const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: zone,
    });
  } catch (error) {
    console.error("Error fetching zone:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



  module.exports = {
    createZone,
    getAllZones,
    updateZone,
    deleteZone,
    getZoneStats,
    getZoneById
  };