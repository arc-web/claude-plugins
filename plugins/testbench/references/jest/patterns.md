# Jest Patterns

> Load when `jest` is detected in `devDependencies` or `jest.config.*` exists (and Vitest is NOT present).

> **Note:** Jest and Vitest share ~90% of their API surface. This doc covers Jest-specific differences. For shared concepts (AAA, mock boundaries, naming), see `general/testing-principles.md`.

---

## Configuration

### jest.config.ts (Next.js)

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
}

export default createJestConfig(config)
```

### Setup file (jest.setup.ts)

```typescript
import '@testing-library/jest-dom'
```

---

## Key Differences from Vitest

| Feature | Vitest | Jest |
|---------|--------|------|
| Mock module | `vi.mock()` | `jest.mock()` |
| Mock function | `vi.fn()` | `jest.fn()` |
| Spy | `vi.spyOn()` | `jest.spyOn()` |
| Fake timers | `vi.useFakeTimers()` | `jest.useFakeTimers()` |
| Clear mocks | `vi.clearAllMocks()` | `jest.clearAllMocks()` |
| Restore mocks | `vi.restoreAllMocks()` | `jest.restoreAllMocks()` |
| Hoisting | `vi.hoisted()` | Not needed (jest.mock auto-hoists) |
| Inline snapshots | `toMatchInlineSnapshot()` | `toMatchInlineSnapshot()` (same) |
| Config | `vitest.config.ts` | `jest.config.ts` |
| Runner | Vite | Node / ts-jest / SWC |

---

## Mocking

### jest.mock() — module-level mock

```typescript
// Auto-mock entire module
jest.mock('@/lib/api')

// Manual mock with factory
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: { getSession: jest.fn() },
  },
}))
```

**Jest auto-hoists `jest.mock()` calls.** Unlike Vitest, you don't need `vi.hoisted()`. But you still can't reference variables defined in the test file inside the factory — use `jest.fn()` and configure in `beforeEach`.

### jest.fn() and jest.spyOn()

```typescript
const callback = jest.fn()
callback.mockReturnValue('value')
callback.mockResolvedValue({ data: [] })
callback.mockImplementation((x) => x * 2)

const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
```

---

## Fake Timers

```typescript
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

it('debounces input', () => {
  const callback = jest.fn()
  const debounced = debounce(callback, 300)

  debounced('a')
  debounced('ab')
  debounced('abc')

  expect(callback).not.toHaveBeenCalled()

  jest.advanceTimersByTime(300)

  expect(callback).toHaveBeenCalledOnce()
  expect(callback).toHaveBeenCalledWith('abc')
})
```

---

## Async Testing

Same patterns as Vitest:

```typescript
it('fetches data', async () => {
  const data = await fetchUsers()
  expect(data).toHaveLength(5)
})

it('rejects on error', async () => {
  await expect(fetchUsers()).rejects.toThrow('Network error')
})
```

---

## Snapshot Testing

```typescript
it('renders correctly', () => {
  const { container } = render(<Button label="Click" />)
  expect(container.firstChild).toMatchSnapshot()
})

// Inline (preferred)
it('formats output', () => {
  expect(formatDate(new Date('2025-01-01'))).toMatchInlineSnapshot(`"Jan 1, 2025"`)
})

// Update snapshots: npx jest --updateSnapshot
```

---

## MSW with Jest

Same setup as Vitest — MSW is framework-agnostic:

```typescript
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'Alice' }])
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## TanStack Query with Jest

Same wrapper pattern as Vitest:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

it('loads data', async () => {
  const { result } = renderHook(() => useProjects(), {
    wrapper: createWrapper(),
  })
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data).toBeDefined()
})
```

---

## Common Gotchas

### 1. ESM modules in Jest
Jest runs in CJS by default. If a dependency ships ESM-only, add it to `transformIgnorePatterns`:

```typescript
// jest.config.ts
transformIgnorePatterns: [
  'node_modules/(?!(esm-only-package|another-esm-package)/)',
]
```

### 2. act() warnings
Wrap state updates in `act()`:

```typescript
import { act } from '@testing-library/react'

await act(async () => {
  fireEvent.click(button)
})
```

### 3. SWC vs ts-jest vs Babel
- **Next.js projects**: Use `next/jest` (uses SWC automatically)
- **Non-Next TypeScript**: Use `@swc/jest` for speed, `ts-jest` for accuracy
- **Avoid Babel** unless you have a specific need
