# WORKFLOW: DAY-1 PROJECT BOOTSTRAP (چک‌لیست آغاز اصولی هر پروژه جدید)

> Execute this systematic 6-step checklist on Day 1 of any software or AI development project to establish zero-hallucination guardrails and context efficiency immediately.

---

## Step 1: Constitution & Directives Alignment
1. Verify that `AGENTS.md`, `GEMINI.md`, and `CLAUDE.md` exist at the workspace root and match identically.
2. Confirm `.agents/rules/01_universal_constitution.md` is loaded.
3. **Guardrail:** Confirm that the agent understands the Fail-Fast policy: No fabricated citations, no fake URLs, no pretend UI buttons.

---

## Step 2: Day-1 Knowledge Graph Initialization (Graphify)
1. Check if `graphify` is installed:
   ```bash
   graphify --version || uvx graphifyy --version || npx graphifyy --version
   ```
2. Build the initial structural knowledge graph:
   ```bash
   graphify build .
   ```
3. Read `graphify-out/GRAPH_REPORT.md` to identify:
   - God Nodes (modules with high centrality).
   - Core dependency graphs.
   - Entry points and CLI/web routing.

---

## Step 3: Architecture Decision Record (ADR) Setup
1. Copy `docs/DECISIONS_TEMPLATE.md` to `docs/DECISIONS.md`.
2. Record `ADR-001: Project Architecture and Foundational Directives`.
3. Establish the rule: Every major architectural change, library addition, or database schema change must be appended as an ADR.

---

## Step 4: 3-Layer Directory Structure Establishment
Create and verify the three operational layers:
- `directives/`: Standard Operating Procedures in Markdown for recurring agent workflows.
- `execution/`: Deterministic scripts (Python / TypeScript / Shell) for file processing, APIs, and builds.
- `.tmp/` and `scratch/`: Designated directories for transient intermediate dumps and scratchpad tests. Ensure both are listed in `.gitignore`.

---

## Step 5: Environment & Secrets Isolation
1. Create `.env.example` documenting all required variables with placeholder keys.
2. Verify that `.gitignore` contains:
   ```gitignore
   .env*
   credentials.json
   token.json
   .tmp/
   scratch/
   ```
3. Never commit raw API tokens or production credentials.

---

## Step 6: Proof-First Compiler Verification Baseline
1. Run the project compiler or typechecker:
   - TypeScript: `npx tsc --noEmit`
   - Python: `pyright` or `python -m pytest`
   - Rust: `cargo check`
   - Go: `go vet ./...`
2. Ensure baseline project compiles with **Exit Code: 0** before any feature development begins.
