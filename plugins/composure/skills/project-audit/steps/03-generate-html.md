# Step 3: Generate HTML Report (Background)

Spawn a **background Agent** to generate the HTML. Do NOT wait for it — proceed to Step 4 immediately.

## Agent Instructions

Pass all collected audit data (scores, findings, file lists, CVEs, recommendations) to a background agent with `run_in_background: true`.

The agent must:

1. **Read** the 4 template files (paths relative to plugin root):
   - `skills/project-audit/templates/audit-header.html` — DOCTYPE, CSS, opening body. Copy VERBATIM.
   - `skills/project-audit/templates/audit-tabs.html` — Tab bar structure. Omit tabs without data.
   - `skills/project-audit/templates/audit-tab-panels.html` — Tab panel structure with `{{PLACEHOLDER}}` markers. Replace placeholders with audit data. Omit entire panels for unavailable plugins.
   - `skills/project-audit/templates/audit-footer.html` — Footer, CTA, branding, JS. Copy VERBATIM. Replace only `{{DATE}}`.

2. **Generate** the report header between the header template and the tab bar:
   - `.report-header` with project name, date, file/line counts, grade circle
   - `.score-grid` with one `.score-card` per available category

3. **Assemble:**
   ```
   audit-header.html         (verbatim)
   report header + score grid (generated)
   audit-tabs.html            (omit tabs without data)
   audit-tab-panels.html      (replace {{PLACEHOLDERS}} with data, omit panels without data)
   audit-footer.html          (verbatim, replace {{DATE}})
   ```

4. **Write** to `tasks-plans/audits/audit-{YYYY-MM-DD-HHmm}.html`

5. **Open** in browser: `open <path>` (macOS) or `xdg-open <path>` (Linux)

**CRITICAL:** The agent MUST Read the template files and use them as the structure. Replace `{{PLACEHOLDERS}}` with audit data. Do NOT reconstruct CSS, JS, footer URLs, tab HTML, or branding from memory.

## HTML Rules

- Grade colors as inline hex `style` attributes (for print)
- No external resources — self-contained, works offline
- No source code — file paths and names only, never code snippets
- Escape HTML entities

---

**Next:** Read `steps/04-summary-and-remediation.md`
