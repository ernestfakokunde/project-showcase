import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// Get conversations list (unique users and last message)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all messages involving this user
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from", "username avatar")
      .populate("to", "username avatar")
      .sort({ createdAt: -1 });

    // Create conversation map (group by other user)
    const conversations = {};
    messages.forEach((msg) => {
      const otherUser = msg.from._id.equals(userId) ? msg.to : msg.from;
      const key = otherUser._id.toString();

      if (!conversations[key]) {
        conversations[key] = {
          userId: otherUser._id,
          username: otherUser.username,
          avatar: otherUser.avatar,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        };
      }

      // Count unread messages from other user
      if (!msg.read && msg.to._id.equals(userId) && msg.from._id.equals(otherUser._id)) {
        conversations[key].unreadCount++;
      }
    });

    const conversationsList = Object.values(conversations)
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.status(200).json({
      success: true,
      conversations: conversationsList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.user._id;

    // Validate if otherUser exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get messages between users
    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: otherUserId },
        { from: otherUserId, to: currentUserId },
      ],
    })
      .populate("from", "username avatar")
      .populate("to", "username avatar")
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      {
        from: otherUserId,
        to: currentUserId,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages,
      otherUser: {
        _id: otherUser._id,
        username: otherUser.username,
        avatar: otherUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    const from = req.user._id;

    // Validate input
    if (!to || !text) {
      return res.status(400).json({ message: "To and text are required" });
    }

    if (!text.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Validate if recipient exists
    const recipient = await User.findById(to);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Prevent self-messages
    if (from.toString() === to) {
      return res.status(400).json({ message: "Cannot send message to yourself" });
    }

    // Create message
    const message = new Message({
      from,
      to,
      text: text.trim(),
    });

    await message.save();
    await message.populate("from", "username avatar");
    await message.populate("to", "username avatar");

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message (only by sender)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete
    if (!message.from.equals(userId)) {
      return res.status(403).json({ message: "Only sender can delete message" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      to: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
