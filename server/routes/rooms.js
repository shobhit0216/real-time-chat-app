const express = require('express');
const Room = require('../models/Room');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all rooms (public or user is member)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { isPrivate: false },
        { members: req.userId }
      ]
    })
    .populate('creator', 'username avatar')
    .populate('members', 'username avatar status')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username avatar' }
    })
    .sort({ lastActivity: -1 });

    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create room
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    
    const room = new Room({
      name,
      description,
      creator: req.userId,
      members: [req.userId],
      isPrivate: isPrivate || false,
      avatar
    });

    await room.save();
    await room.populate('creator', 'username avatar');
    await room.populate('members', 'username avatar status');

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get room by ID
router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar status');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user has access
    if (room.isPrivate && !room.members.some(m => m._id.toString() === req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join room
router.post('/:roomId/join', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.isPrivate) {
      return res.status(403).json({ error: 'Cannot join private room' });
    }

    if (room.members.includes(req.userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    room.members.push(req.userId);
    await room.save();
    await room.populate('members', 'username avatar status');

    res.json(room);
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Leave room
router.post('/:roomId/leave', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.members = room.members.filter(m => m.toString() !== req.userId);
    await room.save();

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get room messages
router.get('/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, before } = req.query;
    
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check access
    if (room.isPrivate && !room.members.includes(req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const query = { room: req.params.roomId, isDeleted: false };
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
