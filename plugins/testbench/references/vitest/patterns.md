# Vitest Patterns

> Load when `vitest` is detected in `devDependencies` or `vitest.config.ts` exists.

---

## Configuration

### Minimal vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '*.config.*', '**/*.d.ts'],
      thresholds: { statements: 80, branches: 75, functions: 80, lines: 80 },
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

### Setup file (vitest.setup.ts)

```typescript
import '@testing-library/jest-dom/vitest'
afterEach(() => { vi.restoreAllMocks() })
```

---

## Mocking

### vi.mock() — module-level mock (hoisted to top of file)

```typescript
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: { getSession: vi.fn() },
  },
}))
```

Use `vi.hoisted()` when mock factories need shared references:

```typescript
const { mockFetch } = vi.hoisted(() => ({ mockFetch: vi.fn() }))
vi.mock('@/lib/api', () => ({ fetchUsers: mockFetch }))
```

### vi.fn() — standalone mock function

```typescript
const onSubmit = vi.fn()
render(<Form onSubmit={onSubmit} />)
await user.click(screen.getByRole('button', { name: /submit/i }))
expect(onSubmit).toHaveBeenCalledOnce()
```

### Mock return values

```typescript
mockFn.mockReturnValue('static')
mockFn.mockResolvedValue({ data: [] })
mockFn.mockRejectedValue(new Error('fail'))
mockFn.mockResolvedValueOnce({ data: 'first' }).mockRejectedValueOnce(new Error('second'))
```

---

## Common Assertions

```typescript
expect(result).toBe(42)                    // strict ===
expect(result).toEqual({ a: 1 })           // deep equality
expect(value).toBeTruthy()
expect(value).toBeNull()
expect(list).toHaveLength(3)
expect(list).toContain('item')
expect(obj).toHaveProperty('nested.key', 'value')
expect(fn).toHaveBeenCalledWith('arg1')
expect(() => riskyFn()).toThrow('message')

// DOM (with @testing-library/jest-dom)
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveTextContent('Hello')
expect(element).toBeDisabled()
```

---

## Async Testing

```typescript
it('fetches data', async () => {
  const data = await fetchUsers()
  expect(data).toHaveLength(5)
})

await expect(fetchUsers()).resolves.toHaveLength(5)
await expect(fetchUsers()).rejects.toThrow('Network error')
```

---

## Snapshot Testing

Prefer inline snapshots (live in the test file, easier to review):

```typescript
expect(result).toMatchInlineSnapshot(`{ "displayName": "Alice", "isAdmin": true }`)
```

---

## Test Lifecycle

```typescript
beforeAll(async () => { /* once before all */ })
afterAll(async () => { /* once after all */ })
beforeEach(() => { vi.clearAllMocks() })  // preferred for mock resets
afterEach(() => { vi.restoreAllMocks() })
```

## Test Filtering

```typescript
describe.only('focused group', () => { ... })
it.skip('disabled test', () => { ... })
test.todo('write this later')
```

---

## MSW for API Mocking

Mock at the network level so your actual fetch/axios calls execute normally:

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

// Override per test:
it('handles error', async () => {
  server.use(http.get('/api/users', () => HttpResponse.json(null, { status: 500 })))
})
```

---

## Testing React Hooks

```typescript
import { renderHook, waitFor, act } from '@testing-library/react'

it('increments counter', () => {
  const { result } = renderHook(() => useCounter())
  act(() => { result.current.increment() })
  expect(result.current.count).toBe(1)
})
```

---

## Supabase Mocking Pattern

```typescript
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1' } } }, error: null,
      }),
    },
  },
}))

// Chain builder for query mocking
function mockSupabaseQuery(data: unknown[], error: null | Error = null) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: data[0] ?? null, error }),
    then: vi.fn((cb) => cb({ data, error })),
  }
}
```

---

## TanStack Query Testing

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
}

it('fetches data', async () => {
  const { result } = renderHook(() => useProjects(), { wrapper: createWrapper() })
  expect(result.current.isLoading).toBe(true)
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data).toEqual([{ id: 1, name: 'Project A' }])
})
```
