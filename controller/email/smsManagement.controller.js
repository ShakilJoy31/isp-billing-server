const { Op } = require("sequelize");
const SMS = require("../../models/email/sms.model");

//! Create new SMS Configuration
const createSMS = async (req, res, next) => {
  try {
    const { appName, apiKey, type, senderId, service, message } = req.body;

    // Validate required fields
    if (!appName || !apiKey || !senderId || !service || !message) {
      return res.status(400).json({
        message: "App name, API key, sender ID, service, and message are required fields.",
      });
    }

    // Validate API key format (basic validation)
    if (apiKey.length < 10) {
      return res.status(400).json({
        message: "API key must be at least 10 characters long.",
      });
    }

    // Validate type
    const validTypes = ["unicode", "text", "flash"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        message: "Type must be either 'unicode', 'text', or 'flash'.",
      });
    }

    // Validate sender ID
    if (senderId.length < 3 || senderId.length > 20) {
      return res.status(400).json({
        message: "Sender ID must be between 3 and 20 characters.",
      });
    }

    // Validate service
    const validServices = ["Bill collection", "Reminder", "Account Creation", "Salary receive", "Client Disable", "Client Enable", "Bill Due", "Bill Due Notice", "Bill Due Final Notice"];
    if (!validServices.includes(service)) {
      return res.status(400).json({
        message: "Service must be one of: Bill collection, Reminder, Account Creation, Salary receive, Client Disable, Client Enable, Bill Due, Bill Due Notice, Bill Due Final Notice",
      });
    }

    // Validate message
    if (message.trim() === '') {
      return res.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    // Check if the app name already exists
    const existingSMSByName = await SMS.findOne({ 
      where: { service } 
    });
    
    if (existingSMSByName) {
      return res.status(409).json({
        message: "An SMS configuration with this service already exists! Try a different service.",
      });
    }

    // Static base URL
    const baseUrl = "https://msg.mram.com.bd/smsapi";

    // Create a new SMS configuration
    const newSMS = await SMS.create({
      appName,
      apiKey,
      type: type || "unicode",
      senderId,
      service,
      message: message.trim(),
      baseUrl,
    });

    // Return response
    const smsResponse = {
      id: newSMS.id,
      appName: newSMS.appName,
      apiKey: newSMS.apiKey,
      type: newSMS.type,
      senderId: newSMS.senderId,
      service: newSMS.service,
      message: newSMS.message,
      baseUrl: newSMS.baseUrl,
      createdAt: newSMS.createdAt,
      updatedAt: newSMS.updatedAt
    };

    return res.status(201).json({
      message: "SMS configuration created successfully!",
      data: smsResponse,
    });
  } catch (error) {
    next(error);
  }
};

//! Get all SMS Configurations with pagination and filters
const getAllSMS = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Extract filters
    const { search, status, type, service } = req.query;
    let whereCondition = {};

    // Add search filter
    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { appName: { [Op.like]: `%${search}%` } },
          { senderId: { [Op.like]: `%${search}%` } },
          { service: { [Op.like]: `%${search}%` } },
          { message: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Add type filter
    if (type) {
      whereCondition.type = type;
    }

    // Add service filter
    if (service) {
      whereCondition.service = service;
    }

    // Fetch paginated SMS configurations
    const { count, rows: smsConfigs } = await SMS.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (!smsConfigs || smsConfigs.length === 0) {
      return res.status(404).json({
        message: "No SMS configurations found.",
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
      message: "SMS configurations retrieved successfully!",
      data: smsConfigs,
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

//! Update SMS Configuration
const updateSMS = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { appName, apiKey, type, senderId, service, message } = req.body;

    // Find the SMS configuration by ID
    const smsToUpdate = await SMS.findOne({ where: { id } });

    if (!smsToUpdate) {
      return res.status(404).json({
        message: "SMS configuration not found!",
      });
    }

    // Validate type if provided
    if (type) {
      const validTypes = ["unicode", "text", "flash"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          message: "Type must be either 'unicode', 'text', or 'flash'.",
        });
      }
    }

    // Validate service if provided
    if (service) {
      const validServices = ["Bill collection", "Reminder", "Account Creation", "Salary receive", "Client Disable", "Client Enable", "Bill Due", "Bill Due Notice", "Bill Due Final Notice"];
      if (!validServices.includes(service)) {
        return res.status(400).json({
           message: "Service must be one of: Bill collection, Reminder, Account Creation, Salary receive, Client Disable, Client Enable, Bill Due, Bill Due Notice, Bill Due Final Notice",
        });
      }
    }

    // Validate message if provided
    if (message !== undefined) {
      if (message.trim() === '') {
        return res.status(400).json({
          message: "Message cannot be empty.",
        });
      }
    }

    // Update the SMS configuration fields
    if (appName) smsToUpdate.appName = appName;
    if (apiKey) smsToUpdate.apiKey = apiKey;
    if (type) smsToUpdate.type = type;
    if (senderId) smsToUpdate.senderId = senderId;
    if (service) smsToUpdate.service = service;
    if (message !== undefined) smsToUpdate.message = message.trim();

    // Save the updated SMS configuration
    await smsToUpdate.save();

    // Return response
    const updatedResponse = {
      id: smsToUpdate.id,
      appName: smsToUpdate.appName,
      apiKey: smsToUpdate.apiKey,
      type: smsToUpdate.type,
      senderId: smsToUpdate.senderId,
      service: smsToUpdate.service,
      message: smsToUpdate.message,
      baseUrl: smsToUpdate.baseUrl,
      createdAt: smsToUpdate.createdAt,
      updatedAt: smsToUpdate.updatedAt
    };

    return res.status(200).json({
      message: "SMS configuration updated successfully!",
      data: updatedResponse,
    });
  } catch (error) {
    next(error);
  }
};

//! Delete SMS Configuration
const deleteSMS = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the SMS configuration by ID
    const smsToDelete = await SMS.findOne({ where: { id } });

    if (!smsToDelete) {
      return res.status(404).json({
        message: "SMS configuration not found!",
      });
    }
    
    // Delete the SMS configuration
    await smsToDelete.destroy();

    return res.status(200).json({
      message: "SMS configuration deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

//! Get SMS Configuration by ID
const getSMSById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the SMS configuration by ID
    const sms = await SMS.findOne({ 
      where: { id }
    });

    if (!sms) {
      return res.status(404).json({
        message: "SMS configuration not found!",
      });
    }

    return res.status(200).json({
      message: "SMS configuration retrieved successfully!",
      data: sms,
    });
  } catch (error) {
    next(error);
  }
};

//! Test SMS Configuration
const testSMS = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phoneNumber, customMessage } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Phone number is required for testing.",
      });
    }

    // Find the SMS configuration by ID
    const sms = await SMS.findOne({ where: { id } });

    if (!sms) {
      return res.status(404).json({
        message: "SMS configuration not found!",
      });
    }

    // Use custom message if provided, otherwise use saved message
    const messageToSend = customMessage || sms.message;
    
    // Construct the test URL
    const testUrl = `${sms.baseUrl}?api_key=${sms.apiKey}&type=${sms.type}&contacts=${phoneNumber}&senderid=${sms.senderId}&msg=${encodeURIComponent(messageToSend)}`;

    // In a real implementation, you would make an HTTP request here
    // For now, we'll simulate a response
    
    // Simulate API call
    const isSuccess = Math.random() > 0.3; // 70% success rate for simulation

    if (isSuccess) {
      return res.status(200).json({
        message: "Test SMS sent successfully!",
        data: {
          testUrl: testUrl,
          status: "success",
          simulated: true,
          details: {
            to: phoneNumber,
            messageLength: messageToSend.length,
            type: sms.type,
            senderId: sms.senderId,
            service: sms.service
          }
        },
      });
    } else {
      return res.status(500).json({
        message: "Failed to send test SMS. Please check your configuration.",
        data: {
          testUrl: testUrl,
          status: "failed",
          simulated: true
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSMS,
  getAllSMS,
  updateSMS,
  deleteSMS,
  getSMSById,
  testSMS
};