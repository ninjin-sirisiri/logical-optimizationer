---
phase: 6
plan: 4
wave: 1
---

# Plan 6.4: Optimization Panel and Result Integration

## Objective
Implement optimization configuration options and display the final results (expressions and circuits) to the user.

## Context
- .gsd/SPEC.md
- src/core/optimizer/index.ts
- src/core/circuit/transformer.ts
- src/store/index.ts

## Tasks

<task type="auto">
  <name>Implement Optimization Controls</name>
  <files>src/components/panel/OptimizationControls.tsx</files>
  <action>
    Create a panel for settings:
    - Toggle for Optimization Mode: SOP (Sum of Products) vs POS (Product of Sums).
    - Dropdown or button group for Gate Target: Default (AND/OR/NOT), NAND only, NOR only.
    Connect these selections to the global store's `options`.
  </action>
  <verify>Verify that changing UI controls updates the store's options.</verify>
  <done>User can configure optimization parameters through the UI.</done>
</task>

<task type="auto">
  <name>Implement Result Display and Main Logic Hook</name>
  <files>src/components/result/ResultView.tsx, src/hooks/useOptimize.ts</files>
  <action>
    Create a custom hook `useOptimize` that:
    1. Reads `expression`/`truthTable` from store.
    2. Runs the core optimizer (QM algorithm).
    3. Runs gate transformation if requested.
    4. Updates `results` in the store.
    Create `ResultView` to display:
    - Optimized Expression (monospaced font).
    - Simple textual netlist/gate list for transformed circuits.
  </action>
  <verify>Perform an optimization on a known expression and verify the result appears in the UI.</verify>
  <done>Results of the optimization are calculated and displayed correctly in the UI.</done>
</task>

## Success Criteria
- [ ] User can switch between SOP/POS and gate sets.
- [ ] Final optimized expression and circuit info are visible.
