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

### Rules

- Never generate test cases yourself. Always delegate to `test-generator-agent`.
- Never read Notion tickets yourself for analysis. Always delegate to `spec-analyzer-agent`.
- Never read from the Google Drive Specs spreadsheet yourself. Always delegate to `spec-reader-agent`.
- Never write from the Google Drive Specs spreadsheet yourself. Always delegate to `spec-storage-agent`.
- Follow the chain: `spec-analyzer-agent` → `test-generator-agent` → `spec-storage-agent` (save).
- If a ticket number is provided, pass it directly to the agent — do not look it up first.
