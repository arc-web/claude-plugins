---
name: connectors-setup
description: Set up external connectors (GitHub, Slack, Jira) for Composure. Enables automated violation reporting, PR comments, and ticket creation.
argument-hint: "[github|slack|jira|all]"
---

# Composure Connectors Setup

Configure external service connectors to extend Composure's reach beyond your local environment.

## Available Connectors

### GitHub

Enables: PR review comments, issue creation for decomposition debt, automated status checks.

**Setup:**

1. Add to your project's `.mcp.json` or Cowork's connector settings:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/github-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "your-github-token"
      }
    }
  }
}
```

2. Create a personal access token at https://github.com/settings/tokens with `repo` scope.

**What Composure does with it:**
- `/composure:review-pr` posts review comments directly on PRs
- Decomposition audit results can be posted as GitHub issues
- Impact radius analysis can be added as PR status checks

### Slack

Enables: Violation alerts, daily task queue summaries, audit report notifications.

**Setup:**

1. Add to your connector configuration:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic/slack-mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_TEAM_ID": "your-team-id"
      }
    }
  }
}
```

2. Create a Slack app at https://api.slack.com/apps with `chat:write` and `channels:read` scopes.

**What Composure does with it:**
- Post critical violation alerts to a designated channel
- Send daily/weekly task queue summaries (pair with Cowork scheduled tasks)
- Notify when decomposition audits complete

### Jira

Enables: Auto-create tickets for violations, link tasks to sprints, track remediation.

**Setup:**

1. Add to your connector configuration:

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@anthropic/jira-mcp-server"],
      "env": {
        "JIRA_URL": "https://your-org.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

2. Create an API token at https://id.atlassian.com/manage-profile/security/api-tokens

**What Composure does with it:**
- Create tickets for Critical decomposition violations
- Link audit findings to existing sprint boards
- Track remediation progress across sprints

## Setup Process

Based on `$ARGUMENTS`:

### `github`
1. Check if GitHub connector is already configured in `.mcp.json`
2. If not, guide the user through token creation
3. Add the connector to `.mcp.json`
4. Test by reading a repo or PR

### `slack`
1. Check if Slack connector is already configured
2. Guide through Slack app creation and token setup
3. Add the connector
4. Test by sending a message to a channel

### `jira`
1. Check if Jira connector is already configured
2. Guide through API token creation
3. Add the connector
4. Test by reading a project's issues

### `all`
Run all three setups sequentially.

### No argument
Show which connectors are currently configured and which are available.
