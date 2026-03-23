---
description: Check code knowledge graph health and staleness
---

Check the health and freshness of the Composure code knowledge graph.

1. Call `list_graph_stats` to get node/edge counts, languages, and last update time.

2. Check the latest git commit time:
   ```bash
   git log -1 --format='%ci'
   ```

3. Compare graph last_updated with latest commit. Report:

```
## Graph Status

| Metric | Value |
|--------|-------|
| Nodes | N |
| Edges | N |
| Files indexed | N |
| Languages | TypeScript, TSX, ... |
| Last updated | YYYY-MM-DD HH:MM |
| Latest commit | YYYY-MM-DD HH:MM |
| Status | Fresh / Stale (N commits behind) |
```

If stale, suggest: "Run `/composure:build-graph` to update."
If graph doesn't exist, suggest: "Run `/composure:init` or `/composure:build-graph` to create the graph."
