# Step 4: Execute Moves

For each approved move, in the dependency order from the plan:

## 4a. Move the file

```bash
git mv "{source}" "{destination}"
```

If the destination directory doesn't exist, create it first: `mkdir -p "{dest-dir}"`

Use `git mv` to preserve git history. If the project isn't a git repo, use regular `mv`.

## 4b. Update the moved file's imports

The file's own relative imports may have changed because its location changed. For each `import ... from './...'` or `import ... from '../...'` in the moved file:

1. Resolve what the old import pointed to (relative to old location)
2. Compute the new relative path from the file's new location to that same target
3. Rewrite the import path

## 4c. Update all importers

Find every file that imports the moved file and rewrite their import path.

**Primary (graph available)**: Use the importer list already collected in Step 2g. For each importer:
1. Compute the new relative path from the importer to the moved file's new location
2. Rewrite the import statement
3. **Cross-check**: After rewriting, grep for any remaining references to the old path as a safety net

**Fallback (`--no-graph`)**: Grep-based scanning:
```bash
# Search for imports of the old path (without extension)
grep -rn "from ['\"].*{old-path-stem}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"
```
Then also check for:
- `require('...')` calls (CommonJS)
- Dynamic `import('...')` calls
- Barrel `export ... from '...'` re-exports

For each importer found:
1. Compute the new relative path from the importer to the moved file's new location
2. Rewrite the import statement

## 4d. Handle barrel exports

If the moved file was re-exported from an `index.ts`:
- Update the re-export path in the old `index.ts`
- Or remove it if the file moved to a new directory that has its own barrel

If creating new barrel exports (from Step 3 plan):
- Create `index.ts` files that re-export the directory's public API

## 4e. Handle path aliases

Read `tsconfig.json` `compilerOptions.paths` (or `jsconfig.json`).

Common aliases: `@/*` → `./src/*`, `~/` → `./`, `#/` → `./*`

**Rule**: If an import uses an alias (`import { X } from '@/lib/utils'`) and that alias still resolves correctly after the move, **do NOT rewrite it**. Only rewrite alias imports that would break.

## 4f. Apply renames

If `--naming` was specified or naming normalization is in the plan:
- Rename files as part of the `git mv` (source → new-name at destination)
- Update all import paths to use the new filename

## 4g. Aggressive mode (if `--aggressive`)

After all moves are complete:

1. **Split large files**: For any file over 300 lines, apply the decomposition pattern from `app-architecture/frontend/typescript/01-component-decomposition.md`:
   - Extract into a feature folder: `feature/index.ts`, `feature/FeatureContainer.tsx`, `feature/FeatureList.tsx`, etc.
   - Follow container vs. presentation split

2. **Extract shared utilities**: Find functions imported by 3+ files. If they live in a component file, extract to `lib/`:
   ```bash
   grep -rn "import.*{funcName}" --include="*.ts" --include="*.tsx" | wc -l
   ```

3. **Extract shared types**: Find types/interfaces imported by 3+ files. If they live in a component file, extract to `types/`.

---

**Next:** Read `steps/05-verify.md`
