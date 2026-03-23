---
description: Quick task queue summary grouped by severity
---

Show a quick summary of the Composure task queue.

1. Read `tasks-plans/tasks.md` from the project root.
2. Read any additional `tasks-plans/*.md` files (excluding archived/).

3. Count open items (`- [ ]`) grouped by severity section (Critical, High, Moderate).

4. Present:

```
## Task Queue

| Priority | Open | Resolved | Worst Offender |
|----------|------|----------|----------------|
| Critical | N | N | filename (NNN lines) |
| High | N | N | filename (NNN lines) |
| Moderate | N | N | filename (NNN lines) |

**Total: N open tasks** | N resolved | N audit files

Next steps:
- `/composure:review-tasks verify` — check which tasks are now resolved
- `/composure:review-tasks delegate` — parallel-fix independent tasks
- `/composure:review-tasks archive` — clean up completed audits
```

If no task files exist, report: "No tasks logged yet. Tasks are auto-created by Composure hooks during development, or run `/composure:decomposition-audit` to scan the codebase."
