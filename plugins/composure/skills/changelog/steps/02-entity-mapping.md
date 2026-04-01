# Step 2: Entity Mapping

Map each commit's changed files to business entities in the code graph. This adds context: "this commit changed the Users entity" vs just "this commit changed 3 files."

**If the graph MCP is unavailable, skip this step.** The changelog still works without entity context.

## 2a. Get All Entities

```
entity_scope()
```

This returns all discovered entities (features/domain concepts) with member counts and role breakdowns.

## 2b. Map Commits to Entities

For each commit in `COMMITS`, check which entities its changed files belong to:

1. For each changed file path, check if it matches any entity's file list
2. If a file belongs to an entity, tag the commit with that entity name

A single commit can map to multiple entities (cross-entity change).

## 2c. Enrich Commit Data

Add to each commit:
- `entities` — array of entity names this commit affects
- `entity_count` — number of entities touched

## 2d. Entity Summary

Build an entity impact summary across all commits:

```
Entity Impact:
  - Users: 5 commits (3 features, 2 fixes)
  - Orders: 2 commits (1 feature, 1 refactor)
  - Shared/Lib: 4 commits (2 refactors, 1 fix, 1 chore)
```

Store for use in step 03.

---

**Next:** Read `steps/03-generate-output.md`
