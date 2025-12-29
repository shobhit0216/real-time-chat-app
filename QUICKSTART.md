# 🚀 Quick Start Guide

## Prerequisites Check
- Node.js v18+ installed
- npm v9+ installed  
- MongoDB v6+ installed and running

## Installation (3 minutes)

### Option 1: Automated Setup
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend (new terminal)
cd client
npm install
```

#### 2. Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env with your settings
```

#### 3. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - MongoDB runs as service
```

#### 4. Run Application
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🌐 Access Application
Open browser: **http://localhost:3000**

## 🧪 Test the App

1. **Register** - Create 2 accounts
2. **Login** - Sign in with first account
3. **Create Room** - Click + in Rooms tab
4. **Send Message** - Type and send
5. **Start DM** - Click + in Direct tab, select user
6. **Upload File** - Click 📎 to attach image/file
7. **Check Real-time** - Login with second account, see instant updates

## ✅ Success Indicators

- Backend: "Server is running on port 5000"
- Frontend: "Local: http://localhost:3000"
- MongoDB: Connection successful
- Real-time: Messages appear instantly

## ❌ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB Not Running
```bash
# Check status
mongosh
# If fails, start MongoDB service
```

### Dependencies Error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation
- **README.md** - Full documentation
- **PROJECT_SUMMARY.md** - Features & architecture
- **SCREENSHOTS.md** - UI walkthrough

## 🎯 Key Features to Test

✅ User authentication  
✅ Create/join chat rooms  
✅ Send messages (room & DM)  
✅ Upload images/files  
✅ Typing indicators  
✅ Online status  
✅ Responsive design  
✅ Real-time updates  

---

**Ready to chat! 💬** For detailed setup, see README.md
