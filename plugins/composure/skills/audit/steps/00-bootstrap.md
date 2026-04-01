# Step 0: Bootstrap

Prepare for the audit — verify infrastructure, run the graph audit if available, and determine what checks to run.

## 0a. Check graph availability

```
Call list_graph_stats() to check if the code-review graph is built.
```

- **Graph available**: full audit mode (all steps)
- **No graph**: limited mode — skip Step 3 (architecture), use bash fallbacks in Steps 1-2
- **`--quick` flag**: fast health snapshot — run Steps 0 → 1 → 3 → 7 only. Skip Steps 2 (decomposition deep-dive), 4 (security), 5 (quality census), 6 (dependencies). Architecture (Step 3) is still included if graph is available — it's the most valuable check when walking into a project. Security and dependency analysis are handled by `/sentinel:scan` and `/shipyard:deps-check` separately.

If graph is available but stale (last_updated older than latest commit), rebuild:
```
Call build_or_update_graph({ full_rebuild: false })
```

## 0b. Run graph audit (if available)

```
Call run_audit({ include_security: true, include_testing: true })
```

This computes baseline findings from SQL queries on the graph DB and stores letter grades. The subsequent steps EXTEND these findings with checks the graph can't do (grep-based scans, dependency analysis, suppression counting).

Record the audit results — the scoring in Step 7 will merge graph audit grades with the additional checks.

## 0c. Read project config

Read `.claude/no-bandaids.json` to get:
- Detected stack (frameworks, versions)
- File extensions to scan
- Skip patterns

If config doesn't exist, use defaults: scan `.ts`, `.tsx`, `.js`, `.jsx`, skip `node_modules`, `.next`, `dist`.

## 0d. Set thresholds

Default thresholds (can be overridden with `--threshold`):
- File: 400 (warn), 600 (alert), 800 (critical)
- Function: 150 lines max
- Inline types: >3 per file
- Route files: 50 lines max

---

**Next:** Read `steps/01-size-structure.md`
