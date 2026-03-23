#!/bin/bash
# ============================================================
# Graph Update Hook — PostToolUse on Edit|Write
# ============================================================
# Triggers incremental graph update for changed source files.
#
# v2 CHANGES:
#   - Cowork Dispatch integration: emits notification if graph
#     update fails, alerting that quality checks are degraded
#
# Non-blocking (exit 0 always). Timeout: 15 seconds.
# ============================================================

# Read tool input from stdin
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

[ -z "$FILE_PATH" ] && exit 0

# Only update for source files the parser handles
case "$FILE_PATH" in
  *.tsx|*.ts|*.jsx|*.js) ;;
  *) exit 0 ;;
esac

# Skip generated/vendored directories
case "$FILE_PATH" in
  */node_modules/*|*/.next/*|*/dist/*|*/.expo/*) exit 0 ;;
  */.code-review-graph/*) exit 0 ;;
esac

# Check if graph dist exists (graph may not be built yet)
GRAPH_UPDATE="${CLAUDE_PLUGIN_ROOT}/graph/dist/update.js"
[ ! -f "$GRAPH_UPDATE" ] && exit 0

# Run incremental update for this single file
if ! node --experimental-sqlite "$GRAPH_UPDATE" --file "$FILE_PATH" 2>/dev/null; then
  # ── Cowork Dispatch Notification — graph update failed ──
  NOTIFY_LIB="${CLAUDE_PLUGIN_ROOT}/hooks/lib/notify.sh"
  if [ -f "$NOTIFY_LIB" ]; then
    source "$NOTIFY_LIB"
    RELATIVE_PATH="${FILE_PATH#$CLAUDE_PROJECT_DIR/}"
    emit_notification \
      "info" \
      "Graph Update Failed" \
      "Incremental graph update failed for \`${RELATIVE_PATH}\`. Quality checks may use stale data. Run /build-graph to rebuild." \
      "/build-graph" \
      "$RELATIVE_PATH" \
      "graph" > /dev/null 2>&1
  fi
fi

exit 0
