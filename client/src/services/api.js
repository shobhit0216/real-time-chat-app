import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Room API
export const roomAPI = {
  getRooms: () => api.get('/rooms'),
  getRoom: (roomId) => api.get(`/rooms/${roomId}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  joinRoom: (roomId) => api.post(`/rooms/${roomId}/join`),
  leaveRoom: (roomId) => api.post(`/rooms/${roomId}/leave`),
  getRoomMessages: (roomId, params) => api.get(`/rooms/${roomId}/messages`, { params }),
};

// Private Chat API
export const chatAPI = {
  getChats: () => api.get('/chats'),
  getChat: (chatId) => api.get(`/chats/${chatId}`),
  createChat: (userId) => api.post('/chats', { userId }),
  getChatMessages: (chatId, params) => api.get(`/chats/${chatId}/messages`, { params }),
};

// User API
export const userAPI = {
  getUsers: (search) => api.get('/users', { params: { search } }),
  getUser: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userData) => api.patch('/users/profile', userData),
};

// Message API
export const messageAPI = {
  uploadFile: (formData) => {
    return api.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

export default api;
