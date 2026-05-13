#!/bin/bash

# Function to start the Docker environment
start_environment() {
    echo "Starting Docker environment..."
    docker-compose -f /opt/axentx/cloud-lab/docker-environment.yml up -d
    if [ $? -eq 0 ]; then
        echo "Docker environment started successfully."
    else
        echo "Failed to start Docker environment."
    fi
}

# Function to stop the Docker environment
stop_environment() {
    echo "Stopping Docker environment..."
    docker-compose -f /opt/axentx/cloud-lab/docker-environment.yml down
    if [ $? -eq 0 ]; then
        echo "Docker environment stopped successfully."
    else
        echo "Failed to stop Docker environment."
    fi
}

# Function to switch Docker versions
switch_docker_version() {
    read -p "Enter the Docker version you want to switch to: " version
    echo "Switching to Docker version $version..."
    # Placeholder for actual logic to switch Docker versions
    echo "Docker version switched to $version."
}

# Main menu
while true; do
    clear
    echo "Docker Environment Management"
    echo "1. Start Docker Environment"
    echo "2. Stop Docker Environment"
    echo "3. Switch Docker Version"
    echo "4. Exit"
    read -p "Enter your choice: " choice

    case $choice in
        1) start_environment ;;
        2) stop_environment ;;
        3) switch_docker_version ;;
        4) exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac

    read -p "Press Enter to continue..."
done