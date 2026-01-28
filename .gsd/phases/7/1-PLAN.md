---
phase: 7
plan: 1
wave: 1
---

# Plan 7.1: Store Schema & Mode Toggle

## Objective

Update the application store to support different input modes and provide a UI to toggle between then.

## Context

- .gsd/SPEC.md
- src/store/index.ts
- src/App.tsx

## Tasks

<task type="auto">
  <name>Update AppState in store</name>
  <files>
    <file>src/store/index.ts</file>
  </files>
  <action>
    - Add `inputMode: 'expression' | 'table'` to `AppState`.
    - Set default `inputMode` to `'expression'`.
  </action>
  <verify>
    Check if types in src/store/index.ts include InputMode.
  </verify>
  <done>
    AppState includes inputMode and initial state is set.
  </done>
</task>

<task type="auto">
  <name>Implement InputModeToggle component</name>
  <files>
    <file>src/components/editor/InputModeToggle.tsx</file>
    <file>src/App.tsx</file>
  </files>
  <action>
    - Create a new component `InputModeToggle` that allows switching between 'Logic Expression' and 'Truth Table' modes.
    - Use premium design with smooth transitions (Tailwind CSS v4).
    - Integrate it into `App.tsx` above the editor section.
    - Show/hide `ExpressionEditor` based on the mode.
  </action>
  <verify>
    Run the app and check if the toggle switches the store state and UI.
  </verify>
  <done>
    User can switch modes; UI responds accordingly.
  </done>
</task>

## Success Criteria

- [ ] Store supports `inputMode`.
- [ ] Toggle UI is functional and follows premium design.
