# Step 3: Architecture Analysis

**Requires graph.** Skip if graph unavailable. **Included in `--quick` mode** — architecture is the most valuable check when walking into a project (circular deps, fan-out, dead exports reveal structural health fast).

These checks use the code-review graph to detect structural problems that grep can't find.

## 3a. Circular dependencies

Detect 2-hop import cycles (A imports B, B imports A):

```
For each source file in the graph:
  Call query_graph({ pattern: "imports_of", target: file })
  For each imported file:
    Call query_graph({ pattern: "imports_of", target: imported_file })
    If any of those import the original file → CYCLE DETECTED
```

**Performance**: Limit to files >100 lines (small utility files rarely cause cycle problems). Stop after finding 10 cycles.

Report each cycle as: `file_A → file_B → file_A` with line counts for both files.

## 3b. High fan-out files

Files importing >8 unique modules are coupling hotspots — a change anywhere they depend on risks breaking them.

```
For each file with >200 lines:
  Call query_graph({ pattern: "imports_of", target: file })
  Count unique imported files/packages
  If >8 → HIGH FAN-OUT
```

Report: file path, import count, list of top dependencies.

## 3c. Dead exports

Exported functions with 0 callers anywhere in the codebase — safe to delete.

```
For each file:
  Call query_graph({ pattern: "file_summary", target: file })
  For each exported function/component:
    Call query_graph({ pattern: "callers_of", target: function_name })
    If 0 callers AND function is not in an index.ts barrel → DEAD EXPORT
```

**Skip barrel exports** (index.ts, index.tsx) — they aggregate, not produce. Also skip files in `__tests__/` and `*.test.*`.

Report: file path, function name, "0 callers — safe to delete".

## 3d. Mixed concerns

Files that import from incompatible layers — UI and data in the same component file.

```
For each component file (*.tsx in components/ or app/):
  Call query_graph({ pattern: "imports_of", target: file })
  Categorize imports:
    UI: @radix-ui, @iconify, shadcn, react-native (presentational)
    Data: @supabase, @template/database, prisma, drizzle, pg (data layer)
    State: @tanstack/react-query, zustand (state management)
  If file imports from BOTH UI AND Data categories → MIXED CONCERNS
```

The fix: split into a container component (hooks + data) and a presentational component (UI only).

## 3e. Barrel bloat

Index files with excessive re-exports that hurt build performance:

```
For each index.ts / index.tsx:
  Call query_graph({ pattern: "file_summary", target: file })
  Count total exports
  If >15 → BARREL BLOAT
```

Impact: bloated barrels break tree-shaking, slow TypeScript compilation, and increase bundle size. The fix: import directly from the source file instead of through the barrel.

---

**Next:** Read `steps/04-security.md`
