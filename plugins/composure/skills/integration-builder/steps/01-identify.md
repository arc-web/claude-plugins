# Step 1: Identify Target Service & Detect Stack

If the user provided a service name as an argument, use it. Otherwise, ask what service they want to integrate.

## 1a. Detect Project Stack

Read `.claude/no-bandaids.json` for stack info. If the file exists, extract:
- `frameworks` -- languages in use
- `frontend` -- frontend framework (`"vite"`, `"nextjs"`, `"angular"`, `"expo"`, or `null`)
- `backend` -- backend framework (or `null`)

If `.claude/no-bandaids.json` is missing, detect from config files (in priority order):

| Config file | Language | Framework detection |
|---|---|---|
| `package.json` + `tsconfig.json` | TypeScript | Parse dependencies for `next`, `express`, `fastify`, `hono`, etc. |
| `package.json` (no tsconfig) | JavaScript | Same framework detection as TypeScript |
| `pyproject.toml` or `requirements.txt` | Python | Parse for `django`, `fastapi`, `flask`, `starlette` |
| `go.mod` | Go | Parse for `gin`, `fiber`, `echo`, `chi` |
| `Cargo.toml` | Rust | Parse for `actix-web`, `axum`, `rocket`, `warp` |
| `Gemfile` | Ruby | Parse for `rails`, `sinatra`, `hanami` |
| `composer.json` | PHP | Parse for `laravel`, `symfony` |

**CRITICAL**: The detected language determines which SDK to install and which code patterns to generate. Getting this wrong means installing a Python package in a TypeScript project. Always verify.

## 1b. Detect Monorepo

Check for workspace indicators:

| File | Tool |
|---|---|
| `pnpm-workspace.yaml` | pnpm workspaces |
| `turbo.json` | Turborepo |
| `nx.json` | Nx |
| `lerna.json` | Lerna |
| `package.json` with `"workspaces"` field | Yarn/npm workspaces |

If any found:
- Note the workspace root path
- Identify the packages directory (`packages/`, `libs/`, or custom from config)
- Check if `packages/integrations/` or similar already exists

## 1c. Detect Package Manager

For JavaScript/TypeScript projects, check lockfiles (in priority order):
1. `pnpm-lock.yaml` → pnpm
2. `yarn.lock` → yarn
3. `package-lock.json` → npm
4. `bun.lockb` → bun

For other languages, use the standard tool:
- Python: `pip` / `poetry` / `uv` (check for `poetry.lock`, `uv.lock`)
- Go: `go mod`
- Rust: `cargo`
- Ruby: `bundler`

## 1d. Present Stack Profile

"Detected stack:
- **Language**: {language}
- **Framework**: {framework or 'none detected'}
- **Package manager**: {manager}
- **Monorepo**: {yes/no} {tool if yes}
- **Target service**: {service name}

Proceeding to discover the {service} SDK for {language}."

If anything looks wrong (e.g., multiple languages detected), ask the user to confirm which language the integration should target.

---

**Next:** Read `steps/02-discover.md`
