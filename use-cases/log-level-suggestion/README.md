# Context-Aware Log Level Suggestions

**Scenario**: Hook catches a broad exception handler, Claude adds logging but picks an arbitrary log level
**Stack**: Python DNS module with exception handlers that need logging
**Plugin features**: Proposed enhancement to PostToolUse broad-except hook

---

## The Problem

The broad-except hook fires. Claude adds logging. But what level?

```python
# Claude's default choice - but is it right?
except dns.exception.DNSException as e:
    logger.debug("DNS lookup failed for %s: %s", domain, e)
```

`debug` is probably correct here - DNS NXDOMAIN is an expected failure in an enumeration tool. But Claude didn't reason about that. It picked `debug` because the prompt didn't specify and `debug` is the least disruptive default.

In a different context - say, a database write failing - `debug` would be dangerously wrong. That needs `error` or `warning` at minimum.

---

## The Current Flow

```
1. Claude adds: except Exception as e: logger.debug(...)
2. Hook fires: "broad except Exception detected"
3. Hook narrows the exception type
4. Log level? Nobody checks.
```

The hook fixes the exception type but ignores the log level. Both matter.

---

## Proposed Enhancement

After the hook detects a broad except and Claude adds logging, the hook also evaluates whether the log level matches the context.

### Heuristics

| Context Signal | Suggested Level | Reasoning |
|----------------|----------------|-----------|
| Method name contains `get`, `fetch`, `resolve`, `lookup` | `debug` | Read operations - failure is often expected |
| Method name contains `write`, `save`, `update`, `delete` | `warning` or `error` | Write operations - failure means data loss risk |
| Exception type is `TimeoutError`, `ConnectionError` | `warning` | Infrastructure issues - worth alerting on |
| Exception type is `ValueError`, `KeyError` | `error` | Logic bugs - should not happen in normal flow |
| Catch-all `Exception` (if still present) | `warning` | Unknown failures deserve visibility |
| Inside a retry loop | `debug` on retries, `warning` on final failure | Expected to fail transiently |

### Implementation Sketch

```bash
#!/bin/bash
# Enhancement to the broad-except PostToolUse hook

file_path="$1"
diff_content="$2"

# Detect logging in the new code
if echo "$diff_content" | grep -q "logger\.\(debug\|info\|warning\|error\)"; then
    level=$(echo "$diff_content" | grep -oP 'logger\.\K(debug|info|warning|error)')
    method=$(echo "$diff_content" | grep -B 20 "logger\." | grep -oP 'def \K\w+')

    # Check if level matches context
    if echo "$method" | grep -qiE "write|save|update|delete|create|insert" && \
       [ "$level" = "debug" ]; then
        echo "[hook] logger.debug in a write-path method ($method)."
        echo "[hook] Consider logger.warning or logger.error for write failures."
    fi

    if echo "$method" | grep -qiE "get|fetch|resolve|lookup|check" && \
       [ "$level" = "error" ]; then
        echo "[hook] logger.error in a read-path method ($method)."
        echo "[hook] If failure is expected, logger.debug may be more appropriate."
    fi
fi
```

### Expected Output

For the DNS module (correctly using debug):
```
[composure] Log level check: logger.debug in _resolve (read-path) - level OK
```

For a hypothetical database write (incorrectly using debug):
```
[composure] Log level check: logger.debug in save_record (write-path)
[composure] Consider logger.warning or logger.error for write failures.
```

---

## Why This Matters

Log levels determine what shows up in monitoring. Wrong levels have real consequences:

| Scenario | Wrong Level | Impact |
|----------|-------------|--------|
| DB write fails | `debug` | Nobody sees it. Data silently lost. |
| DNS lookup misses | `error` | Alert fatigue. Team ignores real errors. |
| Auth check fails | `debug` | Security event hidden from monitoring. |
| Cache miss | `warning` | Log noise. Obscures actual warnings. |

The hook already has the context to make this judgment: it knows the method name, the exception type, and the log statement. One additional check turns a "you have logging" into "you have the right logging."

---

## The Pattern

1. **Hook already fires** - no new trigger needed
2. **Read the method name** - cheap heuristic for read vs write path
3. **Compare against level** - flag mismatches
4. **Advisory output** - suggest, don't override

This extends the broad-except hook from "fix the exception type" to "fix the exception handling" - a natural evolution that catches a class of bugs that are hard to find in review.

---

**Docs:** [composure-pro.com](https://composure-pro.com)

*Proposed enhancement for Composure v1.3.x*
