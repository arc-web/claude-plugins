---
description: Show blast radius of current changes
---

Analyze the blast radius of current uncommitted changes.

1. Call `get_impact_radius` with no `changed_files` (auto-detects from git diff).

2. If no changes detected, check staged changes:
   ```bash
   git diff --cached --name-only
   ```
   Pass those as `changed_files` if found.

3. Present the impact analysis:

```
## Impact Radius

### Changed Files
[List of files with changes]

### Directly Affected (1 hop)
[Functions and files that directly depend on changed code]

### Indirectly Affected (2 hops)
[Second-degree dependencies]

### Risk Assessment
- High risk: [functions with many callers that changed]
- Medium risk: [functions with some callers]
- Low risk: [leaf functions with no callers]
```

If $ARGUMENTS contains file paths, pass them as `changed_files` instead of auto-detecting.
