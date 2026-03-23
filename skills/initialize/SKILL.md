---
name: initialize
description: Detect project stack and generate Composure config (.claude/no-bandaids.json, task queue). Run once per project.
argument-hint: "[--force] [--dry-run]"
---

# Composure Initialize

Bootstrap Composure project-level configuration by detecting the tech stack and generating appropriate configs.

## Arguments

- `--force` — Overwrite existing `.claude/no-bandaids.json` even if it exists
- `--dry-run` — Show what would be generated without writing files

## Workflow

### Step 0: Ensure Context7 MCP

Context7 provides up-to-date library documentation, which Step 3 uses for stack-specific pattern verification.

1. Check if Context7 is already available by running:
   ```bash
   claude mcp list 2>/dev/null | grep -i context7
   ```
2. If **not found** (no output or command fails), install it:
   ```bash
   claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
   ```
3. Report: "Context7 MCP: already installed" or "Context7 MCP: installed"
4. If the `claude mcp add` command fails (e.g., CLI not available, permissions), note it and continue — Step 3 is optional anyway

### Step 1: Detect Stack

Read these files from the project root to identify the stack:

| File | What to extract |
|------|----------------|
| `package.json` (root) | Framework, key dependencies, scripts, package manager |
| `tsconfig.json` | TypeScript version, strict mode, target |
| `turbo.json` or `pnpm-workspace.yaml` | Monorepo detection |
| `apps/*/package.json` | Per-app frameworks (Next.js, Expo, Vite, etc.) |
| `packages/*/package.json` | Shared packages with type exports |
| `supabase/config.toml` | Supabase detection |
| `next.config.*` | Next.js version and config |
| `app.json` or `app.config.*` | Expo SDK version |

Build a stack profile:

```
{
  "monorepo": true/false,
  "packageManager": "pnpm" | "npm" | "yarn" | "bun",
  "typescript": { "version": "5.x", "strict": true },
  "frameworks": ["next@16.x", "expo@55", ...],
  "libraries": ["@tanstack/react-query", "@supabase/ssr", ...],
  "sharedPackages": ["@myapp/database", "@myapp/shared", ...],
  "typegenScript": "pnpm --filter @myapp/database generate" | null
}
```

**Detecting typegenHint**: Look for type generation scripts in order:
1. A `generate` script in any package that produces `*.types.ts` or `database.types.ts`
2. A `supabase gen types` command in any script
3. A `prisma generate` command in any script
4. A `graphql-codegen` command in any script
5. If found, format as the full command from root (e.g., `pnpm --filter @scope/pkg generate`)

### Step 2: Resolve Extensions and Skip Patterns

Based on detected stack:

| Stack | Extensions | Skip Patterns |
|-------|-----------|---------------|
| TypeScript + React | `.ts`, `.tsx`, `.js`, `.jsx` | `*.d.ts`, `*.generated.*`, `*.gen.*` |
| + Vue | add `.vue` | — |
| + Svelte | add `.svelte` | — |
| + Supabase | — | add `database.types.ts` |
| + Prisma | — | add `*.prisma-client.*` |
| + GraphQL Codegen | — | add `*.generated.ts`, `__generated__/*` |

### Step 3: Query Context7 for Stack-Specific Patterns (Optional)

If the detected stack has frameworks with known type-safety patterns, query Context7 to verify the current recommended approach. Focus on:

- **TypeScript**: Is `satisfies` still the recommended pattern? Any new narrowing features?
- **React**: Current event type patterns (`ChangeEvent<T>`, etc.), ref typing patterns
- **Next.js**: Server action types, async request API patterns, `proxy.ts` types
- **Expo**: Route param typing (`useLocalSearchParams<T>`), navigation types
- **Supabase**: RPC return types, typed client patterns

This step is informational — use the findings to validate that the hook's error messages reference current patterns. If something has changed, note it in the output.

### Step 4: Generate Config

Create `.claude/no-bandaids.json`:

```json
{
  "extensions": ["<detected>"],
  "skipPatterns": ["<detected>"],
  "disabledRules": [],
  "typegenHint": "<detected or empty>"
}
```

### Step 5: Build Code Graph

If the composure-graph MCP server is available (check if `composure-graph` tools like `list_graph_stats` are callable):

1. Call `list_graph_stats` to check if a graph already exists
2. If no graph exists (`last_updated` is null), call `build_or_update_graph({ full_rebuild: true })` to do an initial full build
3. Report: "Graph built: N files, M nodes, K edges" or "Graph already exists: N nodes, last updated X"
4. If the MCP tools aren't available, skip and note: "Code review graph not configured — run /build-graph manually after plugin setup"

### Step 6: Ensure Task Queue

Create `tasks-plans/` directory and `tasks-plans/tasks.md` if they don't exist:

```markdown
# Code Quality Tasks

> Auto-populated by Composure's PostToolUse hook. Process with `/review-tasks`.

## 🔴 Critical

## 🟡 High

## 🟢 Moderate
```

### Step 7: Report

Print a summary:

```
Composure initialized for <project-name>

Stack detected:
  - TypeScript 5.x (strict)
  - Next.js 16.x + Expo SDK 55
  - Supabase + TanStack Query
  - Monorepo (pnpm workspaces)

Generated:
  ✓ .claude/no-bandaids.json (4 extensions, 5 skip patterns, typegen hint set)
  ✓ tasks-plans/tasks.md (task queue ready)

Active hooks:
  - PreToolUse: architecture trigger, no-bandaids
  - PostToolUse: decomposition check, graph update

Available skills:
  /app-architecture  — Feature building guide (database → UI)
  /decomposition-audit — Codebase size violation scan
  /review-tasks — Process accumulated quality tasks
  /review-pr — PR review with impact analysis
  /review-delta — Changes since last commit
  /build-graph — Build/update code review graph
```

## Notes

- This skill is idempotent — running it again updates the config based on current stack
- With `--force`, it overwrites even if `.claude/no-bandaids.json` exists
- With `--dry-run`, it prints the config without creating files
- The skill does NOT modify CLAUDE.md — that's the project's responsibility
- If the project already has a `.claude/no-bandaids.json`, skip generation unless `--force`
