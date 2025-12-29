import { createContext, useContext, useState, useEffect } from 'react';
import { roomAPI, chatAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (user) {
      loadRooms();
      loadPrivateChats();
      setupSocketListeners();
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [user]);

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Load rooms error:', error);
    }
  };

  const loadPrivateChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setPrivateChats(response.data);
    } catch (error) {
      console.error('Load chats error:', error);
    }
  };

  const setupSocketListeners = () => {
    // Room messages
    socketService.on('room:message', (message) => {
      if (activeChat?.type === 'room' && activeChat.id === message.room) {
        setMessages((prev) => [...prev, message]);
      }
      // Update room's last message
      setRooms((prev) =>
        prev.map((room) =>
          room._id === message.room
            ? { ...room, lastMessage: message, lastActivity: new Date() }
            : room
        )
      );
    });

    // Private messages
    socketService.on('private:message', (message) => {
      if (activeChat?.type === 'private' && activeChat.id === message.privateChat) {
        setMessages((prev) => [...prev, message]);
      }
      // Update chat's last message
      setPrivateChats((prev) =>
        prev.map((chat) =>
          chat._id === message.privateChat
            ? { ...chat, lastMessage: message, lastActivity: new Date() }
            : chat
        )
      );
    });

    // Typing indicators
    socketService.on('typing:start', ({ roomId, chatId, userId, username }) => {
      const key = roomId || chatId;
      setTypingUsers((prev) => ({
        ...prev,
        [key]: { userId, username },
      }));
    });

    socketService.on('typing:stop', ({ roomId, chatId }) => {
      const key = roomId || chatId;
      setTypingUsers((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    });

    // User status
    socketService.on('user:status', ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (status === 'online') {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    // Room events
    socketService.on('room:user-joined', ({ roomId, user }) => {
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? { ...room, members: [...room.members, user] }
            : room
        )
      );
    });

    socketService.on('room:user-left', ({ roomId, userId }) => {
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? { ...room, members: room.members.filter((m) => m._id !== userId) }
            : room
        )
      );
    });
  };

  const cleanupSocketListeners = () => {
    socketService.off('room:message');
    socketService.off('private:message');
    socketService.off('typing:start');
    socketService.off('typing:stop');
    socketService.off('user:status');
    socketService.off('room:user-joined');
    socketService.off('room:user-left');
  };

  const selectChat = async (chatType, chatId) => {
    setLoading(true);
    setMessages([]);
    setActiveChat({ type: chatType, id: chatId });

    try {
      let response;
      if (chatType === 'room') {
        response = await roomAPI.getRoomMessages(chatId);
        socketService.joinRoom(chatId);
      } else {
        response = await chatAPI.getChatMessages(chatId);
      }
      setMessages(response.data);
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (content, fileUrl, fileType) => {
    if (!activeChat) return;

    if (activeChat.type === 'room') {
      socketService.sendRoomMessage(activeChat.id, content, fileUrl, fileType);
    } else {
      socketService.sendPrivateMessage(activeChat.id, content, fileUrl, fileType);
    }
  };

  const createRoom = async (roomData) => {
    try {
      const response = await roomAPI.createRoom(roomData);
      setRooms((prev) => [response.data, ...prev]);
      return { success: true, room: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create room',
      };
    }
  };

  const createPrivateChat = async (userId) => {
    try {
      const response = await chatAPI.createChat(userId);
      const chat = response.data;
      
      // Check if chat already exists in list
      const exists = privateChats.find((c) => c._id === chat._id);
      if (!exists) {
        setPrivateChats((prev) => [chat, ...prev]);
      }
      
      return { success: true, chat };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create chat',
      };
    }
  };

  const startTyping = () => {
    if (!activeChat) return;
    
    if (activeChat.type === 'room') {
      socketService.startTyping(activeChat.id, null);
    } else {
      socketService.startTyping(null, activeChat.id);
    }
  };

  const stopTyping = () => {
    if (!activeChat) return;
    
    if (activeChat.type === 'room') {
      socketService.stopTyping(activeChat.id, null);
    } else {
      socketService.stopTyping(null, activeChat.id);
    }
  };

  const value = {
    rooms,
    privateChats,
    activeChat,
    messages,
    loading,
    typingUsers,
    onlineUsers,
    selectChat,
    sendMessage,
    createRoom,
    createPrivateChat,
    loadRooms,
    loadPrivateChats,
    startTyping,
    stopTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
