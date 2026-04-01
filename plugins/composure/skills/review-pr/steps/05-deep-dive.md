# Step 5: Deep-Dive with Verification

This is the core review step. Read the source code of changed files and analyze for correctness, bugs, and design issues. Prioritize files identified as high-risk in step 02.

## VERIFICATION RULE — "Comments with Receipts"

**Before writing ANY finding in the review, you MUST verify it.**

This is not optional. Unverified claims waste the reviewer's time and erode trust.

| Claim you want to make | How to verify FIRST | If verification fails |
|---|---|---|
| "This function is unused" | `callers_of(function)` — check if callers exist | DO NOT claim unused |
| "Missing test coverage" | `tests_for(function)` — check if tests exist | DO NOT claim missing |
| "This could cause a null reference" | Read the full code path to confirm null is possible | DO NOT claim null risk |
| "Breaking change for consumers" | `callers_of` to identify actual consumers | DO NOT claim breakage |
| "This import is unused" | Read the file to confirm the import isn't used | DO NOT claim unused |
| "This duplicates existing code" | `semantic_search_nodes` to find the alleged duplicate | DO NOT claim duplication |

**If you cannot verify a finding**, prefix it with `[Unverified]` and explain why verification was not possible (e.g., function not in graph, external dependency).

**DO NOT include unverified claims as confident assertions.**

## 5a. Prioritize Files

Review files in this order:
1. **High-risk files** — those with the most dependents (from step 02)
2. **Files with quality violations** — those flagged by `run_audit` (from step 04)
3. **New files** — review for completeness and pattern compliance
4. **Modified files** — review changes for correctness
5. **Deleted files** — verify no remaining references (use `importers_of`)

## 5b. Per-File Analysis

For each significant changed file:

1. **Read the full source** — not just the diff. Understand the file in context.

2. **Check callers for modified functions:**
   ```
   query_graph({ pattern: "callers_of", target: "<function_name>" })
   ```
   - If callers exist, verify the changes are compatible
   - If function signature changed, verify all callers are updated in this PR

3. **Check test coverage for changed functions:**
   ```
   query_graph({ pattern: "tests_for", target: "<function_name>" })
   ```
   - Record which functions have tests and which don't
   - Cross-reference with step 04 quality audit results

4. **Check for new large functions:**
   ```
   find_large_functions({ file_pattern: "<changed_directory>" })
   ```
   - Flag any function over 100 lines introduced in this PR

5. **Look for:**
   - Logic errors and edge cases
   - Error handling gaps (missing try/catch, unhandled promise rejections)
   - Type safety issues (implicit `any`, unsafe casts)
   - Performance concerns (N+1 queries, unnecessary re-renders, missing memoization)
   - Security issues (injection vectors, unsanitized input, exposed secrets)
   - Pattern violations (does this follow the codebase's established patterns?)

## 5c. Renamed/Moved Functions

If any functions were renamed or moved:

```
query_graph({ pattern: "callers_of", target: "<old_name>" })
query_graph({ pattern: "importers_of", target: "<old_file_path>" })
```

Verify all callers and importers are updated. Flag any that reference the old name/path and are NOT in the PR's changed files.

## 5d. Deleted Files

For each deleted file:

```
query_graph({ pattern: "importers_of", target: "<deleted_file_path>" })
```

If importers exist that are NOT also deleted or updated in this PR, flag as a broken reference.

Store all verified findings for use in step 08 (output).

---

**Next:** Read `steps/06-framework-checks.md`
