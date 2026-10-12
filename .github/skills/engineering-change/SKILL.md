---
name: engineering-change
description: Implement or review a feature, bug fix, or refactor in the Recadinho do Ceu repository while following its Next.js and TypeScript conventions.
---

# Engineering Change Workflow

1. Identify the owning page, component, route handler, or domain module before editing. Read only the nearby code and relevant package scripts needed to understand the behavior.
2. State the expected behavior and one focused check that can disprove the implementation assumption.
3. Preserve the current Next.js App Router architecture and existing API contracts unless the request explicitly calls for a migration or breaking change.
4. Implement the smallest complete change. Keep code identifiers and comments in English; use Portuguese for product copy when appropriate.
5. Validate input at boundaries, handle loading/empty/error states for UI changes, and consider accessibility and responsive layouts.
6. Run a focused test, lint, or build check after editing. Report exactly which checks ran and any remaining gaps.
7. Update README documentation when setup, API behavior, or user-visible capabilities change.