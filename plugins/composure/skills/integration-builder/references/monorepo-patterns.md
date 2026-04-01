# Monorepo Integration Patterns

How to scaffold and structure integrations in monorepo projects.

## Workspace Detection

Check for these files at the repository root:

| File | Monorepo tool | Package directory |
|---|---|---|
| `pnpm-workspace.yaml` | pnpm workspaces | Read `packages:` array from YAML |
| `turbo.json` | Turborepo | Uses pnpm/yarn/npm workspaces underneath |
| `nx.json` | Nx | Read `workspaceLayout` or default `packages/`, `apps/` |
| `lerna.json` | Lerna | Read `packages` array |
| `package.json` → `"workspaces"` | Yarn/npm workspaces | Read the `workspaces` array |

If multiple indicators exist (e.g., `pnpm-workspace.yaml` + `turbo.json`), the workspace file defines the structure and the tool (Turbo/Nx) orchestrates tasks.

## Package Structure

### Recommended Layout

```
packages/
  integrations/
    core/                    # Shared base: HTTP client, retry logic, error types
    stripe/                  # Stripe integration package
    twilio/                  # Twilio integration package
    sendgrid/                # SendGrid integration package
apps/
  web/                       # Web app — imports @org/integration-stripe
  api/                       # API server — imports @org/integration-stripe
  worker/                    # Background worker — imports @org/integration-twilio
```

### If `packages/integrations/` doesn't exist yet

Check what structure already exists:
- If `packages/` has other packages → create `integrations/` inside it
- If the monorepo uses `libs/` instead → follow that convention
- If unclear → ask the user where integration packages should live

### Shared Core Package

If multiple integrations will exist, create a `core` package with:
- Base HTTP client with retry and error handling
- Common types (IntegrationError, RetryConfig, AuthConfig)
- Shared utilities (HMAC verification, rate limit helpers)

Only create `core` if there are already 2+ integrations or the user plans multiple. Don't over-abstract for a single integration.

## Package Manifest

For TypeScript/JavaScript integration packages:

```json
{
  "name": "@{org}/integration-{service}",
  "version": "0.1.0",
  "private": true,
  "main": "src/client.ts",
  "types": "src/client.ts",
  "dependencies": {
    "{sdk-package}": "^{version}"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**Naming convention**: Match the org name from the root `package.json`. If root is `@acme/web`, packages are `@acme/integration-stripe`.

**Private**: Set `"private": true` unless the package will be published to a registry.

## Dependency Rules

**Critical**: Shared packages NEVER import from apps. The dependency graph is one-directional.

```
apps/ → packages/integrations/{service}/ → packages/integrations/core/
  ↓                                              ↑
  └──────────────── can import ──────────────────┘

packages/ → apps/  ← NEVER (forbidden)
```

## Cross-App Consumption

### pnpm workspaces
```json
// In apps/web/package.json
{
  "dependencies": {
    "@org/integration-stripe": "workspace:*"
  }
}
```

### Yarn workspaces
```json
// In apps/web/package.json
{
  "dependencies": {
    "@org/integration-stripe": "*"
  }
}
```

### Go modules (multi-module monorepo)
```go
// In go.work
use (
    ./apps/api
    ./packages/integrations/stripe
)
```

### Python (uv workspaces)
```toml
# In pyproject.toml at root
[tool.uv.workspace]
members = ["packages/integrations/*", "apps/*"]
```

## Build Caching

Turborepo and Nx cache build outputs. Integration packages benefit from caching because:
- They change less frequently than app code
- Multiple apps depend on them — cache hit saves rebuilding for each app
- Tests can be cached too (re-run only when integration code changes)

No special configuration needed — the monorepo tool handles this automatically if the package is properly declared in the workspace.

## Publishing (Optional)

If integration packages need to be published (e.g., for external consumers):
- Use **Changesets** for versioning: `pnpm add -D @changesets/cli`
- Each integration package gets its own semver
- CI publishes on merge to main
- Internal-only packages stay `"private": true`
