# Playwright E2E Patterns

> Load when `@playwright/test` is detected in `devDependencies` or `playwright.config.ts` exists.

---

## Configuration

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## Selectors — Priority Order

```typescript
// 1. Role-based (best — matches accessibility tree)
page.getByRole('button', { name: /submit/i })
page.getByRole('heading', { level: 1 })

// 2. Label/placeholder (good — user-visible)
page.getByLabel('Email address')
page.getByPlaceholder('Search...')
page.getByText('Welcome back')

// 3. Test ID (acceptable — when no semantic selector works)
page.getByTestId('sidebar-nav')

// 4. CSS/XPath (last resort — brittle)
page.locator('.sidebar > .nav-item:first-child')
```

---

## Assertions

```typescript
await expect(page).toHaveTitle(/Dashboard/i)
await expect(page).toHaveURL('/dashboard')
await expect(page.getByRole('button')).toBeVisible()
await expect(page.getByRole('button')).toBeEnabled()
await expect(page.getByRole('button')).toHaveText('Submit')
await expect(page.getByText('Error')).not.toBeVisible()
await expect(page.getByRole('list')).toHaveCount(5)
```

---

## Authentication — storageState

Save auth state once, reuse across tests:

```typescript
// auth.setup.ts
import { test as setup, expect } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL('/dashboard')
  await page.context().storageState({ path: '.auth/user.json' })
})
```

```typescript
// In playwright.config.ts projects:
{ name: 'setup', testMatch: /.*\.setup\.ts/ },
{
  name: 'chromium',
  use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
  dependencies: ['setup'],
},
```

---

## Waiting

Playwright auto-waits before interactions. Explicit waits only when needed:

```typescript
await page.getByRole('button').click()           // auto-waits for visible + enabled
await page.waitForURL('/dashboard')               // explicit URL wait
await page.waitForResponse('**/api/users')        // wait for API call
await page.getByTestId('spinner').waitFor({ state: 'hidden' })
```

---

## Network Mocking

```typescript
await page.route('**/api/users', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Alice' }]),
  })
})

// Error simulation
await page.route('**/api/users', (route) => {
  route.fulfill({ status: 500, body: 'Internal Server Error' })
})
```

---

## Mobile Testing

```typescript
test.use({ ...devices['iPhone 15'] })

test('mobile nav shows hamburger', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) {
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
    await page.getByRole('button', { name: /menu/i }).click()
    await expect(page.getByRole('navigation')).toBeVisible()
  } else {
    await expect(page.getByRole('navigation')).toBeVisible()
  }
})
```

---

## Fixture Pattern (preferred over Page Objects)

```typescript
import { test as base } from '@playwright/test'

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
})

test('user logs in', async ({ loginPage }) => {
  await loginPage.login('test@test.com', 'pass')
})
```

---

## CLI Quick Reference

```bash
npx playwright test                          # Run all
npx playwright test tests/e2e/login.spec.ts  # Specific file
npx playwright test --project=chromium       # Specific project
npx playwright test --headed                 # See the browser
npx playwright test --debug                  # Step debugger
npx playwright show-report                   # View HTML report
npx playwright test --update-snapshots       # Update visual baselines
```
