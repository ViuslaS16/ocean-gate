#!/bin/bash

# Ocean Gate - Start Both Servers Script
# This script starts both backend and frontend servers concurrently

echo "🚀 Starting Ocean Gate Application..."
echo ""

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory (ocean-gate/)"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill 0
    exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Start backend server
echo "📦 Starting Backend Server (Port 3000)..."
cd backend && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🌐 Starting Frontend Server (Port 3001)..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo ""
echo "✅ Both servers are running!"
echo ""
echo "📍 Access the application at:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
