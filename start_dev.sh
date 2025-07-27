#!/bin/bash

echo "🚀 Starting BazaarBandhu Development Environment..."
echo

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't seem to be running."
    echo "   Please start MongoDB before running this script."
    echo "   You can start it with: mongod"
    echo
fi

# Start backend server
echo "📡 Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🖥️  Starting Frontend Server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo
echo "✅ Development servers are starting..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait 