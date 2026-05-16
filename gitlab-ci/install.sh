#!/bin/bash

# Ensure script runs with superuser privileges
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

# Update package list and install dependencies
apt-get update
apt-get install -y curl openssh-server ca-certificates tzdata perl

# Add GitLab's official repository and install GitLab
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | bash
apt-get install -y gitlab-ce

# Configure GitLab
external_url "http://gitlab.example.com"
gitlab-ctl reconfigure

# Output success message
echo "GitLab CI/CD installation completed."