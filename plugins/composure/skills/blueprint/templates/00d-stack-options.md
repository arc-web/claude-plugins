# Template: Stack Options Presentation

When presenting framework, database, hosting, or auth options to the user, use this structured format. The template forces you to state trade-offs explicitly — a recommendation without a trade-off is just bias.

## Rules

1. **Present 2-4 options per layer** — not one, not ten. Enough to choose, not enough to overwhelm.
2. **Every option has a "Best for" and "Trade-off" line** — one without the other is incomplete.
3. **Lead with a recommendation** — but explain why AND what the user gives up.
4. **Tailor to the user's stated needs** — don't list generic pros/cons. If they said "local-first", highlight offline capability. If they said "users sign up", highlight auth support.
5. **Flag hidden costs** — vendor lock-in, managed vs self-hosted, cold starts, egress fees, required config complexity.
6. **Never present a single option as the only path** — even if it's the obvious choice, show the alternative so the user sees why.

## Format

Use this format per layer (framework, database, hosting, auth):

```markdown
### [Layer Name] — Recommendation: **[Choice]**

| Option | Best for | Trade-off | Notes |
|--------|----------|-----------|-------|
| **[Recommended]** | [Why this fits the user's stated needs] | [What they give up] | [Recommended] |
| [Alternative 1] | [When this would be better] | [What they give up] | |
| [Alternative 2] | [When this would be better] | [What they give up] | |

**Why [Recommended]**: [1-2 sentences connecting the choice to the user's specific requirements]
```

## Example: Database layer for a dashboard with third-party API integration

```markdown
### Database — Recommendation: **Supabase**

| Option | Best for | Trade-off | Notes |
|--------|----------|-----------|-------|
| **Supabase** | Auth + Postgres + realtime in one — good for dashboards with user accounts | Vendor-specific APIs, hosted only (no self-host option yet) | Recommended |
| Neon | Serverless Postgres, pay-per-query — good for variable/low traffic | No built-in auth — need separate auth provider (Auth.js, Clerk) | |
| SQLite (Turso) | Local-first, edge-deployable — good for read-heavy, offline-capable apps | No built-in auth, managing OAuth tokens at edge is tricky | |
| Self-hosted Postgres | Full control, no vendor lock-in — good for teams with DevOps capacity | You manage backups, scaling, migrations, and auth separately | Needs DO/Railway/AWS |

**Why Supabase**: Your dashboard needs user authentication (GHL account connections) and persistent storage for OAuth tokens. Supabase bundles both with row-level security, so each user only sees their own data. If vendor lock-in is a concern, Neon + Auth.js gives the same capabilities with more portability.
```

## Anti-patterns

- Presenting one option with no alternatives → user can't make an informed decision
- Listing 6+ options with generic descriptions → decision paralysis
- Recommending without stating the trade-off → hidden bias
- Using technical jargon without context → "serverless Postgres" means nothing to someone who just wants their data to be safe
- Ignoring the user's stated constraints → if they said "simple" or "local", don't lead with the most complex option
