# Integration Testing Patterns

Stack-agnostic strategies for testing third-party integrations. Tests should NEVER hit real APIs — mock at the network level.

## Testing Stack by Language

| Language | HTTP Mocking | Contract Testing | Test Runner | Key Package |
|---|---|---|---|---|
| TypeScript | MSW v2 | Pact | Vitest / Jest | `msw`, `@pact-foundation/pact` |
| Python | `responses` / `respx` | Pact Python | pytest | `responses`, `pact-python` |
| Go | `net/http/httptest` | Pact Go | `go test` + testify | `github.com/pact-foundation/pact-go` |
| Rust | `wiremock` | wiremock assertions | `cargo test` | `wiremock` |
| Ruby | `webmock` + VCR | Pact Ruby | RSpec / Minitest | `webmock`, `pact` |

## Network-Level Mocking

**Principle**: Mock at the network level, not by patching HTTP clients. This ensures your actual HTTP client code (headers, serialization, error handling) is exercised.

### TypeScript: MSW v2

MSW intercepts requests at the network level using Service Workers (browser) or class extensions (Node.js).

**Setup:**
- `setupServer()` for Node.js test environment (Vitest/Jest)
- Define request handlers: `http.get(url, resolver)`, `http.post(url, resolver)`
- Handlers receive the full request and return mock responses
- Reset handlers between tests to prevent state leakage

**Advantages over mocking `fetch`/`axios`:**
- Tests your actual HTTP client code (headers, auth, serialization)
- Same handlers work in browser tests and Node.js tests
- Supports HTTP, GraphQL, and WebSocket

### Python: responses / respx

- `responses`: Patches `requests` library (use for `requests`-based clients)
- `respx`: Patches `httpx` library (use for `httpx`/async clients)
- Both intercept at the library level and return mock responses

### Go: httptest

- `httptest.NewServer()` creates a real HTTP server on localhost
- Point your client at the test server's URL
- Full HTTP stack exercised (no mocking at all — real server, real client)
- Preferred approach in Go: test servers over mocks

## Contract Testing with Pact

Consumer-driven contract testing verifies that your integration expectations match what the provider actually delivers.

**How it works:**
1. **Consumer** (your code) defines expectations: "When I call GET /users/123, I expect a response with `{id, name, email}`"
2. **Pact** records these expectations as a contract (JSON file)
3. **Provider** (the third-party service) verifies the contract: "Yes, GET /users/123 returns `{id, name, email}`"
4. **CI/CD** runs both sides: consumer publishes contracts, provider verifies them

**When to use:**
- Your integration is critical (payments, auth, data sync)
- The provider has a Pact broker (many do)
- You want to catch breaking API changes before they hit production

**When to skip:**
- Simple integrations (one or two endpoints)
- Provider doesn't support Pact verification
- Internal APIs where you control both sides

### MSW + Pact Bridge (TypeScript)

`@pactflow/pact-msw-adapter` automatically generates Pact contracts from your MSW handlers.

**Workflow:**
1. Write MSW handlers for your integration tests (you already have these)
2. The adapter records each MSW interaction as a Pact interaction
3. Pact contract files are generated automatically
4. Publish to Pact broker for provider verification

This eliminates writing separate Pact consumer tests — your MSW-based unit tests double as contract definitions.

## Test Categories

### 1. Client Unit Tests
- Successful request → correct response parsing
- Auth headers sent correctly
- Error response → IntegrationError with correct fields
- Rate limit (429) → retry behavior triggered
- Network timeout → graceful failure
- Malformed response → clear error, not crash

### 2. Auth Flow Tests
- API key injected in correct location (header/query)
- OAuth token exchange with mocked auth endpoint
- Token refresh when expired
- Missing credentials → meaningful error message

### 3. Webhook Tests
- Valid signature → event processed
- Invalid signature → request rejected (401/403)
- Expired timestamp → request rejected
- Duplicate event ID → skipped (idempotency)
- Unknown event type → logged, 200 returned

### 4. Integration Smoke Tests (optional)
- Use the service's sandbox/test mode (e.g., Stripe test keys)
- Run against real API in a controlled environment
- Not for CI — for pre-deployment validation only

## Test Fixtures

**Environment setup:**
- Use fake/test credentials (never real keys in tests)
- Many services provide test mode: Stripe (`sk_test_`), Twilio (test credentials), SendGrid (sandbox)
- Mock environment variables in test setup, not in source code

**Response fixtures:**
- Store mock response bodies in fixture files (JSON) for complex responses
- Keep fixtures next to test files or in a `__fixtures__/` directory
- Update fixtures when the API changes (contract tests catch this automatically)
