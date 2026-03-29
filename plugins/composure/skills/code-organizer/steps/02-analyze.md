# Step 2: Analyze Current Structure

Run all eight checks. This is the diagnostic — no files are moved yet.

**Windows compatibility:** Do NOT use `grep -P` (Perl regex) — it fails on Windows Git Bash with "supports only unibyte and UTF-8 locales." Use `grep -E` (extended regex) instead, or use the built-in Grep tool which works cross-platform. All patterns in this skill are compatible with `-E`.

## 2a. Directory Inventory

Build a map of `directory → [source files]`:

```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.rs" \) \
  | grep -v node_modules | grep -v .next | grep -v dist | grep -v __pycache__ | grep -v vendor | grep -v target | grep -v .git \
  | sort
```

If **zero source files** are found, stop: "No source files found in this project. Nothing to reorganize." Do not proceed to Step 3.

Count files per directory. Flag directories with 15+ flat files as "overcrowded."

## 2b. Misplaced Files

Compare each source file's location against the convention's classification rules. A file is "misplaced" if:

- It's a **component** (exports JSX) but lives outside `components/`
- It's a **hook** (filename starts with `use` or exports `function use*`) but lives outside `hooks/`
- It's a **pure type file** (only exports `type`/`interface`, no runtime code) but lives outside `types/`
- It's a **service** (contains `fetch`, `axios`, `supabase`, or API client calls, no JSX) but lives outside `services/`
- It's a **utility** (exports functions, no JSX, no hooks, no API calls) but lives outside `lib/` or `utils/`
- It's at the **project root** when it should be under `src/` or `app/`

**Classification heuristics** (use Grep on each file):

| Pattern | Classification |
|---------|---------------|
| File exports JSX (`return <` or `=> <`) | Component |
| Filename matches `use*.ts` or exports `function use[A-Z]` | Hook |
| Only `export type` / `export interface` declarations, no `function`/`const` with runtime value | Pure types |
| Contains `fetch(`, `axios.`, `supabase.`, `.from(` with no JSX | Service |
| Exports functions/constants, no JSX, no `use*` pattern, no fetch | Utility |
| Has `'use server'` directive | Server action |
| Is a route file (`page.tsx`, `layout.tsx`, `+page.svelte`) | Route (don't move) |

## 2c. Mixed Concerns

For directories with 5+ files, check if they mix too many types. A directory has "mixed concerns" if it contains 3+ of these categories: components, hooks, types, services, utilities.

Exception: **feature folders** (see 2f) are intentionally mixed — don't flag them.

## 2d. Missing Directories

Compare the project's current directories against the convention's target structure. List conventional directories that don't exist yet and would be needed based on the files found in 2b.

Only suggest directories that would actually receive files. Don't suggest empty `services/` if no service files were detected.

## 2e. Naming Inconsistencies

Classify each source filename:

| Convention | Pattern | Example |
|-----------|---------|---------|
| PascalCase | Starts with uppercase, no separators | `UserCard.tsx` |
| camelCase | Starts with lowercase, no separators | `userCard.tsx` |
| kebab-case | Lowercase with hyphens | `user-card.tsx` |
| snake_case | Lowercase with underscores | `user_card.tsx` |

Determine the **dominant convention** (most files). Report outliers. If `--naming` was specified, the target convention overrides detection.

**Framework defaults** (if no dominant convention and no `--naming` flag):
- Next.js / Vite / Expo: kebab-case for files, PascalCase for component exports
- Angular: kebab-case with type suffix (`user-card.component.ts`)
- Python: snake_case
- Go: snake_case

## 2f. Feature Folder Detection

A directory is a **feature folder** (intentional colocation) if it contains:
- At least 1 component file AND
- At least 1 of: hook, type file, service, or test file

Feature folders are **valid structure** — do NOT reorganize their contents. Instead, move the entire folder to the correct parent if needed (e.g., from `src/UserProfile/` to `components/features/user-profile/`).

## 2g. Import Dependency Analysis

The graph was ensured in Step 0b. Use it as the **primary** source of import data.

1. For each file identified in 2b as misplaced:
   - Call `query_graph({ pattern: "importers_of", target: <file> })` to get the exact list of files that import it
   - Record the importer count as the file's **risk score** (more importers = more paths to update = higher risk)
2. For files with 10+ importers, also call `query_graph({ pattern: "imports_of", target: <file> })` to understand what the file itself depends on — these are high-traffic nodes that need extra care
3. Use importer data to determine **move order**: leaves first (0-1 importers), roots last (5+ importers). This ensures files are already in their new location before their importers get updated.

**If `--no-graph` was passed** (grep fallback):
- Skip this step entirely. Import scanning will happen during execution (Step 4) using grep.
- The plan will show "?" in the Risk column and include a warning: "Import counts unavailable — moves may require manual import fixes."

## 2h. Root Clutter & Build Artifacts

Scan the **project root** for files that don't belong there. This catches non-code issues the source file inventory (2a) misses.

```bash
# List all files at project root (not recursive, not directories)
find . -maxdepth 1 -type f | grep -v node_modules | grep -v .git | sort
```

**Flag these categories:**

| Category | Pattern | Action |
|----------|---------|--------|
| **Loose assets** | `*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.svg`, `*.ico`, `*.webp`, `*.mp4`, `*.mp3`, `*.woff`, `*.woff2`, `*.ttf`, `*.otf` | Move to `public/` or `assets/` |
| **Build artifacts** | `tsconfig.tsbuildinfo`, `*.tsbuildinfo`, `.turbo/`, `*.log`, `.cache/` | Add to `.gitignore` |
| **Large files** | Any file > 500KB at root | Flag for review — likely an asset that should be in `public/` or LFS |
| **Environment samples** | `.env.example`, `.env.sample` | OK at root (don't flag) |
| **Config files** | See Universal Never-Move List in conventions.md | OK at root (don't flag) |

**For build artifacts**: check if they're already in `.gitignore`. If not, suggest adding them.

```bash
# Check if tsconfig.tsbuildinfo is gitignored
git check-ignore tsconfig.tsbuildinfo 2>/dev/null || echo "NOT IGNORED"
```

Report findings as a separate section in the plan — these don't need import updates, just moves or .gitignore additions.

---

**Next:** Read `steps/03-plan.md`
