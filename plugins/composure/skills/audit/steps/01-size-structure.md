# Step 1: Size & Structure

Gather file sizes and large functions. Build the size distribution histogram.

## 1a. File sizes

**With graph (preferred):**
```
Call find_large_functions({ min_lines: 100, kind: "Function" })
Call find_large_functions({ min_lines: 200, kind: "Class" })
Call find_large_functions({ min_lines: 400 })  // any node type
```

**Without graph (fallback):**
```bash
find . -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | \
  grep -v node_modules | grep -v .next | grep -v dist | \
  xargs wc -l | sort -rn | head -50
```

For each file over 300 lines, use Grep to count function declarations and estimate sizes.

## 1b. File size distribution histogram

Build a count of files in each bucket:

```bash
find . \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/dist/*" | \
  xargs wc -l 2>/dev/null | grep -v total | awk '{print $1}' | \
  awk '{
    if ($1 < 50) b["<50"]++
    else if ($1 < 100) b["50-100"]++
    else if ($1 < 200) b["100-200"]++
    else if ($1 < 400) b["200-400"]++
    else if ($1 < 600) b["400-600"]++
    else b["600+"]++
  } END {
    for (k in b) print k, b[k]
  }'
```

Store the distribution — it goes in the report as a quick health indicator:
- **Healthy**: >80% of files under 200 lines
- **Concerning**: >10% of files over 400 lines
- **Critical**: any files over 800 lines

## 1c. Categorize findings

For each file exceeding thresholds:
- **Critical** (>2x limit): file >800 lines, function >300 lines
- **High** (1.5-2x): file 600-800, function 225-300
- **Moderate** (1-1.5x): file 400-600, function 150-225

Store findings with: file path, line count, limit, number of functions, largest function name + size.

---

**Next:** Read `steps/02-decomposition.md`
