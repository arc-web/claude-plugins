# Prompt Quality Linting

**Scenario**: User submits a prompt with contradictory instructions that Claude must silently resolve
**Stack**: Python DNS module refactor
**Plugin features**: Proposed - prompt-submit hook for quality checks

---

## The Problem

Hooks catch code quality issues after Claude writes code. But some problems start earlier - in the prompt itself. Contradictory instructions, missing scope, and ambiguous action verbs force Claude to guess, and guesses aren't reliable.

---

## What Happened

### The Prompt

```
Refactor it to also return error context so callers know what failed.
Keep the except Exception handler but add logging inside it.
```

Two instructions that conflict:

| Instruction | Implication |
|-------------|-------------|
| "Return error context" | Change the return type - callers need error info |
| "Keep the handler, add logging" | Don't change the return type - just log internally |

Claude chose logging (the simpler interpretation). That happened to be correct. But on a different day, Claude might have introduced a `Tuple[List[str], Optional[str]]` return type that breaks every caller.

---

## The Proposal: Prompt-Submit Hook

A hook that runs when the user submits a prompt, before Claude starts working. Zero token cost. Catches issues at the source.

### What It Checks

**Contradictory directives:**
```
Pattern: "return X" + "keep Y unchanged" where X requires changing Y
Flag: "Prompt contains potentially contradictory instructions about
       return values. Clarify: should the return type change or stay
       the same?"
```

**Missing scope:**
```
Pattern: names a single method but the file has siblings with the
         same pattern
Flag: "Prompt targets _resolve but _get_mx, _get_spf, _get_dkim
       have the same pattern. Add 'fix all' or 'fix only _resolve'
       to clarify scope."
```

**Ambiguous action verbs:**
```
Pattern: "return error context" (how? logging? new return type?
         exception? callback?)
Flag: "Specify mechanism: logger.debug(), raise, return tuple, or
       other?"
```

**Missing specifics:**
```
Pattern: "add logging" without level
Flag: "Specify log level: debug, info, warning, or error?"
```

### Implementation Sketch

```bash
#!/bin/bash
# prompt-quality-check hook
# Runs on prompt submit, before Claude processes

prompt="$1"

# Check for contradictory return instructions
if echo "$prompt" | grep -qi "return.*context\|return.*error" && \
   echo "$prompt" | grep -qi "keep.*handler\|keep.*unchanged\|keep.*same"; then
    echo "[prompt-lint] Possible contradiction: 'return context' vs 'keep unchanged'"
    echo "[prompt-lint] Clarify: should the return type change?"
fi

# Check for missing scope
if echo "$prompt" | grep -qP "the \w+ method" && \
   ! echo "$prompt" | grep -qi "all\|every\|each"; then
    echo "[prompt-lint] Prompt names a single method."
    echo "[prompt-lint] If siblings have the same pattern, add scope guidance."
fi

# Check for missing log level
if echo "$prompt" | grep -qi "add logging\|add.*log" && \
   ! echo "$prompt" | grep -qi "debug\|info\|warning\|error\|critical"; then
    echo "[prompt-lint] No log level specified. Default will be used."
    echo "[prompt-lint] Consider specifying: debug, info, warning, or error."
fi
```

---

## Why This Fits Composure's Philosophy

Composure hooks run outside the LLM. Zero token cost. The prompt-quality hook follows the same principle:

| Current hooks | Proposed hook |
|---------------|---------------|
| PostToolUse - catches bad code after writing | PromptSubmit - catches bad instructions before writing |
| Costs 0 tokens | Costs 0 tokens |
| Prevents bad code from persisting | Prevents bad code from being written |

Catching a contradiction at prompt time saves an entire edit-hook-fix cycle.

---

## The Pattern

1. **Shift left** - catch issues at the prompt, not the code
2. **Zero cost** - shell script, no LLM calls
3. **Advisory, not blocking** - flag issues, don't reject prompts
4. **Specific suggestions** - "specify log level" not "prompt unclear"

The hook doesn't need to understand the code. It pattern-matches the prompt text for known ambiguity signatures. Simple heuristics, high value.

---

**Docs:** [composure-pro.com](https://composure-pro.com)

*Proposed feature for Composure v1.3.x*
