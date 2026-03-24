---
name: app-architecture
description: Complete architecture guide for building features from database to UI. Routes to frontend/, fullstack/, mobile/, or backend/ based on detected stack. Covers decomposition, multi-tenant isolation, auth model, query patterns, and component patterns.
---

# App Architecture — Index

**You MUST load framework-specific references before writing any code.** This is not optional. Your training data is 10+ months behind — the reference docs contain current API patterns from Context7.

> **This is the master barrel.** Detect the stack, then load ONLY the matching architecture files. Do NOT load everything.

## Step 1: Detect Stack

Read `.claude/no-bandaids.json` and extract:
- `frameworks` — which languages are in use
- `frontend` — which frontend framework (`"vite"`, `"nextjs"`, `"angular"`, `"expo"`, or `null`)
- `backend` — which backend framework (or `null`)

If the file is missing:
1. **Run `/composure:initialize`** to detect the stack and generate the config
2. If that's not possible, default to `typescript` with `frontend: null` — but warn the user: *"No `.claude/no-bandaids.json` found. Run `/composure:initialize` to detect your stack and generate framework-specific reference docs. Without it, only universal patterns are loaded."*

## Step 2: Route to Architecture Files

Based on the detected `frontend` value, load the matching INDEX.md which tells you exactly what files to read:

| `frontend` value | Load this INDEX | Then follow its MUST READ instructions |
|---|---|---|
| `"vite"` | [frontend/INDEX.md](frontend/INDEX.md) | `frontend/core.md` + `frontend/vite/vite.md` + references |
| `"angular"` | [frontend/INDEX.md](frontend/INDEX.md) | `frontend/core.md` + `frontend/angular/angular.md` + references |
| `"nextjs"` | [fullstack/INDEX.md](fullstack/INDEX.md) | `frontend/core.md` + `fullstack/nextjs/nextjs.md` + references |
| `"expo"` | [mobile/INDEX.md](mobile/INDEX.md) | `frontend/core.md` + `mobile/expo/expo.md` + references |
| `null` or other | [frontend/INDEX.md](frontend/INDEX.md) | `frontend/core.md` only |

**Always also load:**
- [frontend/core.md](frontend/core.md) — Query keys, hooks, page component, decomposition (universal for any UI)
- [backend/INDEX.md](backend/INDEX.md) → [backend/core.md](backend/core.md) — Database, RLS, auth model (if building data layer)

## Step 3: Load Language-Specific Patterns

| Language | MUST Read | Where |
|---|---|---|
| Python | `backend/python/SKILL.md` | + `backend/python/references/generated/` |
| Go | `backend/go/SKILL.md` | + `backend/go/references/generated/` |
| Rust | `backend/rust/SKILL.md` | + `backend/rust/references/generated/` |
| C/C++ | `backend/c-cpp/SKILL.md` | + `backend/c-cpp/references/generated/` |
| Swift | `mobile/swift/SKILL.md` | Only when working on native modules |
| Kotlin | `mobile/kotlin/SKILL.md` | Only when working on native modules |

TypeScript patterns are distributed across `frontend/`, `fullstack/`, and `mobile/` — loaded automatically via their INDEX.md files. No separate `typescript/` directory.

**Also load if they exist:**
- `references/private/` — licensed patterns (submodule, may not be initialized)
- `.claude/frameworks/{lang}/*.md` — project-level overrides

## Step 4: Apply Patterns

**Loading: read ALL, merge, never discard.**

You MUST read docs from BOTH the plugin AND the project. They are **complementary, not competing**. The plugin's curated docs are battle-tested patterns. The project's docs contain project-specific context (newer versions, custom conventions, team decisions). Both matter.

**Read order** (read ALL of these — do not skip any that exist):

| # | Source | What | Why |
|---|--------|------|-----|
| 1 | Plugin | Category `INDEX.md` | Routing — tells you which files to read based on detected stack |
| 2 | Plugin | Category curated references | Battle-tested patterns (hooks, decomposition, query patterns, etc.) |
| 3 | Plugin | Category `references/generated/` | Context7 docs shipped with the plugin |
| 4 | Plugin | Framework-specific file + its `references/` | e.g., `fullstack/nextjs/nextjs.md` + co-located curated docs |
| 5 | Plugin | Language `SKILL.md` | Anti-patterns for the detected language |
| 6 | Plugin | `references/private/` | Licensed patterns (submodule) |
| 7 | Project | `.claude/frameworks/{category}/{framework}/references/generated/` | Project-specific Context7 docs (may have newer versions) |
| 8 | Project | `.claude/frameworks/{category}/*.md` | Hand-written project conventions |

**When plugin and project docs cover the same topic:**
- **Read both.** The project doc may have newer API patterns (fresher Context7 query) while the plugin doc has architectural guidance the project doc lacks.
- **If they conflict on a specific API or pattern**, prefer the project doc — it was generated against the project's actual version.
- **Never skip the plugin doc** just because a project doc exists. The plugin's curated references (hooks, decomposition, component patterns) contain architectural rules that Context7 doesn't provide.

**To refresh generated docs:** Run `/composure:initialize --force`

---

## Directory Structure

```
skills/app-architecture/
├── SKILL.md                          ← You are here (thin router)
│
├── frontend/                         ← Web frontend (SPA) + shared TypeScript patterns
│   ├── INDEX.md                      ← Barrel: routes by frontend value
│   ├── core.md                       ← Phases 3-4, 6 + decomposition (universal)
│   ├── references/
│   │   ├── core/                     ← Curated: TanStack Query, hooks, data patterns
│   │   └── generated/               ← Context7: TypeScript, shadcn, Tailwind (shared)
│   ├── vite/
│   │   ├── vite.md                   ← Phase 5+7 for Vite SPA
│   │   └── references/generated/    ← Context7: Vite docs
│   └── angular/
│       ├── angular.md                ← Phase 5+7 for Angular
│       └── references/generated/    ← Context7: Angular docs
│
├── fullstack/                        ← Full-stack web frameworks
│   ├── INDEX.md                      ← Barrel
│   └── nextjs/
│       ├── nextjs.md                 ← Phase 5+7 for Next.js
│       └── references/
│           ├── *.md                  ← Curated: SSR hydration, route groups
│           └── generated/           ← Context7: Next.js docs
│
├── mobile/                           ← Mobile frameworks
│   ├── INDEX.md                      ← Barrel
│   ├── swift/SKILL.md               ← Native module language
│   ├── kotlin/SKILL.md              ← Native module language
│   └── expo/
│       ├── expo.md                   ← Phase 5+7 + anti-patterns
│       └── references/
│           ├── *.md                  ← Curated: icons, bottom sheets, custom UI
│           └── generated/           ← Context7: Expo, React Native docs
│
├── backend/                          ← Backend concerns + backend languages
│   ├── INDEX.md                      ← Barrel
│   ├── core.md                       ← Phases 1-2 (database, RLS, auth)
│   ├── python/SKILL.md + references/generated/
│   ├── go/SKILL.md + references/generated/
│   ├── rust/SKILL.md + references/generated/
│   └── c-cpp/SKILL.md + references/generated/
│
└── references/
    └── private/                      ← Licensed patterns (git submodule)
```

---

## Quick Reference: The 7-Phase Workflow

```
Phase 1: Database     → backend/core.md
Phase 2: Auth Model   → backend/core.md
Phase 3: Query Keys   → frontend/core.md
Phase 4: Query Hooks  → frontend/core.md
Phase 5: App Shell    → fullstack/nextjs/ | frontend/vite.md | mobile/expo/
Phase 6: Page         → frontend/core.md
Phase 7: Navigation   → fullstack/nextjs/ | frontend/vite.md | mobile/expo/
```

---

## Code Quality Toolchain

| Tool | How to use | When | Output |
|------|-----------|------|--------|
| **Automatic hook** | Fires on Read/Edit/Write | Logs tasks to `tasks-plans/tasks.md` silently | `tasks-plans/tasks.md` |
| `/decomposition-audit` | Invoke manually | Full codebase audit for size violations | `tasks-plans/decomposition-audit-{date}.md` |
| `/review-tasks` | Invoke manually | Process tasks from both sources | TaskCreate entries |
| `/review-tasks sync` | Invoke at session start | Load pending tasks into current session | TaskCreate entries |
| `/review-tasks delegate` | Invoke to execute | Dispatch parallel sub-agents to fix | Completed tasks |
| `find_large_functions_tool` | MCP tool (code-review-graph) | Query AST graph for oversized functions | Direct query results |

### /simplify Integration

After editing 5+ source files in a session, the PostToolUse hook will inject a systemMessage asking you to offer `/simplify` to the user. When you receive this message:

1. **Use AskUserQuestion** — ask: "Want me to run /simplify to refine what I just wrote before continuing?"
2. **Do NOT auto-run** — the user decides
3. `/simplify` preserves all functionality — it only refines *how* code is written, never *what* it does.
