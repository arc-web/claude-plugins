# Step 2: Analyze Source File

Read the file at `<file-path>` and analyze:

| What to extract | Why |
|----------------|-----|
| Named exports | These are the public API -- test each one |
| Default export | Test this too |
| Types/interfaces | Understand input/output shapes for assertions |
| Dependencies (imports) | Determine what needs mocking |
| Side effects | Flag if the module has no testable exports |
| Complexity | Pure functions vs stateful classes vs React components vs API routes |

**If the source file has no exports** (side-effect only module, config file, type-only file):

```
Cannot generate meaningful tests for {file} -- it has no testable exports.

Options:
  - If this is a config file: no tests needed
  - If this is a type-only file (.d.ts, types.ts): no tests needed
  - If this is a side-effect module: refactor to export functions, then test those
  - If this is a React component with default export: tests will target the default export
```

Stop here. Do NOT generate a bad test to fill a gap.

---

**Next:** Read `steps/03-read-existing-tests.md`
