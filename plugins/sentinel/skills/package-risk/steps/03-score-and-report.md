# Step 3: Score and Report

Compute a risk score from the behavior scan results and generate a structured report.

## Scoring Model

```
Risk score = sum of (signal_weight x min(occurrence_count, cap))

Weights and caps:
  High signal (1-8):    3 points per occurrence, capped at 15 per signal
  Medium signal (9-14): 1 point per occurrence, capped at 5 per signal
  Low signal (15):      0.5 points per occurrence, capped at 3 per signal
```

Maximum theoretical score: (8 signals x 15) + (6 signals x 5) + (1 signal x 3) = 153

## Risk Rating

| Score | Rating | Meaning |
|-------|--------|---------|
| 0-5 | Low | Typical utility package. No unusual behavior detected. |
| 6-15 | Medium | Some behavioral signals present. Review flagged patterns. |
| 16-30 | High | Multiple suspicious signals. Manual audit recommended before use in production. |
| 31+ | Critical | Strong indicators of malicious or heavily obfuscated behavior. Do NOT use without thorough review. |

## Report Format

```
Package Risk Analysis: <package-name>@<version>

Risk Score: <score> (<RATING>)
Location: <PACKAGE_DIR>
Files scanned: <FILE_COUNT>

Signals Found:
  HIGH  Dynamic code execution (3 occurrences)
     lib/core.js:45    eval(decodedPayload)
     lib/core.js:89    new Function('return ' + expr)
     lib/utils.js:12   vm.runInNewContext(code)

  HIGH  Network calls (2 occurrences)
     lib/telemetry.js:8   https.request(opts, callback)
     lib/update.js:15     fetch('https://registry.example.com/...')

  MEDIUM  Environment variable access (5 occurrences)
     lib/config.js:3   process.env.HOME
     lib/config.js:7   process.env.NODE_ENV
     lib/config.js:11  process.env.API_KEY
     lib/auth.js:2     process.env.SECRET
     lib/auth.js:9     process.env.TOKEN

  LOW  Encoding operations (1 occurrence)
     lib/utils.js:30   Buffer.from(data, 'base64')

No signals: Postinstall scripts, DNS/Socket, Crypto mining, Obfuscated code,
            File system writes, Prototype manipulation, Binary code,
            Global pollution, Minified source, Suspicious URLs

Recommendation: <contextual recommendation based on findings>
```

## Contextual Recommendations

Generate a recommendation based on the specific signals found:

- **eval + network**: "eval() combined with network calls is a common supply chain attack pattern. Verify these are legitimate before using in production."
- **postinstall + network**: "Postinstall script with network access is the exact vector used in the Axios RAT (2026-03-31). Review the install script carefully."
- **obfuscated + network**: "Obfuscated code making network calls is a strong indicator of malicious behavior. Manual audit required."
- **env vars + network**: "Accessing environment variables and making network calls suggests potential secret exfiltration. Review what data is being sent."
- **child_process + network**: "Shell execution with network calls enables remote code execution. High-risk combination."
- **only env vars**: "Environment variable access is common in configuration libraries. Verify the specific variables being read are expected."
- **only encoding**: "Encoding operations alone are low risk. Common in data processing libraries."
- **no signals**: "No suspicious behavioral signals detected. Package appears to be a standard utility."

If the risk score is High or Critical, also suggest:

```
Next steps:
  - Review the flagged source files manually
  - Check the package's GitHub repository for recent maintainer changes
  - Verify the publisher on npm: npm view <package> maintainers
  - Consider using an alternative if the signals cannot be justified
  - Run /sentinel:audit-deps to check for known CVEs
```

## Clean Package Output

If zero signals are found:

```
Package Risk Analysis: <package-name>@<version>

Risk Score: 0 (LOW)
Location: <PACKAGE_DIR>
Files scanned: <FILE_COUNT>

No suspicious behavioral signals detected.
This package appears to be a standard utility with no unusual runtime behavior.
```

---

**Done.**
