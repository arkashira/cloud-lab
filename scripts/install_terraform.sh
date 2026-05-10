#!/bin/bash

# /opt/axentx/cloud-lab/scripts/install_terraform.sh
# A robust script to install Terraform and provide a sample configuration.

set -e

# --- Configuration ---
# Use a stable, recent version of Terraform. This can be updated easily.
TERRAFORM_VERSION="1.9.5"
# The directory where Terraform will be installed.
INSTALL_DIR="/usr/local/bin"
# The directory where the sample Terraform configuration will be created.
CONFIG_DIR="$HOME/terraform-configs"

# --- Functions ---

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- Main Installation Logic ---

echo "Starting Terraform installation..."

# Determine OS and install accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected Linux. Installing Terraform via apt..."
    
    # Update package manager and install dependencies
    sudo apt-get update -y
    sudo apt-get install -y wget unzip
    
    # Download Terraform
    wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip
    
    # Unzip and move to the install directory
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip
    sudo mv terraform $INSTALL_DIR/
    
    # Clean up
    rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip

elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected macOS. Installing Terraform via Homebrew..."
    
    # Install Homebrew if not already present (optional but helpful)
    if ! command_exists brew; then
        echo "Homebrew not found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install Terraform via Homebrew
    brew tap hashicorp/tap
    brew install hashicorp/tap/terraform
fi

# Verify installation
if command_exists terraform; then
    echo "✅ Terraform installed successfully!"
    terraform --version
else
    echo "❌ Failed to install Terraform."
    exit 1
fi

# --- Create Sample Configuration ---
echo "Creating a sample Terraform configuration..."

mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_DIR/main.tf" << 'EOF'
# A simple Terraform configuration using the null provider.
# This demonstrates basic syntax and how to use a resource.

terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
  }
}

provider "null" {}

# A null_resource is used here to demonstrate how to trigger an action
# during the 'plan' or 'apply' phase.
resource "null_resource" "example" {
  triggers = {
    message = "Hello from Terraform in the sandbox!"
  }
}
EOF

echo "✅ Sample Terraform configuration created at $CONFIG_DIR/main.tf"

echo "🎉 Installation and setup complete!"
echo "To get started, run the following commands from your terminal:"
echo "1. Navigate to the config directory:"
echo "   cd $CONFIG_DIR"
echo "2. Initialize the Terraform working directory:"
echo "   terraform init"
echo "3. See the plan for the resources:"
echo "   terraform plan"
echo "4. Apply the changes:"
echo "   terraform apply"