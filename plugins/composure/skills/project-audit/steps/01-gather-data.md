# Step 1: Gather Data

Call the `run_audit` MCP tool. It computes all findings from the graph database (zero file I/O for code quality) and optionally runs security CLI tools.

```
run_audit({
  include_security: <true if .claude/sentinel.json exists>,
  include_testing: <true if .claude/testbench.json exists>,
  include_deployment: <true if .claude/shipyard.json exists>,
  url: <from --url argument if provided>
})
```

The tool returns:
- `run_id` — audit run identifier (ISO timestamp)
- `overall_score`, `overall_grade`, `overall_color`
- `categories` — array of `{ category, score, grade, grade_color, findings }`
- `finding_counts` — `{ category → { severity → count } }`
- `summary` — one-line summary string

**All findings are now stored in `graph.db`** in the `audit_findings`, `test_coverage`, and `audit_scores` tables. No further data collection is needed.

If the graph is empty (tool returns error), tell the user to run `/composure:build-graph` first.

## Stack Profile

Still collect from `no-bandaids.json` + `node --version` + `package.json`:
- `language`, `framework`, `packageManager`, `runtimeVersion`
- `keyDependencies` (top 10-15, name + version)

This is lightweight and used for the report header — not for scoring.

---

**Next:** Read `steps/02-scoring.md`
