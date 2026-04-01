# Step 0a: Preflight — Route to Discovery or Planning

Determine whether this blueprint needs the full discovery phase or can skip straight to planning.

## Check project state

1. Does `.claude/no-bandaids.json` exist?
2. Does the project have source code? (check for `src/`, `app/`, `pages/`, `*.ts`, `*.tsx`, `*.js`, `index.html`, or any source files)
3. Does the code graph exist? (call `list_graph_stats` — is `last_updated` non-null?)

## Route based on state

| Project state | Route | What happens |
|---|---|---|
| **Initialized + has code + graph ready** | Skip to Step 1 | Normal blueprint flow — the 90% case |
| **Initialized + has code + no graph** | Build graph, then Step 1 | Call `build_or_update_graph({ full_rebuild: true })`, then proceed |
| **Has code + NOT initialized** | Quick init, then Step 1 | Run `/composure:initialize` (existing project, not empty — no scaffolding needed), then proceed |
| **Empty project** | Full discovery: 00b → 00c → 00d → 00e → 00f | The architect phase — requirements gathering before scaffolding |
| **User explicitly asks for discovery** | Full discovery: 00b → 00e | Even if project exists — user wants to explore options ("help me figure out what to build", "what stack should I use?") |

## How to detect "user explicitly asks for discovery"

Look for signals in the user's blueprint invocation:
- "I'm not sure what framework to use"
- "What should I build this with?"
- "Help me plan the architecture"
- "What are my options?"
- Questions about technology choices, not feature descriptions

If the user provides a clear feature description AND the project is initialized, skip discovery. They already know what they want.

## For the normal path (skip to Step 1)

Report the detected stack in one line:
> "Project initialized: [framework] + [database]. Graph ready with [N] files. Proceeding to classify."

---

**Next (if empty project or discovery requested):** Read `steps/00b-intent-analysis.md`
**Next (if initialized project):** Read `steps/01-classify.md`
