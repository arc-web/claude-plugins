# Step 2: Score Calculation

**Scores were already computed by `run_audit` in Step 1.** The grades returned in the tool response are final.

The tool applies these exact rules (documented here for reference — do not re-compute):

## Category Scoring

**Code Quality (weight 30%):** Start at 100. Deductions:
- -5 per file over 400 lines
- -10 additional per file over 600 lines (total -15 for a 600+ line file)
- -15 additional per file over 800 lines (total -30 for an 800+ line file)
- -3 per function over 150 lines
- -1 per 5 open tasks in task queue

**Security (weight 25%):** Start at 100. Deductions:
- -25 per critical CVE, -10 per high, -3 per moderate
- -15 per Semgrep ERROR, -5 per WARNING, -1 per INFO
- -3 per missing security header

**Testing (weight 25%):**
- Zero tests = score 0
- Otherwise: derived from TESTED_BY edge coverage

**Deployment (weight 20%):**
- -15 per FAIL, -5 per WARN

## Honesty Rules (enforced by tool)

- Zero tests = **F** in Testing
- Any critical CVE = **F** in Security (score capped at 59)
- These are not configurable

## CVE Framing Rules (for YOUR summary output)

- **NEVER diminish transitive CVEs.** They ship in production.
- **ALWAYS provide the fix command.** For transitive: `pnpm update` or override.
- **NEVER say** "not in your direct code" about any CVE.

---

**Next:** Read `steps/03-generate-html.md`
