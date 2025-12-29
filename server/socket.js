const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const Room = require('./models/Room');
const PrivateChat = require('./models/PrivateChat');

// Store online users
const onlineUsers = new Map();

const initializeSocket = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Add user to online users
    onlineUsers.set(socket.userId, socket.id);

    // Update user status to online
    await User.findByIdAndUpdate(socket.userId, {
      status: 'online',
      lastSeen: Date.now()
    });

    // Broadcast online status
    io.emit('user:status', {
      userId: socket.userId,
      status: 'online'
    });

    // Join user's rooms
    const rooms = await Room.find({ members: socket.userId });
    rooms.forEach(room => {
      socket.join(`room:${room._id}`);
    });

    // Join user's private chats
    const privateChats = await PrivateChat.find({ participants: socket.userId });
    privateChats.forEach(chat => {
      socket.join(`chat:${chat._id}`);
    });

    // Handle joining a room
    socket.on('room:join', async (roomId) => {
      try {
        socket.join(`room:${roomId}`);
        const room = await Room.findById(roomId).populate('members', 'username avatar');
        socket.to(`room:${roomId}`).emit('room:user-joined', {
          roomId,
          user: {
            id: socket.userId,
            username: socket.user.username,
            avatar: socket.user.avatar
          }
        });
      } catch (error) {
        console.error('Room join error:', error);
      }
    });

    // Handle leaving a room
    socket.on('room:leave', (roomId) => {
      socket.leave(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('room:user-left', {
        roomId,
        userId: socket.userId
      });
    });

    // Handle room message
    socket.on('room:message', async (data) => {
      try {
        const { roomId, content, fileUrl, fileType } = data;

        const message = new Message({
          sender: socket.userId,
          content,
          fileUrl,
          fileType,
          room: roomId,
          readBy: [socket.userId]
        });

        await message.save();
        await message.populate('sender', 'username avatar');

        // Update room's last activity and message
        await Room.findByIdAndUpdate(roomId, {
          lastMessage: message._id,
          lastActivity: Date.now()
        });

        // Emit to all users in the room
        io.to(`room:${roomId}`).emit('room:message', message);
      } catch (error) {
        console.error('Room message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle private message
    socket.on('private:message', async (data) => {
      try {
        const { chatId, content, fileUrl, fileType } = data;

        const chat = await PrivateChat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          return socket.emit('error', { message: 'Access denied' });
        }

        const message = new Message({
          sender: socket.userId,
          content,
          fileUrl,
          fileType,
          privateChat: chatId,
          readBy: [socket.userId]
        });

        await message.save();
        await message.populate('sender', 'username avatar');

        // Update chat's last activity and message
        await PrivateChat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          lastActivity: Date.now()
        });

        // Emit to both participants
        io.to(`chat:${chatId}`).emit('private:message', message);
      } catch (error) {
        console.error('Private message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', (data) => {
      const { roomId, chatId } = data;
      if (roomId) {
        socket.to(`room:${roomId}`).emit('typing:start', {
          roomId,
          userId: socket.userId,
          username: socket.user.username
        });
      } else if (chatId) {
        socket.to(`chat:${chatId}`).emit('typing:start', {
          chatId,
          userId: socket.userId,
          username: socket.user.username
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { roomId, chatId } = data;
      if (roomId) {
        socket.to(`room:${roomId}`).emit('typing:stop', {
          roomId,
          userId: socket.userId
        });
      } else if (chatId) {
        socket.to(`chat:${chatId}`).emit('typing:stop', {
          chatId,
          userId: socket.userId
        });
      }
    });

    // Handle message read
    socket.on('message:read', async (data) => {
      try {
        const { messageId } = data;
        const message = await Message.findById(messageId);
        
        if (message && !message.readBy.includes(socket.userId)) {
          message.readBy.push(socket.userId);
          await message.save();

          // Notify sender
          const senderSocketId = onlineUsers.get(message.sender.toString());
          if (senderSocketId) {
            io.to(senderSocketId).emit('message:read', {
              messageId,
              userId: socket.userId
            });
          }
        }
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      // Remove from online users
      onlineUsers.delete(socket.userId);

      // Update user status
      await User.findByIdAndUpdate(socket.userId, {
        status: 'offline',
        lastSeen: Date.now()
      });

      // Broadcast offline status
      io.emit('user:status', {
        userId: socket.userId,
        status: 'offline'
      });
    });
  });
};

module.exports = initializeSocket;
