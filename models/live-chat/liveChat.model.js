const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Chat = sequelize.define("Chat", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  chatId: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: dt.STRING,
    allowNull: true,
    comment: "Chat title for group chats or custom naming"
  },
  chatType: {
    type: dt.ENUM('User-Support', 'User-User', 'Group', 'Broadcast'),
    allowNull: false,
    defaultValue: 'User-Support'
  },
  status: {
    type: dt.ENUM('Active', 'Resolved', 'Closed', 'Archived'),
    allowNull: false,
    defaultValue: 'Active'
  },
  priority: {
    type: dt.ENUM('Low', 'Normal', 'High', 'Urgent'),
    allowNull: false,
    defaultValue: 'Normal'
  },
  category: {
    type: dt.ENUM(
      'Billing',
      'Technical',
      'Connection',
      'Package',
      'Speed',
      'General',
      'Complaint',
      'Feedback'
    ),
    allowNull: false,
    defaultValue: 'General'
  },
  lastMessageAt: {
    type: dt.DATE,
    allowNull: true,
  },
  createdBy: {
    type: dt.INTEGER,
    allowNull: false,
    comment: "User ID who created the chat"
  },
  assignedTo: {
    type: dt.INTEGER,
    allowNull: true,
    comment: "Support agent/Admin assigned to handle"
  },
  metadata: {
    type: dt.JSON,
    allowNull: true,
    comment: "Additional chat metadata"
  }
}, {
  hooks: {
    beforeValidate: (chat) => {
      if (!chat.chatId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        chat.chatId = `CHAT${timestamp}${random}`;
      }
    }
  },
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['createdBy']
    },
    {
      fields: ['assignedTo']
    },
    {
      fields: ['lastMessageAt']
    },
    {
      fields: ['priority']
    }
  ]
});

const ChatMessage = sequelize.define("ChatMessage", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  messageId: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  chatId: {
    type: dt.INTEGER,
    allowNull: false,
    references: {
      model: Chat,
      key: 'id'
    }
  },
  senderId: {
    type: dt.INTEGER,
    allowNull: false,
  },
  senderType: {
    type: dt.ENUM('User', 'Support', 'System'),
    allowNull: false,
    defaultValue: 'User'
  },
  messageType: {
    type: dt.ENUM('Text', 'Image', 'File', 'Location', 'System'),
    allowNull: false,
    defaultValue: 'Text'
  },
  content: {
    type: dt.TEXT,
    allowNull: true,
    comment: "Text content or caption for media messages"
  },
  attachments: {
    type: dt.JSON,
    allowNull: true,
    comment: "Array of file attachments with metadata"
  },
  readBy: {
    type: dt.JSON,
    allowNull: true,
    defaultValue: [],
    comment: "Array of user IDs who read the message"
  },
  deliveredTo: {
    type: dt.JSON,
    allowNull: true,
    defaultValue: [],
    comment: "Array of user IDs who received the message"
  },
  status: {
    type: dt.ENUM('Sent', 'Delivered', 'Read', 'Failed'),
    allowNull: false,
    defaultValue: 'Sent'
  },
  replyTo: {
    type: dt.INTEGER,
    allowNull: true,
    comment: "Reference to replied message ID"
  },
  metadata: {
    type: dt.JSON,
    allowNull: true,
  },
  isEdited: {
    type: dt.BOOLEAN,
    defaultValue: false
  },
  editedAt: {
    type: dt.DATE,
    allowNull: true
  },
  deletedAt: {
    type: dt.DATE,
    allowNull: true
  },
  deletedBy: {
    type: dt.INTEGER,
    allowNull: true
  }
}, {
  hooks: {
    beforeValidate: (message) => {
      if (!message.messageId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        message.messageId = `MSG${timestamp}${random}`;
      }
    },
    afterCreate: async (message) => {
      // Update chat's last message timestamp
      await Chat.update(
        { lastMessageAt: new Date() },
        { where: { id: message.chatId } }
      );
    }
  },
  indexes: [
    {
      fields: ['chatId', 'createdAt']
    },
    {
      fields: ['senderId']
    },
    {
      fields: ['status']
    }
  ]
});

const ChatParticipant = sequelize.define("ChatParticipant", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  chatId: {
    type: dt.INTEGER,
    allowNull: false,
    references: {
      model: Chat,
      key: 'id'
    }
  },
  userId: {
    type: dt.INTEGER,
    allowNull: false,
  },
  userType: {
    type: dt.ENUM('User', 'Support', 'Admin'),
    allowNull: false,
    defaultValue: 'User'
  },
  role: {
    type: dt.ENUM('Member', 'Admin', 'Creator'),
    allowNull: false,
    defaultValue: 'Member'
  },
  joinedAt: {
    type: dt.DATE,
    defaultValue: dt.NOW
  },
  lastSeenAt: {
    type: dt.DATE,
    allowNull: true,
  },
  isMuted: {
    type: dt.BOOLEAN,
    defaultValue: false
  },
  isArchived: {
    type: dt.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: [
    {
      fields: ['chatId', 'userId'],
      unique: true
    },
    {
      fields: ['userId']
    },
    {
      fields: ['lastSeenAt']
    }
  ]
});

// Define associations
Chat.hasMany(ChatMessage, { foreignKey: 'chatId', onDelete: 'CASCADE' });
ChatMessage.belongsTo(Chat, { foreignKey: 'chatId' });

Chat.hasMany(ChatParticipant, { foreignKey: 'chatId', onDelete: 'CASCADE' });
ChatParticipant.belongsTo(Chat, { foreignKey: 'chatId' });

module.exports = {
  Chat,
  ChatMessage,
  ChatParticipant
};