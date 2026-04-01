# Step 0b: Intent Analysis — Parse Signals from User Description

Read the user's description (argument to blueprint, or their most recent message) and identify what they actually need built. This step extracts architectural signals that inform the research and stack decisions.

## Signal extraction

Parse the user's description for these categories:

### Concerns (what distinct things need building)

| Signal words | Concern type | Implication |
|---|---|---|
| "dashboard", "admin panel", "portal", "view data" | Web UI | Needs a frontend framework |
| "API", "integrate with", "connect to", "sync" | Third-party integration | Needs server-side routes + API client |
| "MCP server", "CLI tool", "agent tool" | MCP/CLI | Separate Node.js package |
| "mobile", "iOS", "Android", "app" | Mobile | Expo or React Native |
| "users sign up", "login", "accounts" | Auth | Needs auth provider + database |
| "calendar", "scheduling", "appointments" | Domain UI | Specific component, depends on data source |
| "real-time", "live updates", "notifications" | Real-time | WebSocket/SSE, affects backend choice |
| "deploy", "host", "put online" | Hosting | Affects framework choice (Vercel vs self-host) |
| "simple", "local", "just for me", "prototype" | Low complexity | Steer toward lighter stack |
| "production", "scale", "multiple users" | High complexity | Steer toward robust stack |

### Complexity classification

Based on the number and type of concerns:

| Concerns | Complexity | Likely structure |
|---|---|---|
| 1 concern (e.g., just a dashboard) | Simple | Single project |
| 2 concerns in same domain (e.g., dashboard + API routes) | Standard | Single project with API routes |
| 2-3 distinct concerns (e.g., web + MCP + shared lib) | Compound | Monorepo |
| 4+ concerns or multi-platform (web + mobile + API) | Complex | Monorepo with careful package boundaries |

## Output

Present your analysis to the user in a brief summary:

> "From your description, I see [N] distinct concerns:
> 1. **[Concern]** — [what it needs]
> 2. **[Concern]** — [what it needs]
> 3. **[Concern]** — [what it needs]
>
> This looks like a **[complexity]** project. [1 sentence on likely structure]."

Do NOT ask a question yet — just present the analysis. If the user's description is too vague to extract signals, use **AskUserQuestion**:

> "I want to set this up right from the start. Can you tell me a bit more about what you're building? For example:
> - Who uses it? (just you, your team, external users?)
> - What data does it work with? (API from another service, user uploads, database?)
> - Where does it run? (web browser, mobile app, CLI tool, all of the above?)"

**BLOCKING** — wait for the user's response before continuing.

---

**Next:** Read `steps/00c-ecosystem-research.md`
