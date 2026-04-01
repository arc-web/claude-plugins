# Step 3: Generate HTML Report

Call the `generate_audit_html` MCP tool. It reads the stored findings and scores from graph.db, fills the HTML templates, and writes the report.

```
generate_audit_html({
  audit_run_id: <run_id from Step 1>
})
```

The tool returns:
- `output_path` — path to the generated HTML file
- `overall_grade`, `overall_score`
- `summary` — one-line confirmation

Then open the report:
```bash
open <output_path>
```

**No background agent needed.** The MCP tool does the template assembly in <1 second — zero tokens, no waiting.

If the tool returns an error about missing templates, the plugin installation may be incomplete.

---

**Next:** Read `steps/04-summary-and-remediation.md`
