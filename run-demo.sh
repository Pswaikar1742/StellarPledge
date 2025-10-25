#!/bin/bash
# StellarPledge Demo Script
# This script helps you run and demonstrate the StellarPledge application

echo "=========================================="
echo "  ⭐ StellarPledge Demo Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the StellarPledge root directory"
    exit 1
fi

echo "✓ Found project directory"
echo ""

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✓ Dependencies installed"
    echo ""
fi

echo "=========================================="
echo "  🚀 Starting StellarPledge Application"
echo "=========================================="
echo ""
echo "The application will be available at:"
echo "  👉 http://127.0.0.1:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "=========================================="
echo ""

# Start the server
cd frontend
npx http-server -p 3000
