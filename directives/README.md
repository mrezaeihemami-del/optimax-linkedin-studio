# DIRECTIVES (Layer 1: What To Do)

> Directives are Standard Operating Procedures (SOPs) written in natural language Markdown.
> They define goals, inputs, tools to call, output specifications, and edge cases.

---

## The Rule of Directives
- **Directives are living documents:** When you discover API limits, better approaches, or common edge cases, update the directive.
- **Agent Role:** The AI agent reads directives, plans the steps, and executes deterministic scripts in `execution/`.
- **Do not mix execution code into directives:** Directives state *what* needs to be done; scripts in `execution/` do the heavy lifting.

---

## Directory Structure
- `directives/template_task_sop.md`: Base template for creating new task SOPs.
- `directives/<workflow_name>.md`: Specific workflows for recurring tasks (e.g. data ingestion, deployment, regression testing).
