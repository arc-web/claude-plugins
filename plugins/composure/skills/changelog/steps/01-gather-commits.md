# Step 1: Gather Commits

Parse git history between the specified refs and group commits by type.

## 1a. Determine Refs

**`--from` ref:**
- If provided, use it directly
- If not provided, find the latest tag:
  ```bash
  git describe --tags --abbrev=0 2>/dev/null
  ```
- If no tags exist, use the first commit:
  ```bash
  git rev-list --max-parents=0 HEAD
  ```

**`--to` ref:**
- If provided, use it directly
- Default: `HEAD`

## 1b. Parse Git Log

```bash
git log <from>..<to> --pretty=format:"%H|%s|%an|%aI" --no-merges
```

This gives: commit hash, subject line, author name, author date (ISO).

For each commit, also get the changed files:

```bash
git diff-tree --no-commit-id --name-status -r <hash>
```

This gives: change type (A/M/D/R) and file path for each changed file.

## 1c. Group by Conventional Commit Type

Parse the subject line for conventional commit prefixes:

| Prefix | Category | Display name |
|--------|----------|-------------|
| `feat:` | features | Features |
| `fix:` | fixes | Bug Fixes |
| `refactor:` | refactors | Refactors |
| `perf:` | performance | Performance |
| `test:` | tests | Tests |
| `docs:` | docs | Documentation |
| `chore:` | chores | Chores |
| `ci:` | ci | CI/CD |
| `style:` | style | Style |
| `build:` | build | Build |

**If a commit doesn't use conventional prefixes**, infer the type:
- Changed test files only → `tests`
- Changed `.md` files only → `docs`
- Changed CI files (`.github/`, `.gitlab-ci.yml`) → `ci`
- Changed `package.json` / lockfiles only → `chores`
- Everything else → `features` (conservative default)

Strip the prefix and optional scope from the subject for display:
- `feat(auth): add OAuth flow` → type: `features`, message: `add OAuth flow`, scope: `auth`
- `fix: null check in user service` → type: `fixes`, message: `null check in user service`

## 1d. Output

Store for use in subsequent steps:
- `COMMITS` — array of parsed commits with: hash, type, scope, message, author, date, changed_files
- `FROM_REF` — starting ref (tag name or hash)
- `TO_REF` — ending ref
- `TOTAL_COMMITS` — count

---

**Next:** Read `steps/02-entity-mapping.md`
