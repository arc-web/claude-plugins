# Hook Scope Propagation

**Scenario**: Hook catches a pattern in one method, but identical patterns exist in sibling methods
**Stack**: Python DNS module with 4 methods sharing the same anti-pattern
**Plugin features**: Composure PostToolUse hooks (pattern detection)

---

## The Problem

A PostToolUse hook fires when Claude edits a method containing `except Exception:`. Claude fixes that method. But the same file has three other methods with the exact same anti-pattern - and the hook only fired on the method Claude touched.

The result: a partial fix. One method gets logging, three don't.

---

## What Happened

### The File

```python
# dns_module.py - 4 methods, same pattern

class DNSModule:
    def _resolve(domain, rdtype):    # <- prompt targeted this one
        except (dns.exception.DNSException, Exception):
            return []

    def _get_mx(domain):             # <- same pattern, not mentioned
        except (dns.exception.DNSException, Exception):
            return []

    def _get_spf(domain):            # <- same pattern, not mentioned
        except (dns.exception.DNSException, Exception):
            pass

    def _get_dkim(self, domain):     # <- same pattern, not mentioned
        except (dns.exception.DNSException, Exception):
            continue
```

### The Outcome

Claude fixed all four because it made a judgment call. But this was luck, not process. A different prompt or a different model temperature could have produced a fix to `_resolve` only.

---

## The Gap

Current hook behavior:

```
1. Claude edits _resolve
2. Hook detects "except Exception" in the diff
3. Hook flags the pattern
4. Claude fixes _resolve
```

What's missing:

```
5. Hook scans the rest of the file for the same pattern
6. Hook reports: "Same pattern found on lines 47, 58, 72"
7. Claude fixes all instances
```

---

## Proposed Convention: Sibling Scan

When a PostToolUse hook detects a pattern in a diff, it should also scan the full file for the same pattern and report all matches - not just the one in the diff.

### Implementation Sketch

```bash
# In the PostToolUse hook, after detecting the pattern in the diff:
# 1. Get the full file path from the tool call
# 2. Grep the entire file for the same pattern
# 3. Report all matches, not just the diff match

pattern="except.*Exception"
file_path="$1"

# Current: only checks the diff
# Proposed: check the full file
all_matches=$(grep -n "$pattern" "$file_path")
diff_matches=$(echo "$diff" | grep "$pattern")

if [ "$(echo "$all_matches" | wc -l)" -gt "$(echo "$diff_matches" | wc -l)" ]; then
    echo "[hook] Found same pattern on other lines: $all_matches"
    echo "[hook] Consider fixing all instances, not just the edited one."
fi
```

### Expected Behavior

```
[composure] PostToolUse: broad except Exception detected in diff (line 36)
[composure] Same pattern found in 3 other locations:
  - line 47: except (dns.exception.DNSException, Exception):
  - line 58: except (dns.exception.DNSException, Exception):
  - line 72: except (dns.exception.DNSException, Exception):
[composure] Recommend fixing all instances for consistency.
```

---

## Why This Matters

Partial fixes are worse than no fix in some ways - they create inconsistency. If `_resolve` logs errors but `_get_mx` silently swallows them, debugging becomes harder because you expect logging everywhere but only get it sometimes.

The hook already knows the pattern. Scanning the file costs milliseconds. The information helps Claude make complete fixes without relying on prompt quality or model judgment.

---

## The Pattern

1. **Hook detects in diff** - the current behavior, keep it
2. **Hook scans the file** - new step, find siblings
3. **Hook reports all matches** - give Claude the full picture
4. **Claude fixes all** - consistent, complete fix

This turns hooks from "catch what changed" into "catch what matters" - a small expansion in scope with a large improvement in fix completeness.

---

**Docs:** [composure-pro.com](https://composure-pro.com)

*Based on real-world hook interaction with Composure v1.2.71*
