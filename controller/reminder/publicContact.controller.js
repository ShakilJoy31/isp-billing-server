// controller/contact/contact.controller.js
const { Op } = require("sequelize");
const PublicMessageContact = require("../../models/live-chat/publicContact.model");
const sequelize = require("../../database/connection");

//! Create new contact (Public API)
const createPublicContact = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Create new contact
    const newContact = await Contact.create({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: {
        id: newContact.id,
        name: newContact.name,
        email: newContact.email,
        subject: newContact.subject,
        created_at: newContact.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    next(error);
  }
};

//! Get all contacts with pagination (Admin only)
const getAllPublicContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};

    // Date range filter
    if (startDate || endDate) {
      whereClause.created_at = {};
      if (startDate && startDate !== "") {
        whereClause.created_at[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== "") {
        whereClause.created_at[Op.lte] = new Date(endDate);
      }
    }

    // Search filter
    if (search && search !== "") {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { message: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate and set sort order
    const validSortOrders = ["ASC", "DESC"];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    // Validate sortBy field
    const validSortFields = [
      "name",
      "email",
      "created_at",
      "updated_at",
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "created_at";

    const contacts = await PublicMessageContact.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Calculate total statistics
    const totalContacts = await PublicMessageContact.count();
    const todayContacts = await PublicMessageContact.count({
      where: {
        created_at: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          [Op.lte]: new Date(),
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully!",
      data: contacts.rows,
      statistics: {
        total: totalContacts,
        today: todayContacts,
      },
      meta: {
        totalItems: contacts.count,
        totalPages: Math.ceil(contacts.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    next(error);
  }
};

//! Get contact by ID (Admin only)
const getPublicContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await PublicMessageContact.findOne({ where: { id } });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact retrieved successfully!",
      data: contact,
    });
  } catch (error) {
    console.error("Error retrieving contact:", error);
    next(error);
  }
};

//! Update contact (Admin only - for marking as responded)
const updatePublicContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      notes,
      status,
    } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await PublicMessageContact.findOne({ where: { id } });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const updateData = {};

    // Only allow status and notes updates for basic model
    if (status && ["pending", "reviewed", "resolved"].includes(status)) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Update the contact
    await contact.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully!",
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    next(error);
  }
};

//! Delete contact (Admin only)
const deletePublicContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    const contact = await PublicMessageContact.findOne({ where: { id } });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await contact.destroy();

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    next(error);
  }
};

//! Bulk delete contacts (Admin only)
const bulkDeletePublicContacts = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of contact IDs",
      });
    }

    const result = await PublicMessageContact.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `${result} contact(s) deleted successfully`,
      deletedCount: result,
    });
  } catch (error) {
    console.error("Error bulk deleting contacts:", error);
    next(error);
  }
};

//! Get contact statistics (Admin only)
const getPublicContactStats = async (req, res, next) => {
  try {
    // Get today's contacts
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayContacts = await PublicMessageContact.count({
      where: {
        created_at: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    // Get yesterday's contacts
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    const yesterdayContacts = await PublicMessageContact.count({
      where: {
        created_at: {
          [Op.between]: [yesterdayStart, yesterdayEnd],
        },
      },
    });

    // Get this week's contacts
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const thisWeekContacts = await PublicMessageContact.count({
      where: {
        created_at: {
          [Op.gte]: weekStart,
        },
      },
    });

    // Get this month's contacts
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const thisMonthContacts = await PublicMessageContact.count({
      where: {
        created_at: {
          [Op.gte]: monthStart,
        },
      },
    });

    // Get total contacts
    const totalContacts = await PublicMessageContact.count();

    // Get contacts by email domain
    const domainStats = await PublicMessageContact.findAll({
      attributes: [
        [
          sequelize.fn(
            'SUBSTRING_INDEX',
            sequelize.col('email'),
            '@',
            -1
          ),
          'domain'
        ],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['domain'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      message: "Contact statistics retrieved successfully!",
      data: {
        today: todayContacts,
        yesterday: yesterdayContacts,
        thisWeek: thisWeekContacts,
        thisMonth: thisMonthContacts,
        total: totalContacts,
        domainStats: domainStats,
      },
    });
  } catch (error) {
    console.error("Error retrieving contact statistics:", error);
    next(error);
  }
};

module.exports = {
  createPublicContact,
  getAllPublicContacts,
  getPublicContactById,
  updatePublicContact,
  deletePublicContact,
  bulkDeletePublicContacts,
  getPublicContactStats,
};