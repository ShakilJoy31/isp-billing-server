const express = require("express");
const { 
  createChat, 
  getUserChats, 
  getAdminChats,
  getChatMessages, 
  sendMessage, 
  updateMessage, 
  addParticipant, 
  updateChatStatus, 
  searchMessages, 
  getChatStats 
} = require("../controller/live-chat/liveChat.controller");
const router = express.Router();

// Chat routes
router.post("/create", createChat);
router.get("/user-chats", getUserChats); // For users
router.get("/admin-chats", getAdminChats); // Add this line - For admin
router.get("/:chatId/messages", getChatMessages);
router.post("/:chatId/messages", sendMessage); // for admin
router.put("/messages/:messageId", updateMessage);
router.post("/:chatId/participants", addParticipant);
router.put("/:chatId/status", updateChatStatus);
router.get("/:chatId/search", searchMessages);
router.get("/stats", getChatStats);

module.exports = liveChatRoutes = router;