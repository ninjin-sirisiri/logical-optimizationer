---
phase: 8
plan: 3
wave: 3
---

# Plan 8.3: Testing and Polish for Gate Selection

## Objective

Ensure the reliability of the custom gate conversion and provide feedback to the user on the validity of their gate selection.

## Context

- src/core/circuit/transformers.ts
- src/components/panel/GateSelector.tsx
- src/core/circuit/__tests__/integration.test.ts

## Tasks

<task type="auto">
  <name>Add unit tests for custom gate conversion</name>
  <files>
    <file>c:\Users\user\Desktop\logical-optimizationer\src\core\circuit\__tests__\transformers.test.ts</file>
  </files>
  <action>
    - Create `src/core/circuit/__tests__/transformers.test.ts`.
    - Test conversion to various sets (e.g., AND/NOT only, OR/NOT only, XOR/AND only).
    - Verify that the resulting circuit only contains enabled gates.
    - Verify that the logic remains correct (truth table check).
  </action>
  <verify>Run `bun test src/core/circuit/__tests__/transformers.test.ts` and ensure all tests pass.</verify>
  <done>Comprehensive unit tests cover major custom gate set combinations.</done>
</task>

<task type="auto">
  <name>Add functional completeness validation</name>
  <files>
    <file>c:\Users\user\Desktop\logical-optimizationer\src\components\panel\GateSelector.tsx</file>
  </files>
  <action>
    - Add a helper function to check if a set of gates is "functionally complete".
    - Basic complete sets: {NAND}, {NOR}, {AND, NOT}, {OR, NOT}.
    - If the user selection is NOT complete, show a subtle warning message in the `GateSelector` UI.
  </action>
  <verify>Disable all gates except AND in the UI and confirm a warning message appears.</verify>
  <done>User receives visual feedback when choosing an incomplete gate set.</done>
</task>

## Success Criteria

- [ ] Unit tests pass for varied gate sets.
- [ ] UI provides feedback on functional completeness.
