# Annotated Prompt Examples

**Scenario**: Real prompts used with Composure hooks, graded and revised
**Purpose**: Show what the user actually typed, what happened, and how to improve
**Plugin features**: PostToolUse hooks, Sentinel, Shipyard

---

## Why This Exists

The other use-cases show outcomes: "12 minutes to fix 4 CVEs", "2.6x faster than Plan Mode." But they don't show what the user typed to get there.

Prompts are the input to the system. Hook quality and prompt quality are multipliers of each other. This doc shows both sides.

---

## Example 1: Broad Exception Refactor

### The Prompt (Grade: B+)

```
In ~/agents/domain-auditor/dns_module.py, the _resolve method catches
a broad "except Exception:" on line 36. Refactor it to also return
error context so callers know what failed. Keep the except Exception
handler but add logging inside it.
```

### What Fired

- PostToolUse hook detected `except Exception:` in the edited code
- Hook narrowed it to `dns.exception.DNSException` (removed broad catch)

### What Claude Did

- Added `logger.debug` to `_resolve` with domain, record type, and error
- Also fixed `_get_mx`, `_get_spf`, `_get_dkim` (judgment call, not prompted)
- Defaulted to `debug` level (not specified in prompt)

### Grade Breakdown

| Criterion | Score | Note |
|-----------|-------|------|
| File targeting | A | Exact path + line number |
| Action clarity | B | "Refactor" is clear but "return error context" contradicts "add logging" |
| Scope | C | Named one method, file had four with the same pattern |
| Specificity | B | No log level, no mechanism specified |
| Meta separation | C | "Why it works" section mixed into instructions |

### Revised Prompt (Grade: A)

```
In ~/agents/domain-auditor/dns_module.py, all four DNS methods
(_resolve, _get_mx, _get_spf, _get_dkim) catch broad except Exception.
Add logger.debug inside each handler that logs the domain, record type,
and exception message. Keep the existing exception types and return
values unchanged.
```

**Changes**: named all methods, specified log level, removed contradiction, dropped meta-commentary.

---

## Example 2: Vulnerability Resolution

### The Prompt (Grade: A)

```
Run them
```

### Context

GitHub had just flagged 4 vulnerabilities. Two audit skills (Sentinel, Shipyard) were mentioned in the prior message.

### Why It Scores High

Two words. But the context made it unambiguous:
- "Them" clearly referred to the two audit skills just discussed
- No contradictions possible in a 2-word prompt
- Scope was implicit (fix whatever the audits find)

### When This Fails

Without the prior context, "run them" is meaningless. Short prompts work when the conversation provides the specificity. They fail as first messages.

---

## Example 3: Blueprint Request (Hypothetical)

### The Prompt (Grade: D)

```
Plan the auth refactor
```

### Problems

| Issue | Why it matters |
|-------|---------------|
| Which auth? | Could be middleware, OAuth, session, JWT |
| "Plan" is ambiguous | Blueprint? Plan Mode? A markdown doc? |
| No constraints | Timeline? Breaking changes OK? Backwards compat? |
| No scope | One service? All services? Just the API layer? |

### Revised Prompt (Grade: A-)

```
/composure:blueprint for replacing the Express auth middleware in
api/src/middleware/auth.ts. The new middleware must use the session
token format from the compliance spec (see docs/compliance/session-spec.md).
Breaking changes to internal APIs are OK. External API contracts must
not change.
```

**Changes**: named the skill, specified the file, referenced the constraint source, defined the change boundary.

---

## The Grading Rubric

| Criterion | Weight | What "A" looks like |
|-----------|--------|-------------------|
| **File targeting** | 20% | Exact path, line number if relevant |
| **Action clarity** | 25% | One verb, one mechanism, no contradictions |
| **Scope** | 20% | Every target named, or explicit "all in file" |
| **Specificity** | 20% | Log level, error handling, return types stated |
| **Meta separation** | 15% | No "why the hook works" mixed into instructions |

### Score Ranges

- **A (90-100)**: Claude can execute without any guesses
- **B (80-89)**: One guess required, low risk of wrong choice
- **C (70-79)**: Multiple guesses, moderate risk
- **D (60-69)**: Ambiguous enough that different runs produce different results
- **F (<60)**: Claude will ask for clarification or produce wrong output

---

## Key Takeaway

The best prompts aren't long - they're precise. "Run them" (2 words, grade A) beats a 50-word prompt with contradictions (grade B+). Length doesn't correlate with quality. Specificity does.

---

**Docs:** [composure-pro.com](https://composure-pro.com)

*Based on real-world prompt analysis with Composure v1.2.71*
