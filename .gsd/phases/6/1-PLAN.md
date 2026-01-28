---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Setup and State Management

## Objective
Install dependency and setup a centralized state management system using `@simplestack/store` to coordinate between the expression editor, truth table, and optimization engine.

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md (ADR-027, ADR-028)
- src/core/truth-table/types.ts (TruthTable definition)
- src/core/optimizer/index.ts (Optimization types)

## Tasks

<task type="auto">
  <name>Install dependencies</name>
  <files>package.json</files>
  <action>
    Install `@simplestack/store`.
    Note: The user requested `@simple-stack/store` but the correct npm package name found in research is `@simplestack/store`.
  </action>
  <verify>bun pm list | grep simplestack</verify>
  <done>@simplestack/store is listed in dependencies.</done>
</task>

<task type="auto">
  <name>Create Global Store</name>
  <files>src/store/index.ts</files>
  <action>
    Define the application state and create a store using `store()` from `@simplestack/store`.
    State should include:
    - expression: string
    - truthTable: TruthTable | null
    - results: { optimizedExpression: string | null; circuit: Circuit | null }
    - options: { mode: 'SOP' | 'POS'; gateSet: string }
  </action>
  <verify>Check if src/store/index.ts exists and exports a store instance.</verify>
  <done>Global store is defined with TypeScript types representing the application state.</done>
</task>

## Success Criteria
- [ ] `@simplestack/store` is successfully installed.
- [ ] A central store is available to the application with full type safety.
