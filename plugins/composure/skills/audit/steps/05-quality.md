# Step 5: Code Quality Census

Scan for deferred work markers and test coverage gaps.

## 5a. TODO/FIXME/HACK census

Count all AI debt markers across the codebase:

```bash
grep -rn '//\s*\(TODO\|FIXME\|HACK\|XXX\|TEMP\|WORKAROUND\)' \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | \
  grep -v node_modules | grep -v .next | grep -v dist
```

Count total and find the top 5 files with the most TODOs:

```bash
grep -rc 'TODO\|FIXME\|HACK\|XXX\|TEMP\|WORKAROUND' \
  --include="*.ts" --include="*.tsx" --include="*.js" . | \
  grep -v node_modules | grep -v .next | grep -v ':0$' | sort -t: -k2 -rn | head -5
```

These represent deferred work — often AI-generated placeholders that were never resolved.

## 5b. Test coverage gaps

Match source files to test files to estimate coverage:

**With graph** (preferred — uses TESTED_BY edges from `run_audit`):
If `run_audit` was called with `include_testing: true`, it already computed test coverage. Use those findings directly.

**Without graph (fallback):**

```bash
TESTED=0
TOTAL=0
UNTESTED=""

for src in $(find . \( -name "*.tsx" -o -name "*.ts" \) \
  -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/dist/*" \
  -not -name "*.test.*" -not -name "*.spec.*" -not -path "*/__tests__/*" \
  -not -name "*.d.ts" -not -name "index.ts" -not -name "index.tsx" \
  -not -path "*/.claude/*" -not -path "*/generated/*"); do
  
  TOTAL=$((TOTAL + 1))
  base=$(basename "$src" | sed 's/\.[^.]*$//')
  dir=$(dirname "$src")
  
  # Check for test file: same dir, __tests__ dir, or test/ dir
  if find "$dir" -maxdepth 2 \( -name "${base}.test.*" -o -name "${base}.spec.*" \) 2>/dev/null | grep -q .; then
    TESTED=$((TESTED + 1))
  else
    UNTESTED="${UNTESTED}\n  ${src}"
  fi
done

echo "Coverage: ${TESTED}/${TOTAL} files ($(( TESTED * 100 / TOTAL ))%)"
```

**Prioritize untested files by importance** — if graph is available, sort by importer count (most-imported = most critical to test):

```
For each untested file:
  Call query_graph({ pattern: "importers_of", target: file })
  Sort by count descending
```

Report the top 10 most-imported untested files — these are the highest-risk gaps.

---

**Next:** Read `steps/06-dependencies.md`
