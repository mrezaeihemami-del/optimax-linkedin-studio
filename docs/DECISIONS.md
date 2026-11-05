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

## ADR-002: SQLite Native Database & Modular Full-Stack Architecture

### Status
Accepted

### Context
The initial prototype in `Old` relied on a flat, unindexed `.optimax_store.json` file for persistence, and bundled all backend logic, AI prompting, auth, and analytics into a single 1,130-line `server.ts`. 
To transform this into a production-grade full-stack website without external cloud database dependencies, a lightweight, zero-configuration, robust embedded relational database is required.

### Decision
1. **Database:** Adopted Node.js native `node:sqlite` (`DatabaseSync`) for persistent, ACID-compliant storage in `data/optimax.db`.
   - Dedicated typed tables for: `settings`, `sources`, `stories`, `metrics`, `users`, `audit_logs`.
   - Normalized relations with foreign keys and automatic timestamps.
2. **Modular Architecture:**
   - `server/db/`: Database connection, schema migrations, and type-safe repositories.
   - `server/services/`: Business logic for AI agent chaining (Gemini), LinkedIn publisher, analytics aggregator, and background cron scheduler.
   - `server/routes/`: Isolated REST controllers (`/api/auth`, `/api/stories`, `/api/sources`, `/api/settings`, `/api/analytics`, `/api/linkedin`).
   - `src/`: Client-side React 19 application with Vite, Tailwind CSS, Lucide icons, and Canvas renderers.
   - `execution/`: Deterministic scripts for database migrations, HTA feed parsing, and test verification.
3. **Background Scheduler:** An internal tick/cron runner that monitors scheduled stories and executes automated publications without external dependencies.

### Consequences
- **Positive:** Zero external database server setup; ultra-fast local disk I/O; reliable ACID transactions; clean separation of concerns.
- **Negative / Trade-offs:** Single-node local file database (ideal for local/single-server deployment; would require SQLite replication like Litestream if distributed multi-region scaling is needed later).

---

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
