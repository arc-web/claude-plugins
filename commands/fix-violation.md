---
description: "Fix a specific violation by ID — designed for Cowork Dispatch mobile action buttons"
---

Fix a code quality violation identified by its violation ID. This command is the action target for Dispatch push notifications — when a manager or developer taps "Fix" on a mobile alert, this runs.

## Arguments

`$ARGUMENTS` should contain a violation ID (e.g., `decomp-dashboard-a1b2c3`) or a file path.

## Steps

1. **Locate the violation**:
   - If `$ARGUMENTS` looks like a violation ID (contains a hyphen, no path separators): search `tasks-plans/tasks.md` for the ID, and search `.composure/notifications/pending.jsonl` for a matching `id` field to get the file path and category.
   - If `$ARGUMENTS` looks like a file path: use it directly.
   - If no argument provided: read `.composure/notifications/pending.jsonl`, pick the most recent unread notification with severity "critical" or "warning", and use that.

2. **Determine fix strategy based on category**:
   - **decomposition**: Run the `/composure:audit` command on the file, then apply decomposition — extract large functions into separate modules, move inline types to `types.ts`, extract StyleSheet blocks to `styles.ts`.
   - **bandaid**: Read the file, find the band-aid pattern (as any, @ts-ignore, etc.), and fix the root cause with proper typing.
   - **type-safety**: Run type-safety review on the file and fix all violations.
   - **graph**: Run `/composure:build-graph` to rebuild the stale graph.

3. **Apply the fix**: Make the actual code changes using Edit/Write tools.

4. **Mark resolved**:
   - In `tasks-plans/tasks.md`, change the matching `- [ ]` line to `- [x]`.
   - Mark the notification as read by updating `.composure/notifications/pending.jsonl`.

5. **Confirm**: Output a single short line:
   ```
   Fixed: <violation-id> in <file>. <1-sentence summary of what changed>.
   ```

## Important

- This command is designed to work unattended (triggered from Dispatch). Do not ask clarifying questions — make the best judgment call.
- If the fix requires changes across multiple files, proceed with all of them.
- If the violation cannot be auto-fixed (e.g., requires architectural decision), output: `Needs review: <violation-id> — <reason>`.
