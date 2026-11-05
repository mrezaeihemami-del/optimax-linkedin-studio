# ARCHITECTURAL DECISION RECORDS (ADR LOG)

> This document is the living record of all architectural, technical, and compliance decisions made across the lifecycle of this project.
> Every entry follows the standardized ADR format (Context, Decision, Consequences).

---

## ADR-001: Foundational Framework & Universal Agent Constitution

### Status
Accepted

### Context
Probabilistic LLMs generate subtle variations, hallucinations, and superficial "decorative" code when unconstrained. Software engineering requires deterministic reliability, verifiable proof, and zero synthetic placeholders.

### Decision
1. Adopted the Universal Agent Constitution mandating:
   - Zero-Hallucination & Fail-Fast status when data is unavailable.
   - Strict Anti-Decorative engineering (every UI element wired to live logic).
   - Proof-First verification (0 lint/type errors, live response logs).
   - Radical honesty and error transparency.
2. Implemented the 3-Layer Architecture (Directives $\rightarrow$ Orchestration $\rightarrow$ Execution).
3. Initialized Graphify knowledge graph from Day 1 for AST-level context navigation.

### Consequences
- **Positive:** Compounded error rate drops from exponential decay to linear predictability; context window token consumption is reduced by up to 70%.
- **Negative:** Requires rigorous discipline to write deterministic execution scripts and document ADRs before implementing architectural shifts.

---

## ADR Template (For Future Decisions)

```markdown
## ADR-XXX: [Short, descriptive title]

### Status
[Proposed | Accepted | Superseded | Deprecated]

### Context
[What problem or constraint triggered this decision? Include technical facts, limitations, or requirements.]

### Decision
[What concrete architectural or technical choice was made? List explicit rules, libraries, or patterns.]

### Consequences
- **Positive:** [Benefits and improvements gained.]
- **Negative / Trade-offs:** [Costs, complexity, or constraints introduced.]
```
