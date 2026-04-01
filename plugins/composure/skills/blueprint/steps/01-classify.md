# Step 1: Classify the Work

If the user provided a description as an argument, classify it. Otherwise, ask what they want to build.

Classify into exactly ONE category:

| Classification | Signal | Typical scope |
|---|---|---|
| `new-feature` | New capability, new page/route, new API endpoint | 3-15 files, new folders |
| `enhancement` | Extending existing feature, adding options/modes | 2-8 files, mostly edits |
| `refactor` | Restructuring without behavior change | 5-20 files, moves + edits |
| `bug-fix` | Broken behavior with known reproduction | 1-5 files, targeted edits |
| `migration` | Version upgrade, dependency swap, API migration | 5-50 files, pattern replacement |

## Present Classification

State your classification and reasoning:

"I've classified this as **[type]** because [1-sentence reasoning]."

## Checkpoint

- **If ambiguous** (could be two types): use **AskUserQuestion** to confirm before proceeding.
- **If clear**: state the classification and move on. Do NOT force a confirmation question on obvious classifications — that wastes a round-trip.

---

**Next:** Read `steps/02-graph-scan.md`
