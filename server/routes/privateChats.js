const express = require('express');
const PrivateChat = require('../models/PrivateChat');
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all private chats for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const chats = await PrivateChat.find({
      participants: req.userId
    })
    .populate('participants', 'username avatar status')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username avatar' }
    })
    .sort({ lastActivity: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get private chats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or get private chat
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (userId === req.userId) {
      return res.status(400).json({ error: 'Cannot chat with yourself' });
    }

    // Check if user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if chat already exists
    const existingChat = await PrivateChat.findOne({
      participants: { $all: [req.userId, userId] }
    })
    .populate('participants', 'username avatar status')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username avatar' }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create new chat
    const chat = new PrivateChat({
      participants: [req.userId, userId]
    });

    await chat.save();
    await chat.populate('participants', 'username avatar status');

    res.status(201).json(chat);
  } catch (error) {
    console.error('Create private chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get private chat by ID
router.get('/:chatId', authMiddleware, async (req, res) => {
  try {
    const chat = await PrivateChat.findById(req.params.chatId)
      .populate('participants', 'username avatar status');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get private chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get private chat messages
router.get('/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, before } = req.query;
    
    const chat = await PrivateChat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check access
    if (!chat.participants.includes(req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const query = { privateChat: req.params.chatId, isDeleted: false };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
