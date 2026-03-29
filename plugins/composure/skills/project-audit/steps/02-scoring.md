# Step 2: Score Calculation

## Category Scoring

**Code Quality (weight 30%):** Start at 100. Deductions:
- -5 per file over 400 lines
- -10 additional per file over 600 lines (total -15 for a 600+ line file)
- -15 additional per file over 800 lines (total -30 for an 800+ line file)
- -3 per function over 150 lines
- -1 per 5 open tasks in task queue
- Floor at 0

**Security (weight 25%):** Start at 100. Deductions:
- -25 per critical CVE
- -10 per high CVE
- -3 per moderate CVE
- -15 per Semgrep ERROR finding
- -5 per Semgrep WARNING finding
- -1 per Semgrep INFO finding
- -3 per missing security header (if --url provided)
- Floor at 0

**Testing (weight 25%):**
- If no tests exist (totalTests == 0): score = 0
- Otherwise: `score = coverageLines * 0.6 + (passed / totalTests * 100) * 0.4`
- Clamp to 0-100

**Deployment (weight 20%):**
- If no checks ran: score = 0
- Otherwise: `score = (passed / totalChecks) * 100`, then -15 per FAIL, -5 per WARN
- Floor at 0

## Weight Redistribution

When a plugin is unavailable, redistribute proportionally:
```
adjustedWeight = originalWeight / sumOfAvailableOriginalWeights
```

## Overall Score and Grades

```
overallScore = sum(categoryScore * adjustedWeight) for each available category
```

| Grade | Range   | Color   |
|-------|---------|---------|
| A     | 90-100  | #22c55e |
| B     | 80-89   | #3b82f6 |
| C     | 70-79   | #eab308 |
| D     | 60-69   | #f97316 |
| F     | 0-59    | #ef4444 |

## Honesty Rules

- Zero tests = **F** in Testing, no exceptions
- Any critical CVE = **F** in Security
- 5+ FAIL preflight checks = **F** in Deployment
- Do not inflate grades — honest assessment is the value
- **Do NOT rationalize poor grades.** An F is an F. Do not say "common in X projects" or "mostly structural" to soften it. State the grade, state the fix.

## CVE Framing Rules (NEVER violate)

- **NEVER diminish transitive CVEs.** A transitive vulnerability ships in the production bundle and is exploitable. "Transitive" describes the FIX PATH (override/upgrade parent), not the severity.
- **NEVER say** "not in your direct code" or "not your problem" about any CVE. If it's in the dependency tree, it's a production vulnerability.
- **ALWAYS provide the fix command.** For transitive CVEs: `npm pkg set overrides.{pkg}={safe-version}` or "upgrade {parent-package} which pulls in {vulnerable-package}."
- **ALWAYS state severity based on the CVE itself**, not on how it entered the dependency tree.

---

**Next:** Read `steps/03-generate-html.md`
