const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Reminder = sequelize.define("Reminder", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  reminderId: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  customerId: {
    type: dt.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: dt.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: dt.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: dt.STRING,
    allowNull: true,
  },
  serviceType: {
    type: dt.ENUM(
      'Internet',
      'TV',
      'Phone',
      'Bundle',
      'Installation',
      'Maintenance',
      'Other'
    ),
    allowNull: false,
    defaultValue: 'Internet'
  },
  packageName: {
    type: dt.STRING,
    allowNull: false,
  },
  amountDue: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
  },
  dueDate: {
    type: dt.DATE,
    allowNull: false,
  },
  reminderType: {
    type: dt.ENUM(
      'Payment Due',
      'Payment Overdue',
      'Service Renewal',
      'Contract Expiry',
      'Special Offer',
      'Maintenance Reminder',
      'Custom'
    ),
    allowNull: false,
    defaultValue: 'Payment Due'
  },
  reminderMethod: {
    type: dt.ENUM('SMS', 'Email', 'Both', 'System Only'),
    allowNull: false,
    defaultValue: 'SMS'
  },
  message: {
    type: dt.TEXT,
    allowNull: false,
  },
  status: {
    type: dt.ENUM('Pending', 'Sent', 'Failed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  scheduledAt: {
    type: dt.DATE,
    allowNull: false,
  },
  sentAt: {
    type: dt.DATE,
    allowNull: true,
  },
  priority: {
    type: dt.ENUM('Low', 'Medium', 'High', 'Urgent'),
    allowNull: false,
    defaultValue: 'Medium'
  },
  retryCount: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxRetries: {
    type: dt.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  responseData: {
    type: dt.JSON,
    allowNull: true,
  },
  notes: {
    type: dt.TEXT,
    allowNull: true,
  },
  isRecurring: {
    type: dt.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  recurrencePattern: {
    type: dt.ENUM('Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'),
    allowNull: true,
  },
  nextReminderDate: {
    type: dt.DATE,
    allowNull: true,
  },
  createdBy: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: 'admin'
  },
  updatedBy: {
    type: dt.STRING,
    allowNull: true,
  }
}, {
  hooks: {
    beforeValidate: (reminder) => {
      // Generate reminder ID if not provided
      if (!reminder.reminderId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        reminder.reminderId = `REM${timestamp}${random}`;
      }
      
      // Set scheduledAt to due date if not provided
      if (reminder.dueDate && !reminder.scheduledAt) {
        reminder.scheduledAt = new Date(reminder.dueDate);
        // Schedule reminder 3 days before due date by default
        reminder.scheduledAt.setDate(reminder.scheduledAt.getDate() - 3);
      }
      
      // Set next reminder date for recurring reminders
      if (reminder.isRecurring && reminder.dueDate && !reminder.nextReminderDate) {
        const nextDate = new Date(reminder.dueDate);
        switch (reminder.recurrencePattern) {
          case 'Monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case 'Weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case 'Yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
          default:
            nextDate.setDate(nextDate.getDate() + 1);
        }
        reminder.nextReminderDate = nextDate;
      }
    }
  },
  indexes: [
    {
      fields: ['customerId', 'status']
    },
    {
      fields: ['dueDate']
    },
    {
      fields: ['scheduledAt', 'status']
    },
    {
      fields: ['reminderType']
    }
  ]
});

module.exports = Reminder;