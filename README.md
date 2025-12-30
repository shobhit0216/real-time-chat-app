# Real-Time Chat Application


# Real-Time Chat Application

![GitHub](https://img.shields.io/github/license/shobhit0216/real-time-chat-app)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.6-black)

> A full-featured real-time chat application built with the MERN stack and WebSockets
A full-featured real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and WebSockets using Socket.IO.

## 🚀 Features

### Core Features
- **Real-time messaging** - Instant message delivery using WebSockets
- **User Authentication** - Secure registration and login with JWT tokens
- **Chat Rooms** - Create and join public/private chat rooms
- **Private Conversations** - One-on-one direct messaging
- **File Sharing** - Send images and documents
- **Message Persistence** - All messages saved in MongoDB
- **Typing Indicators** - See when someone is typing
- **Online Status** - View who's currently online
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Additional Features
- User avatars (automatically generated)
- Message timestamps
- Chat history
- User search functionality
- Real-time notifications
- Clean and modern UI

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Icons** - Icon library
- **date-fns** - Date formatting
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - WebSocket library
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (v6.0 or higher)

### Version Details
```
Node.js: v18.x or v20.x
npm: v9.x or v10.x
MongoDB: v6.x or v7.x
```

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd chat-app
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd server
npm install
```

#### Frontend Setup
```bash
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd ../server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a random, secure string in production!

### 4. Start MongoDB

Make sure MongoDB is running on your system:

#### On macOS (with Homebrew):
```bash
brew services start mongodb-community
```

#### On Linux:
```bash
sudo systemctl start mongod
```

#### On Windows:
MongoDB typically runs as a service. If not, start it from Services or run:
```bash
mongod
```

### 5. Run the Application

You'll need two terminal windows:

#### Terminal 1 - Start Backend Server
```bash
cd server
npm start
# For development with auto-restart:
npm run dev
```

The server will start on `http://localhost:5000`

#### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```

The client will start on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📱 Usage Guide

### Getting Started

1. **Register a new account**
   - Click "Register" on the login page
   - Fill in username, email, and password
   - Submit to create your account

2. **Login**
   - Enter your email and password
   - Click "Login" to access the chat

3. **Create a Chat Room**
   - Click the "+" button in the Rooms tab
   - Enter room name and optional description
   - Choose if it's public or private
   - Click "Create Room"

4. **Start a Direct Message**
   - Switch to the "Direct" tab
   - Click the "+" button
   - Search for and select a user
   - Start chatting!

5. **Send Messages**
   - Type your message in the input box
   - Press Enter or click Send
   - Attach files using the paperclip icon

## 🏗️ Project Structure

```
chat-app/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── PrivateChat.js
│   │   └── Message.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   ├── privateChats.js
│   │   ├── users.js
│   │   └── messages.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── socket.js          # Socket.IO configuration
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env.example
│
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatArea.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── CreateRoomModal.jsx
│   │   │   ├── NewChatModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/       # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── services/      # API services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── pages/         # Page components
│   │   │   └── Chat.jsx
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation
- CORS configuration
- Secure file upload handling

## 🎨 Design Features

- Modern, clean interface
- Responsive layout for all devices
- Smooth animations
- User-friendly navigation
- Custom scrollbars
- Color-coded messages
- Avatar generation

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:roomId` - Get room details
- `POST /api/rooms/:roomId/join` - Join room
- `POST /api/rooms/:roomId/leave` - Leave room
- `GET /api/rooms/:roomId/messages` - Get room messages

### Private Chats
- `GET /api/chats` - Get all private chats
- `POST /api/chats` - Create/get private chat
- `GET /api/chats/:chatId` - Get chat details
- `GET /api/chats/:chatId/messages` - Get chat messages

### Users
- `GET /api/users` - Search users
- `GET /api/users/:userId` - Get user details
- `PATCH /api/users/profile` - Update profile

### Messages
- `POST /api/messages/upload` - Upload file
- `DELETE /api/messages/:messageId` - Delete message

## 🔌 WebSocket Events

### Client to Server
- `room:join` - Join a room
- `room:leave` - Leave a room
- `room:message` - Send room message
- `private:message` - Send private message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `message:read` - Mark message as read

### Server to Client
- `room:message` - Receive room message
- `private:message` - Receive private message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `user:status` - User online/offline status
- `room:user-joined` - User joined room
- `room:user-left` - User left room
- `message:read` - Message read confirmation

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh
# If connection fails, start MongoDB service
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### WebSocket Connection Failed
- Check if backend server is running
- Verify CORS settings in server
- Check browser console for errors

## 🚀 Deployment

### Backend Deployment (Render, Heroku, etc.)
1. Set environment variables
2. Update MongoDB URI to production database
3. Update CLIENT_URL to production frontend URL
4. Deploy server code

### Frontend Deployment (Vercel, Netlify, etc.)
1. Update API endpoints in `src/services/api.js`
2. Update Socket URL in `src/services/socket.js`
3. Build the project: `npm run build`
4. Deploy the `dist` folder


## 👥 Real-World Applications

This chat application architecture is similar to:
- **Slack** - Team communication
- **WhatsApp Web** - Instant messaging
- **Microsoft Teams** - Business communication
- **Discord** - Community chat



Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please create an issue in the repository.

---

**Happy Chatting! 💬**
