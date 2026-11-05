# GRAPHIFY KNOWLEDGE GRAPH RULE (Day 1 Knowledge Architecture)

> This project requires an active Graphify Knowledge Graph to maintain context efficiency, eliminate redundant full-file reads, and provide immediate architectural understanding.

---

## 1. DAY-1 INITIALIZATION MANDATE
When a new project is created or loaded:
- Verify if `graphify-out/graph.json` exists.
- If it does NOT exist, immediately run Day-1 build:
  ```bash
  graphify build .
  ```
  *(or `npx -y graphifyy build .` / `uvx graphifyy build .`)*
- Inspect `graphify-out/GRAPH_REPORT.md` to identify the God Nodes, module clusters, and dependency bottlenecks.

---

## 2. STRICT QUERY-FIRST PROTOCOL (TOKEN CONSERVATION)
When asked about codebase structure, dependencies, function flows, or architecture:
- **DO NOT** perform massive recursive grep or read 10 entire files simultaneously.
- **FIRST** query the graph:
  ```bash
  graphify query "<question or concept>"
  ```
- To inspect direct relationships or call hierarchies between two modules:
  ```bash
  graphify path "<SourceModule>" "<TargetModule>"
  ```
- To understand a specific function, class, or domain concept:
  ```bash
  graphify explain "<ConceptOrSymbol>"
  ```
- If `graphify-out/wiki/index.md` exists, navigate the generated structural wiki instead of guessing.

---

## 3. CONTINUOUS AST UPDATE LOOP
- After editing, refactoring, or creating code files during any development session, keep the graph synchronized:
  ```bash
  graphify update .
  ```
  *(Note: `graphify update` is AST/Tree-sitter only and incurs ZERO LLM API cost).*

---

## 4. COLD-START RECOVERY
If the workspace is cloned freshly on a new machine or environment:
- Execute `graphify build .` once to restore the knowledge graph and AST cache.
