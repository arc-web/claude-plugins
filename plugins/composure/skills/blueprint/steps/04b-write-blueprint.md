# Step 4b: Write Blueprint File

Read `BLUEPRINT-TEMPLATE.md` in this skill's directory for the full template structure, section rules, and classification matrix.

Create `tasks-plans/blueprints/` directory if needed.

## File Path

`tasks-plans/blueprints/{slug}-{YYYY-MM-DD}.md`

Where `{slug}` is a 2-4 word kebab-case summary (e.g., `user-roles-2026-03-28.md`).

## Writing Process

Work through each section defined in `BLUEPRINT-TEMPLATE.md`:

1. **Context** — what and why, link to research if applicable
2. **Related Code** — from step 02 graph scan
3. **Decisions** — from user answers in steps 01-03
4. **Impact Analysis** — from step 03
5. **Files to Touch** — every file to create/edit/delete
6. **Preservation Boundaries** — what must NOT change (skip for bug-fix)
7. **Implementation Spec** — per-file bullet specs with exact changes
8. **Risks** — with mitigations
9. **Verification** — concrete test scenarios
10. **Checklist** — 1:1 mapping to Implementation Spec

If while writing the Implementation Spec you realize you need information you don't have (a function signature you haven't read, a type you need to check), read the source now. Do NOT write vague specs — go back to the code.

---

**Next:** Read `04c-handoff.md`
