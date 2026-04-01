# Integration Error Handling

Stack-agnostic patterns for handling errors from third-party service integrations.

## Custom Error Class

Every integration should define a typed error that captures service-specific context.

**Required properties:**

| Property | Type | Purpose |
|---|---|---|
| `message` | string | Human-readable error description |
| `statusCode` | number | HTTP status code from the service |
| `service` | string | Service name (e.g., "stripe", "twilio") |
| `retryable` | boolean | Whether this error can be retried |
| `details` | object/null | Raw error payload from the service |

**Standard error mapping:**

| Status | Category | Retryable? | Action |
|---|---|---|---|
| 400 | Bad Request | No | Fix the request (validation error) |
| 401 | Unauthorized | No | Re-authenticate or check credentials |
| 403 | Forbidden | No | Check permissions/scopes |
| 404 | Not Found | No | Resource doesn't exist |
| 409 | Conflict | Maybe | Check idempotency key, may be duplicate |
| 422 | Unprocessable | No | Fix the request payload |
| 429 | Rate Limited | Yes | Wait and retry (respect Retry-After) |
| 500 | Server Error | Yes | Retry with backoff |
| 502 | Bad Gateway | Yes | Retry with backoff |
| 503 | Unavailable | Yes | Retry with backoff |
| 504 | Gateway Timeout | Yes | Retry with backoff |
| Network error | Connection | Yes | Retry with backoff |
| Timeout | Timeout | Yes | Retry with backoff (maybe increase timeout) |

## Retry with Exponential Backoff + Jitter

Retries prevent transient failures from becoming permanent. Jitter prevents thundering herd when multiple clients retry simultaneously.

**Algorithm:**
```
max_retries = 3
base_delay = 1000ms

for attempt in 1..max_retries:
  try:
    return make_request()
  catch error:
    if not error.retryable:
      throw error
    if attempt == max_retries:
      throw error

    delay = base_delay * (2 ^ (attempt - 1))
    jitter = random(0, delay * 0.5)
    wait(delay + jitter)
```

**Retry schedule (default):**
| Attempt | Base delay | With jitter range |
|---|---|---|
| 1 | 1s | 1.0s - 1.5s |
| 2 | 2s | 2.0s - 3.0s |
| 3 | 4s | 4.0s - 6.0s |

**Respect Retry-After header:**
If the service returns a `Retry-After` header (common with 429 responses), use that value instead of the calculated backoff. It may be:
- A number of seconds: `Retry-After: 30`
- An HTTP date: `Retry-After: Thu, 01 Apr 2026 20:00:00 GMT`

## Circuit Breaker

Prevents cascading failures when a service is down. Stop sending requests that will fail.

**States:**
```
CLOSED (normal operation)
  → Count consecutive failures
  → If failures >= threshold (default: 5): switch to OPEN

OPEN (circuit tripped)
  → Reject all requests immediately (throw CircuitOpenError)
  → After reset_timeout (default: 30s): switch to HALF_OPEN

HALF_OPEN (testing recovery)
  → Allow ONE request through
  → If it succeeds: switch to CLOSED, reset failure count
  → If it fails: switch back to OPEN, restart timeout
```

**When to use:**
- Service has intermittent outages
- Your application can degrade gracefully without the integration
- You want fast failure instead of waiting for timeouts

**When NOT to use:**
- Single critical request (payment processing) — retry is better
- Low-traffic integration (circuit never trips on occasional failures)

## Rate Limit Handling

Many services enforce rate limits. Exceeding them causes 429 errors and may result in temporary bans.

**Detection:**
- HTTP 429 status code
- `Retry-After` header (seconds to wait)
- `X-RateLimit-Remaining` header (requests remaining in window)
- `X-RateLimit-Reset` header (when the window resets)

**Prevention strategies:**
1. **Respect rate limit headers** — If `X-RateLimit-Remaining` is low, slow down proactively
2. **Queue requests** — For bulk operations, queue requests and process at the rate limit
3. **Batch when possible** — Use batch/bulk endpoints if the API offers them
4. **Cache responses** — Don't re-fetch data that hasn't changed

## User-Friendly Error Messages

Map technical API errors to messages users can act on:

| Technical error | User-facing message |
|---|---|
| 401 Unauthorized | "Integration credentials are invalid. Please reconfigure." |
| 403 Forbidden | "Insufficient permissions. Check the API key's access scope." |
| 429 Rate Limited | "Too many requests. Automatically retrying in {N} seconds." |
| 500 Server Error | "{Service} is experiencing issues. Will retry automatically." |
| Network Error | "Cannot reach {Service}. Check your internet connection." |
| Timeout | "{Service} is responding slowly. Request will be retried." |

Never expose raw API error details to end users — log them for debugging, show actionable messages.
