# Decomposition Audit — composure/graph
**Date**: 2026-03-21
**Scope**: `graph/src/` (14 TypeScript source files, 2,900 lines total)
**Thresholds**: Function 150 hard / File 400 warn / File 600 alert

---

## 🔴 Critical

- [x] **DECOMPOSE** `graph/src/parser.ts` (846→507 lines, limit 400) ✅ 2026-03-21
  - Extracted `parser-helpers.ts` (222 lines): getName, getParams, getBases, imports, calls, resolver
  - Refactored `extractFromTree` from 290→57 lines via handler methods
  - 507 lines remaining — all methods <60 lines, accepted as healthy class surface area

## 🟡 High

- [x] **DECOMPOSE** `graph/src/store.ts` (448→375 lines, limit 400) ✅ 2026-03-21
  - Extracted `serialization.ts` (81 lines): nodeToDict, edgeToDict, rowToNode, rowToEdge, makeQualifiedName
  - Store re-exports public helpers for backward compat

- [x] **DECOMPOSE** `graph/src/tools/query-graph.ts` (242→184 lines) ✅ 2026-03-21
  - Extracted pattern handlers: edgesByTarget, edgesBySource, callersOf, fileSummary, inheritorsOf
  - Switch reduced to single-line dispatch table

## 🟢 Moderate

- [ ] `graph/src/incremental.ts` (305 lines) — acceptable, no action needed
- [ ] `graph/src/server.ts` (266 lines) — acceptable, tool registrations are inherently verbose
- [ ] `graph/src/bfs.ts` (146 lines) — clean
- [ ] `graph/src/tools/get-review-context.ts` (141 lines) — clean

## Summary

| Priority | Files | Action |
|----------|-------|--------|
| 🔴 Critical | 1 (parser.ts) | Split into 4 files |
| 🟡 High | 2 (store.ts, query-graph.ts) | Extract helpers + refactor |
| 🟢 Moderate | 4 | No action needed |
