# SDKs & Integrations — Index

> **This is a barrel index.** Cross-cutting libraries that aren't tied to a specific frontend, backend, or mobile category.

## What goes here

Libraries used across multiple categories — validation, AI, payments, email, auth providers:

| Library | When detected |
|---------|---------------|
| `zod` | Schema validation (used in frontend forms, backend APIs, SDK contracts) |
| `ai` / `@ai-sdk/*` | AI SDK (used in Next.js routes, standalone backends, edge functions) |
| `stripe` | Payment processing |
| `resend` | Email delivery |
| `clerk` / `@clerk/*` | Auth provider SDK |

## Load by detection

If any of these libraries appear in `package.json` dependencies, check `.claude/frameworks/sdks/generated/` for project-level Context7 docs.

These docs complement category-specific docs — a Next.js project loads `fullstack/nextjs/` AND `sdks/` if it uses AI SDK + Stripe.

## Integration Builder

For full integration workflows — API client scaffolding, auth setup, webhook handling, testing — use `/composure:integration-builder`. It provides the complete integration lifecycle:

- Stack detection (TypeScript, Python, Go, Rust, Ruby)
- SDK discovery + Context7 live documentation
- Integration tier selection (Official SDK, Direct API, Unified API, MCP Gateway, OpenAPI SDK Gen)
- Monorepo-aware scaffolding
- Auth, webhook, and error handling patterns
- Test scaffolding (MSW/Pact for TS, language-appropriate for others)

`sdks/INDEX.md` handles **doc detection for libraries already in the project**. `integration-builder` handles **adding new third-party service connections from scratch**.
