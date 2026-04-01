# Step 0e: Requirements Confirmation — Mini-PRD

Before scaffolding, summarize what was decided into a structured requirements summary. This is the last checkpoint before code is created. One page, not a document.

## Produce the summary

Use the format from `templates/00e-requirements-summary.md`:

1. **Concerns table** — what distinct things are being built, where they live, what they need
2. **Chosen stack table** — framework, database, auth, hosting, project structure — each with a 1-line "why"
3. **Integrations table** — each external service with connection method, auth type, what to cache
4. **Out of scope** — things the user might expect but we're deferring (prevents scope creep)
5. **"Anything missing?"** — the final confirmation

## Rules

- **Organize by CONCERN, not by technology** — "Calendar views" not "Next.js pages"
- **One page max** — if it doesn't fit in one response, it's too detailed
- **State what's OUT of scope explicitly** — this prevents "I thought that was included" later
- **Don't force it if questions remain** — if the user hasn't decided on something, show it as "TBD" with the open question

## Handle open questions

If the user's description left things ambiguous, include an **Open questions** section:

> ### Open questions (need answers before scaffolding)
> 1. Calendar: Full scheduling tool, or read-only view of GHL appointments?
> 2. MCP server: For your personal use, or distributing to others?

**Don't scaffold with unanswered questions.** It's cheaper to ask now than to re-scaffold later. Use **AskUserQuestion** with the summary + open questions.

**BLOCKING** — wait for the user to confirm or adjust.

## After confirmation

Once the user says "looks good" (or a variation), proceed to scaffolding. Store the confirmed requirements mentally — Step 00f needs the chosen framework, database, project structure, and integration list.

---

**Next:** Read `steps/00f-scaffold.md`
