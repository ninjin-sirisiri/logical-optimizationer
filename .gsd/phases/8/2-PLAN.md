---
phase: 8
plan: 2
wave: 2
---

# Plan 8.2: Implement Generic Gate Transformer

## Objective

Implement a generic transformer that can synthesize a circuit using only the gates enabled by the user.

## Context

- .gsd/SPEC.md
- src/core/circuit/transformers.ts
- src/hooks/useOptimize.ts
- src/store/index.ts

## Tasks

<task type="auto">
  <name>Implement toCustomGateSet transformer</name>
  <files>
    <file>c:\Users\user\Desktop\logical-optimizationer\src\core\circuit\transformers.ts</file>
  </files>
  <action>
    - Define a mapping of gate types to their decompositions (e.g., XOR(A,B) -> OR(AND(A, NOT(B)), AND(NOT(A), B))).
    - Implement `toCustomGateSet(circuit: Circuit, enabledGates: Record<string, boolean>): Circuit`.
    - Use a recursive approach:
      1. If gate is enabled, use it.
      2. If not, pick a decomposition and recursively transform its nodes.
    - Ensure a "safe" path exists (e.g., if everything is disabled, fallback to something or throw a descriptive error).
  </action>
  <verify>Check `src/core/circuit/transformers.ts` for the new function implementation.</verify>
  <done>`toCustomGateSet` is implemented and handles basic decompositions recursively.</done>
</task>

<task type="auto">
  <name>Update useOptimize to handle custom gate sets</name>
  <files>
    <file>c:\Users\user\Desktop\logical-optimizationer\src\hooks\useOptimize.ts</file>
  </files>
  <action>
    - Update the `optimize` function in `useOptimize.ts` to check for `options.gateSet === 'custom'`.
    - If custom, call `toCustomGateSet(circuit, options.enabledGates)`.
    - Pass the `enabledGates` from the store to the transformer.
  </action>
  <verify>Run a test optimization with a custom gate set (e.g., only NAND) and check if the result uses only NAND gates.</verify>
  <done>The optimization pipeline respects the user-selected gate set.</done>
</task>

## Success Criteria

- [ ] `toCustomGateSet` correctly synthesizes functions using only enabled gates.
- [ ] Optimization results reflect the custom gate selection.
