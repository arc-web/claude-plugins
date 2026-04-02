# Step 5: Verify

## 1. Typecheck

Detect the typecheck command from `package.json` scripts. Look for: `typecheck`, `type-check`, `check-types`, `tsc`. For Python: `mypy`. For Go: `go vet`. Run it.

## 2. Lint

If a lint script exists in `package.json`, run it. Common names: `lint`, `eslint`.

## 3. Handle failures

- If typecheck fails, the errors are almost certainly broken import paths
- Show the errors and attempt to fix remaining import paths
- Re-run typecheck after fixes
- If still failing after 2 attempts, list remaining errors and stop for manual review

## 4. Rebuild graph

Call `build_or_update_graph({ full_rebuild: true })` since file paths changed. This keeps the graph accurate for subsequent `/review-pr`, `/review`, and PostToolUse hooks. If `--no-graph` was used, skip.

## 5. Prompt commit

Ask the user: "Reorganization complete and verified. Create a commit? (y/n)"

If yes:
- Stage all changes: `git add -A` (safe here — this is a pure restructure, no new source code)
- Commit message:
  ```
  refactor: reorganize project structure to {framework} conventions

  - Moved {N} files to conventional directories
  - Created {K} new directories: {list}
  - Updated ~{P} import paths
  - Naming convention: {convention}
  ```

## 6. Handoff — Suggest next steps

After reorganization is complete and verified:

- "`/composure:review` — review what changed before committing (if not committing immediately)"
- "`/composure:audit --quick` — verify the restructure improved health scores"
- If the user is preparing for launch: "`/shipyard:preflight` — check launch readiness"

---

**Done.**
