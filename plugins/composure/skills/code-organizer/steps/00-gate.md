# Step 0: Gate — Read Config & Ensure Graph

## 0a. Stack config

1. Read `.claude/no-bandaids.json` from the project root
2. Extract: `frameworks`, `frontend`, `backend`, `monorepo`, `packageManager`
3. If the file is missing, **run `/composure:initialize` automatically** — do NOT stop and ask the user. Report: "No stack config found — running initialize first." After initialize completes, re-read the config and continue.
4. If `monorepo: true` with multiple app paths, ask the user which app to organize. Accept `--all` to process each app root independently. Never reorganize across app boundaries.

## 0b. Ensure code graph exists (safety prerequisite)

The code graph provides **exact import dependency data** — which files import which. Without it, import path updates during file moves rely on grep, which can miss barrel re-exports, dynamic imports, and aliased paths. For a mass restructure, this is the difference between clean moves and broken imports.

**The `composure-graph` MCP server is bundled with the Composure plugin.** It is NOT an npm package — do NOT try to `npm install` it. It is declared in the plugin's `plugin.json` and should be auto-registered when the plugin is installed. If tools are unavailable, the server failed to start or the plugin wasn't installed correctly.

1. Check if `composure-graph` MCP tools are available by calling `list_graph_stats`
2. **If tools available + graph exists** (`last_updated` is not null): proceed. Report: "Graph ready: {N} files indexed"
3. **If tools available + no graph** (`last_updated` is null): build it now.
   - Call `build_or_update_graph({ full_rebuild: true })`
   - Report: "Built code graph: {N} files, {M} nodes, {K} edges — import dependencies now tracked"
   - This is non-optional. The graph must exist before we move files.
4. **If tools unavailable** (MCP server not running):
   - **Do NOT offer choices.** Do NOT ask "would you like to proceed without the graph." Do NOT try to `npm install` anything — the server is bundled with the plugin.
   - Run the auto-fix from `/composure:initialize` Step 0a:
     - **A.** Check `node --version` — must be >= 22.5.0
     - **B.** Find plugin path via `claude plugin list --json`, locate `graph/dist/server.js`, and register it: `claude mcp add composure-graph -- node --experimental-sqlite "$COMPOSURE_PATH/graph/dist/server.js"`
     - **C.** If plugin not installed at all → tell user to install it
   - After registering, tell user to restart Claude Code (Ctrl+C then `claude`).
   - **Stop here.** The graph is required. The `--no-graph` flag exists only for analysis (`--dry-run`) — never for actual file moves.

---

**Next:** Read `steps/01-load-conventions.md`
