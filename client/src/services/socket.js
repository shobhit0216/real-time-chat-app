import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  on(event, callback) {
    if (!this.socket) return;

    // Store callback for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Remove from stored listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Room methods
  joinRoom(roomId) {
    this.emit('room:join', roomId);
  }

  leaveRoom(roomId) {
    this.emit('room:leave', roomId);
  }

  sendRoomMessage(roomId, content, fileUrl, fileType) {
    this.emit('room:message', { roomId, content, fileUrl, fileType });
  }

  // Private chat methods
  sendPrivateMessage(chatId, content, fileUrl, fileType) {
    this.emit('private:message', { chatId, content, fileUrl, fileType });
  }

  // Typing indicators
  startTyping(roomId, chatId) {
    this.emit('typing:start', { roomId, chatId });
  }

  stopTyping(roomId, chatId) {
    this.emit('typing:stop', { roomId, chatId });
  }

  // Message read
  markAsRead(messageId) {
    this.emit('message:read', { messageId });
  }
}

export default new SocketService();
