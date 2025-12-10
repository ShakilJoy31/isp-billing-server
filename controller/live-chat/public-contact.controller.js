// controllers/contact.controller.js
const { Op } = require("sequelize");
const Contact = require("../../models/live-chat/public-contact.model");

// Create new contact
const createContact = async (req, res, next) => {
  try {
    const {
      section,
      title,
      subtitle,
      description,
      phone,
      email,
      address,
      city,
      country,
      working_hours,
      whatsapp,
      telegram,
      facebook,
      linkedin,
      instagram,
      imo,
      latitude,
      longitude,
      icon,
      color,
      bg_color,
      display_order,
      additional_details,
      is_active
    } = req.body;

    // Validate required fields
    if (!section || !title) {
      return res.status(400).json({
        success: false,
        message: "Section and title are required fields"
      });
    }

    // Validate section
    const validSections = ['contact_info', 'office_locations'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section. Valid sections are: contact_info, office_locations"
      });
    }

    // Format WhatsApp URL if provided
    let formattedWhatsapp = whatsapp;
    if (whatsapp && !whatsapp.startsWith('http')) {
      const phoneNumber = whatsapp.replace(/\D/g, '');
      formattedWhatsapp = `https://wa.me/${phoneNumber}`;
    }

    // Format Telegram URL if provided
    let formattedTelegram = telegram;
    if (telegram && !telegram.startsWith('http')) {
      const username = telegram.replace(/^@/, '');
      formattedTelegram = `https://t.me/${username}`;
    }

    // Create new contact
    const newContact = await Contact.create({
      section,
      title,
      subtitle: subtitle || null,
      description: description || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      city: city || null,
      country: country || null,
      working_hours: working_hours || null,
      whatsapp: formattedWhatsapp || null,
      telegram: formattedTelegram || null,
      facebook: facebook || null,
      linkedin: linkedin || null,
      instagram: instagram || null,
      imo: imo || null,
      latitude: latitude || null,
      longitude: longitude || null,
      icon: icon || 'phone',
      color: color || 'from-blue-500 to-cyan-400',
      bg_color: bg_color || 'bg-blue-500/10',
      display_order: display_order || 0,
      additional_details: additional_details || [],
      is_active: is_active !== undefined ? is_active : true,
      created_by: req.user?.id || 'admin'
    });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully!",
      data: newContact
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating contact",
      error: error.message
    });
  }
};

// Get all contacts (for admin panel)
const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      section,
      search,
      is_active,
      sortBy = 'display_order',
      sortOrder = 'ASC'
    } = req.query;

    // Build where clause
    const whereClause = {};
    
    if (section && section !== '') {
      whereClause.section = section;
    }
    
    if (is_active !== undefined && is_active !== '') {
      whereClause.is_active = is_active === 'true';
    }
    
    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { phone: { [Op.like]: `%${search.trim()}%` } },
        { email: { [Op.like]: `%${search.trim()}%` } },
        { address: { [Op.like]: `%${search.trim()}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate sort order
    const validSortOrders = ['ASC', 'DESC'];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'ASC';

    // Get contacts with pagination
    const { rows, count } = await Contact.findAndCountAll({
      where: whereClause,
      order: [[sortBy, finalSortOrder]],
      limit: parseInt(limit) > 100 ? 100 : parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully!",
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving contacts",
      error: error.message
    });
  }
};

// Get active contacts (for frontend - single endpoint)
const getActiveContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll({
      where: { is_active: true },
      order: [['section', 'ASC'], ['display_order', 'ASC']]
    });

    // Structure data for frontend
    const structuredData = {
      contact_info: contacts.filter(c => c.section === 'contact_info'),
      office_locations: contacts.filter(c => c.section === 'office_locations')
    };

    return res.status(200).json({
      success: true,
      message: "Active contacts retrieved successfully!",
      data: structuredData,
      count: contacts.length
    });
  } catch (error) {
    console.error("Error retrieving active contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving active contacts",
      error: error.message
    });
  }
};

// Get single contact by ID
const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact retrieved successfully!",
      data: contact
    });
  } catch (error) {
    console.error("Error retrieving contact:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving contact",
      error: error.message
    });
  }
};

// Update contact
const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    // Format WhatsApp URL if provided
    if (updateData.whatsapp && !updateData.whatsapp.startsWith('http')) {
      const phoneNumber = updateData.whatsapp.replace(/\D/g, '');
      updateData.whatsapp = `https://wa.me/${phoneNumber}`;
    }

    // Format Telegram URL if provided
    if (updateData.telegram && !updateData.telegram.startsWith('http')) {
      const username = updateData.telegram.replace(/^@/, '');
      updateData.telegram = `https://t.me/${username}`;
    }

    // Update the contact
    await contact.update({
      ...updateData,
      updated_by: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully!",
      data: contact
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating contact",
      error: error.message
    });
  }
};

// Delete contact
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    await contact.destroy();

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting contact",
      error: error.message
    });
  }
};

// Toggle contact status
const toggleContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    await contact.update({
      is_active: !contact.is_active,
      updated_by: req.user?.id || 'admin'
    });

    return res.status(200).json({
      success: true,
      message: `Contact ${contact.is_active ? 'activated' : 'deactivated'} successfully!`,
      data: contact
    });
  } catch (error) {
    console.error("Error toggling contact status:", error);
    return res.status(500).json({
      success: false,
      message: "Error toggling contact status",
      error: error.message
    });
  }
};

// Seed initial contact data (one-time setup)
const seedInitialContacts = async (req, res, next) => {
  try {
    // Check if contacts already exist
    const existingCount = await Contact.count();
    
    if (existingCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Contacts already exist. Use update instead."
      });
    }

    const initialData = [
      // Contact Information Cards
      {
        section: 'contact_info',
        title: 'Phone Support',
        subtitle: '24/7 Customer Support',
        icon: 'phone',
        color: 'from-blue-500 to-cyan-400',
        bg_color: 'bg-blue-500/10',
        phone: '(+88) 872-670-780',
        display_order: 1,
        additional_details: [
          { label: '24/7 Hotline', value: '(+88) 872-670-780' },
          { label: 'Sales Department', value: '(+88) 422-655-793' },
          { label: 'Emergency Support', value: '(+88) 123-456-789' }
        ],
        is_active: true
      },
      {
        section: 'contact_info',
        title: 'Email Support',
        subtitle: 'Email us anytime',
        icon: 'mail',
        color: 'from-purple-500 to-pink-400',
        bg_color: 'bg-purple-500/10',
        email: 'info@ringtel.com',
        display_order: 2,
        additional_details: [
          { label: 'General Inquiries', value: 'info@ringtel.com' },
          { label: 'Technical Support', value: 'support@ringtel.com' },
          { label: 'Business Partnership', value: 'sales@ringtel.com' }
        ],
        is_active: true
      },
      {
        section: 'contact_info',
        title: 'Our Location',
        subtitle: 'Visit our headquarters',
        icon: 'map-pin',
        color: 'from-green-500 to-emerald-400',
        bg_color: 'bg-green-500/10',
        address: 'Abbot Favicon Kinney, New York, USA',
        city: 'New York',
        country: 'USA',
        zip_code: '25423',
        display_order: 3,
        additional_details: [
          { label: 'Head Office', value: 'Abbot Favicon Kinney' },
          { label: 'City & State', value: 'New York, USA' },
          { label: 'Postal Code', value: '25423' }
        ],
        is_active: true
      },
      
      // Office Locations with Social Media Links
      {
        section: 'office_locations',
        title: 'Head Office',
        address: 'Abbot Favicon Kinney, New York, USA',
        city: 'New York',
        country: 'USA',
        working_hours: 'Mon-Fri: 9AM-6PM',
        phone: '(+1) 234-567-890',
        email: 'ny-office@ringtel.com',
        whatsapp: 'https://wa.me/1234567890',
        telegram: 'https://t.me/ringtel_support',
        facebook: 'https://facebook.com/ringtel',
        linkedin: 'https://linkedin.com/company/ringtel',
        instagram: 'https://instagram.com/ringtel_official',
        imo: null,
        latitude: 40.7128,
        longitude: -74.0060,
        display_order: 1,
        is_active: true
      },
      {
        section: 'office_locations',
        title: 'Branch Office',
        address: '123 Tech Street, Silicon Valley, CA',
        city: 'Silicon Valley',
        country: 'USA',
        working_hours: 'Mon-Sat: 8AM-7PM',
        phone: '(+1) 987-654-321',
        email: 'ca-branch@ringtel.com',
        whatsapp: 'https://wa.me/1987654321',
        telegram: 'https://t.me/ringtel_california',
        facebook: 'https://facebook.com/ringtel_ca',
        linkedin: null,
        instagram: 'https://instagram.com/ringtel_ca',
        imo: null,
        latitude: 37.7749,
        longitude: -122.4194,
        display_order: 2,
        is_active: true
      },
      {
        section: 'office_locations',
        title: 'Support Center',
        address: '456 Service Road, Austin, TX',
        city: 'Austin',
        country: 'USA',
        working_hours: '24/7 Support',
        phone: '(+1) 800-123-456',
        email: 'support@ringtel.com',
        whatsapp: 'https://wa.me/1800123456',
        telegram: null,
        facebook: 'https://facebook.com/ringtel_texas',
        linkedin: 'https://linkedin.com/company/ringtel-tx',
        instagram: null,
        imo: 'https://imo.im/ringtel_support',
        latitude: 30.2672,
        longitude: -97.7431,
        display_order: 3,
        is_active: true
      }
    ];

    await Contact.bulkCreate(initialData);

    return res.status(201).json({
      success: true,
      message: "Initial contact data seeded successfully!",
      count: initialData.length
    });
  } catch (error) {
    console.error("Error seeding initial contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Error seeding initial contacts",
      error: error.message
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getActiveContacts,
  getContactById,
  updateContact,
  deleteContact,
  toggleContactStatus,
  seedInitialContacts
};