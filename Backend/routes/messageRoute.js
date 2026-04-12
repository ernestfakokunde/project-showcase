import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
  getUnreadCount,
} from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all conversations
router.get("/conversations", getConversations);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Get messages with a specific user
router.get("/:userId", getMessages);

// Send a message
router.post("/", sendMessage);

// Delete a message
router.delete("/:messageId", deleteMessage);

export default router;
