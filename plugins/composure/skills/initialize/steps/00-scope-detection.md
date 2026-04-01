# Step 0: Scope Detection

Determine what kind of working directory we're in **before** doing anything else. This sets the strategy for all subsequent steps.

## Detection Logic

Run these checks in order:

```bash
# 1. Check for package.json (single project or monorepo root)
[ -f "package.json" ] && echo "HAS_PKG=true"

# 2. Check for monorepo markers
[ -f "turbo.json" ] || [ -f "pnpm-workspace.yaml" ] || [ -f "lerna.json" ] && echo "MONOREPO=true"

# 3. Check for plugin.json (composure plugin repo)
[ -f "plugin.json" ] && echo "PLUGIN_REPO=true"

# 4. Check for .git (inside a repo)
[ -d ".git" ] && echo "GIT_REPO=true"

# 5. If no package.json and no .git, check if children have .git
# (multi-project parent like ~/Projects)
ls -d */.git 2>/dev/null | head -5
```

## Scope Types

| Scope | Detected When | Strategy |
|-------|--------------|----------|
| `single-project` | Has `package.json`, no workspace markers | Normal init flow (Steps 1-12) |
| `monorepo` | Has `turbo.json`, `pnpm-workspace.yaml`, or `lerna.json` | Detect workspace paths, init once with multi-path awareness |
| `plugin-repo` | Has `plugin.json` at root | Use `skills/app-architecture/` as framework doc root instead of `.claude/frameworks/` |
| `multi-project` | No `package.json`, multiple child dirs with `.git` | Fan-out mode (see below) |
| `empty` | No recognizable structure | Interactive scaffolding (see below) |

## Multi-Project Fan-Out

When scope is `multi-project`:

1. **List child projects** with basic info:
   ```
   Detected multi-project root with N child projects:
     cipher-platform/  (Next.js + Supabase monorepo, last commit Mar 25)
     etal-crm/         (Next.js + Supabase monorepo, last commit Mar 28)
     ...
   ```

2. **Build graphs for all child projects** (these are independent and can be parallel):
   ```
   For each child with .git:
     call build_or_update_graph({ repo_root: childPath, full_rebuild: true })
   ```

3. **Skip steps 1-8** (config generation, Context7 docs, task queue) — these are per-project.
   Jump directly to Step 1 (Context Health) and Step 3 (Companion Triage).

4. **Report available cross-project queries**:
   ```
   Graphs built for N projects. You can now query across projects:
     - entity_scope({ repo_root: "path" }) — domain entities per project
     - semantic_search_nodes({ query: "auth", repo_root: "path" }) — find code across projects
     - query_graph({ pattern: "imports_of", target: "file", repo_root: "path" })
   ```

## Empty Project — Interactive Scaffolding

When scope is `empty`, do NOT just stop. Guide the user through scaffolding a proper project structure. This prevents Claude from defaulting to monolithic single-file apps.

### Delegated Mode (called from Blueprint)

If Initialize was triggered from Blueprint's Step 0f, the conversation already contains confirmed scaffold decisions (framework, database, project structure, integrations). In this case:

1. **Skip Phases 0-2 entirely** — Blueprint already gathered requirements, researched the ecosystem, and confirmed the stack with the user
2. **Go directly to Phase 3 (Scaffold from packages)** — use the choices established in the conversation
3. **After scaffolding, continue to Step 1** as normal

How to detect delegated mode: if the conversation already established specific framework/database/structure choices through Blueprint's discovery phase (Steps 00b-00e), AND the user confirmed them, treat this as delegated. Do NOT re-ask questions the user already answered.

### Phase 0: Analyze user intent (if available)

**Runs only in standalone mode** (`/composure:initialize` called directly, not from Blueprint).

Before asking questions, check if context already exists — the user's message, a blueprint description, or a conversation history. Look for **signals** that inform the scaffold decision:

| Signal in user's description | Implication |
|---|---|
| "integrate with [API]", "connect to [service]", "OAuth" | Needs server-side routes → framework, not vanilla |
| "dashboard", "admin panel", "SaaS", "users can sign up" | Multi-page app with auth → Next.js + database |
| "MCP server", "CLI tool", "agent" | Separate Node.js project (may need monorepo if combined with web) |
| "mobile", "iOS", "Android" | Expo or React Native |
| "simple page", "landing page", "portfolio" | Could be vanilla or Vite depending on interactivity |
| "real-time", "live updates", "notifications" | Needs WebSocket/SSE support → Supabase realtime or dedicated backend |
| Multiple distinct concerns (web + API + MCP) | Monorepo with separate packages |

**If the user's intent is already clear**, skip the generic menu and present a **recommendation with rationale** instead. For example:

> "Based on your description, I'd recommend:
> - **Next.js** for the dashboard (server-side routes protect your API keys, App Router for the calendar views)
> - **Supabase** for auth + data (users sign in, store their GHL account connections)
> - **Separate `packages/mcp-server/`** for the MCP CLI tool (shares types with the dashboard)
> - **Turborepo** to tie them together
>
> Does this look right, or would you like to adjust?"

**BLOCKING** — wait for the user's response. They may accept, adjust, or describe something different.

**If intent is unclear or generic** ("I want to build something"), fall through to Phase 1 below.

### Phase 1: What are you building?

Use **AskUserQuestion** — but only if Phase 0 didn't already resolve the scaffold choice.

> "This is an empty project — let's set it up right. What kind of application are you building?"
>
> 1. **Web app** (dashboard, landing page, SaaS) → Next.js or Vite
> 2. **Mobile app** (iOS/Android) → Expo
> 3. **API / Backend** (REST, GraphQL, workers) → Node + framework
> 4. **Full-stack monorepo** (web + mobile + shared packages) → Turborepo
> 5. **Simple static site** (HTML/CSS/JS, no framework needed)
>
> "Or describe what you want and I'll recommend the right setup."

**BLOCKING** — wait for the user's response before continuing.

### Phase 2: Persistence & data

After the app type is decided, follow up with **AskUserQuestion** about data — but only if the answer isn't already implied by the user's description:

> "How should data be stored?"
>
> 1. **Supabase** (hosted Postgres + auth + realtime — recommended for most apps)
> 2. **SQLite** (local file database — good for prototypes, offline-first)
> 3. **No database yet** (start with in-memory/localStorage, add later)
> 4. **Other** (Prisma + Postgres, Firebase, MongoDB, etc.)

**BLOCKING** — wait for the user's response before continuing.

**Safety guardrails for persistence choice:**
- If the user chose "integrate with [third-party API]" but picks "No database" → warn: "API integrations typically need somewhere to store OAuth tokens and cached data. Consider at least SQLite for now."
- If the user wants "users can sign up" but picks "No database" → warn: "User authentication requires persistent storage. Supabase includes auth out of the box."
- If the user wants vanilla HTML + API integration → warn: "API keys in client-side JavaScript are exposed to anyone viewing your source. Consider adding a backend (even a simple Node server) to proxy API calls securely."

These are warnings, not blocks — the user decides.

### Phase 3: Scaffold from packages

Based on the user's answers, run the appropriate scaffold command. **Never write project files from scratch — always scaffold from packages.**

| Choice | Scaffold command |
|--------|-----------------|
| Web app (complex/SaaS) | `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir` |
| Web app (simple/fast) | `npm create vite@latest . -- --template react-ts` then `npm install` |
| Mobile app | `npx create-expo-app@latest . --template tabs` |
| API (Node) | `npm init -y` then install chosen framework (`express`, `hono`, `fastify`) |
| Full-stack monorepo | `npx create-turbo@latest .` |
| MCP server | `npm init -y` then `npm install @modelcontextprotocol/sdk zod` + create `src/index.ts` with MCP server boilerplate |
| Simple static site | See **Vanilla scaffolding** below |

**Multi-concern projects** (e.g., dashboard + MCP server + API integration):

When the user's description involves multiple distinct pieces, scaffold a **monorepo** and set up each concern as a separate package:

```bash
npx create-turbo@latest .
# Then within the monorepo:
# apps/web/        — Next.js dashboard (create-next-app)
# packages/mcp/    — MCP server (npm init + @modelcontextprotocol/sdk)
# packages/shared/ — Shared types, API client, utilities
```

The monorepo approach means:
- Each concern has its own package with appropriate dependencies
- Shared types and API clients live in `packages/shared/`
- The integration-builder skill handles the third-party API client (in `packages/shared/` or `apps/web/lib/`)
- The MCP server imports from shared types — consistent interfaces across CLI and web

**After scaffolding completes**, verify the project structure was created (check for `package.json`, `tsconfig.json`, or `index.html` depending on choice). Then **continue to Step 1** — the normal init flow will detect the newly scaffolded stack.

### Integration routing

After scaffolding, if the user's description mentioned third-party integrations:

1. **Note which integrations were mentioned** (GHL, Stripe, Twilio, etc.)
2. **Do NOT build the integration client during scaffolding** — that's the integration-builder's job
3. **Report**: "Integration with [service] noted. After initialization, run `/composure:blueprint` to plan the integration, which will route to the integration-builder patterns for API client setup, auth flow, and error handling."

This keeps scaffolding focused on project structure and lets the specialized skills handle their domain.

### Vanilla Scaffolding (Simple static site)

If the user wants HTML/CSS/JS without a framework, **still create a proper decomposed structure**. Do NOT write a single monolithic file.

Create this structure:

```
project/
├── index.html          # Thin shell — structure + links only (<50 lines)
├── css/
│   └���─ styles.css      # All styles in separate file(s)
├── js/
│   ├── app.js          # Main application logic
│   └── utils.js        # Shared utilities (if needed)
├── assets/             # Images, fonts, etc.
└── README.md           # What this project does
```

**Rules for vanilla projects:**
- `index.html` links to CSS via `<link>` and JS via `<script src>` — NO inline `<style>` or `<script>` blocks beyond initialization
- Each CSS file stays under 300 lines. Split by concern (layout, components, utilities) if growing.
- Each JS file stays under 300 lines. Split by feature/module.
- Use ES modules (`type="module"` on script tags) for JS imports between files.
- If the user later wants a build step, this structure migrates cleanly to Vite (`npm create vite` preserves the file layout).

After creating the structure, write a minimal `.claude/no-bandaids.json` with:
```json
{
  "composureVersion": "<plugin-version>",
  "extensions": [".html", ".css", ".js"],
  "skipPatterns": [],
  "disabledRules": [],
  "frameworks": {
    "html": {
      "paths": ["."],
      "frontend": null,
      "backend": null,
      "versions": {}
    }
  }
}
```

Then **continue to Step 1** for the rest of the init flow (graph build, task queue, etc.).

### If scaffolding was called from Blueprint

When this step runs because Blueprint's Step 0 auto-triggered initialize, the user's feature description from Blueprint Step 1 (classify) should inform Phase 0's signal analysis. Report to the user after scaffolding:

> "Project scaffolded as [type]. Continuing with initialization, then returning to your blueprint."

The user should see the scaffolding happen seamlessly — not as a detour.

## Output

Set a `scope` variable (used by subsequent steps):

```json
{
  "scope": "single-project" | "monorepo" | "plugin-repo" | "multi-project" | "empty",
  "children": ["cipher-platform", "etal-crm"],  // only for multi-project
  "monorepoWorkspaces": ["apps/web", "packages/shared"],  // only for monorepo
  "pluginRoot": "skills/app-architecture/",  // only for plugin-repo
  "scaffolded": true | false,  // true if this step created the project structure
  "scaffoldType": "nextjs" | "vite" | "expo" | "node-api" | "turbo" | "vanilla" | null
}
```

When `scaffolded: true`, subsequent steps treat this as a `single-project` (or `monorepo` for turbo) — the scope effectively upgrades after scaffolding.

---

**Next:** Read `steps/01-context-health.md`
