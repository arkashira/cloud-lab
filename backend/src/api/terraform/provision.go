# Explore the project root and subdirectories
ls -la /opt/axentx/cloud-lab/

# Find all Go source files to understand the codebase
find /opt/axentx/cloud-lab -type f -name "*.go" 2>/dev/null | head -50

# Check for existing API patterns
find /opt/axentx/cloud-lab -type f -name "*.go" | xargs grep -l "router\|handler\|api" 2>/dev/null | head -20

# Look for existing container/isolation patterns
find /opt/axentx/cloud-lab -type f -name "*.go" | xargs grep -l "container\|docker\|isolation" 2>/dev/null | head -20