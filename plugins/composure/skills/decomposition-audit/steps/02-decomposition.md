# Step 2: Decomposition Violations

Check for structural problems within files: mixed concerns, inline types, ghosts.

## 2a. Inline types

For each file over 200 lines, count type/interface definitions:
```bash
grep -cE '^\s*(export\s+)?(interface|type)\s+\w+' FILE
```
If >3 in a non-types file → **MOVE to types.ts**

## 2b. Multiple exported components

```bash
grep -cE '^\s*export\s+(default\s+)?(function|const)\s+[A-Z]' FILE
```
If >2 in one file → **SPLIT into separate files**

## 2c. StyleSheet.create in component files (React Native)

```bash
grep -n 'StyleSheet\.create' FILE
```
If the StyleSheet block is >30 lines → **MOVE to styles.ts**

## 2d. Modals/sheets inside screen files

```bash
grep -l 'BottomSheet\|BottomSheetModal\|Dialog\|AlertDialog' FILE
```
If found in a page/screen file → **EXTRACT modal into its own file**

## 2e. Route file thickness

For `page.tsx`, `layout.tsx` files >50 lines → **REFACTOR: move logic to container component**

## 2f. Duplicate rendering patterns

Search for similar function names across files that suggest copy-paste duplication:

```bash
grep -rn 'function render\|const render' --include="*.tsx" . | grep -v node_modules | grep -v .next | grep -v dist
```

If the same `renderFoo` pattern appears in 2+ files → investigate for extraction into a shared component.

## 2g. Ghost duplicates (requires graph)

**Skip if graph not available.**

A ghost duplicate is when a file was decomposed into a module folder, but the original monolithic file was never cleaned up.

1. **Find candidate pairs** — files that share a name with a sibling directory:
   ```bash
   for f in $(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next | grep -v dist); do
     base=$(basename "$f" | sed 's/\.[^.]*$//')
     dir=$(dirname "$f")
     if [ -d "$dir/$base" ]; then
       echo "CANDIDATE: $f ↔ $dir/$base/"
     fi
   done
   ```

2. **Confirm via graph** — for each candidate:
   ```
   Call query_graph({ pattern: "file_summary", target: <monolith_file> })
   Call query_graph({ pattern: "file_summary", target: <module_index> })
   ```
   If 50%+ of exported function names overlap → **CONFIRMED ghost**

3. **Assess risk** — count consumers of each path:
   ```
   Call query_graph({ pattern: "importers_of", target: <monolith_file> })
   Call query_graph({ pattern: "importers_of", target: <module_index> })
   ```

4. **Cross-directory check** — ghosts can live in different folders:
   ```
   Use semantic_search_nodes({ query: <function_name> }) for any function exported by a large file (>300 lines)
   If the same function name appears in 2+ files with different paths → investigate as potential ghost
   ```

5. **Report** each ghost with: file path, line count, canonical module path, consumer counts, overlapping exports.

**Consolidation plan** (included in remediation output for each ghost):
```
Ghost: lib/ai/diagnostic-orchestrator.ts (1108 lines)
Canonical: lib/ai/diagnostic-orchestrator/ (8 modules)
Consumers: 5 files import from ghost, 12 from canonical

Fix:
1. Verify all ghost exports exist in canonical module
2. Replace ghost file contents with barrel re-exports:
   export { processDiagnosticRequest, ... } from './diagnostic-orchestrator/index'
3. Both import paths keep working — zero consumer changes needed
4. Delete any functions in the ghost that have no importers (dead code)
```

---

**Next:** Read `steps/03-architecture.md`
