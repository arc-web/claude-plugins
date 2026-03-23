---
description: Quick decomposition audit — find oversized files and functions
---

Run a quick decomposition audit using the code knowledge graph.

1. Call `list_graph_stats` to verify the graph is built. If not built, tell the user to run `/composure:build-graph` first.

2. Call `find_large_functions` with `min_lines=150` to find oversized functions.

3. Call `find_large_functions` with `min_lines=300` and `kind="Class"` to find oversized classes.

4. Present results as a prioritized table:

```
## Quick Audit Results

| Priority | File | Entity | Lines | Limit | Over By |
|----------|------|--------|-------|-------|---------|

**Total: N violations** | Critical: N | High: N | Moderate: N
```

Classify as:
- **Critical**: 2x+ over limit
- **High**: 1.5-2x over limit
- **Moderate**: 1-1.5x over limit

If $ARGUMENTS contains a path or glob, pass it as `file_pattern` to `find_large_functions`.
