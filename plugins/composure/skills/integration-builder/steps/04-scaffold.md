# Step 4: Scaffold Directory Structure

> Read `references/monorepo-patterns.md` if the project is a monorepo (detected in Step 1).

## 4a. Determine Base Path

### Monorepo (workspace detected in Step 1)

```
{workspace-root}/packages/integrations/{service}/
├── src/
│   ├── client.{ext}
│   ├── auth.{ext}
│   ├── types.{ext}
│   ├── webhooks.{ext}      (if webhooks needed)
│   └── errors.{ext}
├── tests/
│   ├── client.test.{ext}
│   ├── auth.test.{ext}
│   └── webhooks.test.{ext} (if webhooks needed)
├── {manifest file}          (package.json, pyproject.toml, etc.)
└── README.md
```

If `packages/integrations/` doesn't exist yet but other packages exist under `packages/`, create it. If the monorepo uses a different convention (e.g., `libs/`), follow that convention.

### Single Repository

```
{project-root}/src/lib/integrations/{service}/
├── client.{ext}
├── auth.{ext}
├── types.{ext}
├── webhooks.{ext}           (if webhooks needed)
├── errors.{ext}
└── __tests__/               (or co-located .test files)
    ├── client.test.{ext}
    └── webhooks.test.{ext}
```

If the project already has integrations in a different location (found in Step 2c), follow the existing convention.

## 4b. File Extensions by Language

| Language | Source | Test | Types | Manifest |
|---|---|---|---|---|
| TypeScript | `.ts` | `.test.ts` | `.ts` (interfaces/types) | `package.json` |
| JavaScript | `.js` / `.mjs` | `.test.js` | `.d.ts` or JSDoc | `package.json` |
| Python | `.py` | `test_*.py` or `*_test.py` | `.py` (dataclasses/TypedDict) | `pyproject.toml` |
| Go | `.go` | `_test.go` | `.go` (structs/interfaces) | `go.mod` |
| Rust | `.rs` | `.rs` (in `tests/` or `#[cfg(test)]`) | `.rs` (structs/traits) | `Cargo.toml` |
| Ruby | `.rb` | `_spec.rb` or `_test.rb` | `.rb` (Sorbet `.rbi` if typed) | `Gemfile` |

## 4c. Create Structure

Create the directories and empty files. Do NOT write content yet — that happens in Step 5.

For monorepo packages, also create the manifest file (e.g., `package.json`) with:
- Package name: `@{org}/integration-{service}` (match org from root manifest)
- Version: `0.1.0`
- Main entry point: `src/client.{ext}`
- The SDK as a dependency (from Step 2)

## 4d. Verify Before Proceeding

Confirm the structure is correct:

"Created integration scaffold at `{base-path}`:
```
{tree output}
```

{N} files to implement. Proceeding to generate code."

---

**Next:** Read `steps/05-implement.md`
