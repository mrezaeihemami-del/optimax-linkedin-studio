---
name: system-design
description: Standard architectural patterns, modular component design, and API contract specifications. Activate when designing new modules, refactoring, or planning system architecture.
---

# System Design & Clean Architecture Skill

## Core Principles
1. **Separation of Concerns:** Keep presentation, business domain logic, and data access decoupled.
2. **Defensive API Contracts:** Validate all incoming and outgoing schemas with runtime types (Zod, Pydantic, or TypeScript interfaces).
3. **No Hidden State:** Explicit props and dependency injection over opaque global variables.
4. **Idempotence & Graceful Degradation:** External calls must implement timeouts, retries with backoff, and explicit fallback handling.
