# Testbench Testing References — Index

> **Barrel index.** Load docs based on detected test framework from `.claude/no-bandaids.json` or `.claude/testbench.json`.

## Always Load

| File | Contains |
|------|----------|
| [general/testing-principles.md](general/testing-principles.md) | Universal testing principles — AAA pattern, mock boundaries, naming, pyramid |

## Load by Framework

| Detected | Load | Contains |
|----------|------|----------|
| Vitest | [vitest/patterns.md](vitest/patterns.md) | Mocking, async, snapshots, MSW, TanStack Query, Supabase |
| Jest | [jest/patterns.md](jest/patterns.md) | Jest equivalents — same patterns, different API surface |
| Playwright | [playwright/patterns.md](playwright/patterns.md) | E2E selectors, auth state, network mocking, mobile, CI |
| pytest | [pytest/patterns.md](pytest/patterns.md) | Fixtures, parametrize, markers, async, database testing |

**Load ONLY what matches the detected stack.** Don't load Playwright docs for a project without E2E tests. Don't load pytest for a TypeScript-only project.

## Templates

Templates live in `../templates/{framework}/`. Each is a commented-out skeleton — uncomment and fill in. Available:

| Framework | Template | For |
|-----------|----------|-----|
| Vitest | `vitest/component.test.ts` | React/JSX component tests |
| Vitest | `vitest/hook.test.ts` | TanStack Query hook tests |
| Vitest | `vitest/utility.test.ts` | Pure function / utility tests |
| Playwright | `playwright/page.test.ts` | Page-level E2E tests |
| pytest | `pytest/test_module.py` | Python module tests |
