const sequelize = require("../../database/connection");
const Reminder = require("../../models/reminder/reminder.model");
const { Op } = require("sequelize");
const { sendSMSHelper } = require("../../utils/helper/sendSMS");
const ClientInformation = require("../../models/Authentication/client.model");

//! Create new reminder
const createReminder = async (req, res, next) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      serviceType,
      packageName,
      amountDue,
      dueDate,
      reminderType,
      reminderMethod,
      message,
      scheduledAt,
      priority,
      notes,
      isRecurring,
      recurrencePattern
    } = req.body;

    // Validate required fields
    if (!customerId || !customerName || !customerPhone || !packageName || !amountDue || !dueDate) {
      return res.status(400).json({ 
        message: "Missing required fields: customerId, customerName, customerPhone, packageName, amountDue, dueDate" 
      });
    }

    // Create new reminder
    const newReminder = await Reminder.create({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      serviceType: serviceType || 'Internet',
      packageName,
      amountDue,
      dueDate,
      reminderType: reminderType || 'Payment Due',
      reminderMethod: reminderMethod || 'SMS',
      message: message || `Dear ${customerName}, your payment of ${amountDue} for ${packageName} is due on ${new Date(dueDate).toLocaleDateString()}. Please make payment to avoid service interruption.`,
      scheduledAt,
      priority: priority || 'Medium',
      notes,
      isRecurring: isRecurring || false,
      recurrencePattern,
      createdBy: req.user?.id || 'admin'
    });

    console.log(newReminder);

    // Send reminder SMS to customer
    if (newReminder) {
      const client = await ClientInformation.findOne({
        where: { id: customerId }
      });

      if (client) {
        // Format due date in Bengali
        const dueDateObj = new Date(dueDate);
        const formattedDueDate = dueDateObj.toLocaleDateString('bn-BD', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
        const result = await sendSMSHelper(
          'Reminder',
          customerPhone,
          client.id,
          null, // Use default message from database
          {
            fullName: customerName,
            dueAmount: amountDue.toString(),
            packageName: packageName,
            dueDate: formattedDueDate,
            customerId: customerId,
            serviceType: serviceType || 'Internet'
          }
        );
        
        // Send admin copy
        await sendSMSHelper(
          "Reminder",
          '+8801684175551',
          client.id,
          null,
          {
            fullName: customerName,
            dueAmount: amountDue.toString(),
            packageName: packageName,
            customerId: customerId
          }
        );
      }
    }

    return res.status(201).json({
      message: "Reminder created successfully!",
      data: newReminder
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    next(error);
  }
};

//! Get all reminders with filtering and pagination
const getAllReminders = async (req, res, next) => {
  try {
    const { 
      page = 1,
      limit = 10,
      search,
      reminderType,
      status,
      priority,
      reminderMethod,
      serviceType,
      isRecurring,
      startDate,
      endDate,
      sortBy = 'scheduledAt',
      sortOrder = 'DESC'
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};
    
    // Handle reminderType filter (ignore empty strings)
    if (reminderType && reminderType !== '') {
      whereClause.reminderType = reminderType;
    }
    
    // Handle status filter (ignore empty strings)
    if (status && status !== '') {
      whereClause.status = status;
    }
    
    // Handle priority filter (ignore empty strings)
    if (priority && priority !== '') {
      whereClause.priority = priority;
    }
    
    // Handle reminderMethod filter (ignore empty strings)
    if (reminderMethod && reminderMethod !== '') {
      whereClause.reminderMethod = reminderMethod;
    }
    
    // Handle serviceType filter (ignore empty strings)
    if (serviceType && serviceType !== '') {
      whereClause.serviceType = serviceType;
    }
    
    // Handle isRecurring filter (convert string to boolean, ignore empty strings)
    if (isRecurring !== undefined && isRecurring !== '') {
      whereClause.isRecurring = isRecurring === 'true';
    }
    
    // Date range filter
    if (startDate || endDate) {
      whereClause.dueDate = {};
      if (startDate && startDate !== '') {
        whereClause.dueDate[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate !== '') {
        whereClause.dueDate[Op.lte] = new Date(endDate);
      }
    }
    
    // Search filter (ignore empty strings)
    if (search && search !== '') {
      whereClause[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { customerPhone: { [Op.like]: `%${search}%` } },
        { customerEmail: { [Op.like]: `%${search}%` } },
        { packageName: { [Op.like]: `%${search}%` } },
        { reminderId: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate and set sort order
    const validSortOrders = ['ASC', 'DESC'];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) 
      ? sortOrder.toUpperCase() 
      : 'DESC';

    // Validate sortBy field to prevent SQL injection
    const validSortFields = [
      'customerName', 'reminderType', 'status', 'priority', 'dueDate', 
      'scheduledAt', 'amountDue', 'createdAt', 'updatedAt'
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'scheduledAt';

    const reminders = await Reminder.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      message: "Reminders retrieved successfully!",
      data: reminders.rows,
      meta: {
        totalItems: reminders.count,
        totalPages: Math.ceil(reminders.count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving reminders:", error);
    next(error);
  }
};

//! Get reminder by ID
const getReminderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid reminder ID" });
    }

    const reminder = await Reminder.findOne({ where: { id } });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    return res.status(200).json({
      message: "Reminder retrieved successfully!",
      data: reminder
    });
  } catch (error) {
    console.error("Error retrieving reminder:", error);
    next(error);
  }
};







//! Problematic area need to be fixed. 
// Update reminder
const updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid reminder ID" });
    }

    // Find the reminder
    const reminder = await Reminder.findOne({ where: { id } });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    // Prevent updating reminderId and id
    delete updateData.reminderId;
    delete updateData.id;

    // Update the reminder
    await reminder.update({
      ...updateData,
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      message: "Reminder updated successfully!",
      data: reminder
    });
  } catch (error) {
    console.error("Error updating reminder:", error);
    next(error);
  }
};







// Delete reminder
const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid reminder ID" });
    }

    const reminder = await Reminder.findOne({ where: { id } });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await reminder.destroy();

    return res.status(200).json({
      message: "Reminder deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    next(error);
  }
};

// Send reminder immediately
const sendReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid reminder ID" });
    }

    const reminder = await Reminder.findOne({ where: { id } });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.status === 'Sent') {
      return res.status(400).json({ message: "Reminder has already been sent" });
    }

    // Simulate sending reminder (integrate with your SMS/Email service)
    try {
      // TODO: Integrate with actual SMS/Email service
      console.log(`Sending reminder to ${reminder.customerPhone}: ${reminder.message}`);
      
      // Update reminder status
      await reminder.update({
        status: 'Sent',
        sentAt: new Date(),
        responseData: { sent: true, timestamp: new Date() },
        updatedBy: req.user?.id || 'admin'
      });

      return res.status(200).json({
        message: "Reminder sent successfully!",
        data: reminder
      });
    } catch (sendError) {
      // Update reminder status to failed
      await reminder.update({
        status: 'Failed',
        retryCount: reminder.retryCount + 1,
        responseData: { error: sendError.message },
        updatedBy: req.user?.id || 'admin'
      });

      return res.status(500).json({
        message: "Failed to send reminder",
        error: sendError.message
      });
    }
  } catch (error) {
    console.error("Error sending reminder:", error);
    next(error);
  }
};

// Get reminder statistics
const getReminderStats = async (req, res, next) => {
  try {
    const totalReminders = await Reminder.count();
    const pendingReminders = await Reminder.count({ where: { status: 'Pending' } });
    const sentReminders = await Reminder.count({ where: { status: 'Sent' } });
    const failedReminders = await Reminder.count({ where: { status: 'Failed' } });

    const typeStats = await Reminder.findAll({
      attributes: [
        'reminderType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['reminderType']
    });

    const priorityStats = await Reminder.findAll({
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['priority']
    });

    // Calculate overdue reminders
    const overdueReminders = await Reminder.count({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.in]: ['Pending', 'Failed'] }
      }
    });

    return res.status(200).json({
      message: "Reminder statistics retrieved successfully!",
      data: {
        totalReminders,
        pendingReminders,
        sentReminders,
        failedReminders,
        overdueReminders,
        typeBreakdown: typeStats,
        priorityBreakdown: priorityStats
      }
    });
  } catch (error) {
    console.error("Error retrieving reminder statistics:", error);
    next(error);
  }
};

// Bulk create reminders (for multiple customers)
const createBulkReminders = async (req, res, next) => {
  try {
    const { reminders } = req.body;

    if (!reminders || !Array.isArray(reminders) || reminders.length === 0) {
      return res.status(400).json({ 
        message: "Reminders array is required" 
      });
    }

    // Validate each reminder
    for (const reminder of reminders) {
      if (!reminder.customerId || !reminder.customerName || !reminder.customerPhone || 
          !reminder.packageName || !reminder.amountDue || !reminder.dueDate) {
        return res.status(400).json({ 
          message: "Each reminder must have customerId, customerName, customerPhone, packageName, amountDue, and dueDate" 
        });
      }
    }

    const createdReminders = await Reminder.bulkCreate(
      reminders.map(reminder => ({
        ...reminder,
        reminderType: reminder.reminderType || 'Payment Due',
        reminderMethod: reminder.reminderMethod || 'SMS',
        serviceType: reminder.serviceType || 'Internet',
        priority: reminder.priority || 'Medium',
        status: 'Pending',
        createdBy: req.user?.id || 'admin'
      }))
    );

    return res.status(201).json({
      message: `${createdReminders.length} reminders created successfully!`,
      data: createdReminders
    });
  } catch (error) {
    console.error("Error creating bulk reminders:", error);
    next(error);
  }
};

// Cancel reminder
const cancelReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid reminder ID" });
    }

    const reminder = await Reminder.findOne({ where: { id } });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.status === 'Sent') {
      return res.status(400).json({ message: "Cannot cancel already sent reminder" });
    }

    await reminder.update({
      status: 'Cancelled',
      updatedBy: req.user?.id || 'admin'
    });

    return res.status(200).json({
      message: "Reminder cancelled successfully!",
      data: reminder
    });
  } catch (error) {
    console.error("Error cancelling reminder:", error);
    next(error);
  }
};





// Check if user has pending/warning reminders
const getUserWarningStatus = async (req, res, next) => {
  try {
    const { customerEmail } = req.query;
    
    if (!customerEmail || customerEmail.trim() === '') {
      return res.status(400).json({ 
        message: "Customer email is required" 
      });
    }

    const currentDate = new Date();
    
    // Find all reminders for this customer that are pending or failed
    const customerReminders = await Reminder.findAll({
      where: {
        customerEmail: customerEmail.trim(),
        status: { [Op.in]: ['Pending', 'Failed'] }
      },
      order: [['dueDate', 'ASC']]
    });

    if (!customerReminders || customerReminders.length === 0) {
      return res.status(200).json({
        message: "No pending reminders found for this user",
        hasWarning: false,
        warnings: [],
        nextDueDate: null,
        totalPending: 0
      });
    }

    // Check each reminder to see if it should trigger a warning
    const warnings = [];
    let hasWarning = false;
    let earliestDueDate = null;

    for (const reminder of customerReminders) {
      const dueDate = new Date(reminder.dueDate);
      const scheduledAt = reminder.scheduledAt ? new Date(reminder.scheduledAt) : null;
      
      let warningReason = '';
      let warningLevel = 'info'; // info, warning, danger
      let shouldWarn = false;

      // Rule 1: Check if due date has passed (Overdue)
      if (dueDate < currentDate) {
        warningReason = `Payment overdue since ${formatDate(dueDate)}`;
        warningLevel = 'danger';
        shouldWarn = true;
        hasWarning = true;
      }
      // Rule 2: Check if due date is within 3 days (Approaching due date)
      else {
        const daysUntilDue = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 3 && daysUntilDue > 0) {
          warningReason = `Payment due in ${daysUntilDue} day(s) (${formatDate(dueDate)})`;
          warningLevel = 'warning';
          shouldWarn = true;
          hasWarning = true;
        }
        // Rule 3: Check if scheduled reminder time has arrived
        else if (scheduledAt && scheduledAt <= currentDate) {
          warningReason = `Scheduled reminder triggered for ${formatDate(dueDate)}`;
          warningLevel = 'info';
          shouldWarn = true;
          hasWarning = true;
        }
      }

      // Rule 4: Check for high priority reminders (always warn)
      if (reminder.priority === 'High' && reminder.status === 'Pending') {
        warningReason = `High priority reminder: ${reminder.reminderType}`;
        warningLevel = 'warning';
        shouldWarn = true;
        hasWarning = true;
      }

      if (shouldWarn) {
        warnings.push({
          reminderId: reminder.id,
          reminderType: reminder.reminderType,
          packageName: reminder.packageName,
          amountDue: reminder.amountDue,
          dueDate: reminder.dueDate,
          scheduledAt: reminder.scheduledAt,
          status: reminder.status,
          priority: reminder.priority,
          warningReason,
          warningLevel,
          message: reminder.message
        });
      }

      // Track earliest due date for response
      if (!earliestDueDate || dueDate < new Date(earliestDueDate)) {
        earliestDueDate = reminder.dueDate;
      }
    }

    // Helper function to format dates
    function formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    return res.status(200).json({
      message: hasWarning 
        ? "User has pending warnings" 
        : "No active warnings for user",
      hasWarning,
      warningCount: warnings.length,
      warnings,
      nextDueDate: earliestDueDate,
      totalPending: customerReminders.length,
      customerEmail: customerEmail.trim()
    });

  } catch (error) {
    console.error("Error checking user warning status:", error);
    next(error);
  }
};

module.exports = {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  sendReminder,
  getReminderStats,
  createBulkReminders,
  cancelReminder,
  getUserWarningStatus
};