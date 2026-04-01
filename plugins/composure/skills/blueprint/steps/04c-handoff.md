# Step 4c: Handoff

Present a brief summary of the blueprint to the user.

## If gaps surfaced during writing

Sometimes writing the Implementation Spec reveals gaps — a function signature you couldn't verify, a design question that only appears when you get specific. If this happened, present the gaps now:

"Blueprint written at `tasks-plans/blueprints/{slug}-{date}.md`.

While writing the spec, I need clarity on:
1. [Specific question that surfaced]
2. [Another question if applicable]

Review the blueprint and answer these, then tell me to start — or adjust anything first."

Use **AskUserQuestion** with the specific questions.

## If no gaps (clean handoff)

"Blueprint written at `tasks-plans/blueprints/{slug}-{date}.md`. Review it, then tell me to start — or adjust anything first."

Use **AskUserQuestion** with:
- Option 1: "Start building" (Recommended)
- Option 2: "Adjust something"

The user's response is the approval gate. When they say go, begin with the first checklist item.

## Integration Notes

- **Blueprint files persist across sessions** — another session can pick them up via `/review-tasks`
- **Checklist items use `- [ ]` format** — compatible with `/review-tasks verify` and `/commit` gate
- **The commit skill scans `tasks-plans/blueprints/*.md`** — open blueprint items are visible during commits
- **After blueprint, the architecture docs are already loaded** — no need to invoke `/app-architecture` separately

**Done.**
