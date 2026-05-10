#!/usr/bin/env bash
# ------------------------------------------------------------
# Script: register_runners.sh
# Purpose: Install and register a GitLab Runner for the sandbox
# ------------------------------------------------------------

set -euo pipefail

# -------------------------
# Configuration (env vars)
# -------------------------
# Required:
#   GITLAB_URL           - Base URL of the GitLab instance (e.g. https://gitlab.example.com)
#   REGISTRATION_TOKEN   - Registration token from the GitLab admin area
# Optional (with defaults):
#   RUNNER_DESCRIPTION   - Human‑readable description for the runner
#   RUNNER_TAGS          - Comma‑separated list of tags (e.g. "sandbox,linux")
#   RUNNER_EXECUTOR      - Executor type (docker, shell, etc.) – default: docker
#   DOCKER_IMAGE         - Default Docker image for the docker executor – default: alpine:latest
#   CONFIG_DIR           - Directory where the runner config will be stored – default: /etc/gitlab-runner

: "${RUNNER_DESCRIPTION:=sandbox-runner}"
: "${RUNNER_TAGS:=sandbox}"
: "${RUNNER_EXECUTOR:=docker}"
: "${DOCKER_IMAGE:=alpine:latest}"
: "${CONFIG_DIR:=/etc/gitlab-runner}"

# Validate required variables
if [[ -z "${GITLAB_URL:-}" || -z "${REGISTRATION_TOKEN:-}" ]]; then
  echo "Error: GITLAB_URL and REGISTRATION_TOKEN environment variables must be set."
  exit 1
fi

# ------------------------------------------------------------
# Helper functions
# ------------------------------------------------------------
install_gitlab_runner() {
  if command -v gitlab-runner >/dev/null 2>&1; then
    echo "gitlab-runner already installed."
    return
  fi

  echo "Installing gitlab-runner..."
  # Detect package manager
  if command -v apt-get >/dev/null 2>&1; then
    curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
    sudo apt-get install -y gitlab-runner
  elif command -v yum >/dev/null 2>&1; then
    curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash
    sudo yum install -y gitlab-runner
  else
    echo "Unsupported OS package manager. Install gitlab-runner manually."
    exit 1
  fi
}

runner_already_registered() {
  # gitlab-runner stores each runner in a separate config file under $CONFIG_DIR/config.toml
  # The presence of a non‑empty config.toml indicates a registration.
  [[ -f "${CONFIG_DIR}/config.toml" ]] && grep -q "url = \"${GITLAB_URL}\"" "${CONFIG_DIR}/config.toml"
}

register_runner() {
  echo "Registering GitLab Runner..."
  sudo gitlab-runner register \
    --non-interactive \
    --url "${GITLAB_URL}" \
    --registration-token "${REGISTRATION_TOKEN}" \
    --description "${RUNNER_DESCRIPTION}" \
    --tag-list "${RUNNER_TAGS}" \
    --executor "${RUNNER_EXECUTOR}" \
    $( [[ "${RUNNER_EXECUTOR}" == "docker" ]] && echo "--docker-image ${DOCKER_IMAGE}" ) \
    --config "${CONFIG_DIR}/config.toml"
}

enable_and_start_service() {
  echo "Enabling and starting gitlab-runner service..."
  sudo systemctl enable gitlab-runner
  sudo systemctl restart gitlab-runner
}

# ------------------------------------------------------------
# Main execution flow
# ------------------------------------------------------------
install_gitlab_runner

if runner_already_registered; then
  echo "Runner already registered for ${GITLAB_URL}. Skipping registration."
else
  register_runner
fi

enable_and_start_service

echo "GitLab Runner setup complete."