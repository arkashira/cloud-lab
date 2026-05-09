#!/bin/bash
# Ansible Installation and Setup Script
# Purpose: Install Ansible and create a basic playbook structure

set -e  # Exit immediately if any command fails

# Configuration
INSTALL_DIR="/opt/axentx/ansible"
PLAYBOOK_NAME="sample_playbook.yml"

# Function to display messages
log() {
    echo "[INFO] $1"
}

# Function to handle errors
error_exit() {
    echo "[ERROR] $1" >&2
    exit 1
}

log "Starting Ansible installation process..."

# Update package list
log "Updating package lists..."
apt-get update || error_exit "Failed to update package lists"

# Install dependencies
log "Installing required dependencies..."
apt-get install -y software-properties-common || error_exit "Failed to install dependencies"

# Add Ansible repository
log "Adding Ansible repository..."
add-apt-repository --yes --update ppa:ansible/ansible || error_exit "Failed to add Ansible repository"

# Install Ansible
log "Installing Ansible..."
apt-get install -y ansible || error_exit "Failed to install Ansible"

# Verify installation
ANSIBLE_VERSION=$(ansible --version | head -n 1)
log "Ansible installed successfully: $ANSIBLE_VERSION"

# Create directory structure
log "Creating directory structure at $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR" || error_exit "Failed to create directory structure"

# Create sample playbook
PLAYBOOK_PATH="$INSTALL_DIR/$PLAYBOOK_NAME"
log "Creating sample playbook at $PLAYBOOK_PATH..."
cat > "$PLAYBOOK_PATH" << 'EOF' || error_exit "Failed to create playbook"
---
- name: Sample Playbook
  hosts: localhost
  connection: local
  tasks:
    - name: Verify Ansible installation
      debug:
        msg: "Ansible is working correctly!"
EOF

# Verify playbook execution
log "Testing playbook execution..."
ansible-playbook "$PLAYBOOK_PATH" || error_exit "Playbook execution failed"

log "Installation and setup completed successfully!"
log "Sample playbook available at: $PLAYBOOK_PATH"