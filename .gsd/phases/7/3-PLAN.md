---
phase: 7
plan: 3
wave: 2
---

# Plan 7.3: Data Sync & Optimization Integration

## Objective

Connect the editable truth table to the store and update the optimization engine to handle direct table input.

## Context

- src/components/table/TruthTableEditor.tsx
- src/hooks/useOptimize.ts

## Tasks

<task type="auto">
  <name>Connect TruthTableEditor to Store for manual edits</name>
  <files>
    <file>src/components/table/TruthTableEditor.tsx</file>
  </files>
  <action>
    - Ensure `TruthTableEditor` updates the store when a cell is toggled.
    - Handle multiple output variables in the UI (currently it might assume one).
    - Add a "Reset Table" button to clear output values.
  </action>
  <verify>
    Modify values in the truth table and verify they persist in the store.
  </verify>
  <done>
    Manual table edits are synced with the global state.
  </done>
</task>

<task type="auto">
  <name>Update useOptimize for Table Mode</name>
  <files>
    <file>src/hooks/useOptimize.ts</file>
  </files>
  <action>
    - Modify `optimize` function to check `inputMode`.
    - If `inputMode === 'table'`, skip `expressionToTruthTable` and use `state.truthTable` directly.
    - Ensure multi-output optimization (already supported in core engine) works through the UI.
  </action>
  <verify>
    Manually edit a table, hit Optimize, and check if the results match the table.
  </verify>
  <done>
    Optimization works regardless of the input mode.
  </done>
</task>

## Success Criteria

- [ ] Editable truth table correctly updates store.
- [ ] Optimization can be triggered directly from a manually defined table.
- [ ] Multi-output optimization is functional.
