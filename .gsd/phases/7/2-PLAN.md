---
phase: 7
plan: 2
wave: 1
---

# Plan 7.2: Variable Management UI

## Objective

Provide a UI to manage input and output variables when in Truth Table mode, and automatically initialize the table.

## Context

- .gsd/SPEC.md
- src/store/index.ts
- src/components/editor/VariableManager.tsx

## Tasks

<task type="auto">
  <name>Implement VariableManager component</name>
  <files>
    <file>src/components/editor/VariableManager.tsx</file>
  </files>
  <action>
    - Create `VariableManager` component to add/remove input and output variables.
    - Each variable should have a name (default A, B, C... and Y, Z...).
    - Add buttons to add/remove.
    - Style it with a clean, list-like interface.
  </action>
  <verify>
    Component renders and allows adding/removing variables in the UI state.
  </verify>
  <done>
    Variable names can be managed through the UI.
  </done>
</task>

<task type="auto">
  <name>Sync Variable management with Truth Table state</name>
  <files>
    <file>src/components/editor/VariableManager.tsx</file>
    <file>src/core/truth-table/index.ts</file>
  </files>
  <action>
    - When variables change in `TruthTable` mode, trigger a store update to re-initialize `state.truthTable`.
    - Use a helper function (possibly in `src/core/truth-table/index.ts`) to generate a default table with $2^n$ entries for given variables.
    - Default all output values to `false`.
  </action>
  <verify>
    Switch to Table mode, add a variable, and check if the TruthTableEditor displays the updated rows.
  </verify>
  <done>
    Adding/removing variables correctly updates the truth table structure.
  </done>
</task>

## Success Criteria

- [ ] Users can manage variable names and count.
- [ ] Truth table automatically expands/shrinks based on input variable count.
