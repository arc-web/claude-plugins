# Step 2: Discover SDK & Pull Documentation

**Skip Context7 calls if `--skip-docs` flag is set.**

## 2a. Find the Official SDK

Search for the official SDK package for the detected language:

| Language | Search patterns | Registry |
|---|---|---|
| TypeScript/JS | `{service}`, `@{service}/*`, `{service}-node`, `{service}-js` | npm |
| Python | `{service}`, `{service}-python`, `{service}-sdk`, `python-{service}` | PyPI |
| Go | `github.com/{service}/{service}-go`, `go-{service}` | Go modules |
| Rust | `{service}`, `{service}-rs`, `{service}-sdk` | crates.io |
| Ruby | `{service}`, `{service}-ruby`, `{service}-sdk` | RubyGems |

**Prioritize**: Official SDK (maintained by the service provider) over community SDK. Check:
- Is it listed on the service's official documentation?
- Is it actively maintained (recent commits, releases)?
- Does it cover the API surface the user needs?

**If no SDK exists for the detected language**: Note this — we'll use the Direct API tier in step 03.

## 2b. Pull Documentation via Context7

If Context7 MCP is available and `--skip-docs` is NOT set:

1. **Resolve library**: Call `resolve-library-id` with the SDK package name
2. **Query docs**: Call `query-docs` with the resolved ID, requesting:
   - Installation / setup instructions
   - Authentication configuration
   - Main client class or initialization function
   - Rate limits and pagination patterns
   - Webhook setup (if the service supports webhooks)
   - Error handling patterns
   - Common use cases

**Extract and note**:
- Install command (e.g., `pnpm add stripe`, `pip install twilio`)
- Auth method (API key, OAuth 2.0, Bearer token)
- Main client initialization pattern
- Rate limit (requests per minute/second)
- Webhook signature verification method (if applicable)

### If Context7 is unavailable

Fall back gracefully:
1. State: "Context7 not available — searching for {service} documentation."
2. Use **WebSearch** to find the official API docs
3. Use **WebFetch** to pull key setup instructions from the official docs
4. If neither works: Ask the user to provide a link to the API documentation

## 2c. Check for OpenAPI / Swagger Spec

Before building from scratch, check if the service provides an OpenAPI (v3.x) or Swagger (v2.x) specification:

1. Search the project for existing spec files: `*.openapi.json`, `*.openapi.yaml`, `swagger.json`, `swagger.yaml`
2. Check the service's developer docs for a downloadable spec
3. If found, the spec is the **single source of truth** for:
   - All available endpoints and their parameters
   - Request/response schemas (use for type generation)
   - Authentication requirements
   - Rate limit documentation

**If a spec exists**: Use it to generate types in Step 5a. For TypeScript, generate interfaces directly from the schema objects. For Python, generate dataclasses/Pydantic models. For Go, generate structs with JSON tags. The spec eliminates guesswork about the API surface.

**If the user owns the API and has a spec**: This may shift the integration tier to "OpenAPI SDK Generation" — revisit in Step 3.

## 2d. Check for Existing Integration Code

Search the codebase for existing integration patterns:

1. Use graph: `semantic_search_nodes({ query: "{service}" })` — find if this service is already partially integrated
2. Use graph: `semantic_search_nodes({ query: "integration" })` — find existing integration patterns to follow
3. Check for existing `.env` variables with the service name (e.g., `STRIPE_SECRET_KEY`)

If existing code found, note it — step 05 should follow the established patterns rather than introducing new conventions.

## 2e. Present Findings

"SDK Discovery:
- **SDK**: {package name} (official / community / none found)
- **Install**: `{install command}`
- **Auth**: {method} ({details from docs})
- **Rate limit**: {X requests per Y}
- **Webhooks**: {supported / not supported}
- **Existing code**: {found at path / none}

{If Context7 docs pulled: 'Latest documentation loaded for {SDK version}.'}
{If no SDK: 'No official SDK found for {language}. Will use Direct API approach.'}"

---

**Next:** Read `steps/03-decide.md`
