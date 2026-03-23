---
name: dispatch-workflows
description: Optimized workflows for Claude Cowork Dispatch (remote control from mobile). Mobile-friendly summaries, async-first outputs, and quick dispatch commands.
argument-hint: "[setup|commands]"
---

# Composure Dispatch Workflows

Optimized workflows for controlling Composure remotely via Claude Cowork Dispatch (mobile → desktop).

## Why Dispatch + Composure

Dispatch lets you monitor code quality and trigger fixes from your phone. Your desktop does the heavy lifting (graph queries, file analysis, decomposition) — you just get concise results back.

**Key use cases:**
- Check code quality status while away from your desk
- Trigger decomposition audits before a review meeting
- Get task queue summaries on the go
- Dispatch parallel fixes and check results later

## Mobile-Friendly Commands

When responding to Dispatch messages (detected by shorter conversation context or mobile-style requests), optimize output for phone screens:

### Quick Status Check
User says something like: "How's the code quality?" or "Any violations?"

Respond with a compact summary:
```
Code Quality: 3 critical, 5 high, 2 moderate violations
Graph: Fresh (updated 2h ago)
Tasks: 10 open, 4 resolved this week
Top offender: security-client.tsx (1220 lines, limit 150)
```

### Run Audit
User says: "Run a decomposition audit" or "Scan the codebase"

1. Run the audit using `find_large_functions`
2. Write detailed results to `composure-dispatch-audit.md`
3. Send a compact summary back:
```
Audit complete — 8 violations found
Report: composure-dispatch-audit.md

Critical (2):
  security-client.tsx: 1220 lines (limit 150)
  keys.ts: 890 lines (limit 300)

High (3): user-form.tsx, dashboard.tsx, settings-page.tsx
Moderate (3): message-bubble.tsx, nav-header.tsx, sidebar.tsx
```

### Check Blast Radius
User says: "What changed today?" or "Blast radius of recent changes"

1. Run `get_impact_radius` for recent commits
2. Respond concisely:
```
Today's changes: 4 files modified
Impact radius: 12 files affected (2 hops)

High impact:
  useAuth.ts → 8 consumers affected
  api-client.ts → 5 consumers affected

Low impact:
  button.tsx → 1 consumer
  styles.ts → 0 consumers
```

### Fix Violations
User says: "Fix the critical violations" or "Decompose security-client.tsx"

1. Acknowledge: "Starting decomposition of security-client.tsx. I'll message you when done."
2. Run the decomposition (this may take several minutes)
3. Report back with results

## Setup Guide

When `$ARGUMENTS` is `setup`:
1. Explain that Dispatch requires Claude Desktop (macOS/Windows) and Claude mobile app
2. Guide through: Cowork → Dispatch → Get Started → scan QR code
3. Explain that all Composure tools work through Dispatch automatically
4. Suggest testing with: "Check graph status" from phone

When `$ARGUMENTS` is `commands`:
List the recommended dispatch phrases:
- "Code quality status" → quick summary
- "Run a decomposition audit" → full scan
- "What's the blast radius?" → impact analysis
- "Show me the task queue" → open tasks
- "Fix [filename]" → decompose a specific file
- "Generate an audit report" → professional report

## Design Principles for Dispatch Responses

1. **Compact**: Phone screens are small — bullet points over tables, counts over details
2. **File-backed**: Write detailed output to files, send summaries in chat
3. **Actionable**: End with clear next steps the user can trigger from phone
4. **Async-aware**: Acknowledge long-running tasks immediately, report when done
