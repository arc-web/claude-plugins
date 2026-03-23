---
description: Generate a professional audit report (Excel/CSV or formatted document)
---

Generate a professional code quality audit report using the Composure knowledge graph and task queue.

## Process

1. **Gather data** — Call these MCP tools:
   - `list_graph_stats` for overall codebase health
   - `find_large_functions(min_lines=100)` for all size violations
   - Read `tasks-plans/tasks.md` for open tasks
   - Read any `tasks-plans/*.md` audit files

2. **Build the report** with these sections:

### Executive Summary
- Total files indexed, functions tracked, edges in graph
- Count of violations by severity (Critical/High/Moderate)
- Open vs resolved task ratio
- Graph freshness status

### Violations Detail
Create a CSV or markdown table:
```
File, Entity, Lines, Limit, Severity, Status, Recommended Action
```

### Task Queue Status
- Open items by priority
- Recently resolved items
- Estimated effort per remaining item

### Trend (if previous audit data exists in tasks-plans/archived/)
- Compare current violations to previous audits
- Note improvements and regressions

3. **Output format** based on $ARGUMENTS:
   - No argument or `markdown`: Output as formatted markdown
   - `csv`: Write a `composure-audit-report.csv` file to the project root
   - `document`: Write a formatted `composure-audit-report.md` with full detail suitable for sharing with stakeholders

4. Include timestamp and graph version in the report footer.
