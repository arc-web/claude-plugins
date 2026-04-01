# Step 7: Security Crossover (Sentinel Integration)

Cross-reference the PR's changed files against open Sentinel security findings. Also detect newly added dependencies that should be vetted.

**Skip this step silently if `tasks-plans/tasks.md` does not exist AND the PR does not modify `package.json`.**

## 7a. Check Open Security Findings

If `tasks-plans/tasks.md` exists:

1. Read the file
2. Extract entries tagged with `[SECURITY]`, `[CVE-*]`, `[BANNED]`, or `[KNOWN-CVE]`
3. For each entry, extract the file path (e.g., `src/api/users.ts:45`)
4. Match against `CHANGED_FILES`

If matches found, collect them for the Security Context section in step 08.

Format:

```
- **[P0:Public] [CVE-2024-XXXXX]** `lodash@4.17.20` in `src/api/users.ts` — Prototype Pollution
- **[P1:Auth] [SECURITY]** SQL injection in `src/api/orders.ts:45` — CWE-89
```

## 7b. Detect New Dependencies

If `package.json` is in `CHANGED_FILES`:

```bash
git diff <BASE_BRANCH>...HEAD -- package.json
```

Parse the diff to find newly added entries in `dependencies` or `devDependencies`.

For each new dependency:
- Record the package name and version
- Flag for security review: "Run `/sentinel:audit-deps` to check for CVEs"
- Flag for behavior review: "Run `/sentinel:package-risk <package>` to inspect behavior"

## 7c. Check Against Banned List

If new dependencies were detected and `sentinel/data/banned-packages.json` is accessible:

Read the banned list and cross-reference new dependency names. If any new dependency is on the banned list, flag it as CRITICAL in the review output.

## 7d. No Findings

If no security findings match the changed files AND no new dependencies detected, skip the Security Context section entirely in step 08. Do not output an empty section.

Store all findings for use in step 08.

---

**Next:** Read `steps/08-generate-output.md`
