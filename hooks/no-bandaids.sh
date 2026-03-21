#!/usr/bin/env bash
set -euo pipefail

# no-bandaids.sh — Global PreToolUse hook that blocks type-casting band-aids.
# Prevents Claude (and subagents) from using shortcuts instead of fixing root causes.
#
# Validated against: TypeScript 5.9, React 19.2, Next.js 16.1, Expo SDK 55, RN 0.83
# Safe patterns: `as const`, `satisfies`, generic type params, async request APIs
#
# Config: place .claude/no-bandaids.json in any project to customize:
# {
#   "extensions": [".ts", ".tsx", ".js", ".jsx", ".vue", ".svelte"],
#   "skipPatterns": ["*.d.ts", "*.generated.*", "database.types.ts"],
#   "disabledRules": ["non-null-assertion"],
#   "typegenHint": "pnpm --filter @my-app/database generate"
# }
#
# Without config, sensible defaults apply to any TypeScript/JavaScript project.

INPUT=$(cat)
TOOL_NAME=$(printf '%s' "$INPUT" | jq -r '.tool_name')

# Extract content being written — use printf throughout (portable, no flag interpretation)
if [[ "$TOOL_NAME" == "Write" ]]; then
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.content // ""')
elif [[ "$TOOL_NAME" == "Edit" ]]; then
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.new_string // ""')
else
  exit 0
fi

[[ -z "$CONTENT" ]] && exit 0

FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // "unknown"')
BASENAME=$(basename "$FILE_PATH")
PROJECT_DIR=$(printf '%s' "$INPUT" | jq -r '.cwd // ""')

# ─── Load project config (optional) ───────────────────────────────
CONFIG_FILE="${PROJECT_DIR}/.claude/no-bandaids.json"
if [[ -f "$CONFIG_FILE" ]]; then
  CONFIG=$(cat "$CONFIG_FILE")
else
  CONFIG='{}'
fi

# ─── Resolve extensions to check ──────────────────────────────────
EXT_MATCH=false
DEFAULT_EXTS=(".ts" ".tsx" ".js" ".jsx")

if printf '%s' "$CONFIG" | jq -e '.extensions' >/dev/null 2>&1; then
  EXTS=$(printf '%s' "$CONFIG" | jq -r '.extensions[]')
else
  EXTS=$(printf '%s\n' "${DEFAULT_EXTS[@]}")
fi

for ext in $EXTS; do
  if [[ "$BASENAME" == *"$ext" ]]; then
    EXT_MATCH=true
    break
  fi
done
[[ "$EXT_MATCH" == "false" ]] && exit 0

# ─── Resolve skip patterns ────────────────────────────────────────
DEFAULT_SKIPS=("*.d.ts" "*.generated.*" "*.gen.*")

if printf '%s' "$CONFIG" | jq -e '.skipPatterns' >/dev/null 2>&1; then
  SKIP_PATTERNS=$(printf '%s' "$CONFIG" | jq -r '.skipPatterns[]')
else
  SKIP_PATTERNS=$(printf '%s\n' "${DEFAULT_SKIPS[@]}")
fi

for pattern in $SKIP_PATTERNS; do
  case "$BASENAME" in
    $pattern) exit 0 ;;
  esac
done

# ─── Detect test files ────────────────────────────────────────────
IS_TEST_FILE=false
case "$BASENAME" in
  *.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx|*.test.js|*.spec.js) IS_TEST_FILE=true ;;
esac

# ─── Resolve disabled rules ───────────────────────────────────────
DISABLED_RULES=""
if printf '%s' "$CONFIG" | jq -e '.disabledRules' >/dev/null 2>&1; then
  DISABLED_RULES=$(printf '%s' "$CONFIG" | jq -r '.disabledRules[]' | tr '\n' '|')
fi

is_rule_enabled() {
  local rule_name="$1"
  if [[ -n "$DISABLED_RULES" ]] && printf '%s' "$rule_name" | grep -qE "^(${DISABLED_RULES%|})$"; then
    return 1
  fi
  return 0
}

# ─── Run checks ───────────────────────────────────────────────────
VIOLATIONS=""

# Rule: as-any
if is_rule_enabled "as-any" && printf '%s\n' "$CONTENT" | grep -qE '\bas\s+any\b'; then
  VIOLATIONS="${VIOLATIONS}\n- 'as any' detected. Use a type guard, satisfies, or fix the type at its source."
fi

# Rule: double-cast
if is_rule_enabled "double-cast" && printf '%s\n' "$CONTENT" | grep -qE '\bas\s+unknown\s+as\b'; then
  VIOLATIONS="${VIOLATIONS}\n- 'as unknown as T' detected. Use a type guard to narrow unknown to T."
fi

# Rule: ts-suppress
if is_rule_enabled "ts-suppress"; then
  if [[ "$IS_TEST_FILE" == "true" ]]; then
    if printf '%s\n' "$CONTENT" | grep -qE '//\s*@ts-(ignore|nocheck)'; then
      VIOLATIONS="${VIOLATIONS}\n- @ts-ignore/@ts-nocheck detected. Use @ts-expect-error in test files (it fails when the error is fixed)."
    fi
  else
    if printf '%s\n' "$CONTENT" | grep -qE '//\s*@ts-(ignore|expect-error|nocheck)'; then
      VIOLATIONS="${VIOLATIONS}\n- TS suppression comment detected. Fix the type error. Do not suppress it."
    fi
  fi
fi

# Rule: eslint-ts-disable
if is_rule_enabled "eslint-ts-disable" && printf '%s\n' "$CONTENT" | grep -qE '//\s*eslint-disable.*@typescript-eslint'; then
  VIOLATIONS="${VIOLATIONS}\n- eslint-disable for @typescript-eslint rule detected. Fix the type."
fi

# Rule: non-null-assertion — foo!.bar or foo![index]
# ref.current?.focus() is the correct pattern. Not ref.current!.focus().
if is_rule_enabled "non-null-assertion" && printf '%s\n' "$CONTENT" | grep -qE '\w+!\.\w+|\w+!\['; then
  VIOLATIONS="${VIOLATIONS}\n- Non-null assertion (!) detected. Use optional chaining (?.) with a null guard."
fi

# Rule: underscore-unused — catch(_error), const _result = await, param _data
if is_rule_enabled "underscore-unused" && printf '%s\n' "$CONTENT" | grep -qE 'catch\s*\(\s*_\w+\)|const\s+_\w+\s*=\s*await|,\s*_\w+\s*[:\)]'; then
  VIOLATIONS="${VIOLATIONS}\n- Underscore-prefixed unused variable detected. Remove it. For catch blocks, use catch {} (TS 5.x optional catch binding)."
fi

# Rule: any-param — function parameter typed as 'any'
if is_rule_enabled "any-param" && printf '%s\n' "$CONTENT" | grep -qE '\(\s*\w+\s*:\s*any\s*[,\)]'; then
  VIOLATIONS="${VIOLATIONS}\n- Parameter typed as 'any' detected. Define an interface. Use React.ChangeEvent<T>, useLocalSearchParams<T>, etc."
fi

# Rule: return-assertion — "return ... as Type" (NOT "as const" — that's correct)
if is_rule_enabled "return-assertion" && printf '%s\n' "$CONTENT" | grep -qE 'return\s+.*\bas\s+[A-Z]\w+'; then
  VIOLATIONS="${VIOLATIONS}\n- Return type assertion detected. Use satisfies, a type guard, or annotate the function return type."
fi

# ─── Report ────────────────────────────────────────────────────────
if [[ -n "$VIOLATIONS" ]]; then
  printf 'BLOCKED: Band-aid type fix in %s. Fix the root cause:\n' "$BASENAME" >&2
  printf '%b\n' "$VIOLATIONS" >&2
  printf '\nFix with:\n' >&2
  printf '  - satisfies operator for type validation without widening\n' >&2
  printf '  - Type guards (is/in/instanceof) to narrow unknown or union types\n' >&2
  printf '  - Generic type params: useLocalSearchParams<T>, ChangeEvent<T>, Ref<T>\n' >&2
  printf '  - Regenerate types if the schema changed\n' >&2

  TYPEGEN_HINT=$(printf '%s' "$CONFIG" | jq -r '.typegenHint // empty')
  if [[ -n "$TYPEGEN_HINT" ]]; then
    printf '  - Regen: %s\n' "$TYPEGEN_HINT" >&2
  fi

  exit 2
fi

exit 0
