# Step 0f: Scaffold — Create Project Structure + Initialize

Execute the scaffolding based on confirmed choices from Step 0e. Then run Composure initialization so the rest of the blueprint has graph + architecture docs available.

## Scaffolding rules

1. **Always scaffold from packages** — `npx create-next-app`, `npm create vite`, `npx create-turbo`, `npx create-expo-app`. NEVER write project files from scratch.
2. **Verify scaffold succeeded** — check for `package.json`, `tsconfig.json`, or `index.html` after each scaffold command.
3. **Set up monorepo packages** if compound project — scaffold each concern into its own directory.
4. **Install key dependencies** after scaffold — database client, API SDK, MCP SDK, etc.

## Scaffold commands by choice

| Choice | Command | Post-install |
|--------|---------|-------------|
| Next.js | `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir` | — |
| Vite | `npm create vite@latest . -- --template react-ts` then `npm install` | `npm install tailwindcss` if user wants styling |
| Expo | `npx create-expo-app@latest . --template tabs` | — |
| Turborepo | `npx create-turbo@latest .` | Then scaffold apps inside (see below) |
| Node API | `npm init -y` then install framework | `npm install hono` or `express` or `fastify` |
| MCP Server | `npm init -y` then `npm install @modelcontextprotocol/sdk zod typescript` | Create `src/index.ts` with MCP server boilerplate |
| Vanilla | Create decomposed structure (see Initialize scope detection for spec) | — |

### Monorepo sub-scaffolding

For Turborepo projects with multiple concerns:

```bash
# After npx create-turbo@latest .
# Scaffold the web app inside apps/
cd apps/web && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Create shared packages
mkdir -p packages/shared/src
cd packages/shared && npm init -y

# Create MCP server package (if needed)
mkdir -p packages/mcp-server/src
cd packages/mcp-server && npm init -y && npm install @modelcontextprotocol/sdk zod
```

Adjust based on what `create-turbo` scaffolded — it may already have `apps/web` ready.

## Database setup

After project scaffold, set up the database based on the user's choice:

| Database | Setup command | Notes |
|----------|-------------|-------|
| Supabase | `npx supabase init` in project root | Creates `supabase/` directory with config |
| SQLite (Turso) | `npm install @libsql/client` | Create `db/` directory for migrations |
| Prisma | `npx prisma init` | Creates `prisma/schema.prisma` |
| No database | Skip | — |

## Run Composure initialization

After scaffolding is complete, run `/composure:initialize` in **delegated mode**:

> The project was just scaffolded with the following confirmed stack: [framework], [database], [project structure]. Skip the interactive scaffolding questions in Step 0 — the project structure already exists. Proceed directly with stack detection, Context7 doc generation, graph building, and task queue creation.

This ensures:
- `.claude/no-bandaids.json` is created with the correct stack
- Code graph is built for the scaffolded structure
- Framework docs are queried and generated
- Task queue is set up

## Report and transition

After scaffolding + initialization:

> "Project scaffolded and initialized:
> - [Framework] in [location] 
> - [Database] configured
> - Code graph built: [N] files indexed
> - Framework docs generated
>
> Continuing with blueprint planning."

---

**Next:** Read `steps/01-classify.md`
