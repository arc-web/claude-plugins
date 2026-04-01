# Step 1: Locate Package

Find the installed package on disk. The location depends on the ecosystem.

## Ecosystem Detection

If `--ecosystem` was not provided, auto-detect:

1. Check `.claude/sentinel.json` for `project.language`
2. Fall back to lockfile detection:
   - `pnpm-lock.yaml` / `package-lock.json` / `yarn.lock` / `bun.lockb` → `js`
   - `pyproject.toml` / `requirements.txt` / `Pipfile` → `python`
   - `Cargo.lock` → `rust`
   - `go.sum` → `go`

## Package Location by Ecosystem

### JavaScript (`js`)

```bash
# Check node_modules
PACKAGE_DIR="node_modules/<package-name>"

# For scoped packages (@org/name)
PACKAGE_DIR="node_modules/@org/name"

# Verify it exists
ls "$PACKAGE_DIR/package.json" 2>/dev/null
```

Extract version from `package.json`:

```bash
jq -r '.version' "$PACKAGE_DIR/package.json"
```

### Python (`python`)

```bash
# Find in site-packages (venv or system)
PACKAGE_DIR=$(python3 -c "import <package_name>; import os; print(os.path.dirname(<package_name>.__file__))" 2>/dev/null)

# Alternative: pip show
pip show <package-name> 2>/dev/null | grep -i "Location:"
```

### Rust (`rust`)

Rust packages are compiled, not inspectable at runtime. Check the source cache:

```bash
# Cargo registry cache
PACKAGE_DIR="$HOME/.cargo/registry/src/*/package-name-<version>"

# Find it
find "$HOME/.cargo/registry/src" -maxdepth 2 -name "<package-name>-*" -type d 2>/dev/null | head -1
```

### Go (`go`)

```bash
# Go module cache
PACKAGE_DIR=$(go env GOMODCACHE)/<module-path>@<version>

# Find it
find "$(go env GOMODCACHE)" -maxdepth 3 -path "*/<package-name>@*" -type d 2>/dev/null | head -1
```

## Failure Handling

If the package cannot be found:

```
Package '<package-name>' not found in <ecosystem> install directory.

Checked:
  - node_modules/<package-name>/

Make sure the package is installed first:
  pnpm add <package-name>

Then re-run /sentinel:package-risk <package-name>
```

## Output

Store for use in subsequent steps:
- `PACKAGE_DIR` — absolute path to the package source
- `PACKAGE_VERSION` — installed version
- `ECOSYSTEM` — detected ecosystem
- `FILE_COUNT` — number of source files found

```bash
# Count source files (JS example)
find "$PACKAGE_DIR" -name '*.js' -o -name '*.mjs' -o -name '*.cjs' | wc -l
```

---

**Next:** Read `steps/02-behavior-scan.md`
