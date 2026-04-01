# Step 2: Verify composure-graph MCP

The `composure-graph` MCP server is **declared in the plugin's `.claude-plugin/plugin.json`** and auto-registered when the plugin is installed. It starts automatically at session startup — no manual registration needed.

1. Check if it's available by calling `list_graph_stats`
2. **If available**: report "composure-graph MCP: ready" and move to the next step.
3. **If NOT available**, diagnose using the chain below. Do NOT stop and ask the user — diagnose it yourself:

   **Check A — Node version:**
   ```bash
   node --version
   ```
   If Node < 22.5.0: "composure-graph requires Node 22.5+ (for built-in SQLite). You have Node {version}. Update Node, then restart Claude Code." — **STOP.**

   **Check B — Plugin installed correctly:**
   ```bash
   # Verify the plugin files exist
   ls "${CLAUDE_PLUGIN_ROOT}/graph/dist/server.js" 2>/dev/null
   ```
   If the file exists but MCP isn't connected: "The composure-graph server is installed but not connected. Run `/reload-plugins` to reconnect, or restart Claude Code."

   If the file doesn't exist: "The graph server hasn't been built. Run:
   ```bash
   cd "${CLAUDE_PLUGIN_ROOT}/graph" && pnpm install && pnpm build
   ```
   Then run `/reload-plugins`."

   **Check C — Plugin not installed:**
   If `CLAUDE_PLUGIN_ROOT` is empty or the composure directory doesn't exist: "Composure plugin is not installed. Install it with: `claude plugin install composure@my-claude-plugins`" — **STOP.**

---

**Next:** Read `steps/03-companion-triage.md`
