# Step 0c: Ecosystem Research — Surface-Level Service Discovery

**Skip if**: No third-party integrations identified in Step 0b (pure UI project, local-only tool).

For each external service or integration the user mentioned, do a quick web search to understand what's available. This is SURFACE-LEVEL — enough to inform stack choices, not an exhaustive API analysis. The integration-builder skill handles the deep dive during implementation.

## What to search for (per service)

2-3 web searches per service. Focus on:

1. **"[Service] API documentation [year]"** — does it have a public API? What type? (REST, GraphQL, WebSocket)
2. **"[Service] OAuth" or "[Service] API authentication"** — how do you authenticate?
3. **"[Service] SDK npm" or "[Service] MCP server"** — is there an official SDK or MCP?

## Present findings

Use the format from `templates/00c-ecosystem-research.md` — one card per service with:
- API type, auth method, SDK availability, MCP availability
- Rate limits (if easily found)
- **"What this means for your project"** — the actionable insight

If researching multiple services, include a **Connections** section showing how data flows between them.

## Research quality rules

- **State what you found, not what you assume** ��� if rate limits aren't documented, say "not found"
- **Link to official docs** �� the user should be able to verify
- **Flag community vs official** — an unofficial SDK has different reliability guarantees
- **Note pricing if relevant** — "API access requires $X/month plan" affects feasibility
- **Don't deep-dive** — if you find the API uses OAuth2 with REST endpoints, that's enough. Don't map every endpoint.

## After presenting research

Do NOT ask a question after this step. The research informs Step 0d (stack options), where the user makes their choices. Just present the findings and proceed.

If the research reveals something that changes the project scope (e.g., "GHL doesn't have a public API — only partner access"), flag it:

> "Important: [Service] requires partner-level access for API use. This may affect your timeline — you'd need to apply for API access before building the integration."

---

**Next:** Read `steps/00d-stack-options.md`
