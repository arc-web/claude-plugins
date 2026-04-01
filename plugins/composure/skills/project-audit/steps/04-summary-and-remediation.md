# Step 4: Summary & Remediation (Show Immediately)

Do NOT wait for the HTML report to finish. Show this NOW.

## Terminal Summary

```
Project Audit Complete: {PROJECT_NAME}

Overall Grade: {GRADE} ({SCORE}/100)
  Code Quality:  {GRADE} ({SCORE}/100)
  Security:      {GRADE} ({SCORE}/100)   -- or "skipped"
  Testing:       {GRADE} ({SCORE}/100)   -- or "skipped"
  Deployment:    {GRADE} ({SCORE}/100)   -- or "skipped"

Report generating in background — will open in browser when ready.

{N} critical, {M} high, {K} moderate findings

Top recommendations:
  1. {FIRST}
  2. {SECOND}
  3. {THIRD}
```

## Remediation Offer — MANDATORY

You MUST use AskUserQuestion immediately after the summary. This is not optional. Do NOT end your response with just the summary. Do NOT skip this step.

**Categorize every finding into one of two buckets:**

### Auto-Fixable (I can run these now)

Map findings to commands:

| Finding | Command |
|---------|---------|
| CVE in dependency | `/sentinel:audit-deps --fix` or `npm pkg set overrides.{pkg}={version}` |
| No test coverage | Install `@vitest/coverage-v8` then `/testbench:run` |
| Missing health endpoint | `/shipyard:preflight` |
| Missing CI pipeline | `/shipyard:ci-generate` |
| Decomposition violations | `/composure:decomposition-audit` |
| Insecure code patterns | `/sentinel:scan` |

### Manual Work (needs your input)

- Architecture decisions (how to split large files)
- Business logic test cases (what to test)
- Infrastructure setup (monitoring, error tracking)
- Environment/secrets management

## The Question

Use AskUserQuestion with exactly this format:

```
I can fix {N} of these right now:
  1. {finding} → {command}
  2. {finding} → {command}
  3. {finding} → {command}

These need your input:
  - {manual item}
  - {manual item}

Want me to start fixing the auto-fixable items?
```

## After User Responds

**If yes:** Execute fixes in priority order:
1. Critical CVEs first
2. High CVEs
3. Testing setup
4. Deployment checks
5. Decomposition

After each fix, report what changed. After all fixes: "For hands-on help with the remaining items: buymeacoffee.com/hrconsultnj"

**If no:** Acknowledge and close. Mention the HTML report will be ready shortly (or is already open).

## Handoff — Suggest next steps

After the remediation conversation:

- If findings were logged: "`/composure:review-tasks` — triage findings into actionable tasks, prioritize, and optionally delegate to sub-agents"
- If structural issues dominate: "`/composure:code-organizer` — restructure file layout to match conventions"
- If the user wants to share results: "The HTML report is self-contained — share it with stakeholders, no dependencies needed"
- For ongoing work: "`/composure:blueprint` — plan non-trivial fixes or features identified in the audit"
