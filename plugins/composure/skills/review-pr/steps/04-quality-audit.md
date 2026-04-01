# Step 4: Quality Audit

Run the Composure quality audit to get objective, measurable findings. This provides FACTS ("function is 147 lines") rather than OPINIONS ("function seems long").

## 4a. Run the Audit

Execute the full quality audit:

```
run_audit({ include_security: false, include_testing: true })
```

Read the response. It contains:
- `findings` — array of quality issues (oversized files, oversized functions, untested code)
- `scores` — letter grades per category (size, testing, cohesion)
- `summary` — aggregate statistics

Write down the total finding count and overall grade before proceeding. You will need these numbers in step 08.

## 4b. Filter Findings to Changed Files

The audit covers the entire repo. You only care about findings in `CHANGED_FILES`.

For each finding in the audit response:

1. Read the finding's `file` path
2. Check: is this file in `CHANGED_FILES`?
   - **Yes** → keep this finding
   - **No** → discard it (pre-existing issue, not this PR's concern)

After filtering, write down:
- How many findings remain (these are the PR-relevant ones)
- If zero remain, note: "No quality violations in changed files" — still proceed to 4c

## 4c. Categorize the Remaining Findings

Sort the filtered findings into three buckets:

**Bucket 1 — Oversized functions** (functions exceeding 100-line threshold):
- For each: record the function name, file path, and line count
- Example: `processOrder` in `src/api/orders.ts` — 156 lines

**Bucket 2 — Untested code** (functions/classes without `TESTED_BY` edges):
- For each: record the function name and file path
- Cross-reference with `CHANGED_FILES`: is this a NEW function added by this PR, or a pre-existing function that was modified?
  - New function without tests → flag as "New function, tests recommended"
  - Modified function without tests → flag as "Modified function, no existing tests"

**Bucket 3 — Oversized files** (files exceeding line count thresholds):
- For each: record the file path and line count
- Check: did this PR make the file larger? Compare against the base branch:
  ```bash
  git diff <BASE_BRANCH>...HEAD --stat -- <file_path>
  ```
  - If the PR added significant lines → flag as "PR increased file size"
  - If the file was already oversized before this PR → note but don't flag as a PR issue

## 4d. Check for Regressions vs Improvements

Now determine whether this PR made quality better or worse.

**Regressions** (this PR introduced new violations):

For each oversized function finding, check if the function existed before this PR:

```
query_graph({ pattern: "file_summary", target: "<file_path>" })
```

Look at the function in the graph. If the function is new (added in this PR) and exceeds the threshold, that's a regression:
- "This PR introduces a 156-line function `processOrder` in `src/api/orders.ts`. Consider decomposing."

If the function existed before and was already oversized, that's pre-existing — mention but don't blame the PR:
- "Pre-existing: `processOrder` was already 142 lines. This PR added 14 lines (now 156). Consider decomposing as a follow-up."

**Improvements** (this PR fixed existing violations):

If `run_audit` shows fewer findings than the last audit run (if available in the graph DB), note:
- "This PR resolved N pre-existing quality violations."

## 4e. Build the Quality Summary

Assemble the metrics that will appear in step 08's output:

```
QUALITY_GRADE: <letter grade for changed files>
OVERSIZED_FUNCTIONS: <count> functions exceed 100-line threshold
  - <function_name> in <file> (<line_count> lines) [regression | pre-existing]
UNTESTED_FUNCTIONS: <count> changed functions without tests
  - <function_name> in <file> [new | modified]
OVERSIZED_FILES: <count> files exceed threshold
  - <file> (<line_count> lines) [PR increased | pre-existing]
REGRESSIONS: <count> new quality violations introduced by this PR
IMPROVEMENTS: <count> quality violations resolved by this PR
```

Store this summary. Steps 05 (deep-dive) and 08 (output) will reference it directly.

---

**Next:** Read `steps/05-deep-dive.md`
