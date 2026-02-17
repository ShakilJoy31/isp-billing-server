const { Op } = require("sequelize");
const FTPServer = require("../../models/FTPServer/FTPServer.model");

// Helper function to format URL
const formatServerLink = (url) => {
  if (!url) return url;
  
  // Remove any existing protocol and ensure http:// prefix
  const cleanedUrl = url.replace(/^http?:\/\//, '').trim();
  return `http://${cleanedUrl}`;
};

// Create new FTP Server
const createFTPServer = async (req, res, next) => {
  try {
    const { serverName, serverLink, description, status } = req.body;

    // Validate required fields
    if (!serverName || !serverLink) {
      return res.status(400).json({
        message: "Server name and server link are required fields.",
      });
    }

    // Format the server link
    const formattedLink = formatServerLink(serverLink);

    // Check if the server already exists by name
    const existingServerByName = await FTPServer.findOne({ 
      where: { serverName } 
    });
    
    if (existingServerByName) {
      return res.status(409).json({
        message: "A server with this name already exists! Try a different name.",
      });
    }

    // Check if the server already exists by link
    const existingServerByLink = await FTPServer.findOne({ 
      where: { serverLink: formattedLink } 
    });
    
    if (existingServerByLink) {
      return res.status(409).json({
        message: "A server with this link already exists!",
      });
    }

    // Create a new FTP server
    const newFTPServer = await FTPServer.create({
      serverName,
      serverLink: formattedLink,
      description,
      status: status || "Active",
    });

    return res.status(201).json({
      message: "FTP Server created successfully!",
      data: newFTPServer,
    });
  } catch (error) {
    next(error);
  }
};

// Get all FTP Servers with pagination and filters
const getAllFTPServers = async (req, res, next) => {
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
          { serverName: { [Op.like]: `%${search}%` } },
          { serverLink: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Add status filter
    if (status) {
      whereCondition.status = status;
    }

    // Fetch paginated FTP servers
    const { count, rows: servers } = await FTPServer.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (!servers || servers.length === 0) {
      return res.status(404).json({
        message: "No FTP servers found.",
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
        },
      });
    }

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: "FTP Servers retrieved successfully!",
      data: servers,
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

// Update FTP Server
const updateFTPServer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { serverName, serverLink, description, status } = req.body;

    // Find the server by ID
    const serverToUpdate = await FTPServer.findOne({ where: { id } });

    if (!serverToUpdate) {
      return res.status(404).json({
        message: "FTP Server not found!",
      });
    }

    // Check if the new serverName already exists (if it's being updated)
    if (serverName && serverName !== serverToUpdate.serverName) {
      const existingServer = await FTPServer.findOne({ 
        where: { serverName } 
      });
      if (existingServer) {
        return res.status(409).json({
          message: "A server with this name already exists! Try a different name.",
        });
      }
    }

    // Format the server link if provided
    let formattedLink = serverToUpdate.serverLink;
    if (serverLink) {
      formattedLink = formatServerLink(serverLink);
      
      // Check if the new link already exists (excluding current server)
      const existingServerWithLink = await FTPServer.findOne({
        where: { 
          serverLink: formattedLink,
          id: { [Op.ne]: id } // Not equal to current server id
        }
      });
      
      if (existingServerWithLink) {
        return res.status(409).json({
          message: "A server with this link already exists!",
        });
      }
    }

    // Update the server fields
    if (serverName) serverToUpdate.serverName = serverName;
    if (serverLink) serverToUpdate.serverLink = formattedLink;
    if (description !== undefined) serverToUpdate.description = description;
    if (status) serverToUpdate.status = status;

    // Save the updated server
    await serverToUpdate.save();

    return res.status(200).json({
      message: "FTP Server updated successfully!",
      data: serverToUpdate,
    });
  } catch (error) {
    next(error);
  }
};

// Delete FTP Server
const deleteFTPServer = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the server by ID
    const serverToDelete = await FTPServer.findOne({ where: { id } });

    if (!serverToDelete) {
      return res.status(404).json({
        message: "FTP Server not found!",
      });
    }

    // Delete the server
    await serverToDelete.destroy();

    return res.status(200).json({
      message: "FTP Server deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// Get FTP Server by ID
const getFTPServerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the server by ID
    const server = await FTPServer.findOne({ where: { id } });

    if (!server) {
      return res.status(404).json({
        message: "FTP Server not found!",
      });
    }

    return res.status(200).json({
      message: "FTP Server retrieved successfully!",
      data: server,
    });
  } catch (error) {
    next(error);
  }
};

// Get FTP Server statistics
const getFTPServerStats = async (req, res, next) => {
  try {
    // Get total servers count
    const totalServers = await FTPServer.count();
    
    // Get active servers count
    const activeServers = await FTPServer.count({ 
      where: { status: 'Active' } 
    });
    
    // Get inactive servers count
    const inactiveServers = await FTPServer.count({ 
      where: { status: 'Inactive' } 
    });

    return res.status(200).json({
      message: "FTP Server statistics retrieved successfully!",
      data: {
        totalServers,
        activeServers,
        inactiveServers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all active FTP Server names
const getActiveFTPServerNames = async (req, res, next) => {
  try {
    const servers = await FTPServer.findAll({
      attributes: ['id', 'serverName', 'serverLink'],
      where: { status: 'Active' },
      order: [['serverName', 'ASC']],
    });

    if (!servers || servers.length === 0) {
      return res.status(404).json({
        message: "No active FTP servers found.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Active FTP Servers retrieved successfully!",
      data: servers,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle FTP Server status
const toggleFTPServerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the server by ID
    const server = await FTPServer.findOne({ where: { id } });

    if (!server) {
      return res.status(404).json({
        message: "FTP Server not found!",
      });
    }

    // Toggle status
    const newStatus = server.status === 'Active' ? 'Inactive' : 'Active';
    server.status = newStatus;

    // Save the updated server
    await server.save();

    return res.status(200).json({
      message: `FTP Server ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`,
      data: server,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFTPServer,
  getAllFTPServers,
  updateFTPServer,
  deleteFTPServer,
  getFTPServerById,
  getFTPServerStats,
  getActiveFTPServerNames,
  toggleFTPServerStatus,
};