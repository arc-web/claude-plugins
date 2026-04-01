# Step 3: Generate Output

Format the changelog using commit data and entity mapping.

## Markdown Format (default)

```markdown
# Changelog: <FROM_REF> → <TO_REF>

**Date range**: <earliest commit date> — <latest commit date>
**Commits**: <TOTAL_COMMITS> | **Contributors**: <unique author count>

## Features
- **<scope/entity>**: <message> (<short hash>)
- **auth**: add OAuth flow with PKCE support (a1b2c3d)
- **users**: pagination for user list endpoint (d4e5f6a)

## Bug Fixes
- **orders**: null check in order total calculation (b7c8d9e)
- fix timezone handling in date picker (f0a1b2c)

## Refactors
- **shared**: extract pagination helper to lib (c3d4e5f)

## Tests
- integration tests for OAuth flow (e6f7a8b)

## Chores
- update dependencies, bump lockfile (a9b0c1d)

---

### Entity Impact
- **Users**: 3 commits (2 features, 1 fix)
- **Orders**: 1 commit (1 fix)
- **Auth**: 2 commits (1 feature, 1 test)

### Files Changed
- **X** files changed (**Y** added, **Z** modified, **W** deleted)
```

## Formatting Rules

1. **Group by type** — features first, then fixes, then everything else alphabetically
2. **Include scope/entity** — bold the scope or entity name if available
3. **Short hash** — 7-character abbreviated commit hash in parentheses
4. **Omit empty categories** — if no refactors, don't show the Refactors section
5. **Entity Impact section** — only include if entity mapping succeeded (step 02)
6. **Files Changed** — aggregate stats at the bottom

## JSON Format (--format json)

```json
{
  "from": "<FROM_REF>",
  "to": "<TO_REF>",
  "dateRange": { "start": "<ISO date>", "end": "<ISO date>" },
  "totalCommits": 15,
  "contributors": ["Alice", "Bob"],
  "categories": {
    "features": [
      {
        "hash": "a1b2c3d",
        "message": "add OAuth flow with PKCE support",
        "scope": "auth",
        "author": "Alice",
        "date": "2026-03-31T10:00:00Z",
        "entities": ["Auth"],
        "files": ["src/auth/oauth.ts", "src/auth/pkce.ts"]
      }
    ],
    "fixes": [...],
    "refactors": [...]
  },
  "entityImpact": {
    "Users": { "total": 3, "features": 2, "fixes": 1 },
    "Orders": { "total": 1, "fixes": 1 }
  },
  "filesChanged": { "added": 5, "modified": 12, "deleted": 2 }
}
```

## No Commits

If there are no commits between the refs:

```
No changes found between <FROM_REF> and <TO_REF>.
```

---

**Done.**
