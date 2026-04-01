# Step 4a: Load Architecture Docs

**Skip if `--quick` or classification is `bug-fix`.**

Read `.claude/no-bandaids.json` for stack info. Load docs selectively:

| Classification | What to load |
|---|---|
| `new-feature` | Full `/app-architecture` skill (all phases) |
| `enhancement` | Only the category matching affected files (frontend/ or backend/) |
| `refactor` | `frontend/core.md` for decomposition rules + affected category |
| `migration` | Query Context7 for the target version's migration guide |

---

**Next:** Read `04b-write-blueprint.md`
