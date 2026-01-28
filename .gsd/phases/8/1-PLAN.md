---
phase: 8
plan: 1
wave: 1
---

# Plan 8.1: Update State and UI for Custom Gate Selection

## Objective

Update the application state to support individual gate selection and provide a UI for users to toggle each gate.

## Context

- .gsd/SPEC.md
- src/store/index.ts
- src/components/panel/OptimizationControls.tsx
- src/core/circuit/types.ts

## Tasks

<task type="auto">
  <name>Update AppState for custom gates</name>
  <files>
    <file>c:\Users\user\Desktop\logical-optimizationer\src\store\index.ts</file>
  </files>
  <action>
    - Update `GateSet` type to include `'custom'`.
    - Add `enabledGates: Record<GateType, boolean>` to the `options` object in `AppState`.
    - Note: `GateType` should exclude `'vcc'`, `'gnd'`, and `'buf'` for the toggle UI, but they are needed internally.
    - Set default `enabledGates` to all true for standard gates (and, or, not, nand, nor, xor, xnor).
  </action>
  <verify>Check if `AppState` in `src/store/index.ts` has the new fields and types.</verify>
  <done>TypeScript compiles without errors and the store has the new fields.</done>
</task>

<task type="auto">
  <name>Implement GateSelector UI</name>
  <files>
    <file>c:\Users\user\Desktop\logical-optimizationer\src\components\panel\GateSelector.tsx</file>
    <file>c:\Users\user\Desktop\logical-optimizationer\src\components\panel\OptimizationControls.tsx</file>
  </files>
  <action>
    - Create `src/components/panel/GateSelector.tsx` to display a grid of checkboxes/toggles for each gate type.
    - Use HSL-based colors or premium styling as per design guidelines.
    - Integrate `GateSelector` into `OptimizationControls.tsx`, showing it only when `gateSet === 'custom'`.
    - Update `OptimizationControls` to include 'Custom' in the `Target Gate Set` options.
  </action>
  <verify>Open the browser and confirm "Custom" appears in the gate set options, and clicking it reveals the gate selection grid.</verify>
  <done>User can toggle individual gates in a "Custom" mode UI.</done>
</task>

## Success Criteria

- [ ] `AppState` supports individual gate toggles.
- [ ] UI allows toggling gates when "Custom" gate set is selected.
