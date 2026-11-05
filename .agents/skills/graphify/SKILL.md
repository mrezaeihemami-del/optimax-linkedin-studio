---
name: graphify
description: Knowledge graph engine for codebase architecture, structural dependencies, and AST code mapping. Activate when understanding codebase structure or answering architecture questions.
---

# Graphify Knowledge Graph Skill

## Purpose
Graphify transforms any codebase or documentation tree into a persistent, navigable Knowledge Graph with God Nodes detection, community clustering, and scoped subgraphs. It saves thousands of tokens by avoiding brute-force file scanning.

---

## Command Reference

### 1. Build Knowledge Graph (Day 1 / Full Rebuild)
Run at project inception or after major structural rewrites:
```bash
graphify build .
```
- Parses source files via Tree-sitter / AST.
- Generates `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md`, and visual `graphify-out/graph.html`.

### 2. Query Architecture & Relationships
Ask targeted questions without reading files:
```bash
graphify query "How does authentication flow to the workspace?"
```

### 3. Path Between Two Modules
Determine how module A connects to module B:
```bash
graphify path "auth-service" "database-pool"
```

### 4. Explain Symbol or Concept
Deep-dive into a specific function, class, or entity:
```bash
graphify explain "TenantProjectNamespace"
```

### 5. Incremental AST Update (Post-Code Edit)
After editing or creating code files:
```bash
graphify update .
```
*(Zero API cost, updates AST incrementally in seconds).*

---

## Operating Protocol for Agents
1. If `graphify-out/graph.json` exists, **ALWAYS** query the graph before opening files blindly.
2. Read `graphify-out/GRAPH_REPORT.md` only for broad high-level architecture reviews.
3. Keep the graph current by running `graphify update .` before declaring work complete.
