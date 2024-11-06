#!/bin/bash

# Path to your Python script
SCRIPT="/home/ubuntu/haikuer/backend/serve.py"

# Function to start the Python script in the background
start_script() {
    python3 $SCRIPT &
    echo $! > backend_script.pid # Store the PID of the process
    echo "Script started with PID: $(cat backend_script.pid)"
}

# Function to stop the Python script if running
stop_script() {
    if [ -f backend_script.pid ]; then
        PID=$(cat backend_script.pid)
        if ps -p $PID > /dev/null; then
            kill $PID
            echo "Script stopped."
        else
            echo "No running script found with PID: $PID"
        fi
        rm backend_script.pid
    fi
}

# Clean __pycache__ and restart script
restart_script() {
    stop_script
    rm -rf /home/ubuntu/haikuer/backend/__pycache__
    start_script
}

# Run on startup
start_script

# Restart the script every hour
while true; do
    sleep 3600 # Wait one hour
    restart_script
done