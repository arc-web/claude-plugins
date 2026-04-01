# Webhook Patterns

Stack-agnostic patterns for receiving and processing webhook events from third-party services.

## Signature Verification

**ALWAYS verify webhook signatures before processing events.** An unverified webhook endpoint is an unauthenticated POST endpoint — anyone can send fake events.

### HMAC-SHA256 (Most Common)

The standard pattern used by Stripe, GitHub, Square, Twilio, and most modern services.

**How it works:**
1. Provider sends event payload + signature header + timestamp
2. You reconstruct the signed payload: `{timestamp}.{raw_body}`
3. Compute HMAC: `HMAC-SHA256(webhook_secret, signed_payload)`
4. Compare your computed signature with the received signature

**Critical implementation details:**
- **Use timing-safe comparison** — Standard string equality (`==`) is vulnerable to timing attacks. Use:
  - TypeScript: `crypto.timingSafeEqual()`
  - Python: `hmac.compare_digest()`
  - Go: `hmac.Equal()`
  - Rust: `constant_time_eq`
  - Ruby: `Rack::Utils.secure_compare()`
- **Use the raw request body** — Parse the body BEFORE your framework's JSON middleware. Many frameworks parse JSON automatically, which changes the byte representation. Verify against raw bytes.
- **Validate timestamp** — Reject events with timestamps older than 5 minutes to prevent replay attacks.

### Provider-Specific Variations

| Provider | Signature header | Payload format | Notes |
|---|---|---|---|
| Stripe | `Stripe-Signature` | `t={timestamp},v1={sig}` | Timestamp + HMAC in one header |
| GitHub | `X-Hub-Signature-256` | `sha256={sig}` | HMAC of raw body |
| Square | `X-Square-Hmacsha256-Signature` | Base64 HMAC | Uses notification URL in signed content |
| Twilio | `X-Twilio-Signature` | Base64 HMAC-SHA1 | Signs URL + sorted POST params |
| SendGrid | `X-Twilio-Email-Event-Webhook-Signature` | ECDSA | Uses public key, not shared secret |

**If using an Official SDK**: Most SDKs provide a `constructEvent()` or `verifySignature()` helper. Use it — it handles the nuances.

## Idempotency

Webhook providers may send the same event multiple times (at-least-once delivery). Your handler must be idempotent.

**Pattern: Event ID tracking**
1. Each webhook event has a unique ID (e.g., `evt_xxx`, `delivery_id`)
2. Before processing, check if this ID has been seen before
3. If seen: return 200 (acknowledge) but skip processing
4. If new: process the event, then store the ID

**Storage options:**
- Database table: `webhook_events(id, event_id, event_type, processed_at)`
- Redis: `SET webhook:{event_id} 1 EX 86400` (TTL: 24 hours)
- In-memory cache: Only for single-instance deployments

**Important**: Store the event ID AFTER successful processing, not before. If processing fails, you want the retry to succeed.

## Event Routing

Dispatch events to appropriate handlers based on event type.

**Pattern: Type-based dispatch**
```
receive webhook event
  verify signature (reject if invalid)
  check idempotency (skip if duplicate)
  route by event.type:
    "payment_intent.succeeded" → handlePaymentSuccess(event.data)
    "payment_intent.failed"    → handlePaymentFailure(event.data)
    "customer.created"         → handleCustomerCreated(event.data)
    unknown                    → log warning, return 200
```

**Rules:**
- Return 200 for ALL valid webhook events, even unhandled types — returning 4xx/5xx causes the provider to retry
- Log unhandled event types (useful for discovering new events you should handle)
- Process asynchronously if the handler is slow — return 200 immediately, process in background
- Set a reasonable timeout — webhook providers typically wait 5-30 seconds for a response

## Error Recovery

**Retry semantics:**
- Most providers retry failed deliveries (non-2xx response) with exponential backoff
- Retry windows vary: Stripe retries for 72 hours, GitHub for 48 hours
- If your handler is temporarily down, events will be redelivered

**Dead letter handling:**
- For critical events (payments, user deletion), log failures to a dead letter table
- Monitor failed webhook processing separately from general application errors
- Implement manual replay capability for dead-lettered events

## Security Checklist

- [ ] Signature verification before ANY processing
- [ ] Timing-safe comparison for signature check
- [ ] Raw body used for verification (not parsed JSON)
- [ ] Timestamp validation (reject events > 5 minutes old)
- [ ] Webhook secret stored in environment variable
- [ ] HTTPS endpoint only (no plain HTTP)
- [ ] Idempotency check for duplicate events
- [ ] Return 200 for all valid events (even unhandled types)
- [ ] Async processing for slow handlers
