# Step 6: Dependency Health

Assess package freshness and framework version alignment.

## 6a. Outdated packages

```bash
# Detect package manager and check outdated
if [ -f "pnpm-lock.yaml" ]; then
  pnpm outdated 2>/dev/null
elif [ -f "package-lock.json" ]; then
  npm outdated 2>/dev/null
elif [ -f "yarn.lock" ]; then
  yarn outdated 2>/dev/null
fi
```

Count by severity:
- **Major version behind**: high risk — breaking changes likely
- **Minor version behind**: moderate — new features missing
- **Patch behind**: low — bug fixes missing

For monorepos, check each workspace's `package.json`:
```bash
for pkg in package.json apps/*/package.json packages/*/package.json; do
  [ -f "$pkg" ] && echo "=== $pkg ===" && (cd $(dirname "$pkg") && pnpm outdated 2>/dev/null | head -20)
done
```

## 6b. Framework version gap

Compare the project's detected versions (from `.claude/no-bandaids.json`) against the generated Context7 docs:

1. Read `.claude/no-bandaids.json` → `frameworks.*.versions`
2. For each framework doc in `.claude/frameworks/**/generated/*.md`:
   - Read the `library_version` from frontmatter
   - Compare against the project's detected version
   - If the doc is for a NEWER version than what's installed → **VERSION GAP**
   - If docs don't exist → "Framework docs not generated — run `/composure:update-project docs`"

Example output:
```
Framework versions:
  react: 19.2.4 (docs: 19.2) ✅ current
  next: 16.2.1 (docs: 16.2) ✅ current
  tailwindcss: 4.2.2 (docs: 4.2) ✅ current
  expo: 55.0.9 (docs: 55) ✅ current
  zod: 4.3.6 (docs: 4.3) ✅ current
```

Or if behind:
```
  react: 18.2.0 (docs: 19.2) ⚠️ 1 major version behind — see migration guide
```

## 6c. Duplicate dependencies (monorepos)

In monorepos, check for version mismatches across workspaces:

```bash
# Find packages with different versions across workspaces
for dep in react react-dom typescript tailwindcss; do
  versions=$(grep -h "\"$dep\"" apps/*/package.json packages/*/package.json 2>/dev/null | sort -u)
  count=$(echo "$versions" | wc -l | tr -d ' ')
  [ "$count" -gt 1 ] && echo "MISMATCH: $dep has $count different versions" && echo "$versions"
done
```

Version mismatches in monorepos cause subtle bugs — especially for React (multiple React instances = hooks break).

---

**Next:** Read `steps/07-score-report.md`
