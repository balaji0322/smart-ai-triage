#!/bin/bash

# AI Smart Patient Triage System Startup Script
echo -e "\033[1;36mStarting AI Smart Patient Triage System...\033[0m"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "\033[1;33mStopping servers...\033[0m"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "\033[1;32mServers stopped.\033[0m"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Start Backend
echo -e "\033[1;33m[1/3] Starting Backend Server...\033[0m"
cd backend
python start.py &
BACKEND_PID=$!
cd ..

# Wait for backend to initialize
sleep 5

# Start Frontend
echo -e "\033[1;33m[2/3] Starting Frontend Server...\033[0m"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to initialize
sleep 5

# Open Browser
echo -e "\033[1;33m[3/3] Opening Browser...\033[0m"
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo -e "\033[1;32m========================================\033[0m"
echo -e "\033[1;32m  AI Smart Patient Triage System\033[0m"
echo -e "\033[1;32m========================================\033[0m"
echo -e "  Frontend: http://localhost:3000"
echo -e "  Backend:  http://localhost:8000"
echo -e "  API Docs: http://localhost:8000/api/docs"
echo -e "\033[1;32m========================================\033[0m"
echo ""
echo -e "\033[1;33mPress Ctrl+C to stop all servers...\033[0m"
echo ""

# Wait for processes
wait
