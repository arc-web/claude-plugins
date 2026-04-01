# Template: Requirements Summary (Mini-PRD)

After the user confirms their stack choices, produce a structured requirements summary before scaffolding. This is NOT a full PRD — it's a one-page confirmation document that ensures alignment. Think of it as the napkin sketch the architect shows the client before drafting blueprints.

## Rules

1. **One page max** — if it doesn't fit in one AskUserQuestion response, it's too detailed for this stage.
2. **Organized by CONCERN, not by technology** — "Calendar views" not "Next.js App Router pages".
3. **Each concern has: what it does, where it lives, what it needs** — three lines, not three paragraphs.
4. **State what's OUT of scope** — prevents scope creep before scaffolding.
5. **End with "Anything missing?"** — this is the last checkpoint before scaffolding begins.

## Format

```markdown
## Project: [Name or Description]

### What we're building

| Concern | What it does | Where it lives | Needs |
|---------|-------------|----------------|-------|
| [Concern 1] | [1-line description] | `apps/web/` or `packages/x/` | [Key dependency or integration] |
| [Concern 2] | [1-line description] | [location] | [what it needs] |
| [Concern 3] | [1-line description] | [location] | [what it needs] |

### Chosen stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | [e.g., Next.js] | [1-line reason tied to requirements] |
| Database | [e.g., Supabase] | [1-line reason] |
| Auth | [e.g., Supabase Auth] | [1-line reason] |
| Hosting | [e.g., Vercel] | [1-line reason, or "TBD — decide after MVP"] |
| Project structure | [e.g., Turborepo monorepo] | [1-line reason] |

### Integrations

| Service | How we connect | Auth | What we cache |
|---------|---------------|------|---------------|
| [e.g., GHL] | REST API v2 (custom client) | OAuth2 | Contacts, calendar events |

### Out of scope (for now)

- [Thing user might expect but we're deferring]
- [Thing that could be added later but isn't in the initial build]

### Anything missing?
```

## Example: GHL Dashboard + MCP project

```markdown
## Project: GHL Dashboard + CLI Tool

### What we're building

| Concern | What it does | Where it lives | Needs |
|---------|-------------|----------------|-------|
| Dashboard | View calendar, contacts, account info from GHL | `apps/web/` | GHL API client, auth |
| MCP Server | CLI access to GHL data for AI agents | `packages/mcp-server/` | GHL API client, MCP SDK |
| GHL Client | Shared API client with OAuth, rate limiting, caching | `packages/ghl-client/` | GHL OAuth tokens |
| Calendar UI | Calendar component for viewing GHL appointments | `apps/web/` (component) | GHL calendar data |

### Chosen stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 | Server routes protect OAuth tokens, App Router for dashboard views |
| Database | Supabase | Auth + Postgres + RLS — each user sees only their GHL data |
| Auth | Supabase Auth | Bundled with DB, handles user sessions |
| Hosting | TBD | Decide after MVP — Vercel or self-host |
| Project structure | Turborepo | 3 distinct packages sharing a GHL client |

### Integrations

| Service | How we connect | Auth | What we cache |
|---------|---------------|------|---------------|
| GoHighLevel | REST API v2 (custom client) | OAuth2 (authorization code) | Contacts, appointments, account metadata |

### Out of scope (for now)

- GHL webhook real-time sync (can add post-MVP for live updates)
- Mobile app (dashboard is web-only initially)
- Multi-agency support (single agency per user for MVP)

### Anything missing?
```

## When the user is NOT sure

If the user can't answer "What are you building?" clearly, the requirements summary should reflect that uncertainty:

```markdown
### What we're building

| Concern | What it does | Where it lives | Needs |
|---------|-------------|----------------|-------|
| Dashboard | View GHL data (specifics TBD) | `apps/web/` | GHL API client |
| ? | User mentioned "calendar" — full calendar app or just a view? | TBD | Clarify scope |
| ? | MCP "for CLI level" — for personal use or distributing to others? | TBD | Affects packaging |

### Open questions (need answers before scaffolding)

1. Calendar: Are you building a full scheduling tool, or just displaying GHL appointments in a read-only view?
2. MCP server: Is this for your own CLI use, or will other people install and use it?
3. Users: Will multiple people use this dashboard, or is it just for you?
```

Don't force a scaffold with unanswered questions. It's cheaper to ask now than to re-scaffold later.

## Anti-patterns

- Writing a 3-page PRD at this stage → too detailed, slows down scaffolding
- Organizing by technology instead of concern → "Next.js pages" means nothing to the user, "Calendar views" does
- Skipping "Out of scope" → user will assume everything they mentioned is in v1
- Not asking "Anything missing?" → user had something in mind you didn't capture
