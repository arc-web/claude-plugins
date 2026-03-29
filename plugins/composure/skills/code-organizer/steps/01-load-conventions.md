# Step 1: Load Conventions

Read `conventions.md` from this skill's directory (co-located alongside this SKILL.md).

Extract **only** the section matching the detected stack:
- `frontend: "nextjs"` → load the Next.js section
- `frontend: "vite"` → load the Vite SPA section
- `frontend: "expo"` → load the Expo section
- `frontend: "angular"` → load the Angular section
- Python detected → load the Python FastAPI section
- Go detected → load the Go section
- `monorepo: true` → also load the Monorepo section for top-level structure

This keeps token cost low — one framework's conventions, not all of them.

---

**Next:** Read `steps/02-analyze.md`
