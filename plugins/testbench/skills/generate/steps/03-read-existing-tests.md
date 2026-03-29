# Step 3: Read Existing Tests (MANDATORY)

**This step is NOT optional.** Read 2-3 existing test files from the project. Even though conventions are in `testbench.json`, reading real tests provides:

- Concrete mock setup patterns (not just "vi.mock" but the full mock factory this project uses)
- Test data creation patterns (factories, builders, fixtures)
- Common utility imports (test helpers, render wrappers, custom matchers)
- Error handling patterns (how does this project test error cases?)
- Async testing patterns (how does this project handle promises, streams, subscriptions?)

**Selection priority for convention files:**

1. A test file for a similar source file (same directory, same type of code)
2. The most recently modified test file (represents current conventions)
3. A test file that tests something with similar dependencies

Read the files. Do NOT skip this step with "I already have conventions from the config."

---

**Next:** Read `steps/04-generate-test.md`
