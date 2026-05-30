#!/bin/bash
# check-port.sh <port>
# Exits 0 if the given port is in use, exits 1 if the port is free.
PORT="$1"

# netstat -ano: Windows (Git Bash) and most systems
netstat -ano 2>/dev/null | grep -qE ":${PORT}[[:space:]]" && exit 0

# netstat -tlnp: Linux
netstat -tlnp 2>/dev/null | grep -qE ":${PORT}[[:space:]]" && exit 0

# lsof: macOS and Linux
lsof -ti ":${PORT}" 2>/dev/null | grep -q . && exit 0

exit 1
