# Authentication Patterns

Stack-agnostic patterns for authenticating with third-party services. Each pattern describes the FLOW, not the language-specific implementation.

## API Key Authentication

The simplest auth pattern. A static key sent with every request.

**Flow:**
1. Obtain API key from the service's dashboard
2. Store in environment variable (e.g., `STRIPE_API_KEY`)
3. Inject into every request via header or query parameter

**Injection methods:**
- **Header** (most common): `Authorization: Bearer {key}` or custom header like `X-API-Key: {key}`
- **Query parameter** (less common, less secure): `?api_key={key}`

**Security:**
- Never hardcode keys in source code
- Never commit keys to version control
- Use `.env` files for local development (add to `.gitignore`)
- Use secrets managers in production (AWS Secrets Manager, Vault, Doppler)

## Bearer Token Authentication

A token (often JWT) sent in the Authorization header. May require refresh.

**Flow:**
1. Obtain token (via login, API key exchange, or OAuth)
2. Send `Authorization: Bearer {token}` with every request
3. If token expires, refresh it (if refresh token available) or re-authenticate

**Token refresh pattern:**
```
Before each request:
  If token expires within 60 seconds:
    Call refresh endpoint with refresh_token
    Store new access_token + refresh_token
    Use new access_token for the request
  Else:
    Use current access_token
```

**On 401 response:**
```
Attempt token refresh once
  If refresh succeeds: retry the original request
  If refresh fails: throw AuthenticationError (user must re-authenticate)
```

## OAuth 2.0 (Authorization Code + PKCE)

The standard for user-authorized access to third-party accounts.

**Flow:**
1. **Authorization request**: Redirect user to provider's auth page
   - Include: `client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`, `code_challenge` (PKCE)
2. **User authorizes**: Provider redirects back with `code` and `state`
3. **Token exchange**: POST to provider's token endpoint
   - Include: `grant_type=authorization_code`, `code`, `redirect_uri`, `client_id`, `client_secret`, `code_verifier` (PKCE)
4. **Receive tokens**: `access_token`, `refresh_token`, `expires_in`
5. **Use access token**: `Authorization: Bearer {access_token}` on API requests
6. **Refresh when expired**: POST to token endpoint with `grant_type=refresh_token`

**PKCE (Proof Key for Code Exchange):**
- Generate random `code_verifier` (43-128 chars)
- Compute `code_challenge = base64url(sha256(code_verifier))`
- Send `code_challenge` in authorization request
- Send `code_verifier` in token exchange
- Required for public clients (SPAs, mobile apps), recommended for all

**Token storage:**
- Server-side: encrypted in database or session store
- Never store tokens in localStorage (XSS risk)
- Use httpOnly secure cookies if browser-based

**Security:**
- Validate `state` parameter to prevent CSRF
- Use PKCE to prevent authorization code interception
- Store `client_secret` server-side only (never in frontend code)
- Scope to minimum required permissions

## Basic Authentication

Username and password encoded in the request header.

**Flow:**
1. Combine credentials: `{username}:{password}`
2. Base64 encode: `base64({username}:{password})`
3. Send header: `Authorization: Basic {encoded}`

**Security:**
- Only use over HTTPS (credentials are base64-encoded, not encrypted)
- Some APIs use API key as username with empty password (e.g., Stripe: `sk_test_xxx:`)
- Store credentials in environment variables, never hardcode

## Credential Storage Summary

| Environment | Method | Example |
|---|---|---|
| Local development | `.env` file (gitignored) | `STRIPE_API_KEY=sk_test_xxx` |
| CI/CD | Pipeline secrets | GitHub Actions secrets, GitLab CI variables |
| Production | Secrets manager | AWS Secrets Manager, HashiCorp Vault, Doppler |
| Per-tenant (SaaS) | Encrypted database column | AES-256-GCM encrypted, key in secrets manager |
