# Step 6: Framework-Specific Checks (Conditional)

Query Context7 for current best practices when the PR modifies framework-specific code. This catches outdated API usage that the LLM's training data might not flag.

**Skip this entire step if no known frameworks are detected in the changed files.**

## 6a. Detect Frameworks in Changed Files

Scan `CHANGED_FILES` for framework indicators:

| Framework | Detection signals |
|---|---|
| Next.js | Files in `app/`, `pages/`, imports from `next/*`, `next.config.*` |
| Supabase | Imports from `@supabase/*`, `supabase.ts` files |
| React | `.tsx` files with `import React` or `from 'react'` |
| TanStack Query | Imports from `@tanstack/react-query` |
| Tailwind CSS | `tailwind.config.*`, `@apply` directives |
| Prisma | `prisma/schema.prisma`, imports from `@prisma/client` |
| tRPC | Imports from `@trpc/*` |

Also check `.claude/sentinel.json` for detected `integrations` if available.

If zero frameworks detected → skip to step 07.

## 6b. Query Context7

For each detected framework where the PR modifies framework-specific patterns:

1. **Resolve the library ID:**
   ```
   resolve-library-id({ libraryName: "<framework>", query: "<what the PR does with it>" })
   ```

2. **Query for current patterns:**
   ```
   query-docs({ libraryId: "<resolved-id>", query: "<specific pattern seen in diff>" })
   ```

### What to check

| Framework | Common outdated patterns to flag |
|---|---|
| Next.js | `getServerSideProps`/`getStaticProps` (→ App Router), `next/router` (→ `next/navigation`), `pages/api` (→ Route Handlers) |
| Supabase | Client-side `service_role` usage, missing `.select()` on mutations, `supabase-js` v1 patterns |
| React | Class components (→ functional), `useEffect` for data fetching (→ TanStack Query), `forwardRef` (→ ref prop in React 19) |
| TanStack Query | v4 patterns in v5 codebase (`useQuery({ queryKey, queryFn })` shape changes) |

## 6c. Report Framework Findings

Only flag patterns that are **clearly outdated or incorrect** — not stylistic preferences.

Format for each finding:

```
**[Framework]** Pattern in `<file>:<line>` uses `<old_pattern>`.
Current <framework> <version> recommends `<new_pattern>`.
Reference: <Context7 source or doc link>
```

If Context7 is unavailable (MCP server not running), skip this step with a note:
"Framework-specific checks skipped — Context7 MCP not available."

Store findings for inclusion in step 08 output.

---

**Next:** Read `steps/07-security-crossover.md`
