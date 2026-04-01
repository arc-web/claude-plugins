# Blueprint Document Template

> **This file is the template for blueprint documents.** It defines the structure, sections, and content expectations for every blueprint written by `/composure:blueprint`. Step 04 references this template — the blueprint file written to `tasks-plans/blueprints/` must follow this structure exactly.

## Filename Convention (required)

Blueprints use kebab-case slugs with date suffix: `{slug}-{YYYY-MM-DD}.md`

The slug is a 2-4 word summary of the work. Use the most descriptive words, not generic ones.

```
tasks-plans/blueprints/user-roles-2026-03-28.md
tasks-plans/blueprints/dep-guard-supply-chain-2026-03-31.md
tasks-plans/blueprints/review-pr-enhancement-2026-03-31.md
```

## Frontmatter

Blueprints do not use YAML frontmatter. The header block serves as metadata:

```markdown
# Blueprint: {Title}

**Classification**: {new-feature|enhancement|refactor|bug-fix|migration}
**Date**: {YYYY-MM-DD}
**Stack**: {from no-bandaids.json}
```

## Document Structure

Every blueprint MUST follow this structure in order:

### 1. Context (required)

```markdown
## Context

{1-3 sentences: what is being done and why. Include the trigger — user request,
bug report, tech debt, research finding, etc. If there is a research file or
prior conversation that led to this, reference it.}

Research: `docs/research/{file}.txt`
```

### 2. Related Code (required)

```markdown
## Related Code

{From Step 2 graph pre-scan, or "Graph not available" if skipped.
List files that will be modified, files with similar patterns to follow,
and data files that will be read/written.}

- `path/to/similar-feature.tsx` -- similar pattern to follow
- `path/to/affected-file.ts` -- will be modified
- `path/to/data-file.json` -- data source to integrate
```

### 3. Decisions (required)

```markdown
## Decisions

{Key architectural and design decisions from the Q&A with the user.
Number them for easy reference. Include the reasoning, not just the choice.}

1. **Decision name** -- rationale for why this approach was chosen
2. **Another decision** -- what was considered and why this won
```

### 4. Impact Analysis (required if graph available)

```markdown
## Impact Analysis

{From Step 3. Skip section entirely if --skip-graph or --quick.}

- **Files affected**: {N direct, M indirect}
- **Blast radius**: {description of what depends on the changed code}
- **High-risk areas**: {files with many dependents}
- **Large functions in area**: {any over 100 lines}
- **Missing test coverage**: {functions without tests}
```

### 5. Files to Touch (required)

```markdown
## Files to Touch

{Every file that will be created, edited, or deleted. Group by logical area.
Include a one-line "Why" for each file.}

| # | File | Action | Why |
|---|------|--------|-----|
| | **Area Name** | | |
| 1 | `path/to/file.ts` | Create | New utility for X |
| 2 | `path/to/existing.tsx` | Edit | Add prop for Y |
| | **Another Area** | | |
| 3 | `path/to/other.ts` | Edit | Update import |

**Total: N creates + M edits = X files**
```

### 6. Preservation Boundaries (required for new-feature, enhancement, migration)

```markdown
## Preservation Boundaries

{Files and systems that must NOT be modified. Acts as a guard rail during
implementation. Especially important for features that touch auth, billing,
shared infrastructure, or multi-tenant patterns.}

- `path/to/unchanged.ts` — {why it stays untouched}
- `path/to/other.ts` — {why it must not change}
- {System/flow name} — remains unchanged because {reason}
```

Skip this section for `bug-fix` classification (scope is already narrow) and for `refactor` if the refactor explicitly targets the "preserved" files.

### 7. Implementation Spec (required — replaces "Approach")

```markdown
## Implementation Spec

{Per-file change specs. Each file in "Files to Touch" gets its own subsection
with bullet points listing EXACT changes: conditions, prop additions, function
signatures, type changes, key patterns, etc.

A developer should be able to implement from this without guessing.
If you cannot write specific conditions and signatures, you have not
understood the change well enough — go back to the graph.}

### 1. `path/to/first-file.ts` (Create)
- Exports: {what this module exports}
- Key functions: {names, signatures, purpose}
- Dependencies: {what it imports}
- {Specific logic: conditions, patterns, key names, data shapes}

### 2. `path/to/second-file.ts` (Edit)
- Add: {what condition/branch/prop to add}
- Change: {what existing code changes and how}
- Preserve: {what must NOT be modified in this file}

### 3. `path/to/third-file.ts` (Edit)
- ...
```

### 8. Risks (required)

```markdown
## Risks

{Every risk MUST include a mitigation. A risk without a mitigation is just
a worry — state what you will do about it.}

- **{Risk name}** — {description}. Mitigation: {how to handle it}
- **{Another risk}** — {description}. Mitigation: {concrete action}
```

### 9. Verification (required)

```markdown
## Verification

{Concrete test scenarios to confirm the feature works. Include at minimum:
happy path, existing flow preservation, and one edge case.
For bug-fix, include the reproduction steps as scenario 1.}

1. **Happy path**: {step-by-step verification that the new feature works}
2. **Existing flow**: {verify nothing broke — name specific flows to test}
3. **Edge case**: {specific scenario that could fail}
4. Run typecheck: `npx tsc --noEmit` (or equivalent for the stack)
```

### 10. Checklist (required)

```markdown
## Checklist

{Checklist items map 1:1 to Implementation Spec sections. Each file in the
spec should have a corresponding checklist item. This makes progress trackable.
End with verification tasks.}

### {Area Name}
- [ ] {Task matching Implementation Spec section 1}
- [ ] {Task matching Implementation Spec section 2}
- [ ] {Task matching Implementation Spec section 3}

### Verification
- [ ] All verification scenarios pass
- [ ] Run typecheck after changes
- [ ] Verify no decomposition violations
- [ ] Commit and push
```

## Rules (MUST — non-negotiable)

1. **Implementation Spec is NOT optional.** Every blueprint must have per-file specs with exact conditions and signatures. Vague "approach" paragraphs are not acceptable. If you cannot write specific implementation details, the graph scan and impact analysis were insufficient — go back and read more code.
2. **Preservation Boundaries prevent scope creep.** For `new-feature`, `enhancement`, and `migration`, explicitly list what does NOT change. This is the guard rail that prevents "while I'm in here" modifications.
3. **Verification prevents "works on my machine."** Always include at least 2 scenarios (happy path + existing flow). For `bug-fix`, the reproduction steps become scenario 1.
4. **Checklist items map 1:1 to Implementation Spec.** Each file in the spec gets a checklist item. Orphan checklist items (no matching spec) and orphan specs (no matching checklist) are both defects.
5. **Risks always include mitigations.** "This might break X" is not a risk entry. "This might break X — Mitigation: run Y before deploying" is.
6. **Files to Touch is the contract.** If a file appears in the Implementation Spec but not in Files to Touch (or vice versa), the blueprint is inconsistent. Keep them in sync.
7. **Context references upstream.** If a research file, conversation, or prior blueprint led to this work, link it. Future sessions need the trail.

## Section Inclusion by Classification

| Section | new-feature | enhancement | refactor | bug-fix | migration | integration |
|---------|:-----------:|:-----------:|:--------:|:-------:|:---------:|:-----------:|
| Context | Yes | Yes | Yes | Yes | Yes | Yes |
| Related Code | Yes | Yes | Yes | Yes | Yes | Yes |
| Decisions | Yes | Yes | Yes | If ambiguous | Yes | Yes |
| Impact Analysis | Yes | Yes | Yes | If graph available | Yes | Yes |
| Files to Touch | Yes | Yes | Yes | Yes | Yes | Yes |
| Preservation Boundaries | Yes | Yes | If applicable | Skip | Yes | Yes |
| Implementation Spec | Yes | Yes | Yes | Yes | Yes | Yes |
| Risks | Yes | Yes | Yes | If applicable | Yes | Yes |
| Verification | Yes | Yes | Yes | Yes (repro = scenario 1) | Yes | Yes |
| Checklist | Yes | Yes | Yes | Yes | Yes | Yes |
