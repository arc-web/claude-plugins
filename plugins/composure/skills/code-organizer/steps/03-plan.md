# Step 3: Generate Reorganization Plan

Compile all findings into a structured plan. Present it to the user:

```markdown
## Reorganization Plan — {project-name}

### Stack: {framework} | Naming: {convention}

### New directories to create
- {dir}/

### File moves (ordered by dependency — leaves first)
| # | Source | Destination | Reason | Risk (importers) |
|---|--------|-------------|--------|-------------------|
| 1 | {path} | {new-path} | {classification} outside {expected-dir} | {N} files |

### Renames (naming normalization)
| # | Current | Renamed | Convention |
|---|---------|---------|-----------|
| 1 | {name} | {new-name} | {convention} |

### Barrel exports to create
- {dir}/index.ts (re-exports: {list})

### Root clutter
| # | File | Size | Issue | Action |
|---|------|------|-------|--------|
| 1 | `Logo.png` | 1.2MB | Loose asset at root | Move to `public/` |
| 2 | `tsconfig.tsbuildinfo` | 48KB | Build artifact, not gitignored | Add to `.gitignore` |

### Warnings
- {any dynamic imports, alias edge cases, or files that need manual review}

### Summary
- {N} files to move
- {M} files to rename
- {K} new directories
- ~{P} files need import path updates
- {Q} root clutter items (assets to move, artifacts to gitignore)
```

**STOP HERE.** Present the plan and wait for user approval.

The user can respond:
- **"go"** — Execute the full plan
- **"go except #3, #7"** — Execute all except specified rows
- **"stop"** — Abort, no changes made

If `--dry-run` was specified, end the skill entirely after presenting the plan.

---

**Next:** Read `steps/04-execute.md`
