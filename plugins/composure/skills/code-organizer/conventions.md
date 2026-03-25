# Conventional Project Structures

Per-framework target layouts and file classification rules. The code-organizer skill loads **only the relevant section** based on the detected stack in `.claude/no-bandaids.json`.

---

## Next.js (App Router)

> Load when `frontend: "nextjs"`

### Target Structure

```
project-root/
├── app/                          # Routes only (pages, layouts, loading, error, not-found)
│   ├── (auth)/                   # Unauthenticated route group
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/              # Authenticated route group
│   │   ├── layout.tsx            # Auth check + data prefetch
│   │   └── [account_id]/         # Tenant-scoped routes
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       └── settings/page.tsx
│   ├── api/                      # Route handlers (if needed)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable UI primitives (buttons, inputs, cards, shadcn)
│   └── features/                 # Feature-specific components (feature folders)
│       └── {feature}/            # e.g., buildings/, tickets/
│           ├── index.ts          # Barrel export
│           ├── {Feature}Container.tsx
│           ├── {Feature}List.tsx
│           └── {Feature}Card.tsx
├── hooks/                        # Custom React hooks
│   ├── use-{name}.ts            # General hooks
│   └── queries/                  # TanStack Query hooks (optional subfolder)
│       └── use-{entity}.ts
├── lib/                          # Utilities, helpers, shared logic
│   ├── utils.ts                  # General utilities
│   └── {domain}.ts               # Domain-specific helpers
├── types/                        # TypeScript types and interfaces
│   ├── index.ts                  # Barrel / common types
│   └── {domain}.ts               # Domain-specific types
├── services/                     # API clients, external service wrappers
│   ├── {service}-client.ts       # e.g., supabase-client.ts
│   └── {entity}-service.ts       # e.g., building-service.ts
├── config/                       # App configuration, constants
│   └── {name}.ts
├── actions/                      # Server actions (if using 'use server')
│   └── {entity}-actions.ts
└── middleware.ts                  # Next.js middleware (MUST stay at root)
```

### Classification Rules

| Pattern | Target |
|---------|--------|
| Exports JSX, is generic/reusable (Button, Input, Card, Dialog) | `components/ui/` |
| Exports JSX, is feature-specific (BuildingList, TicketCard) | `components/features/{feature}/` |
| Filename `use*.ts` or exports `function use[A-Z]` | `hooks/` |
| Only `export type`/`export interface`, no runtime code | `types/` |
| Contains `fetch(`, `supabase.`, API client calls, no JSX | `services/` |
| Exports functions/constants, no JSX, no hooks, no API calls | `lib/` |
| Has `'use server'` directive | `actions/` |
| Is `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` | `app/` (don't move) |

### Never-Move List

`package.json`, `tsconfig.json`, `next.config.*`, `tailwind.config.*`, `postcss.config.*`, `eslint.config.*`, `prettier.config.*`, `.env*`, `.gitignore`, `middleware.ts`, `instrumentation.ts`, `next-env.d.ts`, `Dockerfile`, `docker-compose.*`, `README.md`, `LICENSE`

### Test Convention

Tests go adjacent to their subject: `{name}.test.ts` next to `{name}.ts`. Or in a `__tests__/` subfolder within the same directory.

---

## Vite SPA

> Load when `frontend: "vite"`

### Target Structure

```
project-root/
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable UI primitives
│   │   └── features/             # Feature-specific components
│   │       └── {feature}/
│   ├── pages/                    # Page-level components (route targets)
│   │   └── {PageName}.tsx
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities, helpers
│   ├── types/                    # TypeScript types
│   ├── services/                 # API clients
│   ├── config/                   # App constants, env config
│   ├── routes.tsx                # Route definitions
│   ├── app.tsx                   # App shell (providers, router)
│   └── main.tsx                  # Entry point (ReactDOM.render)
├── public/                       # Static assets
├── index.html                    # Vite HTML entry
└── vite.config.ts
```

### Classification Rules

Same as Next.js, except:
- **Page components** (full-page views rendered by routes): `src/pages/`
- **No `app/` directory** — Vite SPA uses `src/` as the source root
- **No server actions** — everything is client-side
- **Route definitions**: single `src/routes.tsx` or `src/router.ts`

### Never-Move List

`package.json`, `tsconfig.json`, `vite.config.*`, `tailwind.config.*`, `postcss.config.*`, `eslint.config.*`, `.env*`, `index.html`, `public/`

### Test Convention

Tests in `src/__tests__/` or co-located as `{name}.test.ts`.

---

## Expo (React Native)

> Load when `frontend: "expo"`

### Target Structure

```
project-root/
├── app/                          # Expo Router file-based routes
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── index.tsx
│   │   └── settings.tsx
│   └── _layout.tsx               # Root layout
├── components/
│   ├── ui/                       # Reusable UI (themed Text, Button, etc.)
│   └── features/                 # Feature-specific components
│       └── {feature}/
├── hooks/                        # Custom hooks
├── lib/                          # Utilities, helpers
├── types/                        # TypeScript types
├── services/                     # API clients, storage wrappers
├── constants/                    # Colors, spacing, app constants
│   └── theme.ts
├── assets/                       # Images, fonts, animations
│   ├── images/
│   └── fonts/
└── app.json                      # Expo config (MUST stay at root)
```

### Classification Rules

Same as Next.js, plus:
- **Constants** (colors, spacing, dimensions, app config): `constants/`
- **Assets** (images, fonts, Lottie files): `assets/`
- **Native modules** (if any): `modules/` or `native/`
- Route files (`_layout.tsx`, screen files in `app/`): don't move

### Never-Move List

`package.json`, `tsconfig.json`, `app.json`, `app.config.*`, `babel.config.js`, `metro.config.js`, `eas.json`, `.env*`, `assets/` (if at root)

### Test Convention

Tests in `__tests__/` at project root, or co-located as `{name}.test.ts`.

---

## Angular

> Load when `frontend: "angular"`

### Target Structure

```
project-root/
├── src/
│   └── app/
│       ├── core/                 # Singleton services, guards, interceptors
│       │   ├── services/
│       │   ├── guards/
│       │   └── interceptors/
│       ├── shared/               # Reusable components, directives, pipes
│       │   ├── components/
│       │   ├── directives/
│       │   └── pipes/
│       ├── features/             # Feature modules
│       │   └── {feature}/
│       │       ├── components/
│       │       ├── services/
│       │       ├── models/
│       │       └── {feature}.module.ts
│       ├── models/               # Shared interfaces/types
│       ├── app.component.ts
│       ├── app.module.ts
│       └── app-routing.module.ts
```

### Classification Rules

| Pattern | Target |
|---------|--------|
| `@Injectable()` singleton (app-wide) | `core/services/` |
| `@Injectable()` feature-specific | `features/{feature}/services/` |
| `CanActivate`, `CanDeactivate` guards | `core/guards/` |
| `HttpInterceptor` | `core/interceptors/` |
| Reusable `@Component` (generic) | `shared/components/` |
| Feature-specific `@Component` | `features/{feature}/components/` |
| `@Pipe` | `shared/pipes/` |
| `@Directive` | `shared/directives/` |
| Interfaces/types | `models/` or `features/{feature}/models/` |

### Naming Convention

Angular enforces kebab-case with type suffix: `user-card.component.ts`, `auth.guard.ts`, `api.service.ts`, `format-date.pipe.ts`

### Never-Move List

`package.json`, `tsconfig.json`, `angular.json`, `tailwind.config.*`, `.env*`, `src/main.ts`, `src/index.html`, `src/styles.*`

---

## Python (FastAPI)

> Load when Python is detected with FastAPI

### Target Structure

```
project-root/
├── app/
│   ├── __init__.py
│   ├── main.py                   # FastAPI app creation, middleware
│   ├── routers/                  # Route handlers (one per domain)
│   │   ├── __init__.py
│   │   └── {entity}.py           # e.g., buildings.py, users.py
│   ├── models/                   # SQLAlchemy / ORM models
│   │   ├── __init__.py
│   │   └── {entity}.py
│   ├── schemas/                  # Pydantic request/response models
│   │   ├── __init__.py
│   │   └── {entity}.py
│   ├── services/                 # Business logic layer
│   │   ├── __init__.py
│   │   └── {entity}_service.py
│   ├── dependencies/             # Dependency injection (get_db, get_current_user)
│   │   └── __init__.py
│   ├── core/                     # Config, security, database setup
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   └── utils/                    # Helper functions
│       └── __init__.py
├── tests/
│   ├── conftest.py
│   └── test_{entity}.py
├── alembic/                      # Migrations (if using Alembic)
├── pyproject.toml                # Project config
└── requirements.txt              # Dependencies (if not using pyproject.toml)
```

### Classification Rules

| Pattern | Target |
|---------|--------|
| `@router.get/post/put/delete`, `APIRouter()` | `routers/` |
| `class {Name}(Base)` (SQLAlchemy) or `class {Name}(Model)` | `models/` |
| `class {Name}(BaseModel)` (Pydantic) | `schemas/` |
| Business logic functions, no route decorators | `services/` |
| `Depends()` providers | `dependencies/` |
| Config, env loading, database session | `core/` |
| Pure helper functions | `utils/` |

### Naming Convention

Python: `snake_case` for all files and directories.

### Never-Move List

`pyproject.toml`, `setup.py`, `setup.cfg`, `requirements.txt`, `Makefile`, `Dockerfile`, `docker-compose.*`, `.env*`, `alembic.ini`, `conftest.py` (at root)

---

## Go

> Load when Go is detected

### Target Structure

```
project-root/
├── cmd/                          # Entry points
│   └── server/
│       └── main.go
├── internal/                     # Private application code
│   ├── handler/                  # HTTP handlers
│   │   └── {entity}.go
│   ├── service/                  # Business logic
│   │   └── {entity}.go
│   ├── repository/               # Data access (DB queries)
│   │   └── {entity}.go
│   ├── model/                    # Domain types and structs
│   │   └── {entity}.go
│   ├── middleware/                # HTTP middleware
│   │   └── auth.go
│   └── config/                   # App configuration
│       └── config.go
├── pkg/                          # Public packages (if any, use sparingly)
├── api/                          # OpenAPI specs, proto files
├── migrations/                   # SQL migrations
└── go.mod
```

### Classification Rules

| Pattern | Target |
|---------|--------|
| `func main()` | `cmd/{app}/` |
| HTTP handler functions (`w http.ResponseWriter, r *http.Request`) | `internal/handler/` |
| Business logic (no HTTP types) | `internal/service/` |
| Database queries (`sql.DB`, `sqlx`, `pgx`) | `internal/repository/` |
| Struct definitions, domain types | `internal/model/` |
| `func(next http.Handler) http.Handler` pattern | `internal/middleware/` |
| Config loading (`os.Getenv`, `viper`) | `internal/config/` |

### Naming Convention

Go: `snake_case` for filenames. Directories are single lowercase words.

### Never-Move List

`go.mod`, `go.sum`, `Makefile`, `Dockerfile`, `docker-compose.*`, `.env*`, `README.md`

---

## Monorepo (Top-Level)

> Load when `monorepo: true` — applies to the root structure only. Individual apps within the monorepo follow their own framework conventions above.

### Target Structure

```
project-root/
├── apps/                         # Applications (each has its own framework structure)
│   ├── web/                      # Next.js, Vite, Angular, etc.
│   ├── mobile/                   # Expo, React Native
│   └── api/                      # Backend service
├── packages/                     # Shared packages
│   ├── shared/                   # Shared types, utilities
│   │   ├── src/
│   │   └── package.json
│   ├── ui/                       # Shared component library
│   │   ├── src/
│   │   └── package.json
│   └── config/                   # Shared configs (tsconfig, eslint)
│       └── package.json
├── services/                     # Backend microservices (if applicable)
├── turbo.json                    # Turborepo config
├── pnpm-workspace.yaml           # Workspace config
└── package.json                  # Root package.json
```

### Rules

- Each app in `apps/` follows its own framework convention (Next.js, Expo, etc.)
- Shared code goes in `packages/`, not duplicated across apps
- Cross-app imports use package names (`@scope/shared`), never relative paths
- The code-organizer processes each app root independently — never moves files between apps

---

## Universal Never-Move List

These files must NEVER be moved regardless of framework:

```
package.json, package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb,
tsconfig.json, jsconfig.json,
.gitignore, .git/, .github/,
.env, .env.local, .env.development, .env.production,
Dockerfile, docker-compose.yml, docker-compose.yaml,
Makefile, Procfile,
README.md, LICENSE, CHANGELOG.md,
.prettierrc*, .editorconfig,
.husky/, .lint-staged*,
node_modules/, dist/, build/, .next/, __pycache__/, vendor/, target/,
.claude/, .cursor/, .vscode/
```
