#!/usr/bin/env bash
# This script registers and starts a GitLab Runner in the sandbox environment.
# It expects the following environment variables to be set:
#   GITLAB_URL          - The URL of the GitLab instance (e.g., https://gitlab.example.com)
#   GITLAB_TOKEN        - The registration token for the project/group
#   RUNNER_NAME         - Human‑readable name for the runner (default: "sandbox-runner")
#   RUNNER_TAGS         - Comma‑separated tags for the runner (default: "sandbox")
#   RUNNER_EXECUTOR     - Executor type (e.g., "docker", "shell") (default: "shell")
#   RUNNER_DOCKER_IMAGE - Docker image to use when executor is docker (default: "alpine:latest")
#   RUNNER_LOCKED       - Whether the runner is locked to the project (true/false) (default: false)
#   RUNNER_RUN_UNTAGGED - Whether the runner can run untagged jobs (true/false) (default: true)
#   RUNNER_ACCESS_LEVEL - Access level of the runner (instance, project, group) (default: "project")
#
# The script will:
#   1. Check if a runner with the given name is already registered.
#   2. If not, register a new runner with the provided configuration.
#   3. Start the gitlab-runner service (assumes gitlab-runner is installed).

set -euo pipefail

# Default values
: "${RUNNER_NAME:=sandbox-runner}"
: "${RUNNER_TAGS:=sandbox}"
: "${RUNNER_EXECUTOR:=shell}"
: "${RUNNER_DOCKER_IMAGE:=alpine:latest}"
: "${RUNNER_LOCKED:=false}"
: "${RUNNER_RUN_UNTAGGED:=true}"
: "${RUNNER_ACCESS_LEVEL:=project}"

# Helper: log
log() {
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $*"
}

# Validate required vars
for var in GITLAB_URL GITLAB_TOKEN; do
  if [[ -z "${!var:-}" ]]; then
    log "ERROR: Environment variable $var is required."
    exit 1
  fi
done

# Check if runner already registered
if gitlab-runner list | grep -q "^${RUNNER_NAME}"; then
  log "Runner '${RUNNER_NAME}' is already registered. Skipping registration."
else
  log "Registering new runner '${RUNNER_NAME}'..."
  gitlab-runner register \
    --non-interactive \
    --url "${GITLAB_URL}" \
    --registration-token "${GITLAB_TOKEN}" \
    --name "${RUNNER_NAME}" \
    --tag-list "${RUNNER_TAGS}" \
    --locked="${RUNNER_LOCKED}" \
    --run-untagged="${RUNNER_RUN_UNTAGGED}" \
    --access-level="${RUNNER_ACCESS_LEVEL}" \
    --executor "${RUNNER_EXECUTOR}" \
    $( [[ "${RUNNER_EXECUTOR}" == "docker" ]] && echo "--docker-image ${RUNNER_DOCKER_IMAGE}" )
  log "Runner '${RUNNER_NAME}' registered successfully."
fi

# Start the runner service
if systemctl is-enabled --quiet gitlab-runner; then
  log "Starting gitlab-runner service..."
  systemctl start gitlab-runner
  log "gitlab-runner service started."
else
  log "gitlab-runner service is not enabled. Please enable it manually."
fi

log "GitLab runner setup complete."