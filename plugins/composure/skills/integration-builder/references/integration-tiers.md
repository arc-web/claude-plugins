# Integration Tiers — Decision Matrix

Five distinct tiers for connecting to third-party services. Choose based on your constraints.

## Tier Comparison

| Tier | When to Use | Pros | Cons | Stack Agnostic? |
|---|---|---|---|---|
| **Official SDK** | Mature provider, single language target | Type safety, auth built-in, maintained by provider | Locked to SDK's language, SDK may lag API | No |
| **Direct API** | No SDK, full control needed, 1-2 stable APIs | Any language, no dependency, full control | More code, handle auth/retry yourself | Yes |
| **Unified API** | 10+ SaaS integrations in same category | Single interface for multiple providers | Extra dependency, may not cover all endpoints | Yes |
| **MCP Gateway** | AI agent tool-calling, multi-provider | Protocol-level abstraction, managed auth | Newer pattern, requires MCP runtime | Yes |
| **OpenAPI SDK Gen** | You own the API, need multi-language clients | Generate idiomatic clients from spec | Requires OpenAPI spec, generation tooling | Yes |

## Decision Tree

```
Need to connect to a third-party service?
│
├── Does an official SDK exist for your language?
│   ├── Yes, well-maintained ──────────────────→ Official SDK
│   └── Yes, but outdated/incomplete
│       ├── Service has stable REST API ───────→ Direct API
│       └── Service API is complex/unstable ───→ Official SDK (with workarounds)
│
├── No SDK exists
│   ├── Service has documented REST API ───────→ Direct API
│   ├── Need same service type from multiple
│   │   providers (CRM, email, payments) ──────→ Unified API
│   └── Building AI agent tool-calling ────────→ MCP Gateway
│
└── You own the API and need clients in
    multiple languages ────────────────────────→ OpenAPI SDK Generation
```

## Tier Details

### Official SDK
Use the provider's official client library. Best default choice when available.

**Tools**: npm/PyPI/Go modules (provider's package)
**Example**: `stripe` (npm), `twilio` (PyPI), `github.com/google/go-github` (Go)
**When to avoid**: SDK is abandoned, severely behind the API version, or adds too much bundle weight

### Direct API
Build a raw HTTP client against the provider's REST API.

**Tools**: `fetch`/`axios` (TS), `httpx`/`requests` (Python), `net/http` (Go), `reqwest` (Rust)
**Example**: Any REST API without an SDK, or when you need surgical control
**When to avoid**: Complex auth flows (OAuth is painful without SDK help), or if an excellent SDK exists

### Unified API
Use a platform that normalizes multiple providers behind a single interface.

**Tools**: Nango (open source, 700+ APIs), Merge (sync-and-store), Apideck (real-time pass-through)
**Example**: Connect to Salesforce, HubSpot, AND Pipedrive through one CRM interface
**When to avoid**: Only one provider needed, or you need endpoints the unified API doesn't expose

### MCP Gateway
Use Model Context Protocol for AI agent tool-calling across providers.

**Tools**: Composio (500+ apps as MCP servers), custom MCP servers
**Example**: AI agent that needs to call GitHub, Slack, and Linear
**When to avoid**: Not building AI agents, or need direct programmatic access without MCP runtime

### OpenAPI SDK Generation
Generate idiomatic client libraries from an OpenAPI specification.

**Tools**: Speakeasy (9+ languages, CI/CD auto-regen), Fern (7 languages, now Postman), Stainless (used by OpenAI), OpenAPI Generator (50+ languages, open source)
**Example**: Your API needs TypeScript, Python, and Go clients
**When to avoid**: Consuming someone else's API (they should generate the SDK, not you)
