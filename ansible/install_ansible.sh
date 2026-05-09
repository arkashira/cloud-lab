#!/bin/bash

# Install Ansible
sudo apt update
sudo apt install -y ansible

# Configure Ansible
sudo mkdir -p /opt/axentx/cloud-lab/ansible
sudo cp /opt/axentx/cloud-lab/ansible/inventory.ini /etc/ansible/hosts