# Step 3: Choose Integration Tier & Auth Strategy

## 3a. Select Integration Tier

> Read `references/integration-tiers.md` for the full decision matrix.

Based on findings from Step 2, apply this decision logic:

```
Has official SDK for your language?
├── Yes, well-maintained → Official SDK tier
├── Yes, but outdated/incomplete → Consider Direct API tier
└── No SDK found
    ├── Service has stable REST API → Direct API tier
    ├── Need same service category across providers → Unified API tier (Nango, Merge)
    ├── Building AI agent tool-calling → MCP Gateway tier (Composio)
    └── You OWN the API, need multi-language clients → OpenAPI SDK Generation tier
```

**If the tier is obvious** (official SDK exists, single language project): State the choice and move on.

**If ambiguous** (e.g., SDK exists but is poorly maintained, or multiple tiers could work): Present options to the user with AskUserQuestion:

"Two viable integration approaches:

**Option A: Official SDK** — Use `{package}`. Pros: type safety, auth handling built-in. Cons: SDK is {concern}.
**Option B: Direct API** — Build raw HTTP client. Pros: full control, no dependency. Cons: more code to maintain.

Which approach?"

## 3b. Confirm Auth Strategy

Based on the service's authentication method (from Step 2 Context7 docs):

> Read `references/auth-patterns.md` for pattern details.

| Service auth method | Pattern to use | Key considerations |
|---|---|---|
| API Key | Header or query param injection | Store in env var, never hardcode |
| Bearer Token | Authorization header | May need token refresh flow |
| OAuth 2.0 | Authorization code + PKCE | Needs redirect URI, token storage, refresh |
| Basic Auth | Base64 encoded header | Username:password, always over HTTPS |
| Custom | Service-specific | Follow Context7 docs exactly |

If the auth strategy requires user decisions (e.g., OAuth needs a redirect URI, or the service supports multiple auth methods), ask now.

## 3c. Determine Webhook Needs

If the service supports webhooks (from Step 2):

1. Does the user need webhook handling? (Some integrations are outbound-only)
2. What events are relevant? (e.g., `payment_intent.succeeded`, `message.received`)
3. Does the framework have a standard webhook endpoint pattern? (e.g., Next.js API routes, FastAPI endpoints, Go HTTP handlers)

If webhook needs are straightforward, state the plan and move on. Only ask if there are genuine choices (e.g., which events to subscribe to).

## 3d. Present Integration Plan

"Integration plan for **{service}**:
- **Tier**: {chosen tier}
- **SDK/Client**: {package or 'raw HTTP client'}
- **Auth**: {method}
- **Webhooks**: {yes — events: X, Y / no}
- **Files to create**: ~{N} files

Proceeding to scaffold."

---

**Next:** Read `steps/04-scaffold.md`
