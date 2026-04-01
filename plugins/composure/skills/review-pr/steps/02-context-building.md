# Step 2: Context Building

Gather the full structural picture using the code graph. This step produces the data that all subsequent steps depend on.

## 2a. Get Review Context

```
get_review_context({ base: "<BASE_BRANCH>" })
```

This returns:
- **Changed files** — files modified in the PR
- **Impacted nodes** — functions/classes/types affected by the changes
- **Source snippets** — relevant code from changed areas
- **Review guidance** — auto-generated warnings (test coverage gaps, wide impact, etc.)

Read the review guidance carefully — it highlights areas that need extra attention in the deep-dive (step 05).

## 2b. Get Impact Radius

```
get_impact_radius({ base: "<BASE_BRANCH>" })
```

This returns:
- **Direct impact** — files that directly import from changed files
- **Indirect impact** — files 2 hops away in the dependency graph
- **High-risk nodes** — widely depended-upon functions/types being modified
- **Edge list** — the specific dependency relationships

## 2c. Identify High-Risk Areas

From the impact radius, flag:

1. **Functions with >5 callers** — changes here affect many consumers. Prioritize these in the deep-dive.
2. **Changed exports** — if the PR modifies exported interfaces/types, check all importers.
3. **Cross-boundary changes** — changes that span multiple entities (e.g., modifying both a component and its API route).

Use `entity_scope()` (no arguments) to list all discovered entities. If changed files span multiple entities, note this for the walkthrough (step 03).

## Output

Store for use in subsequent steps:
- `REVIEW_CONTEXT` — full review context from the graph
- `IMPACT_RADIUS` — blast radius data
- `HIGH_RISK_FILES` — files with the most dependents (prioritize in deep-dive)
- `CROSS_ENTITY_CHANGES` — whether the PR spans multiple business entities

---

**Next:** Read `steps/03-walkthrough.md`
