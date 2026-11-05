# RULE 06: FILE HYGIENE & SEPARATION OF CONCERNS

> Keep production directories clean, reproducible, and free of transient scratch files.

---

## Deliverables vs. Intermediates

### Deliverables (Permanent)
- Production source code (`src/`).
- Database migrations, schemas, and configurations.
- Documentation and Architectural Decision Records (`docs/DECISIONS.md`).
- Standard Operating Procedures (`directives/`).

### Intermediates (Transient)
- Scraped dumps, temporary JSON payloads, debug logs.
- Intermediate files MUST live in:
  - `.tmp/` - Regenerated temporary files.
  - `scratch/` - One-off experiment and test scripts.
- Never commit `.tmp/` or `scratch/` to source control. Ensure they are listed in `.gitignore`.
