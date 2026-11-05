# STANDARD OPERATING PROCEDURE (SOP): [Task Name]

## 1. Objective & Goal
- What is the explicit business or technical goal of this procedure?
- What constitutes successful completion?

## 2. Inputs & Prerequisites
- Required files, environment variables, or database tables.
- Pre-flight checks that must pass before running execution scripts.

## 3. Deterministic Tools to Execute (Layer 3)
- Which deterministic script in `execution/` handles this work?
- Example command line:
  ```bash
  python execution/run_task.py --input data.json --output results.json
  ```

## 4. Expected Outputs & Deliverables
- Destination of final artifacts (Database, Dashboard, Cloud Storage, Production Module).
- Format and schema of the output.

## 5. Edge Cases & Fail-Safe Handling
- How to handle API rate limits, empty datasets, or network failures.
- Fail-Fast trigger: When to stop and output `"NOT FOUND / UNAVAILABLE"` instead of guessing.

## 6. Post-Execution Verification Checklist
- [ ] Compiler / Linter check passes with 0 errors.
- [ ] Live response payload inspected and verified.
- [ ] Learnings updated in this SOP or `docs/DECISIONS.md`.
