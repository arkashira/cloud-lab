# /opt/axentx/cloud-lab/docker/base/Dockerfile
# Base image for cloud-lab environments with k3s single-node cluster

FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install comprehensive dependencies for k3s operation
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        wget \
        git \
        ca-certificates \
        gnupg \
        lsb-release \
        iptables \
        iproute2 \
        socat \
        conntrack \
        ipset \
        kmod \
        libseccomp2 \
        libglib2.0-0 \
        libsystemd0 \
    && rm -rf /var/lib/apt/lists/*

# Install k3s binary (latest stable from GitHub releases)
# Direct binary download is more reliable than installer script in Docker
RUN curl -fsSL https://github.com/k3s-io/k3s/releases/download/v1.28.4+k3s2/k3s -o /usr/local/bin/k3s \
    && chmod +x /usr/local/bin/k3s \
    && ln -s /usr/local/bin/k3s /usr/local/bin/kubectl

# Verify k3s installation
RUN k3s --version

# Set default environment variables for k3s operation
ENV K3S_KUBECONFIG_MODE="644"
ENV K3S_DATA_DIR="/var/lib/rancher/k3s"

# Expose necessary ports for k3s API server and agent communication
EXPOSE 6443 10250 10255

# Create non-root user for security best practices
RUN useradd -m -s /bin/bash labuser && \
    chown -R labuser:labuser /home/labuser

# Set working directory
WORKDIR /home/labuser

# Default command - allows interactive shell or k3s startup
CMD ["/bin/bash"]