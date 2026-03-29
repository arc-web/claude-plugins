# Step 1: Gather Data

Run each subsection only for available plugins.

## 1a: Code Quality (Composure — always runs)

**With graph:** Call `list_graph_stats_tool()`, then `find_large_functions_tool(min_lines=150, kind="Function")`.

**Without graph (fallback):** Use Bash:
```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.rs" \) \
  ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ! -path "*/.git/*" \
  -exec wc -l {} + 2>/dev/null | sort -rn | head -60
```

**Collect:** `totalFiles`, `totalLines`, `fileSizeDistribution` (buckets: 0-200, 201-400, 401-600, 601-800, 801+), `largeFiles` (>400 lines, path + count), `largeFunctions` (>150 lines, name + file + count), `openTasks` (count unchecked items in `tasks-plans/tasks.md`).

## 1b: Security (Sentinel — if available)

1. Read `.claude/sentinel.json` for package manager and tooling.
2. Run dependency audit: `npm audit --json 2>/dev/null` (or pnpm/yarn equivalent).
3. If Semgrep installed: `semgrep scan --config=auto --json --quiet . 2>/dev/null`
4. If `--url` provided: `curl -sI <url>` and check for `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

**Collect:** `cves` (critical/high/moderate counts), `semgrepFindings` (error/warning/info counts), `topFindings` (top 5, severity + description + file + line), `headerGrades` (header + present/missing), `dependencyCount`, `vulnerableCount`.

## 1c: Testing (Testbench — if available)

1. Read `.claude/testbench.json` for test framework.
2. Run tests with coverage (vitest/jest/pytest as appropriate).

**Collect:** `testFramework`, `totalTests`, `passed`, `failed`, `skipped`, `coverageLines`, `coverageFunctions`, `coverageBranches`, `uncoveredFiles` (top 5 lowest coverage, path + percentage).

## 1d: Deployment (Shipyard — if available)

1. Read `.claude/shipyard.json` for CI platform.
2. Run preflight checks from the Shipyard plugin.

**Collect:** `ciPlatform`, `totalChecks`, `passed`, `warned`, `failed`, `checkResults` (name + status + detail), `topIssues` (FAIL and WARN items).

## 1e: Stack Profile

From `no-bandaids.json` plus direct detection (`node --version`, `package.json` dependency grep).

**Collect:** `language`, `framework`, `packageManager`, `runtimeVersion`, `keyDependencies` (top 10-15, name + version), `integrations` (from `.claude/sentinel-integrations.json` if exists).

---

**Next:** Read `steps/02-scoring.md`
