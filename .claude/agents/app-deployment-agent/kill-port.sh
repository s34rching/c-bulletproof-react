#!/bin/bash
# kill-port.sh <port>
# Kills the process listening on the given port.
# Exits 0 if a process was killed, exits 1 if no process was found.
PORT="$1"

# Windows (Git Bash): find PID via netstat, kill via taskkill
PID=$(netstat -ano 2>/dev/null | grep -E ":${PORT}[[:space:]]" | awk '{print $NF}' | grep -v '^0$' | head -1)
if [ -n "$PID" ]; then
    taskkill //PID "$PID" //F >/dev/null 2>&1 || kill -9 "$PID" 2>/dev/null
    exit 0
fi

# macOS/Linux: find PID via lsof, kill via kill
PID=$(lsof -ti ":${PORT}" 2>/dev/null | head -1)
if [ -n "$PID" ]; then
    kill -9 "$PID" 2>/dev/null
    exit 0
fi

exit 1
