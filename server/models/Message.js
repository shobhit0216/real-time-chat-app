const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: function() {
      return !this.fileUrl; // Content required if no file
    }
  },
  fileUrl: {
    type: String
  },
  fileType: {
    type: String,
    enum: ['image', 'file', null]
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  privateChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrivateChat'
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ privateChat: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
