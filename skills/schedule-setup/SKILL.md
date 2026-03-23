---
name: schedule-setup
description: Set up recurring Composure tasks using Cowork's scheduled tasks. Automate graph rebuilds, decomposition audits, and task queue summaries.
argument-hint: "[daily|weekly|standup|all]"
---

# Composure Scheduled Tasks Setup

Configure recurring Composure tasks via Cowork's `/schedule` feature. Requires Claude Cowork (Desktop) — not available in Claude Code CLI.

## Available Schedules

### Daily: Graph Freshness Check

**When:** Every morning (e.g., 8:00 AM)
**What:** Checks if the knowledge graph is stale and rebuilds incrementally if needed.

Tell the user to run:
```
/schedule
```
Then describe the task as:
> "Check if the Composure code knowledge graph is stale. If the last graph update is older than the latest git commit, run an incremental graph rebuild using build_or_update_graph. Then report the graph stats."

### Weekly: Full Decomposition Audit

**When:** Every Monday morning (e.g., 9:00 AM)
**What:** Full codebase scan for size violations with prioritized report.

Tell the user to configure with `/schedule`:
> "Run a full Composure decomposition audit. Use find_large_functions with min_lines=100 to find all oversized functions. Check all .ts and .tsx files against size limits. Write a summary report to composure-weekly-audit.md with violations grouped by severity (Critical/High/Moderate). Include the date and comparison to any previous audit in tasks-plans/archived/."

### Pre-Standup: Task Queue Summary

**When:** 15 minutes before daily standup
**What:** Quick summary of open code quality tasks for team discussion.

Tell the user to configure with `/schedule`:
> "Read tasks-plans/tasks.md and summarize open code quality tasks. Group by severity. For each Critical item, include the file name, current line count, and target limit. Keep it concise — this is for a standup discussion."

### Post-Merge: Impact Analysis

**When:** After merging to main (manual trigger or schedule for end of day)
**What:** Check what changed on main and analyze blast radius.

Tell the user to configure with `/schedule`:
> "Check the last 24 hours of commits on the main branch. For each file changed, run get_impact_radius to understand the blast radius. Flag any high-impact changes that might need review. Report results to composure-daily-impact.md."

## Setup Process

Based on `$ARGUMENTS`:

### `daily`
Guide through setting up the daily graph freshness check.

### `weekly`
Guide through setting up the weekly decomposition audit.

### `standup`
Guide through setting up the pre-standup task summary.

### `all`
Set up all four scheduled tasks.

### No argument
Show which schedules are recommended and let the user choose.

## Notes

- Scheduled tasks only run while the computer is awake and Claude Desktop is open
- Results are delivered as files or in the Cowork conversation thread
- Pair with Slack connector to get notifications when scheduled audits complete
- These schedules work with Dispatch — check results from your phone
