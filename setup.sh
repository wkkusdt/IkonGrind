#!/bin/bash

# IkonGrind - Quick Start Guide
# ============================

echo "🎮 IkonGrind - Telegram Mini App RPG Bot"
echo "=========================================\n"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)\n"

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed\n"

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../webapp
npm install
echo "✅ Frontend dependencies installed\n"

cd ..

# Create .env files
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env..."
    cat backend/.env.example > backend/.env
    echo "⚠️  Please edit backend/.env with your Telegram Bot Token and MongoDB URI"
fi

echo "\n✅ Setup complete!\n"

echo "🚀 Start development:\n"
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev\n"
echo "Terminal 2 (Frontend):"
echo "  cd webapp && npm run dev\n"

echo "📖 Documentation: see docs/ folder\n"
echo "🎯 Quick Links:"
echo "  - Main README: README.md"
echo "  - Project Summary: PROJECT_SUMMARY.md"
echo "  - API Docs: docs/API.md"
echo "  - Game Mechanics: docs/GAME_MECHANICS.md"
echo "  - Architecture: docs/ARCHITECTURE.md"
echo "  - Deployment: docs/DEPLOYMENT.md"
echo "  - UX Flow: docs/UX_FLOW.md"
echo "  - Recommendations: docs/RECOMMENDATIONS.md"
