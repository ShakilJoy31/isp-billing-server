const sequelize = require("../../database/connection");
const { Op } = require("sequelize");
const { Chat, ChatMessage, ChatParticipant } = require("../../models/live-chat/liveChat.model");

// Create a new chat (User to Support)
const createChat = async (req, res, next) => {
  try {
    const {
      title,
      category,
      priority,
      message,
      attachments,
      user // Expect user object with id and email
    } = req.body;

    const userId = user?.id || user?.userId;
    const userEmail = user?.email || user?.userId;

    if (!userId) {
      return res.status(400).json({ 
        message: "User information is required" 
      });
    }

    // Validate category if provided
    const validCategories = [
      'Billing', 'Technical', 'Connection', 'Package', 
      'Speed', 'General', 'Complaint', 'Feedback'
    ];
    
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ 
        message: "Invalid category. Valid categories are: " + validCategories.join(', ') 
      });
    }

    // Validate priority if provided
    const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        message: "Invalid priority. Valid priorities are: " + validPriorities.join(', ') 
      });
    }

    // Create new chat
    const newChat = await Chat.create({
      title: title || `Support Chat - ${userEmail}`,
      chatType: 'User-Support',
      category: category || 'General',
      priority: priority || 'Normal',
      createdBy: userId,
      status: 'Active',
      lastMessageAt: new Date()
    });

    // Add user as participant
    await ChatParticipant.create({
      chatId: newChat.id,
      userId: userId,
      userType: 'User',
      role: 'Creator'
    });

    // Add initial message if provided
    let initialMessage = null;
    if (message || (attachments && attachments.length > 0)) {
      initialMessage = await ChatMessage.create({
        chatId: newChat.id,
        senderId: userId,
        senderType: 'User',
        messageType: (attachments && attachments.length > 0) ? 'Image' : 'Text',
        content: message,
        attachments: attachments || null,
        status: 'Sent'
      });
    }

    return res.status(201).json({
      message: "Chat created successfully!",
      data: {
        chat: newChat,
        initialMessage: initialMessage
      }
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    next(error);
  }
};

// Send a message in chat
const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const {
      content,
      messageType = 'Text',
      attachments,
      replyTo,
      user
    } = req.body;

    const userId = user?.id || user?.userId;

    // Validate chatId
    if (!chatId) {
      return res.status(400).json({ message: "Chat id required." });
    }

    if (!userId) {
      return res.status(400).json({ 
        message: "User information is required" 
      });
    }

    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ 
        message: "Message content or attachments required" 
      });
    }

    // Validate message type
    const validMessageTypes = ['Text', 'Image', 'File', 'Location', 'System'];
    if (!validMessageTypes.includes(messageType)) {
      return res.status(400).json({ 
        message: "Invalid message type. Valid types are: " + validMessageTypes.join(', ') 
      });
    }

    // Find the Chat by its chatId string to get the numeric id
    const chat = await Chat.findOne({ 
      where: { chatId: chatId } 
    });

    if (!chat) {
      return res.status(404).json({ 
        message: "Chat not found" 
      });
    }

    // Get the numeric chat id for foreign key reference
    const numericChatId = chat.id;

    // Check user role - Allow admins/support to send messages without being participants
    const isAdminOrSupport = user?.role === 'Admin' || user?.role === 'Support' || user?.role === 'Super-Admin';
    
    // For regular users, check if they are participants
    if (!isAdminOrSupport) {
      const participant = await ChatParticipant.findOne({
        where: { 
          chatId: numericChatId,
          userId: userId 
        }
      });

      if (!participant) {
        return res.status(403).json({ 
          message: "You are not a participant in this chat" 
        });
      }
    }

    // For admins/support, check if they should be added as participants
    if (isAdminOrSupport) {
      const existingParticipant = await ChatParticipant.findOne({
        where: { 
          chatId: numericChatId,
          userId: userId 
        }
      });

      // If admin is not a participant, add them
      if (!existingParticipant) {
        await ChatParticipant.create({
          chatId: numericChatId,
          userId: userId,
          userType: 'Support',
          role: user?.role === 'Super-Admin' ? 'Admin' : 'Member',
          joinedAt: new Date()
        });
      }
    }

    // Parse attachments if it's a string
    let processedAttachments = attachments;
    if (attachments && typeof attachments === 'string') {
      try {
        processedAttachments = JSON.parse(attachments);
      } catch (error) {
        processedAttachments = [attachments];
      }
    }

    // If attachments is an array of strings (URLs), convert to objects
    if (Array.isArray(processedAttachments)) {
      processedAttachments = processedAttachments.map(attachment => {
        if (typeof attachment === 'string') {
          return {
            url: attachment,
            filename: attachment.split('/').pop(),
            uploadedAt: new Date()
          };
        }
        return attachment;
      });
    }

    // Determine message type based on content
    let finalMessageType = messageType;
    if (processedAttachments && processedAttachments.length > 0) {
      const firstAttachment = processedAttachments[0];
      if (firstAttachment.url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const urlLower = firstAttachment.url.toLowerCase();
        const isImage = imageExtensions.some(ext => urlLower.endsWith(ext));
        finalMessageType = isImage ? 'Image' : 'File';
      }
    }

    // Use numericChatId when creating the message
    const newMessage = await ChatMessage.create({
      chatId: numericChatId,
      senderId: userId,
      senderType: isAdminOrSupport ? 'Support' : 'User',
      messageType: finalMessageType,
      content: content || (processedAttachments ? '📎 Attachment' : ''),
      attachments: processedAttachments || null,
      replyTo: replyTo ? parseInt(replyTo) : null,
      status: 'Sent',
      deliveredTo: [userId]
    });

    // Update chat's last message timestamp
    await Chat.update(
      { lastMessageAt: new Date() },
      { where: { id: numericChatId } }
    );

    // Update participant's last seen for sender
    await ChatParticipant.update(
      { lastSeenAt: new Date() },
      { 
        where: { 
          chatId: numericChatId,
          userId: userId 
        }
      }
    );

    return res.status(201).json({
      message: "Message sent successfully!",
      data: newMessage
    });
  } catch (error) {
    console.error("Error sending message:", error);
    next(error);
  }
};





// Get all chats for a user
const getUserChats = async (req, res, next) => {
  try {
    const { userId } = req.query; // Get userId from query params
    const {
      page = 1,
      limit = 20,
      status,
      category,
      search,
      sortBy = 'lastMessageAt',
      sortOrder = 'DESC'
    } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID is required" 
      });
    }

    // Build where clause
    const whereClause = {};
    
    if (status && status !== '') {
      const validStatuses = ['Active', 'Resolved', 'Closed', 'Archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Valid statuses are: " + validStatuses.join(', ') 
        });
      }
      whereClause.status = status;
    }
    
    if (category && category !== '') {
      const validCategories = [
        'Billing', 'Technical', 'Connection', 'Package', 
        'Speed', 'General', 'Complaint', 'Feedback'
      ];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          message: "Invalid category. Valid categories are: " + validCategories.join(', ') 
        });
      }
      whereClause.category = category;
    }
    
    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { chatId: { [Op.like]: `%${search.trim()}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get chats where user is a participant
    const participantChats = await ChatParticipant.findAll({
      where: { userId: parseInt(userId) },
      attributes: ['chatId']
    });

    const chatIds = participantChats.map(p => p.chatId);

    if (chatIds.length === 0) {
      return res.status(200).json({
        message: "No chats found",
        data: [],
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit)
        }
      });
    }

    // Get chats with participants and last message
    const { rows, count } = await Chat.findAndCountAll({
      where: {
        ...whereClause,
        id: { [Op.in]: chatIds }
      },
      include: [
        {
          model: ChatMessage,
          as: 'ChatMessages',
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'content', 'messageType', 'attachments', 'senderId', 'createdAt']
        },
        {
          model: ChatParticipant,
          as: 'ChatParticipants',
          attributes: ['userId', 'userType', 'role', 'lastSeenAt']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
      limit: parseInt(limit) > 100 ? 100 : parseInt(limit), // Cap limit at 100
      offset: offset,
      distinct: true
    });

    // Get unread counts for each chat
    const chatsWithUnread = await Promise.all(
      rows.map(async (chat) => {
        const unreadCount = await ChatMessage.count({
          where: {
            chatId: chat.id,
            senderId: { [Op.ne]: parseInt(userId) },
            [Op.and]: [
              sequelize.where(
                sequelize.fn('JSON_CONTAINS', sequelize.col('readBy'), JSON.stringify(parseInt(userId))),
                0
              ),
              { readBy: { [Op.notLike]: `%${userId}%` } }
            ]
          }
        });

        const chatData = chat.toJSON();
        
        // Get other participants info (excluding current user)
        const otherParticipants = chatData.ChatParticipants?.filter(p => p.userId !== parseInt(userId)) || [];
        
        return {
          ...chatData,
          unreadCount,
          otherParticipants,
          participantCount: chatData.ChatParticipants?.length || 0
        };
      })
    );

    return res.status(200).json({
      message: "Chats retrieved successfully!",
      data: chatsWithUnread,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving chats:", error);
    next(error);
  }
};

// Get chat messages
const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { 
      userId, 
      userRole,  // Add userRole to query params
      page = 1,
      limit = 50,
      before,
      after,
      messageType
    } = req.query;

    if (!chatId || isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID is required" 
      });
    }

    const parsedUserId = parseInt(userId);
    const numericChatId = parseInt(chatId);

    // Get user role from query params
    const isAdminOrSupport = userRole === 'Admin' || 
                            userRole === 'Support' || 
                            userRole === 'Super-Admin';

    console.log('User check:', {
      userId: parsedUserId,
      userRole,
      isAdminOrSupport,
      chatId: numericChatId
    });

    // Check if user is participant
    let participant = await ChatParticipant.findOne({
      where: { 
        chatId: numericChatId,
        userId: parsedUserId 
      }
    });

    console.log('Participant found:', participant);

    // If admin/support is not a participant, add them automatically
    if (!participant && isAdminOrSupport) {
      console.log('Adding admin as participant');
      participant = await ChatParticipant.create({
        chatId: numericChatId,
        userId: parsedUserId,
        userType: 'Support',
        role: userRole === 'Super-Admin' ? 'Admin' : 'Member',
        joinedAt: new Date(),
        lastSeenAt: new Date()
      });
      console.log('Admin added as participant:', participant);
    }
    // For regular users, they must be participants
    else if (!participant) {
      return res.status(403).json({ 
        message: "You are not a participant in this chat" 
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = { 
      chatId: numericChatId,
      deletedAt: null // Don't show deleted messages
    };
    
    if (messageType && messageType.trim() !== '') {
      const validMessageTypes = ['Text', 'Image', 'File', 'Location', 'System'];
      if (!validMessageTypes.includes(messageType)) {
        return res.status(400).json({ 
          message: "Invalid message type. Valid types are: " + validMessageTypes.join(', ') 
        });
      }
      whereClause.messageType = messageType;
    }
    
    if (before) {
      whereClause.createdAt = { [Op.lt]: new Date(before) };
    }
    
    if (after) {
      whereClause.createdAt = { [Op.gt]: new Date(after) };
    }

    // Get messages
    const { rows, count } = await ChatMessage.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) > 100 ? 100 : parseInt(limit),
      offset: offset
    });

    console.log(`Found ${rows.length} messages for chat ${numericChatId}`);

    // Mark messages as read for this user
    const unreadMessages = rows.filter(msg => {
      if (msg.senderId === parsedUserId) return false;
      if (!msg.readBy) return true;
      
      // Handle both string and array readBy
      try {
        if (typeof msg.readBy === 'string') {
          const readByArray = JSON.parse(msg.readBy);
          return !readByArray.includes(parsedUserId);
        } else if (Array.isArray(msg.readBy)) {
          return !msg.readBy.includes(parsedUserId);
        }
      } catch (error) {
        // If parsing fails, treat as unread
        return true;
      }
      return true;
    });

    console.log(`${unreadMessages.length} unread messages`);

    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map(async (msg) => {
          try {
            let readBy = [];
            
            // Parse existing readBy
            if (msg.readBy) {
              if (typeof msg.readBy === 'string') {
                readBy = JSON.parse(msg.readBy);
              } else if (Array.isArray(msg.readBy)) {
                readBy = [...msg.readBy];
              }
            }
            
            // Add current user if not already in list
            if (!readBy.includes(parsedUserId)) {
              readBy.push(parsedUserId);
              await msg.update({ 
                readBy: JSON.stringify(readBy) 
              });
            }
          } catch (error) {
            console.error('Error updating readBy:', error);
          }
        })
      );
    }

    // Update participant's last seen
    await ChatParticipant.update(
      { lastSeenAt: new Date() },
      { where: { 
        chatId: numericChatId,
        userId: parsedUserId 
      }}
    );

    // Format messages for response
    const formattedMessages = rows.map(msg => {
      const messageData = msg.toJSON();
      
      // Parse readBy if it's a string
      let readByArray = [];
      if (messageData.readBy) {
        try {
          if (typeof messageData.readBy === 'string') {
            readByArray = JSON.parse(messageData.readBy);
          } else if (Array.isArray(messageData.readBy)) {
            readByArray = messageData.readBy;
          }
        } catch (error) {
          console.error('Error parsing readBy:', error);
        }
      }
      
      // Check if current user has read this message
      const hasRead = messageData.senderId === parsedUserId || 
        readByArray.includes(parsedUserId);
      
      // Check if current user is the sender
      const isSender = messageData.senderId === parsedUserId;
      
      // Parse attachments if it's a string
      let attachments = messageData.attachments;
      if (attachments && typeof attachments === 'string') {
        try {
          attachments = JSON.parse(attachments);
        } catch (error) {
          // If parsing fails, leave as is
        }
      }
      
      return {
        ...messageData,
        attachments,
        readBy: readByArray,
        hasRead,
        isSender,
        deliveryStatus: messageData.status
      };
    });

    return res.status(200).json({
      message: "Messages retrieved successfully!",
      data: formattedMessages.reverse(), // Return in chronological order
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    next(error);
  }
};

// Update message (edit/delete)
const updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content, action = 'edit', user } = req.body;
    const userId = user?.id || user?.userId;

    if (!messageId || isNaN(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    if (!userId) {
      return res.status(400).json({ 
        message: "User information is required" 
      });
    }

    const message = await ChatMessage.findOne({
      where: { id: parseInt(messageId) }
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const userRole = user?.role || 'User';
    if (message.senderId !== parseInt(userId) && userRole !== 'Support') {
      return res.status(403).json({ 
        message: "You can only edit/delete your own messages" 
      });
    }

    if (action === 'delete') {
      await message.update({
        deletedAt: new Date(),
        deletedBy: parseInt(userId),
        content: '[This message was deleted]'
      });
    } else if (action === 'edit') {
      if (!content || content.trim() === '') {
        return res.status(400).json({ 
          message: "Content is required for editing" 
        });
      }
      await message.update({
        content: content.trim(),
        isEdited: true,
        editedAt: new Date()
      });
    } else {
      return res.status(400).json({ 
        message: "Invalid action. Use 'edit' or 'delete'" 
      });
    }

    return res.status(200).json({
      message: `Message ${action === 'edit' ? 'edited' : 'deleted'} successfully!`,
      data: message
    });
  } catch (error) {
    console.error("Error updating message:", error);
    next(error);
  }
};

// Add participant to chat
const addParticipant = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { userId, userType = 'User', role = 'Member', currentUser } = req.body;
    const currentUserId = currentUser?.id || currentUser?.userId;

    if (!chatId || isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!currentUserId) {
      return res.status(400).json({ 
        message: "Current user information is required" 
      });
    }

    // Validate userType
    const validUserTypes = ['User', 'Support', 'Admin'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ 
        message: "Invalid user type. Valid types are: " + validUserTypes.join(', ') 
      });
    }

    // Validate role
    const validRoles = ['Member', 'Admin', 'Creator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Valid roles are: " + validRoles.join(', ') 
      });
    }

    // Check if current user can add participants
    const currentParticipant = await ChatParticipant.findOne({
      where: { 
        chatId: parseInt(chatId),
        userId: parseInt(currentUserId),
        role: { [Op.in]: ['Creator', 'Admin'] }
      }
    });

    const currentUserRole = currentUser?.role || 'User';
    if (!currentParticipant && currentUserRole !== 'Support') {
      return res.status(403).json({ 
        message: "You don't have permission to add participants" 
      });
    }

    // Check if user is already a participant
    const existingParticipant = await ChatParticipant.findOne({
      where: { 
        chatId: parseInt(chatId),
        userId: parseInt(userId) 
      }
    });

    if (existingParticipant) {
      return res.status(400).json({ 
        message: "User is already a participant" 
      });
    }

    const participant = await ChatParticipant.create({
      chatId: parseInt(chatId),
      userId: parseInt(userId),
      userType: userType,
      role: role
    });

    // Send system message about new participant
    await ChatMessage.create({
      chatId: parseInt(chatId),
      senderId: 0, // System user
      senderType: 'System',
      messageType: 'System',
      content: `${userType} added to the chat`,
      status: 'Sent'
    });

    return res.status(201).json({
      message: "Participant added successfully!",
      data: participant
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    next(error);
  }
};

// Update chat status
const updateChatStatus = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { status, assignedTo, priority, user } = req.body;
    const userId = user?.id || user?.userId;

    if (!chatId || isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    if (!userId) {
      return res.status(400).json({ 
        message: "User information is required" 
      });
    }

    const chat = await Chat.findOne({
      where: { id: parseInt(chatId) }
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Active', 'Resolved', 'Closed', 'Archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Valid statuses are: " + validStatuses.join(', ') 
        });
      }
    }

    // Validate priority if provided
    if (priority) {
      const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ 
          message: "Invalid priority. Valid priorities are: " + validPriorities.join(', ') 
        });
      }
    }

    // Check if user has permission (only creator, admin, or support can update)
    const participant = await ChatParticipant.findOne({
      where: { 
        chatId: parseInt(chatId),
        userId: parseInt(userId),
        role: { [Op.in]: ['Creator', 'Admin'] }
      }
    });

    const userRole = user?.role || 'User';
    if (!participant && userRole !== 'Support') {
      return res.status(403).json({ 
        message: "You don't have permission to update this chat" 
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = parseInt(assignedTo);
    if (priority) updateData.priority = priority;

    await chat.update(updateData);

    // Send system message if status changed
    if (status && status !== chat.status) {
      await ChatMessage.create({
        chatId: parseInt(chatId),
        senderId: 0, // System user
        senderType: 'System',
        messageType: 'System',
        content: `Chat status changed to: ${status}`,
        status: 'Sent'
      });
    }

    return res.status(200).json({
      message: "Chat updated successfully!",
      data: chat
    });
  } catch (error) {
    console.error("Error updating chat:", error);
    next(error);
  }
};

// Get chat statistics
const getChatStats = async (req, res, next) => {
  try {
    const { userId, period = 'today' } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID is required" 
      });
    }

    const parsedUserId = parseInt(userId);
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // Get participant chats
    const participantChats = await ChatParticipant.findAll({
      where: { userId: parsedUserId },
      attributes: ['chatId']
    });

    const chatIds = participantChats.map(p => p.chatId);

    let totalMessages = 0;
    let unreadMessages = 0;

    if (chatIds.length > 0) {
      totalMessages = await ChatMessage.count({
        where: {
          chatId: { [Op.in]: chatIds },
          createdAt: { [Op.gte]: startDate }
        }
      });

      unreadMessages = await ChatMessage.count({
        where: {
          chatId: { [Op.in]: chatIds },
          senderId: { [Op.ne]: parsedUserId },
          [Op.and]: [
            sequelize.where(
              sequelize.fn('JSON_CONTAINS', sequelize.col('readBy'), JSON.stringify(parsedUserId)),
              0
            ),
            { readBy: { [Op.notLike]: `%${parsedUserId}%` } }
          ]
        }
      });
    }

    const activeChats = await Chat.count({
      where: {
        id: { [Op.in]: chatIds },
        status: 'Active'
      }
    });

    const resolvedChats = await Chat.count({
      where: {
        id: { [Op.in]: chatIds },
        status: 'Resolved'
      }
    });

    // Get message breakdown by type
    const messageTypeStats = await ChatMessage.findAll({
      attributes: [
        'messageType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        chatId: { [Op.in]: chatIds },
        createdAt: { [Op.gte]: startDate }
      },
      group: ['messageType']
    });

    return res.status(200).json({
      message: "Chat statistics retrieved successfully!",
      data: {
        totalChats: chatIds.length,
        activeChats,
        resolvedChats,
        totalMessages,
        unreadMessages,
        messageTypeStats,
        period: period,
        startDate: startDate,
        endDate: new Date()
      }
    });
  } catch (error) {
    console.error("Error retrieving chat statistics:", error);
    next(error);
  }
};

// Search messages within chat
const searchMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { query, userId } = req.query;

    if (!chatId || isNaN(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: "Search query is required" });
    }

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID is required" 
      });
    }

    // Check if user is participant
    const participant = await ChatParticipant.findOne({
      where: { 
        chatId: parseInt(chatId),
        userId: parseInt(userId) 
      }
    });

    if (!participant) {
      return res.status(403).json({ 
        message: "You are not a participant in this chat" 
      });
    }

    const messages = await ChatMessage.findAll({
      where: {
        chatId: parseInt(chatId),
        content: { [Op.like]: `%${query.trim()}%` },
        deletedAt: null
      },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    return res.status(200).json({
      message: "Messages retrieved successfully!",
      data: messages,
      count: messages.length
    });
  } catch (error) {
    console.error("Error searching messages:", error);
    next(error);
  }
};


const getAdminChats = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      priority,
      assignedTo,
      search,
      sortBy = 'lastMessageAt',
      sortOrder = 'DESC'
    } = req.query;

    // Admin can see all chats, so no userId filter needed

    // Build where clause
    const whereClause = {};
    
    if (status && status !== '') {
      const validStatuses = ['Active', 'Resolved', 'Closed', 'Archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Valid statuses are: " + validStatuses.join(', ') 
        });
      }
      whereClause.status = status;
    }
    
    if (category && category !== '') {
      const validCategories = [
        'Billing', 'Technical', 'Connection', 'Package', 
        'Speed', 'General', 'Complaint', 'Feedback'
      ];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          message: "Invalid category. Valid categories are: " + validCategories.join(', ') 
        });
      }
      whereClause.category = category;
    }
    
    if (priority && priority !== '') {
      const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ 
          message: "Invalid priority. Valid priorities are: " + validPriorities.join(', ') 
        });
      }
      whereClause.priority = priority;
    }
    
    if (assignedTo && assignedTo !== '') {
      if (assignedTo === 'unassigned') {
        whereClause.assignedTo = null;
      } else {
        whereClause.assignedTo = parseInt(assignedTo);
      }
    }
    
    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { chatId: { [Op.like]: `%${search.trim()}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get all chats (admin view)
    const { rows, count } = await Chat.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ChatMessage,
          as: 'ChatMessages',
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'content', 'messageType', 'attachments', 'senderId', 'createdAt']
        },
        {
          model: ChatParticipant,
          as: 'ChatParticipants',
          attributes: ['userId', 'userType', 'role', 'lastSeenAt']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
      limit: parseInt(limit) > 100 ? 100 : parseInt(limit),
      offset: offset,
      distinct: true
    });

    // Get unread counts for each chat (for admin)
    const chatsWithUnread = await Promise.all(
      rows.map(async (chat) => {
        const unreadCount = await ChatMessage.count({
          where: {
            chatId: chat.id,
            senderType: 'User', // Only user messages are unread for admin
            [Op.and]: [
              sequelize.where(
                sequelize.fn('JSON_CONTAINS', sequelize.col('readBy'), JSON.stringify(chat.assignedTo || 0)),
                0
              ),
              { readBy: { [Op.notLike]: `%${chat.assignedTo || 0}%` } }
            ]
          }
        });

        const chatData = chat.toJSON();
        
        // Get user participant info
        const userParticipant = chatData.ChatParticipants?.find(p => p.userType === 'User');
        
        return {
          ...chatData,
          unreadCount,
          userParticipant,
          participantCount: chatData.ChatParticipants?.length || 0
        };
      })
    );

    return res.status(200).json({
      message: "Admin chats retrieved successfully!",
      data: chatsWithUnread,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error retrieving admin chats:", error);
    next(error);
  }
};

module.exports = {
  createChat,
  sendMessage,
  getUserChats,
  getChatMessages,
  updateMessage,
  addParticipant,
  updateChatStatus,
  getChatStats,
  searchMessages,
  getAdminChats
};