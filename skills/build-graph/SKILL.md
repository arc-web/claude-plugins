---
name: build-graph
description: Build or update the code review knowledge graph. Run this first to initialize, or let hooks keep it updated automatically.
argument-hint: "[full]"
---

# Build Graph

Build or incrementally update the persistent code knowledge graph for this repository.

## Steps

1. **Check graph status** by calling the `list_graph_stats` MCP tool.
   - If the graph has never been built (`last_updated` is null), proceed with a full build.
   - If the graph exists, proceed with an incremental update.

2. **Build the graph** by calling the `build_or_update_graph` MCP tool:
   - For first-time setup: `build_or_update_graph({ full_rebuild: true })`
   - For updates: `build_or_update_graph()` (incremental by default)
   - If the user passes argument "full": `build_or_update_graph({ full_rebuild: true })`

3. **Verify** by calling `list_graph_stats` again and report:
   - Files parsed, nodes and edges created
   - Languages detected (should show typescript, tsx, javascript)
   - Any errors encountered

## When to Use

- First time setting up the graph for a repository
- After major refactoring or branch switches
- The graph auto-updates via PostToolUse hooks on Edit/Write, so manual builds are rarely needed

## Notes

- Graph stored at `.code-review-graph/graph.db` (auto-gitignored)
- Supports: TypeScript, TSX, JavaScript, JSX
- Incremental builds only re-parse changed files + their dependents
