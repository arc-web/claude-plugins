# Step 5: Hand Off to design-forge

The research file at `.claude/research/{topic}-{date}.md` is the handoff. When the user runs `/design-forge` next, it reads the most recent research file for context. No copy-paste needed — the file IS the bridge.

The **Classification block** in the report is the structured bridge to the Design Forge taxonomy. It tells `/design-forge` which industry, platform, and style files to load — enabling automatic pattern routing instead of generic recommendations.

## Conversation Output

In the conversation, output ONLY:

1. Classification summary (platform + industry + style in one line)
2. 3-5 line summary of the recommendation
3. Key technology choice with one-line rationale
4. Path to the full report
5. "Read the report and run `/design-forge` to implement"

**Example:**
```
UX Research: Dashboard Data Visualization
Classification: webapp · saas · modern (moderate intensity)

Recommendation: Recharts + shadcn/ui cards for data display, Framer Motion
for transitions. CSS grid bento layout. No 3D — performance cost outweighs
value for dashboards.

Full report: .claude/research/dashboard-dataviz-2026-03-28.md

Read the report and run /design-forge to implement.
```

**Done.**
