---
phase: 5
plan: 2
wave: 1
---

# Plan 5.2: Core Circuit Converter Implementation

## Objective
Implement the logic to convert optimized logical expressions (AST) into a gate-level circuit (DAG). This handles the initial mapping from logic to gates.

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md (ADR-024)
- src/core/parser/types.ts
- src/core/circuit/types.ts

## Tasks

<task type="auto">
  <name>Implement AST to Gate conversion</name>
  <files>
    - src/core/circuit/converter.ts
  </files>
  <action>
    Implement `convertASTToCircuit` function:
    - Recursively traverse the AST.
    - Map AST nodes to corresponding gates (NOT -> 'not', AND -> 'and', etc.).
    - Use the `CircuitBuilder` from 5.1 to construct the DAG.
    - Memoize results of sub-expressions to ensure common sub-expressions (from mult-level optimization) are shared as the same `GateNode` instance in the DAG (fan-out).
  </action>
  <verify>Check conversion for simple expressions.</verify>
  <done>
    `convertASTToCircuit` correctly maps AST nodes to a shared DAG of gates.
  </done>
</task>

<task type="auto">
  <name>Integration tests for conversion</name>
  <files>
    - src/core/circuit/__tests__/converter.test.ts
  </files>
  <action>
    Write tests that take a logical expression (via parser) and verify the resulting `Circuit` structure.
    Verify that common sub-expressions result in the same GateNode (shared ID).
  </action>
  <verify>bun test src/core/circuit/__tests__/converter.test.ts</verify>
  <done>
    Tests confirm that ASTs are correctly converted to DAGs with shared components.
  </done>
</task>

## Success Criteria
- [ ] AST nodes are correctly mapped to `GateNode`s.
- [ ] Multilevel common expressions result in shared gate instances in the DAG.
- [ ] Integration tests verify the end-to-end conversion from string -> AST -> Circuit.
