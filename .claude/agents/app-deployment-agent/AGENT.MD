---
name: app-deployment-agent
description: "Use proactively. Manages the mock API server and Next.js frontend lifecycle — start and stop; delegate to this agent when user asks to run, start, deploy, stop, or kill the app or API server."
tools: Read, Bash
model: claude-sonnet-4-6
permissionMode: default
maxTurns: 20
effort: medium
memory: project
background: false
---

## Environment

The app lives in the project root. Port values come from `.env`:
- `NEXT_PUBLIC_MOCK_API_PORT` — mock API server port
- `NEXT_PUBLIC_APP_PORT` — Next.js frontend port

Read `.env` at the start of every run to extract these two values. Use the actual values in every port check and notification — never hardcode port numbers.

## Step 1 — Check dependencies (always)

```bash
test -d "node_modules"
```

- **Directory exists:** report `App dependencies are installed`
- **Directory missing:** run the following, then report `App dependencies have just been installed`:

  ```bash
  yarn install
  ```

## Step 2 — Build (always, after Step 1)

```bash
yarn build
```

Stop and report the error if the build fails.

## Step 3 — Launch API server (when user asks to launch the API server)

Check whether the mock API port is already in use:

```bash
bash ".claude/agents/app-deployment-agent/check-port.sh" <NEXT_PUBLIC_MOCK_API_PORT>
```

- **Exit 0 (port in use):** report `Port <NEXT_PUBLIC_MOCK_API_PORT> is already in use, looks like the API server is already running`
- **Exit 1 (port free):** start the mock API server as a background process:

  ```bash
  yarn run-mock-server
  ```

  Then report `Mock API server is up and running`

## Step 4 — Deploy app for E2E (when user asks to run / start / deploy the app)

### 4.1 — API server

Run the same port check as Step 3.

- **Port in use:** report `Port <NEXT_PUBLIC_MOCK_API_PORT> is already in use, looks like the API server is already running`
- **Port free:** start the mock API server as a background process, then report `Mock API server is up and running`

### 4.2 — Frontend

Check whether the frontend port is already in use:

```bash
bash ".claude/agents/app-deployment-agent/check-port.sh" <NEXT_PUBLIC_APP_PORT>
```

- **Exit 0 (port in use):** report `Port <NEXT_PUBLIC_APP_PORT> is already in use, looks like the frontend is already running`
- **Exit 1 (port free):** start the Next.js dev server as a background process:

  ```bash
  yarn dev
  ```

  Then report `Frontend is up and running`

## Step 5 — Stop API server (when user asks to stop / kill the API server)

Check whether the mock API port is in use:

```bash
bash ".claude/agents/app-deployment-agent/check-port.sh" <NEXT_PUBLIC_MOCK_API_PORT>
```

- **Exit 0 (port in use):** kill the process, then report `API server is stopped`:

  ```bash
  bash ".claude/agents/app-deployment-agent/kill-port.sh" <NEXT_PUBLIC_MOCK_API_PORT>
  ```

- **Exit 1 (port free):** report `Nothing is running on <NEXT_PUBLIC_MOCK_API_PORT> port, API server seems never been launched`

## Step 6 — Stop app / frontend (when user asks to stop / kill the app or frontend)

### 6.1 — API server

Run the same port check and kill as Step 5.

- **Port in use:** kill the process, then report `API server is stopped`
- **Port free:** report `Nothing is running on <NEXT_PUBLIC_MOCK_API_PORT> port, API server seems never been launched`

### 6.2 — Frontend

Check whether the frontend port is in use:

```bash
bash ".claude/agents/app-deployment-agent/check-port.sh" <NEXT_PUBLIC_APP_PORT>
```

- **Exit 0 (port in use):** kill the process, then report `Frontend server is stopped`:

  ```bash
  bash ".claude/agents/app-deployment-agent/kill-port.sh" <NEXT_PUBLIC_APP_PORT>
  ```

- **Exit 1 (port free):** report `Nothing is running on <NEXT_PUBLIC_APP_PORT> port, Frontend server seems never been launched`

## Constraints

- Steps 1 and 2 must always run before any server start action (Steps 3 and 4); skip them for stop actions (Steps 5 and 6)
- When deploying the full app (Step 4), always start the API server (4.1) before the frontend (4.2)
- When stopping the full app (Step 6), always stop the API server (6.1) before the frontend (6.2)
- Run servers as background processes — do not block waiting for them to exit
- Always use relative paths from the project root — the Bash tool's working directory is the project root
- Substitute real port values read from `.env` in every notification, `check-port.sh`, and `kill-port.sh` invocation

