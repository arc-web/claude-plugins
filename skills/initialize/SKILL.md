---
name: initialize
description: Detect project stack and generate Composure config (.claude/no-bandaids.json, task queue, framework reference docs). Run once per project.
argument-hint: "[--force] [--dry-run] [--skip-context7]"
---

# Composure Initialize

Bootstrap Composure project-level configuration by detecting the tech stack, querying up-to-date framework patterns, and generating appropriate configs.

## Arguments

- `--force` — Overwrite existing `.claude/no-bandaids.json` and regenerate framework docs even if they exist
- `--dry-run` — Show what would be generated without writing files
- `--skip-context7` — Skip Context7 queries (for offline/CI use)

## Workflow

### Step 0: Ensure Context7 MCP

Context7 provides up-to-date library documentation. Step 3 uses it to generate framework reference docs.

1. Check if Context7 is already available by running:
   ```bash
   claude mcp list 2>/dev/null | grep -i context7
   ```
2. If **not found** (no output or command fails), install it:
   ```bash
   claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
   ```
3. Report: "Context7 MCP: already installed" or "Context7 MCP: installed"
4. If the `claude mcp add` command fails (e.g., CLI not available, permissions), note it and continue — use `--skip-context7` to skip Step 3

### Step 1: Detect Stack

Read these files from the project root to identify the stack:

| File | What to extract |
|------|----------------|
| `package.json` (root + workspaces) | Framework, key dependencies, scripts, package manager |
| `tsconfig.json` | TypeScript version, strict mode, target |
| `turbo.json` or `pnpm-workspace.yaml` | Monorepo detection |
| `apps/*/package.json` | Per-app frameworks (Next.js, Expo, Vite, etc.) |
| `packages/*/package.json` | Shared packages with type exports |
| `supabase/config.toml` | Supabase detection |
| `next.config.*` | Next.js version and config |
| `app.json` or `app.config.*` | Expo SDK version |
| `requirements.txt` / `pyproject.toml` / `setup.py` | Python detection + dependencies |
| `go.mod` | Go detection + version |
| `Cargo.toml` | Rust detection + edition |
| `CMakeLists.txt` / `Makefile` | C++ detection |
| `Dockerfile` / `docker-compose.yml` | Container detection |
| `*.tf` files | Terraform/IaC detection |

Build a stack profile:

```json
{
  "monorepo": true,
  "packageManager": "pnpm",
  "frameworks": {
    "typescript": {
      "paths": ["apps/web", "apps/mobile", "packages/shared"],
      "versions": {
        "typescript": "5.9",
        "react": "19.2",
        "vite": "8.0",
        "next": "16.1",
        "tailwindcss": "4.2",
        "shadcn": "4.1"
      }
    },
    "python": {
      "paths": ["services/api", "scripts"],
      "versions": {
        "python": "3.12",
        "fastapi": "0.115",
        "pydantic": "2.12"
      }
    },
    "go": {
      "paths": ["services/worker"],
      "versions": {
        "go": "1.23"
      }
    }
  },
  "typegenScript": "pnpm --filter @myapp/database generate"
}
```

For single-framework projects, `frameworks` has one key:
```json
{
  "monorepo": false,
  "frameworks": {
    "typescript": {
      "paths": ["."],
      "versions": { "typescript": "5.9", "vite": "8.0", "react": "19.2" }
    }
  }
}
```

**Detecting typegenHint**: Look for type generation scripts in order:
1. A `generate` script in any package that produces `*.types.ts` or `database.types.ts`
2. A `supabase gen types` command in any script
3. A `prisma generate` command in any script
4. A `graphql-codegen` command in any script
5. If found, format as the full command from root (e.g., `pnpm --filter @scope/pkg generate`)

### Step 2: Resolve Extensions and Skip Patterns

Based on detected frameworks (merged across all detected languages):

| Framework | Extensions | Skip Patterns |
|-----------|-----------|---------------|
| TypeScript + React | `.ts`, `.tsx`, `.js`, `.jsx` | `*.d.ts`, `*.generated.*`, `*.gen.*` |
| + Vue | add `.vue` | — |
| + Svelte | add `.svelte` | — |
| + Supabase | — | add `database.types.ts` |
| + Prisma | — | add `*.prisma-client.*` |
| + GraphQL Codegen | — | add `*.generated.ts`, `__generated__/*` |
| Python | `.py` | `__pycache__/*`, `*.pyc`, `.venv/*` |
| Go | `.go` | `vendor/*`, `*_test.go` (for no-bandaids only) |
| Rust | `.rs` | `target/*` |
| C++ | `.cpp`, `.cc`, `.cxx`, `.hpp`, `.h` | `build/*`, `cmake-build-*/*` |

### Step 3: Query Context7 and Generate Framework Reference Docs (MANDATORY)

**This step is required.** Claude's training data is 10+ months behind. Context7 provides the current API surface. Use `--skip-context7` only in offline/CI environments.

For **each detected framework**, query Context7:

1. Resolve the library ID: `resolve-library-id` for each framework/library in `versions`
2. Query for: breaking changes from previous version, current recommended patterns, type safety patterns, anti-patterns, configuration format
3. Write findings to framework reference docs:

```
skills/app-architecture/{lang}/references/generated/{library}-{version}.md
```

Each generated doc MUST have this frontmatter:
```markdown
---
name: {library} {version} Patterns
source: context7
queried_at: {ISO date}
library_version: {version}
context7_library_id: {/org/project}
---
```

**Per-language query focus:**

| Language | Libraries to Query | Focus Areas |
|---|---|---|
| TypeScript | typescript, react, next.js, vite, tailwindcss, shadcn/ui, expo | Type patterns, satisfies, hooks rules, CSS variables, routing |
| Python | fastapi, pydantic, sqlalchemy, django | Pydantic v2 patterns, async patterns, type hints, validation |
| Go | stdlib, gin/echo/chi, cobra | Error handling patterns, generics, context propagation |
| Rust | std, axum/actix-web, clap, serde | Ownership patterns, error handling with ?, trait patterns |
| C++ | — (use web search) | Smart pointers, RAII, const correctness, modern C++ idioms |

**If Context7 is unavailable** (`--skip-context7`): skip doc generation, note in report. The plugin ships with curated `references/universal/` docs as fallback.

### Step 4: Generate Config

Create `.claude/no-bandaids.json`:

```json
{
  "extensions": [".ts", ".tsx", ".js", ".jsx", ".py", ".go"],
  "skipPatterns": ["*.d.ts", "*.generated.*", "__pycache__/*"],
  "disabledRules": [],
  "typegenHint": "pnpm --filter @myapp/database generate",
  "frameworks": {
    "typescript": {
      "paths": ["apps/web"],
      "versions": { "typescript": "5.9", "react": "19.2", "vite": "8.0" }
    },
    "python": {
      "paths": ["services/api"],
      "versions": { "python": "3.12", "fastapi": "0.115" }
    }
  },
  "generatedRefsPath": "skills/app-architecture/{lang}/references/generated"
}
```

The `frameworks` field tells `no-bandaids.sh` which rules to apply based on file path and extension.

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

## Critical

## High

## Moderate
```

### Step 7: Report

Print a summary:

```
Composure initialized for <project-name>

Stack detected:
  - TypeScript 5.9 (strict) — apps/web, apps/mobile
  - Python 3.12 + FastAPI 0.115 — services/api
  - Go 1.23 — services/worker
  - Monorepo (pnpm workspaces)

Generated:
  ✓ .claude/no-bandaids.json (6 extensions, 8 skip patterns, 3 frameworks)
  ✓ tasks-plans/tasks.md (task queue ready)

Framework reference docs:
  ✓ typescript/references/generated/ (5 docs: typescript-5.9, react-19, vite-8, shadcn-v4, tailwind-4)
  ✓ python/references/generated/ (3 docs: python-3.12, fastapi-0.115, pydantic-2.12)
  ✓ go/references/generated/ (1 doc: go-1.23)

Code review graph:
  ✓ 153 nodes, 883 edges, 23 files (last updated: 2026-03-23)

Active hooks:
  - PreToolUse: architecture trigger, no-bandaids (multi-framework)
  - PostToolUse: decomposition check, graph update

Available skills:
  /app-architecture    — Feature building guide (loads framework-specific refs)
  /decomposition-audit — Codebase size violation scan
  /review-tasks        — Process accumulated quality tasks
  /review-pr           — PR review with impact analysis
  /review-delta        — Changes since last commit
  /build-graph         — Build/update code review graph
```

## Notes

- This skill is idempotent — running it again updates the config based on current stack
- With `--force`, it overwrites config AND regenerates all framework reference docs
- With `--dry-run`, it prints what would be generated without writing files
- With `--skip-context7`, it skips Context7 queries (framework docs not generated)
- The skill does NOT modify CLAUDE.md — that's the project's responsibility
- If the project already has a `.claude/no-bandaids.json`, skip generation unless `--force`
- Generated framework docs are `.gitignored` by default — users can `git add -f` to commit them
- Users can also add project-specific patterns at `.claude/frameworks/{lang}/*.md` which layer on top of plugin refs
- To contribute patterns back to the plugin: move from `generated/` to `references/universal/` and submit a PR
