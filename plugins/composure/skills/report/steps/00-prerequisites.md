# Step 0: Prerequisites & Plugin Setup

1. Read `.claude/no-bandaids.json`. If missing, run `/composure:initialize` first.
2. Extract `project`, `stack.framework`, `stack.language`, `stack.packageManager`, `stack.runtime`.
3. Detect installed plugins by checking config files:
   - Sentinel: `.claude/sentinel.json` (skip if `--no-sentinel`)
   - Testbench: `.claude/testbench.json` (skip if `--no-testbench`)
   - Shipyard: `.claude/shipyard.json` (skip if `--no-shipyard`)
4. **Pre-audit setup check:** If any companion plugin is installed but NOT set up, use AskUserQuestion:

   "I found plugins that aren't set up for this project yet. Setting them up before the audit gives more complete results:
   {list missing plugins}
   Want me to set them up now? (Takes ~30 seconds)"

   If user accepts, run the missing setup commands (`/sentinel:assess`, `/testbench:calibrate`, `/shipyard:configure`) before proceeding. If user declines, continue with available data.

5. Create output directory: `mkdir -p tasks-plans/audits`
6. Capture timestamp: `date +"%Y-%m-%d-%H%M"`

---

**Next:** Read `steps/01-gather-data.md`
