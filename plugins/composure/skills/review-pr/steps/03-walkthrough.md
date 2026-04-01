# Step 3: Changes Walkthrough

Generate a concise summary table of all changes in the PR. This provides immediate context before the detailed analysis begins.

## 3a. Build the Walkthrough Table

For each file in `CHANGED_FILES`, determine:

1. **Change type**: Added, Modified, Deleted, Renamed, or Moved
2. **Summary**: One-line description of what changed in this file

To determine the summary, read the git diff for each file:

```bash
git diff <BASE_BRANCH>...HEAD -- <file_path>
```

Write a one-line summary of the change (not the full diff — just what it does).

## 3b. Format

```markdown
### Changes Walkthrough

| File | Change | Summary |
|------|--------|---------|
| `src/api/users.ts` | Modified | Added pagination to list endpoint, new `cursor` parameter |
| `src/lib/db.ts` | Modified | New `paginateQuery` helper for cursor-based pagination |
| `src/types/api.ts` | Modified | Added `PaginatedResponse<T>` generic type |
| `tests/api/users.test.ts` | Added | Integration tests for paginated user list |
| `src/old-helper.ts` | Deleted | Removed unused legacy helper |
```

## 3c. Group by Entity (if applicable)

If `CROSS_ENTITY_CHANGES` is true (the PR spans multiple business entities), group files by entity:

```markdown
### Changes Walkthrough

**Entity: Users**
| File | Change | Summary |
|------|--------|---------|
| `src/api/users.ts` | Modified | Added pagination |
| `tests/api/users.test.ts` | Added | Pagination tests |

**Entity: Shared/Lib**
| File | Change | Summary |
|------|--------|---------|
| `src/lib/db.ts` | Modified | New pagination helper |
| `src/types/api.ts` | Modified | New generic type |
```

Use `entity_scope({ entity: "<name>" })` to confirm which files belong to which entity.

## 3d. Statistics

After the table, add a one-line stat:

```
**X files changed** (Y added, Z modified, W deleted) across N commits
```

Store the walkthrough table for inclusion in step 08 (output generation).

---

**Next:** Read `steps/04-quality-audit.md`
