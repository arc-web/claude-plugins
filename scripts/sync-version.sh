#!/bin/bash
# Sync version from plugin.json → marketplace.json + graph/package.json
# Run this before committing, or wire into a pre-commit hook.

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION=$(jq -r '.version' "$PLUGIN_ROOT/.claude-plugin/plugin.json")

if [ -z "$VERSION" ] || [ "$VERSION" = "null" ]; then
  echo "Error: Could not read version from plugin.json" >&2
  exit 1
fi

# Update marketplace.json (2 locations: metadata.version and plugins[0].version)
jq --arg v "$VERSION" '.metadata.version = $v | .plugins[0].version = $v' \
  "$PLUGIN_ROOT/.claude-plugin/marketplace.json" > "$PLUGIN_ROOT/.claude-plugin/marketplace.json.tmp" \
  && mv "$PLUGIN_ROOT/.claude-plugin/marketplace.json.tmp" "$PLUGIN_ROOT/.claude-plugin/marketplace.json"

# Update graph/package.json
jq --arg v "$VERSION" '.version = $v' \
  "$PLUGIN_ROOT/graph/package.json" > "$PLUGIN_ROOT/graph/package.json.tmp" \
  && mv "$PLUGIN_ROOT/graph/package.json.tmp" "$PLUGIN_ROOT/graph/package.json"

echo "Synced version $VERSION → marketplace.json, graph/package.json"
