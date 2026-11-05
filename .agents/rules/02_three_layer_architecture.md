# RULE 02: THE 3-LAYER OPERATING ARCHITECTURE

> LLMs are probabilistic, whereas core business logic is deterministic and requires consistency.
> This 3-layer architecture eliminates compounded errors by pushing complexity into deterministic code.

---

## Layer 1: Directive (What to do)
- Standard Operating Procedures (SOPs) written in natural language Markdown (`directives/` or `.agents/workflows/`).
- Defines goals, inputs, tools to call, output schemas, and edge cases.

## Layer 2: Orchestration (Decision making)
- The AI Agent.
- Read directives, make intelligent routing decisions, validate schemas, coordinate tools, and handle errors.
- Do not manually calculate or parse large payloads; orchestrate deterministic tools.

## Layer 3: Execution (Doing the work)
- Deterministic scripts (Python, TypeScript, Shell) in `execution/`.
- Handle API calls, data transformations, file operations, chunking, and database interactions.
- Testable, reliable, and fast.
