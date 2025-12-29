const mongoose = require('mongoose');

const privateChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only 2 participants
privateChatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Private chat must have exactly 2 participants'));
  }
  next();
});

// Create compound index to prevent duplicate chats
privateChatSchema.index({ participants: 1 }, { unique: true });

module.exports = mongoose.model('PrivateChat', privateChatSchema);
