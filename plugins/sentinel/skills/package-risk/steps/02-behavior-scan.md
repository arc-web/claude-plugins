# Step 2: Behavior Scan

Run pattern matching for 15 risk signals across all source files in the package directory. Each signal has a grep pattern, severity weight, and contextual explanation.

## Signal Table

Run each signal's grep pattern against the package source. Collect matches with file path and line number.

### High-severity signals (weight: 3)

**Signal 1 — Dynamic code execution**

```bash
grep -rn 'eval(' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' --include='*.ts'
grep -rn 'new Function(' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' --include='*.ts'
grep -rn 'vm\.runIn' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' --include='*.ts'
```

Why it matters: eval() and Function() execute arbitrary strings as code — the primary vector for injecting malicious payloads at runtime.

**Signal 2 — Network calls**

```bash
grep -rn 'http\.request\|https\.request\|http\.get\|https\.get' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
grep -rn "fetch(" "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
grep -rn 'XMLHttpRequest' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
grep -rn 'net\.connect\|net\.createConnection' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
```

Why it matters: Unexpected network calls in utility packages indicate data exfiltration or command-and-control communication.

**Signal 3 — Child process execution**

```bash
grep -rn "child_process\|require('child_process')\|from 'child_process'" "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' --include='*.ts'
grep -rn 'exec(\|execSync(\|spawn(\|spawnSync(\|execFile(' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' --include='*.ts'
```

Why it matters: Shell execution enables arbitrary command running, file system access, and lateral movement.

**Signal 4 — Obfuscated code (high entropy)**

```bash
# Hex-encoded strings (>20 chars of hex)
grep -rn '\\x[0-9a-fA-F]\{2\}\\x[0-9a-fA-F]\{2\}\\x[0-9a-fA-F]\{2\}' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'

# Very long strings (>200 chars on one line, typical of obfuscation)
grep -rn '.\{200,\}' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' | head -5
```

Why it matters: Legitimate code is readable. Obfuscated code hides intent — a hallmark of malware.

**Signal 5 — Postinstall/preinstall scripts**

```bash
jq -r '.scripts.postinstall // empty, .scripts.preinstall // empty, .scripts.install // empty' "$PACKAGE_DIR/package.json" 2>/dev/null
```

Why it matters: Install scripts run automatically with full system access. The Axios RAT (2026-03-31) used this exact vector.

**Signal 6 — DNS/Socket operations**

```bash
grep -rn 'dns\.resolve\|dns\.lookup\|dgram\.\|net\.Socket' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
```

Why it matters: DNS and raw socket access enables covert data channels that bypass HTTP monitoring.

**Signal 7 — Suspicious URLs**

```bash
# Hardcoded IPs (not localhost)
grep -rn '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' | grep -v '127\.0\.0\.1\|0\.0\.0\.0\|localhost'

# URL shorteners
grep -rn 'bit\.ly\|tinyurl\|goo\.gl\|t\.co\|is\.gd' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'

# Non-HTTPS URLs (data exfil)
grep -rn "http://" "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' | grep -v 'localhost\|127\.0\.0\.1\|http://www\.'
```

Why it matters: Hardcoded IPs and URL shorteners are common C2 server indicators. Non-HTTPS enables interception.

**Signal 8 — Crypto mining indicators**

```bash
grep -rn 'stratum\|cryptonight\|coinhive\|minero\|hashrate' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
```

Why it matters: Cryptojacking is a common monetization strategy for compromised packages.

### Medium-severity signals (weight: 1)

**Signal 9 — Environment variable access**

```bash
grep -rn 'process\.env' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' --include='*.ts'
```

Why it matters: Reading environment variables can expose API keys, tokens, and other secrets. Expected in config libraries, suspicious in utilities.

**Signal 10 — File system writes**

```bash
grep -rn 'fs\.writeFile\|fs\.appendFile\|fs\.createWriteStream\|writeFileSync' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
```

Why it matters: Writing files enables persistence (dropping payloads) and data exfiltration (writing to shared locations).

**Signal 11 — Prototype manipulation**

```bash
grep -rn '__proto__\|Object\.defineProperty\|Object\.setPrototypeOf' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
```

Why it matters: Prototype pollution enables property injection attacks across the application.

**Signal 12 — Binary/native code**

```bash
# .node binary files
find "$PACKAGE_DIR" -name '*.node' -o -name '*.so' -o -name '*.dylib' -o -name '*.dll' 2>/dev/null

# node-gyp build scripts
grep -rn 'node-gyp\|prebuild\|prebuildify' "$PACKAGE_DIR/package.json" 2>/dev/null
```

Why it matters: Pre-compiled binaries cannot be audited by reading source — they could contain anything.

**Signal 13 — Global scope pollution**

```bash
grep -rn 'global\.\|globalThis\.' "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs' | grep -v 'globalThis\.process\|global\.process'
```

Why it matters: Global assignments create side effects that persist across modules — can be used to intercept other packages.

**Signal 14 — Minified source (no readable source available)**

```bash
# Files over 10KB that are a single line (typical of minified/obfuscated code)
find "$PACKAGE_DIR" -name '*.js' -size +10k -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -le 3 ] && echo "$1 ($lines lines, $(du -h "$1" | cut -f1))"' _ {} \;
```

Why it matters: Publishing only minified code prevents source review. Legitimate packages include readable source or point to a readable repo.

### Low-severity signals (weight: 0.5)

**Signal 15 — Encoding operations**

```bash
grep -rn "Buffer\.from(\|atob(\|btoa(" "$PACKAGE_DIR" --include='*.js' --include='*.mjs' --include='*.cjs'
```

Why it matters: Base64 encoding is commonly used to hide payload strings and evade pattern matching. Normal in many contexts but worth noting.

## Python-specific patterns

For Python packages, adjust grep patterns:

```bash
# eval/exec
grep -rn 'eval(\|exec(' "$PACKAGE_DIR" --include='*.py'

# subprocess
grep -rn 'subprocess\|os\.system\|os\.popen' "$PACKAGE_DIR" --include='*.py'

# network
grep -rn 'urllib\|requests\.\|httpx\.\|socket\.' "$PACKAGE_DIR" --include='*.py'

# env vars
grep -rn 'os\.environ\|os\.getenv' "$PACKAGE_DIR" --include='*.py'

# obfuscation
grep -rn 'base64\.b64decode\|codecs\.decode\|marshal\.loads\|compile(' "$PACKAGE_DIR" --include='*.py'
```

## Collecting Results

For each signal that has matches, record:
- Signal number and name
- Severity (High/Medium/Low)
- Match count
- Up to 5 representative file:line matches with the matching line content

Cap output at 5 matches per signal to prevent flooding on large packages.

---

**Next:** Read `steps/03-score-and-report.md`
