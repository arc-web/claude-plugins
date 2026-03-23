#!/bin/bash
# ============================================================
# Composure Notification Library — Cowork Dispatch Integration
# ============================================================
# Shared functions for emitting structured notifications that
# Cowork's Dispatch system can surface as push notifications.
#
# Use cases:
#   1. Manager visibility — team lead gets alerts on violations
#   2. Developer mobility — dev steps away, gets phone alerts
#
# Notifications are written to a well-known file that Cowork
# polls, AND emitted as structured JSON in hook output so
# Cowork can route them to Dispatch/push notifications.
#
# Usage (source from any hook):
#   source "${CLAUDE_PLUGIN_ROOT}/hooks/lib/notify.sh"
#   emit_notification "warning" "Code Quality" "Function too large" \
#     "/fix-violation dash-001" "src/Dashboard.tsx"
# ============================================================

NOTIFY_DIR="${CLAUDE_PROJECT_DIR:-.}/.composure/notifications"
NOTIFY_LOG="${NOTIFY_DIR}/pending.jsonl"

# Ensure notification directory exists
_ensure_notify_dir() {
  mkdir -p "$NOTIFY_DIR" 2>/dev/null
}

# Generate a short violation ID from file path + timestamp
# Usage: vid=$(generate_violation_id "src/Dashboard.tsx" "decomp")
generate_violation_id() {
  local file_path="$1"
  local category="${2:-violation}"
  local basename
  basename=$(basename "$file_path" | sed 's/\.[^.]*$//' | tr '[:upper:]' '[:lower:]')
  local short_hash
  short_hash=$(echo "${file_path}${category}" | cksum | cut -d' ' -f1 | head -c 6)
  echo "${category}-${basename}-${short_hash}"
}

# Emit a structured notification for Cowork Dispatch
#
# Args:
#   $1 — severity: "critical" | "warning" | "info"
#   $2 — title: short notification title
#   $3 — body: notification body text
#   $4 — action_command: slash command to fix (e.g., "/fix-violation id")
#   $5 — file_path: source file that triggered the violation
#   $6 — category: violation category (e.g., "decomposition", "type-safety", "bandaid")
#
# Outputs: JSON to stdout (for hook systemMessage) and appends to pending.jsonl
emit_notification() {
  local severity="${1:-warning}"
  local title="${2:-Composure Alert}"
  local body="${3:-A code quality issue was detected.}"
  local action_command="${4:-}"
  local file_path="${5:-}"
  local category="${6:-general}"
  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local violation_id
  violation_id=$(generate_violation_id "$file_path" "$category")

  _ensure_notify_dir

  # Build notification JSON
  local notification
  notification=$(jq -n \
    --arg id "$violation_id" \
    --arg severity "$severity" \
    --arg title "$title" \
    --arg body "$body" \
    --arg action "$action_command" \
    --arg file "$file_path" \
    --arg cat "$category" \
    --arg ts "$timestamp" \
    --arg read "false" \
    '{
      id: $id,
      severity: $severity,
      title: $title,
      body: $body,
      actionable: ($action | length > 0),
      action_command: $action,
      file_path: $file,
      category: $cat,
      timestamp: $ts,
      read: false
    }')

  # Append to pending notifications log (Cowork polls this)
  echo "$notification" >> "$NOTIFY_LOG" 2>/dev/null

  # Return the notification JSON (caller can embed in systemMessage)
  echo "$notification"
}

# Build a systemMessage JSON that includes both human-readable text
# and a structured notification block for Cowork Dispatch.
#
# Args:
#   $1 — human-readable message (for Claude Code / terminal display)
#   $2 — notification JSON (from emit_notification)
#
# Outputs: JSON suitable for hook stdout
build_hook_response() {
  local message="$1"
  local notification_json="${2:-}"

  if [ -n "$notification_json" ]; then
    jq -n \
      --arg msg "$message" \
      --argjson notif "$notification_json" \
      '{
        systemMessage: $msg,
        notification: $notif
      }'
  else
    jq -n --arg msg "$message" '{ systemMessage: $msg }'
  fi
}

# Get count of unread notifications
get_pending_count() {
  if [ -f "$NOTIFY_LOG" ]; then
    grep -c '"read":false\|"read": false' "$NOTIFY_LOG" 2>/dev/null || echo "0"
  else
    echo "0"
  fi
}

# Mark a notification as read by ID
mark_read() {
  local target_id="$1"
  [ ! -f "$NOTIFY_LOG" ] && return
  local tmp="${NOTIFY_LOG}.tmp"
  while IFS= read -r line; do
    local nid
    nid=$(echo "$line" | jq -r '.id // empty' 2>/dev/null)
    if [ "$nid" = "$target_id" ]; then
      echo "$line" | jq -c '.read = true'
    else
      echo "$line"
    fi
  done < "$NOTIFY_LOG" > "$tmp"
  mv "$tmp" "$NOTIFY_LOG"
}

# Clear all notifications older than N hours (default: 48)
prune_notifications() {
  local max_age_hours="${1:-48}"
  [ ! -f "$NOTIFY_LOG" ] && return
  local cutoff
  cutoff=$(date -u -d "${max_age_hours} hours ago" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "")
  [ -z "$cutoff" ] && return  # date -d not available on all platforms
  local tmp="${NOTIFY_LOG}.tmp"
  while IFS= read -r line; do
    local ts
    ts=$(echo "$line" | jq -r '.timestamp // empty' 2>/dev/null)
    if [ -n "$ts" ] && [[ "$ts" > "$cutoff" ]]; then
      echo "$line"
    fi
  done < "$NOTIFY_LOG" > "$tmp"
  mv "$tmp" "$NOTIFY_LOG"
}
