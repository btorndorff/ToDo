#!/bin/bash

# Kill any existing processes on the ports (if needed)
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5000 | xargs kill -9 2>/dev/null

# Navigate to your project directories and start servers
cd "$(dirname "$0")/backend" && npm run dev & 
cd "$(dirname "$0")/" && npm run dev &

# Wait for servers to start
sleep 3

# Open the application in the default browser
open http://localhost:5173/