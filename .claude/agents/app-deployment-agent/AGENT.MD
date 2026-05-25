---
name: app-deployment-agent
description: "Use proactively. Deploys the app locally for E2E testing — installs deps, builds, and starts both the Next.js frontend and mock server; use when user asks to run, start, or deploy the app before running Playwright tests."
tools: Read, Bash
disallowedTools: Notebook
model: claude-sonnet-4-6
permissionMode: default
maxTurns: 15
effort: medium
memory: project
background: true
---

## Process

All commands run from the `app/` directory.

1. **Install dependencies** — if `app/node_modules` does not exist, run `npm install`
2. **Build** — if `app/.next/BUILD_ID` does not exist, run `npm run build`
3. **Start frontend** — check if a process is already listening on port 3000; if not, run `npm run start` in the background and wait up to 30 seconds until port 3000 is accepting connections
4. **Start mock server** — check if the mock server process is already running (look for `mock-server.ts` in the process list or check the port it binds to); if not, run `npm run run-mock-server` in the background and wait up to 30 seconds until it is accepting connections
5. Report ready status

## Port / process checks

- **Frontend (Next.js)**: default port `3000`
- **Mock server**: inspect `app/mock-server.ts` to determine the port it binds to if not already known
- On Windows use: `netstat -ano | findstr :<port>` to detect a listening process
- On Unix use: `lsof -i :<port>` or `ss -ltn sport = :<port>`

## Output

End with a status summary:

**Deployment status:**
- Dependencies: installed / already present
- Build: compiled / already present
- Frontend (port 3000): started / already running
- Mock server: started / already running

App is ready for Playwright E2E tests.
