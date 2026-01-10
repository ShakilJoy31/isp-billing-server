const { Op } = require("sequelize");
const Email = require("../../models/email/email.model");

// Create new Email Configuration
const createEmail = async (req, res, next) => {
  try {
    const { appName, email, emailAppPassword, isActive } = req.body;

    // Validate required fields
    if (!appName || !email || !emailAppPassword) {
      return res.status(400).json({
        message: "App name, email, and app password are required fields.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // Validate password length
    if (emailAppPassword.length < 8) {
      return res.status(400).json({
        message: "App password must be at least 8 characters long.",
      });
    }

    // Check if the app name already exists
    const existingEmailByName = await Email.findOne({ 
      where: { appName } 
    });
    
    if (existingEmailByName) {
      return res.status(409).json({
        message: "An email configuration with this app name already exists! Try a different name.",
      });
    }

    // Check if the email already exists
    const existingEmailByAddress = await Email.findOne({ 
      where: { email } 
    });
    
    if (existingEmailByAddress) {
      return res.status(409).json({
        message: "An email configuration with this email address already exists!",
      });
    }

    // Handle active status - if activating new email, deactivate others
    let finalIsActive = isActive !== undefined ? isActive : true;
    
    if (finalIsActive === true) {
      // Deactivate all other emails
      await Email.update(
        { isActive: false },
        {
          where: {
            // No condition needed - deactivate all existing emails
          }
        }
      );
    }

    // Create a new email configuration
    const newEmail = await Email.create({
      appName,
      email,
      emailAppPassword: emailAppPassword,
      isActive: finalIsActive,
    });

    // Return response with plain password
    const emailResponse = {
      id: newEmail.id,
      appName: newEmail.appName,
      email: newEmail.email,
      emailAppPassword: emailAppPassword,
      isActive: newEmail.isActive,
      createdAt: newEmail.createdAt,
      updatedAt: newEmail.updatedAt
    };

    return res.status(201).json({
      message: "Email configuration created successfully!",
      data: emailResponse,
    });
  } catch (error) {
    next(error);
  }
};

//! Get all Email Configurations with pagination and filters
const getAllEmails = async (req, res, next) => {
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
          { appName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Add status filter
    if (status) {
      if (status === 'active') {
        whereCondition.isActive = true;
      } else if (status === 'inactive') {
        whereCondition.isActive = false;
      }
    }

    // Fetch paginated email configurations
    const { count, rows: emails } = await Email.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (!emails || emails.length === 0) {
      return res.status(404).json({
        message: "No email configurations found.",
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
      message: "Email configurations retrieved successfully!",
      data: emails,
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

//! Update Email Configuration
const updateEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { appName, email, emailAppPassword, isActive } = req.body;

    // Find the email configuration by ID
    const emailToUpdate = await Email.findOne({ where: { id } });

    if (!emailToUpdate) {
      return res.status(404).json({
        message: "Email configuration not found!",
      });
    }

    // Check if the new appName already exists (if it's being updated)
    if (appName && appName !== emailToUpdate.appName) {
      const existingEmail = await Email.findOne({ 
        where: { appName } 
      });
      if (existingEmail) {
        return res.status(409).json({
          message: "An email configuration with this app name already exists! Try a different name.",
        });
      }
    }

    // Check if the new email already exists (excluding current email)
    if (email && email !== emailToUpdate.email) {
      const existingEmail = await Email.findOne({
        where: { 
          email: email,
          id: { [Op.ne]: id } // Not equal to current email id
        }
      });
      
      if (existingEmail) {
        return res.status(409).json({
          message: "An email configuration with this email address already exists!",
        });
      }
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Please enter a valid email address.",
        });
      }
    }

    // Validate password if provided
    if (emailAppPassword && emailAppPassword.length < 8) {
      return res.status(400).json({
        message: "App password must be at least 8 characters long.",
      });
    }

    // Update the email configuration fields
    if (appName) emailToUpdate.appName = appName;
    if (email) emailToUpdate.email = email;
    
    // Handle isActive status - ensure only one email is active at a time
    if (isActive !== undefined) {
      if (isActive === true) {
        // If activating this email, deactivate all others first
        await Email.update(
          { isActive: false },
          {
            where: {
              id: { [Op.ne]: id } // Deactivate all except this one
            }
          }
        );
        emailToUpdate.isActive = true;
      } else {
        // If deactivating this email
        emailToUpdate.isActive = false;
      }
    }
    
    // Update password if provided
    if (emailAppPassword) {
      emailToUpdate.emailAppPassword = emailAppPassword;
    }

    // Save the updated email configuration
    await emailToUpdate.save();

    // Return response with plain password
    const updatedResponse = {
      id: emailToUpdate.id,
      appName: emailToUpdate.appName,
      email: emailToUpdate.email,
      emailAppPassword: emailAppPassword || emailToUpdate.emailAppPassword,
      isActive: emailToUpdate.isActive,
      createdAt: emailToUpdate.createdAt,
      updatedAt: emailToUpdate.updatedAt
    };

    return res.status(200).json({
      message: "Email configuration updated successfully!",
      data: updatedResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Email Configuration
const deleteEmail = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the email configuration by ID
    const emailToDelete = await Email.findOne({ where: { id } });

    if (!emailToDelete) {
      return res.status(404).json({
        message: "Email configuration not found!",
      });
    }

    // Check if this is the active email being deleted
    const wasActive = emailToDelete.isActive;
    
    // Delete the email configuration
    await emailToDelete.destroy();

    // If we deleted the active email, activate the first available email
    if (wasActive) {
      const nextEmail = await Email.findOne({
        order: [['createdAt', 'DESC']]
      });
      
      if (nextEmail) {
        nextEmail.isActive = true;
        await nextEmail.save();
      }
    }

    return res.status(200).json({
      message: "Email configuration deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// Get Email Configuration by ID
const getEmailById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the email configuration by ID
    const email = await Email.findOne({ 
      where: { id }
      // Removed: attributes: { exclude: ['emailAppPassword'] }
    });

    if (!email) {
      return res.status(404).json({
        message: "Email configuration not found!",
      });
    }

    return res.status(200).json({
      message: "Email configuration retrieved successfully!",
      data: email,
    });
  } catch (error) {
    next(error);
  }
};

// Get Email statistics
const getEmailStats = async (req, res, next) => {
  try {
    // Get total email configurations count
    const totalEmails = await Email.count();
    
    // Get active email configurations count
    const activeEmails = await Email.count({ 
      where: { isActive: true } 
    });
    
    // Get inactive email configurations count
    const inactiveEmails = await Email.count({ 
      where: { isActive: false } 
    });

    return res.status(200).json({
      message: "Email configuration statistics retrieved successfully!",
      data: {
        totalEmails,
        activeEmails,
        inactiveEmails,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all active Email Configurations
const getActiveEmails = async (req, res, next) => {
  try {
    const emails = await Email.findAll({
      // Removed: attributes: ['id', 'appName', 'email', 'isActive']
      where: { isActive: true },
      order: [['appName', 'ASC']],
    });

    if (!emails || emails.length === 0) {
      return res.status(404).json({
        message: "No active email configurations found.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Active email configurations retrieved successfully!",
      data: emails,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle Email Configuration status
const toggleEmailStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the email configuration by ID
    const email = await Email.findOne({ where: { id } });

    if (!email) {
      return res.status(404).json({
        message: "Email configuration not found!",
      });
    }

    // Toggle status
    const newStatus = !email.isActive;
    
    if (newStatus === true) {
      // If activating this email, deactivate all others first
      await Email.update(
        { isActive: false },
        {
          where: {
            id: { [Op.ne]: id } // Deactivate all except this one
          }
        }
      );
    }
    
    // Update this email's status
    email.isActive = newStatus;

    // Save the updated email configuration
    await email.save();

    return res.status(200).json({
      message: `Email configuration ${newStatus ? 'activated' : 'deactivated'} successfully!`,
      data: {
        id: email.id,
        appName: email.appName,
        email: email.email,
        emailAppPassword: email.emailAppPassword,
        isActive: email.isActive
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify Email Password
const verifyEmailPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required for verification.",
      });
    }

    // Find the email configuration by ID
    const email = await Email.findOne({ where: { id } });

    if (!email) {
      return res.status(404).json({
        message: "Email configuration not found!",
      });
    }

    // Verify the password (plain text comparison)
    const isValid = email.emailAppPassword === password;

    if (isValid) {
      return res.status(200).json({
        message: "Password verification successful!",
        isValid: true,
      });
    } else {
      return res.status(401).json({
        message: "Password verification failed!",
        isValid: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmail,
  getAllEmails,
  updateEmail,
  deleteEmail,
  getEmailById,
  getEmailStats,
  getActiveEmails,
  toggleEmailStatus,
  verifyEmailPassword
};