#!/bin/bash

echo "================================================"
echo "  Real-Time Chat Application Setup Script"
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check MongoDB
echo "Checking MongoDB..."
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB client not found. Make sure MongoDB is installed and running."
else
    echo "✅ MongoDB client found"
fi
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration!"
fi
npm install
cd ..
echo "✅ Server dependencies installed"
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..
echo "✅ Client dependencies installed"
echo ""

echo "================================================"
echo "  Setup Complete! 🎉"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Update server/.env with your configuration"
echo "3. Start the backend: cd server && npm start"
echo "4. In a new terminal, start the frontend: cd client && npm run dev"
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see README.md"
echo "================================================"
