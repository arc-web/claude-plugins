---
description: "Quick status — 3-line summary for Dispatch/mobile push notifications"
---

Return a concise, mobile-friendly status summary. This command is optimized for Cowork Dispatch — the output fits in a push notification.

## Steps

1. **Graph freshness**: Check if `.code-review-graph/graph.db` exists. If it does, call `list_graph_stats` to get the last update timestamp. Report as "Graph: fresh (updated Xh ago)" or "Graph: STALE (Xd old) — run /build-graph".

2. **Open violations**: Read `tasks-plans/tasks.md`. Count lines matching `- [ ]` grouped by severity emoji:
   - Count lines containing `🔴` → critical
   - Count lines containing `🟡` → high
   - Count lines containing `🟢` → moderate
   Report as "Violations: N critical, N high, N moderate" or "Violations: none"

3. **Pending notifications**: If `.composure/notifications/pending.jsonl` exists, count lines where `"read":false`. Report as "Alerts: N pending" or "Alerts: clear"

## Output format

Respond with EXACTLY 3 lines, no markdown, no headers:

```
Graph: <status>
Violations: <counts>
Alerts: <count>
```

Example:
```
Graph: fresh (2h ago)
Violations: 1 critical, 3 high, 5 moderate
Alerts: 2 pending
```

This format is designed to fit in a mobile push notification body. Do not add any extra text, explanations, or formatting.
