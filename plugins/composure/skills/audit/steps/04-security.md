# Step 4: Security Scan

Grep-based security checks that complement Sentinel. No graph required.

## 4a. Suppression census

Count ALL lint/type suppression comments across the codebase:

```bash
echo "=== @ts-ignore ===" && grep -rn '@ts-ignore' --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v .next | wc -l
echo "=== @ts-nocheck ===" && grep -rn '@ts-nocheck' --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v .next | wc -l
echo "=== @ts-expect-error ===" && grep -rn '@ts-expect-error' --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v .next | wc -l
echo "=== eslint-disable ===" && grep -rn 'eslint-disable' --include="*.ts" --include="*.tsx" --include="*.js" . | grep -v node_modules | grep -v .next | wc -l
echo "=== biome-ignore ===" && grep -rn 'biome-ignore' --include="*.ts" --include="*.tsx" . | grep -v node_modules | wc -l
```

Also find the **suppression hotspots** — top 5 files with the most suppressions:

```bash
grep -rc '@ts-ignore\|@ts-nocheck\|@ts-expect-error\|eslint-disable\|biome-ignore' \
  --include="*.ts" --include="*.tsx" --include="*.js" . | \
  grep -v node_modules | grep -v .next | grep -v ':0$' | sort -t: -k2 -rn | head -5
```

## 4b. Dependency CVEs

Run the package manager's audit:

```bash
# Detect package manager
if [ -f "pnpm-lock.yaml" ]; then
  pnpm audit --json 2>/dev/null || pnpm audit 2>/dev/null
elif [ -f "package-lock.json" ]; then
  npm audit --json 2>/dev/null || npm audit 2>/dev/null
elif [ -f "yarn.lock" ]; then
  yarn audit --json 2>/dev/null || yarn audit 2>/dev/null
fi
```

Count by severity: critical, high, moderate, low.

**If `run_audit` was called in Step 0 with `include_security: true`**, it already has this data. Use the stored findings instead of re-running.

## 4c. Hardcoded secrets scan

Check for API key patterns across the codebase:

```bash
grep -rnE '(sk_live_|sk_test_|ghp_|gho_|github_pat_|xoxb-|xoxp-|AKIA[A-Z0-9]{16})' \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env*" . | \
  grep -v node_modules | grep -v .next | grep -v dist
```

Also check for URL-embedded credentials:

```bash
grep -rnE 'https?://[^@\s]+:[^@\s]+@' \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env*" . | \
  grep -v node_modules
```

If Sentinel is initialized (`.claude/sentinel.json` exists), note: "Run `/sentinel:scan` for a comprehensive security audit with Semgrep OWASP rulesets."

---

**Next:** Read `steps/05-quality.md`
