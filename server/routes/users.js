const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all users (for starting private chats)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    const query = { _id: { $ne: req.userId } };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('username email avatar status lastSeen')
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username email avatar status lastSeen createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updates = {};

    if (username) {
      // Check if username is taken
      const existing = await User.findOne({ 
        username, 
        _id: { $ne: req.userId } 
      });
      
      if (existing) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.username = username;
    }

    if (avatar) {
      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
