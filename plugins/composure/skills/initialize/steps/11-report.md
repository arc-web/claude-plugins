# Step 11: Report

Print a summary, then provide context-aware next steps.

## Summary

```
Composure initialized for <project-name>

Stack detected:
  - TypeScript 5.9 (strict) -- apps/web, apps/mobile
  - Python 3.12 + FastAPI 0.115 -- services/api
  - Go 1.23 -- services/worker
  - Monorepo (pnpm workspaces)

Generated:
  + .claude/no-bandaids.json (6 extensions, 8 skip patterns, 3 frameworks)
  + tasks-plans/tasks.md (task queue ready)

Framework reference docs (.claude/frameworks/ -- categorized):
  + .claude/frameworks/frontend/generated/ (3 docs)
  + .claude/frameworks/fullstack/nextjs/generated/ (1 doc)
  + .claude/frameworks/backend/python/generated/ (3 docs)
  + .claude/frameworks/backend/go/generated/ (1 doc)

Code review graph:
  + 153 nodes, 883 edges, 23 files

Active hooks:
  - PreToolUse: architecture trigger, no-bandaids (multi-framework)
  - PostToolUse: decomposition check, graph update
```

## Recommended Next Steps

Choose the right workflow based on how you're entering this project:

### Walking into someone else's project (collaborator, new to codebase)

```
Recommended orientation:
  1. /composure:decomposition-audit --quick   → health snapshot (structure + architecture)
  2. entity_scope()                           → understand the domain model and entities
  3. /composure:review-tasks                  → check for accumulated issues
  4. /shipyard:preflight                      → launch readiness (env vars, endpoints, CORS)
  5. /composure:blueprint                     → plan any non-trivial changes
```

### Returning to your own project

```
Resume your work:
  1. /composure:review-tasks     → process open tasks from last session
  2. /composure:blueprint        → plan your next feature
  3. /composure:review-delta     → review changes before committing
```

### Just scaffolded a new project (from Blueprint Phase 0)

```
Start building:
  1. /composure:blueprint        → plan your first feature (graph + arch docs ready)
  2. /composure:app-architecture → reference guide while coding
```

**Which workflow applies?** If git log shows commits from other authors and the user hasn't worked in this repo before, default to the collaborator workflow. If the user just created the project (scaffolded via Blueprint), use the "just scaffolded" workflow. Otherwise, use the returning workflow.

---

**Next:** Read `steps/12-claude-md-offer.md`
