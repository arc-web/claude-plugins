# Backend Architecture — Index

> **This is a barrel index.** Read this file first, then load the files listed below based on the detected stack.

## Always Load

| File | Contains |
|------|----------|
| [core.md](core.md) | Phases 1-2: Database schema, RLS policies, auth model, entity registry, ID prefixes |

## Load by `backend` value

| `backend` value | Also load |
|---|---|
| Any Supabase project | Composure Pro Patterns (if installed) — RLS templates, migration checklist, role hierarchy |

## Reference Docs (Composure Pro Patterns)

These contain full implementation templates. If `.claude/composure-pro.json` does not exist, `core.md` provides enough conceptual guidance.

**To load Pro patterns:** Read `.claude/composure-pro.json`, extract the `pluginRoot` field, then read files from the plugin cache using `{pluginRoot}/` as the base path:

| Pattern | File (relative to pluginRoot) |
|---------|-------------------------------|
| Entity Registry | `data-patterns/01-entity-registry-feed.md` |
| ID Prefixes | `data-patterns/02-id-prefix-convention.md` |
| 4-Level Auth | `data-patterns/03-four-level-auth.md` |
| Privacy Groups | `data-patterns/04-privacy-role-system.md` |
| Contact-First | `data-patterns/05-contact-first-pattern.md` |
| Metadata Templates | `data-patterns/08-metadata-templates.md` |
| RLS Patterns | `rls-policies/rls-patterns.md` |
| Role Hierarchy | `rls-policies/role-hierarchy.md` |
| Migration Checklist | `rls-policies/migration-checklist.md` |
