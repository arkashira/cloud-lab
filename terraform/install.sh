#!/bin/bash

set -euo pipefail

# Default Terraform version (can be overridden by passing a version argument or setting an environment variable)
DEFAULT_TERRAFORM_VERSION="1.9.7"
TERRAFORM_VERSION="${1:-${TERRAFORM_VERSION:-$DEFAULT_TERRAFORM_VERSION}}"

# Detect OS and architecture
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "${ARCH}" in
  x86_64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: ${ARCH}" >&2; exit 1 ;;
esac

# Build download URL
BASE_URL="https://releases.hashicorp.com/terraform"
ZIP_NAME="terraform_${TERRAFORM_VERSION}_${OS}_${ARCH}.zip"
DOWNLOAD_URL="${BASE_URL}/${TERRAFORM_VERSION}/${ZIP_NAME}"

# Temporary working directory
TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

# Install dependencies (curl, unzip)
if ! command -v curl &> /dev/null; then
  echo "Installing curl..."
  apt-get update && apt-get install -y curl
fi

if ! command -v unzip &> /dev/null; then
  echo "Installing unzip..."
  apt-get update && apt-get install -y unzip
fi

echo "Downloading Terraform ${TERRAFORM_VERSION} for ${OS}/${ARCH}..."
curl -fsSL -o "${TMP_DIR}/${ZIP_NAME}" "${DOWNLOAD_URL}"

# Verify download
if [ ! -f "${TMP_DIR}/${ZIP_NAME}" ] || [ ! -s "${TMP_DIR}/${ZIP_NAME}" ]; then
  echo "Failed to download Terraform archive."
  exit 1
fi

echo "Extracting Terraform binary..."
unzip -q "${TMP_DIR}/${ZIP_NAME}" -d "${TMP_DIR}"

# Install binary to /usr/local/bin (requires sudo)
INSTALL_DIR="/usr/local/bin"
if [[ ! -w "$INSTALL_DIR" ]]; then
  echo "Installing Terraform to $INSTALL_DIR (requires sudo)..."
  sudo mv "${TMP_DIR}/terraform" "$INSTALL_DIR/"
else
  mv "${TMP_DIR}/terraform" "$INSTALL_DIR/"
fi

chmod +x "$INSTALL_DIR/terraform"

# Verify installation
echo "Verifying Terraform installation..."
if ! command -v terraform &> /dev/null; then
  echo "Terraform installation failed."
  exit 1
fi

terraform --version

echo "Terraform ${TERRAFORM_VERSION} installed successfully to $INSTALL_DIR"