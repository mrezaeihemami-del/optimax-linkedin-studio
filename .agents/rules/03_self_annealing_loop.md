# RULE 03: SELF-ANNEALING LOOP & ERROR RESOLUTION

> Errors are learning opportunities, not dead ends.
> When a component breaks, follow the systematic 5-step self-annealing loop.

---

## The 5-Step Loop

1. **Inspect:** Read the exact error message, stack trace, and response payload. Do not guess.
2. **Admit & Root-Cause:** Identify the physical code line, syntax error, or API limitation responsible.
3. **Fix:** Update the code, connector, or script to resolve the underlying bug.
4. **Test & Verify:** Run the compiler, test script, or curl command to prove it passes with live logs.
5. **Update Learnings:** Record the architectural decision or constraint in project memory (`docs/DECISIONS.md` or directives) so the system permanently strengthens.
