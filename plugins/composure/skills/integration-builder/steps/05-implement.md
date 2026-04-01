# Step 5: Implement Client, Auth & Webhooks

**Skip detailed implementation guidance if `--quick` flag is set.**

## Architecture: Hexagonal Ports & Adapters

The integration follows the Ports & Adapters pattern:

- **Port** (stack-agnostic interface): Defines WHAT the integration does — method signatures, input/output contracts, error types. This is the same regardless of language.
- **Adapter** (language-specific implementation): Defines HOW it's done — using the SDK's API, the language's HTTP client, the framework's conventions.

The port is designed first (from the service's API surface, pulled via Context7 in Step 2). The adapter implements it using the detected language's idioms.

## 5a. Implement Types / Contracts (`types.{ext}`)

Define the data shapes first. Use the Context7 docs from Step 2:

- **Config type**: Base URL, auth credentials, options (timeout, retries)
- **Response types**: Map the service's API responses to typed structures
- **Error types**: Service-specific error codes and messages
- **Webhook event types** (if applicable): Event payloads by event type

Language-specific:
- TypeScript: `interface` / `type` definitions
- Python: `dataclass` / `TypedDict` / Pydantic `BaseModel`
- Go: `struct` definitions with JSON tags
- Rust: `struct` with `serde::Deserialize` / `Serialize`
- Ruby: Plain classes or `Dry::Struct`

## 5b. Implement Error Handling (`errors.{ext}`)

> Read `references/error-handling.md` for the full patterns.

Create a custom error class/type for this integration:

**Required properties:**
- `message` — Human-readable error description
- `statusCode` — HTTP status code from the service
- `service` — Service name (for logging/debugging)
- `details` — Raw error payload from the service (optional)
- `retryable` — Whether this error can be retried

**Standard error mapping:**
| Status | Meaning | Retryable? |
|---|---|---|
| 400 | Bad request (client error) | No |
| 401 | Authentication failed | No (re-auth needed) |
| 403 | Forbidden | No |
| 404 | Resource not found | No |
| 429 | Rate limited | Yes (after backoff) |
| 500+ | Server error | Yes (with backoff) |

## 5c. Implement Auth (`auth.{ext}`)

> Read `references/auth-patterns.md` for the full patterns.

Based on the auth strategy decided in Step 3:

### API Key
- Accept key from config (never hardcode)
- Inject into request headers or query params per service convention
- Validate key exists before making requests

### OAuth 2.0
- `getAuthorizationUrl(redirectUri, state, scopes)` — Build the authorization URL
- `exchangeCodeForToken(code)` — Exchange authorization code for access token
- `refreshToken(refreshToken)` — Refresh expired access token
- Store tokens securely (environment variables in dev, secrets manager in prod)

### Bearer Token
- Accept token from config
- Inject `Authorization: Bearer {token}` header
- If the service provides refresh tokens, implement auto-refresh before expiry

## 5d. Implement Client (`client.{ext}`)

The main integration client. Uses the SDK (Official SDK tier) or raw HTTP (Direct API tier):

### If using Official SDK
- Import and initialize the SDK client with config from Step 2 Context7 docs
- Wrap SDK methods with consistent error handling (catch SDK errors, wrap in IntegrationError)
- Add retry logic for transient failures (429, 5xx)
- Expose domain-specific methods (e.g., `createPaymentIntent`, `sendMessage`, not generic `post`)

### If using Direct API (raw HTTP)
- Create HTTP client with base URL and default headers
- Implement `request<T>(method, path, data?)` with:
  - Auth header injection (from auth module)
  - Response type parsing
  - Error handling (map HTTP errors to IntegrationError)
  - Retry with exponential backoff + jitter for retryable errors
  - Rate limit awareness (respect `Retry-After` header)
- Expose typed endpoint methods that call `request()`

### Retry Logic (both tiers)
```
Attempt 1: immediate
Attempt 2: wait 1s + jitter
Attempt 3: wait 2s + jitter
Attempt 4: wait 4s + jitter
Max retries: 3 (configurable)
Only retry: 429, 500, 502, 503, 504
```

## 5e. Implement Webhooks (`webhooks.{ext}`) — if applicable

> Read `references/webhook-patterns.md` for the full patterns.

### Signature Verification
- Implement HMAC-SHA256 signature verification (most common)
- Use timing-safe comparison to prevent timing attacks
- Validate timestamp to prevent replay attacks (reject events older than 5 minutes)
- Reject unsigned or invalid payloads before processing

### Event Handler
- Route events by type (switch/match statement)
- Each event type gets its own handler function
- Handlers should be idempotent (check if event already processed)
- Log unhandled event types (don't error on unknown events)

### Framework-Specific Endpoint
- Next.js: `app/api/webhooks/{service}/route.ts` (POST handler)
- FastAPI: `@app.post("/webhooks/{service}")`
- Go/Gin: `router.POST("/webhooks/{service}", handler)`
- Express: `app.post("/webhooks/{service}", handler)`
- Follow the project's existing webhook pattern if one exists

## 5f. Install SDK

After implementation, install the SDK package:

| Language | Command pattern |
|---|---|
| TypeScript/JS (pnpm) | `pnpm add {package}` |
| TypeScript/JS (yarn) | `yarn add {package}` |
| TypeScript/JS (npm) | `npm install {package}` |
| Python (pip) | `pip install {package}` |
| Python (poetry) | `poetry add {package}` |
| Python (uv) | `uv add {package}` |
| Go | `go get {package}` |
| Rust | `cargo add {package}` |
| Ruby | Add to Gemfile, run `bundle install` |

For monorepo: install in the integration package directory, not the workspace root.

## 5g. Configuration Storage

Where integration credentials and settings live at runtime:

| Scenario | Storage | Example |
|---|---|---|
| Single-tenant, simple | Environment variables | `STRIPE_API_KEY` in `.env` |
| Single-tenant, complex | Config file or env vars | Multiple keys, webhook secrets, feature flags |
| Multi-tenant (SaaS) | Encrypted database column | Per-tenant API keys, AES-256-GCM encrypted |
| Per-environment | Secrets manager | AWS Secrets Manager, Vault, Doppler — different keys per staging/prod |

**Rules:**
- Never hardcode credentials in source code
- Never commit credentials to version control (`.env` must be in `.gitignore`)
- If the project already has a config/secrets pattern, follow it — don't introduce a new one
- For multi-tenant: each tenant may have their own API key for the integrated service — store per-tenant, encrypted at rest

**If the project uses a config system** (e.g., entity registry, settings table, Vault): integrate with it rather than introducing environment variables. Ask the user if you detect an existing pattern.

---

**Next:** Read `steps/06-test.md`
