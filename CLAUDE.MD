# Claude Code Instructions

## Agent chain

Project-level subagents are defined in `.claude/agents/`. Always delegate to them — do not perform their work inline.

### When to use each agent

| Trigger                                                             | Agent                                                                    |
|---------------------------------------------------------------------|--------------------------------------------------------------------------|
| User asks to analyze, understand, or summarize a ticket             | `spec-analyzer-agent`                                                    |
| User asks to create / generate test cases or scenarios for a ticket | `test-generator-agent` (it will internally invoke `spec-analyzer-agent`) |
| User asks to read test cases / scenarios from Google Drive          | `spec-reader-agent`                                                      |
| User asks to save test cases / scenarios to Google Drive            | `spec-storage-agent`                                                     |
| User asks to implement / write / create Playwright or E2E tests     | `playwright-tests-agent`                                                 |
| User asks to run, start, or deploy the app for E2E testing          | `app-deployment-agent`                                                   |
| User asks to launch the API server for API testing                  | `app-deployment-agent`                                                   |

### Rules

- Never generate test cases yourself. Always delegate to `test-generator-agent`.
- Never read Notion tickets yourself for analysis. Always delegate to `spec-analyzer-agent`.
- Never read from the Google Drive Specs spreadsheet yourself. Always delegate to `spec-reader-agent`.
- Never write to the Google Drive Specs spreadsheet yourself. Always delegate to `spec-storage-agent`.
- Never write Playwright E2E tests yourself. Always delegate to `playwright-tests-agent`.
- Never deploy or start the app yourself. Always delegate to `app-deployment-agent`.
- Follow the chain: `spec-analyzer-agent` → `test-generator-agent` → `spec-storage-agent` (save) → `playwright-tests-agent` → `app-deployment-agent` (deploy).
- If a ticket number is provided, pass it directly to the agent — do not look it up first.
