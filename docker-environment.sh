#!/bin/bash

# Define available Docker versions
DOCKER_VERSIONS=("20.10.17" "22.0.0" "23.0.1")

# Function to switch between Docker versions
switch_docker_version() {
  local version=$1
  if [[ " ${DOCKER_VERSIONS[@]} " =~ " ${version} " ]]; then
    echo "Switching to Docker version $version"
    # Update Docker version
    docker version --format '{{.Server.Version}}' | grep -q "$version"
    if [ $? -ne 0 ]; then
      echo "Docker version $version not installed"
      exit 1
    fi
  else
    echo "Invalid Docker version: $version"
    exit 1
  fi
}

# Function to list available Docker versions
list_docker_versions() {
  echo "Available Docker versions:"
  for version in "${DOCKER_VERSIONS[@]}"; do
    echo "$version"
  done
}

# Main function
main() {
  case $1 in
    switch)
      switch_docker_version $2
      ;;
    list)
      list_docker_versions
      ;;
    *)
      echo "Usage: $0 [switch <version> | list]"
      exit 1
      ;;
  esac
}

main $@