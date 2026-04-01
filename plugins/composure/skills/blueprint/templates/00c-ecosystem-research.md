# Template: Ecosystem Research Summary

When presenting findings from web research about a target service or integration, use this structured format. This is SURFACE-LEVEL research — enough to inform stack choices, not an exhaustive API analysis. The integration-builder skill handles the deep dive during implementation.

## Rules

1. **2-3 web searches per service** — not 10. "Does GHL have an API? What auth? Any SDK?" is enough.
2. **Present findings in a consistent card format** — every service gets the same structure so the user can compare.
3. **Flag what EXISTS vs what you'd need to BUILD** — "GHL has an OAuth2 API but no official MCP server" tells the user: API client = use SDK, MCP = build custom.
4. **Note rate limits and pricing if visible** — these affect architecture (need caching? need queue?).
5. **Admit gaps** — "I couldn't find rate limit docs" is better than guessing.
6. **Link to official docs** — the user may want to verify or dig deeper.

## Format

```markdown
### [Service Name] — Integration Surface

| Aspect | Finding |
|--------|---------|
| **API Type** | REST / GraphQL / WebSocket / gRPC |
| **Auth Method** | OAuth2 / API Key / JWT / Basic Auth |
| **Official SDK** | Yes (npm: `@service/sdk`) / No / Community-maintained |
| **MCP Server** | Yes (official) / Yes (community) / No — would need custom |
| **Webhooks** | Yes (events: X, Y, Z) / No |
| **Rate Limits** | X requests/min (or "not documented") |
| **Pricing** | Free tier available / Paid only / Per-request |
| **Docs** | [Official API docs](url) |

**What this means for your project:**
- [1-2 sentences: what you can use as-is vs what needs building]
- [Architecture implication: "OAuth2 means you need server-side routes for token exchange"]
```

## Example: GoHighLevel research

```markdown
### GoHighLevel (GHL) — Integration Surface

| Aspect | Finding |
|--------|---------|
| **API Type** | REST (v2) |
| **Auth Method** | OAuth2 (authorization code flow) |
| **Official SDK** | No official Node/Python SDK — community wrappers exist |
| **MCP Server** | No official MCP — would need custom server |
| **Webhooks** | Yes (contact.created, opportunity.updated, appointment.scheduled, etc.) |
| **Rate Limits** | 100 requests/min per location, 200/min per agency |
| **Pricing** | API access included with GHL subscription |
| **Docs** | [GHL API v2 docs](https://highlevel.stoplight.io/docs/integrations) |

**What this means for your project:**
- API client needs custom implementation (no SDK). OAuth2 flow requires server-side routes to handle token exchange and refresh.
- Rate limits (100/min) suggest caching GHL data locally rather than proxying every dashboard request.
- MCP server would be custom — wraps the REST API in MCP tool definitions for CLI access.
- Webhooks available for real-time sync — can push updates to Supabase instead of polling.
```

## Multi-service research

When the user's project involves multiple services, present each one as a separate card, then add a **Connections** section at the end:

```markdown
### Connections Between Services

- GHL OAuth tokens → stored in [database] → used by both dashboard and MCP server
- GHL webhooks → hit [backend] endpoint → update [database] → dashboard shows real-time
- MCP server → reads from [database] cache → falls back to GHL API if stale
```

This shows the user how the pieces connect BEFORE choosing a stack — architecture-first, not tool-first.

## Anti-patterns

- Deep API endpoint mapping at this stage → save for integration-builder
- Presenting research without "what this means for your project" → data without insight
- Guessing about features you didn't verify → state "not confirmed" instead
- Skipping rate limits → these drive caching/architecture decisions
