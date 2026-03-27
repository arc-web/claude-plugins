# Universal Testing Principles

> These apply to every framework, every language. Load this always.

---

## 1. Test Structure: Arrange-Act-Assert (AAA)

Every test has three phases. Keep them visually separated.

```
// Arrange — set up inputs, mocks, state
const user = createTestUser({ role: 'admin' })

// Act — call the thing under test
const result = canDeleteProject(user, project)

// Assert — verify the outcome
expect(result).toBe(true)
```

**One act per test.** If you have two Act sections, you have two tests.

---

## 2. What to Test

Test **behavior**, not implementation.

**Good — tests what the user sees:**
```
it('shows error message when email is invalid', ...)
it('redirects to dashboard after login', ...)
it('returns sorted results by date', ...)
```

**Bad — tests how the code works internally:**
```
it('calls setState with error object', ...)
it('triggers useEffect on mount', ...)
```

### Test the public API
- Exported functions, components, hooks
- HTTP endpoints and their responses
- User-visible behavior (clicks, text, navigation)

### Do NOT test
- **Framework behavior** -- don't test that useState works
- **Type definitions** -- TypeScript validates those at compile time
- **Constants/config** -- `expect(API_URL).toBe(...)` tests nothing
- **Third-party libraries** -- they have their own tests
- **Private functions** -- test them through what uses them

---

## 3. Mock Boundaries

Mock at the **system boundary**. Never mock internal functions.

### Mock these (external):
- Database queries (Supabase, Prisma, SQLAlchemy)
- HTTP APIs (fetch, axios to external services)
- File system, time, randomness, environment variables

### Do NOT mock (internal):
- Utility functions in your own codebase
- Internal state management, private methods
- Other components in the same module

Mocking internals makes tests brittle. Refactoring should not break tests.

---

## 4. Test Naming

Describe **what behavior is expected**, not what function is called.

Pattern: `[subject] [condition] [expected result]`

```
'user with admin role can delete any project'
'returns empty array when no results match filter'
'shows loading spinner while data is fetching'
```

---

## 5. Test Isolation

Each test must be independent. No shared mutable state.

- Reset mocks in `beforeEach`, not manually
- Don't rely on test execution order
- Don't share mutable variables between tests
- Each test creates its own data

**Red flag:** A test passes alone but fails in the suite (or vice versa).

---

## 6. Test File Size

**Max 150 lines per test file.** Matches Composure decomposition limits.

Split by behavior when larger:
- `UserProfile.test.ts` -> `UserProfile.render.test.ts` + `UserProfile.interactions.test.ts`
- `auth.test.ts` -> `auth.login.test.ts` + `auth.logout.test.ts`

---

## 7. Coverage Is Not Quality

100% coverage with bad assertions is worse than 70% with good ones.

**Meaningless:** `render(<Component />)` with no assertions.
**Meaningful:** `expect(screen.getByText('Alice')).toBeInTheDocument()`

Reasonable thresholds: statements 80%, branches 75%, functions 80%, lines 80%. These are floors, not goals.

---

## 8. The Testing Pyramid

```
        /  E2E  \          Few — slow, expensive, high confidence
       /----------\
      / Integration \      Some — test module boundaries
     /----------------\
    /    Unit Tests     \  Many — fast, cheap, focused
```

Invest most in unit tests. Use E2E for critical happy paths only.

---

## 9. When AI-Generated Tests Fail

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Cannot find module` | Guessed import path | Read the actual file path |
| `not a function` | Mocked wrong shape | Check real module exports |
| `Expected 1, received undefined` | Stale assertion | Run code first, then assert |
| Timeout on async | Missing await or wrong query | Use `findBy` not `getBy` |
| Mock not called | Mock target mismatch | Mock the consumer's import |
| Snapshot mismatch | Generated from imagination | Delete, regenerate, review |

**The fix is always: read the source code before writing the test.**

---

## 10. Test Maintenance

- Delete tests for deleted features
- Update tests when behavior changes (don't just skip)
- Refactor tests like production code
- Fix flaky tests immediately -- they erode trust

---

## Quick Reference

| Principle | One-liner |
|-----------|-----------|
| AAA | Arrange, Act, Assert -- one act per test |
| Behavior | Test what it does, not how |
| Boundaries | Mock at system edges, not internals |
| Naming | Describe the expected behavior |
| Isolation | Each test is independent |
| Size | Max 150 lines per test file |
| Coverage | Confidence over numbers |
| Pyramid | Many unit, some integration, few E2E |
| AI tests | Read source before writing tests |
| Maintenance | Dead and flaky tests must go |
