# MODULAR SKILLS & PLUGINS SPECIFICATION

> Skills and Plugins allow AI agents to load specialized domain knowledge, workflows, and tool configurations on-demand without bloating the system prompt or burning unnecessary context tokens.

---

## 1. WHAT IS A SKILL?
A Skill is a directory containing specialized cheatsheets, execution patterns, and domain procedures.
- **Location:** `.agents/skills/<skill_name>/`
- **Mandatory Entry Point:** `SKILL.md` with YAML frontmatter.

### Standard `SKILL.md` Structure:
```markdown
---
name: my-specialized-skill
description: Brief 1-2 sentence description of when and why this skill should be activated.
---

# Skill Instructions & Best Practices

## When to Activate
- Trigger conditions, user intents, or file types that require this skill.

## Core Rules & Patterns
- Exact conventions, architectural patterns, and prohibited behaviors.

## Step-by-Step Execution Workflow
1. Step 1: Verification...
2. Step 2: Implementation...
3. Step 3: Test & Proof...
```

---

## 2. WHEN TO CREATE A SKILL
Create a new skill in `.agents/skills/<skill_name>/` whenever:
1. **Domain Complexity:** The project handles complex domain rules (e.g., healthcare compliance, payment processing, audio synthesis, 3D graphics).
2. **Reusable Workflows:** Multiple tasks follow the same multi-step verification sequence.
3. **API Cheatsheets:** Deterministic schemas, rate limits, and quirks of external APIs that the agent must not guess or hallucinate.

---

## 3. ON-DEMAND LOADING PRINCIPLE (TOKEN HYGIENE)
- The agent does NOT load all skills into context at once.
- The agent inspects skill descriptions in available skills metadata.
- When a task requires a skill, the agent calls `view_file` on that specific `.agents/skills/<skill_name>/SKILL.md`.
- Once the skill instructions are executed, the context window remains lightweight.
