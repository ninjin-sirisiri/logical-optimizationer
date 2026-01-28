---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Circuit Data Structure Definition

## Objective

Define the core data structures for gate-level circuits using a Directed Acyclic Graph (DAG) approach. This provides the foundation for gate conversion and fan-out management.

## Context

- .gsd/SPEC.md
- .gsd/DECISIONS.md (ADR-023)
- src/core/parser/types.ts (for reference)

## Tasks

<task type="auto">
  <name>Basic type definitions for gates and circuits</name>
  <files>
    - src/core/circuit/types.ts
  </files>
  <action>
    Create `src/core/circuit/types.ts` and define:
    - `GateType`: Enum or union of 'and' | 'or' | 'not' | 'nand' | 'nor' | 'xor' | 'xnor' | 'buf'.
    - `GateNode`: Interface representing a gate with a unique ID, type, and array of inputs (variable names or other GateNodes).
    - `Circuit`: Interface representing the overall circuit, including input variables, a map of output names to GateNodes/Variables, and a list of all gates.
  </action>
  <verify>Check if the file exists and exports the required types.</verify>
  <done>
    `src/core/circuit/types.ts` is created with `GateType`, `GateNode`, and `Circuit` definitions.
  </done>
</task>

<task type="auto">
  <name>Implement Circuit builder utility</name>
  <files>
    - src/core/circuit/builder.ts
  </files>
  <action>
    Create `src/core/circuit/builder.ts` with a `CircuitBuilder` class to help construct DAGs:
    - Methods to add gates (e.g., `addGate(type, inputs)`).
    - Method to finalize the circuit and return a `Circuit` object.
    - Ensure it handles unique ID generation for gates.
  </action>
  <verify>Create a simple test to verify circuit construction.</verify>
  <done>
    `CircuitBuilder` is implemented and can group gates into a DAG structure.
  </done>
</task>

<task type="auto">
  <name>Unit tests for circuit types and builder</name>
  <files>
    - src/core/circuit/__tests__/builder.test.ts
  </files>
  <action>
    Write tests to verify that the `CircuitBuilder` correctly creates the DAG and maintains IDs/connections.
  </action>
  <verify>bun test src/core/circuit/__tests__/builder.test.ts</verify>
  <done>
    All tests pass for the circuit builder.
  </done>
</task>

## Success Criteria

- [ ] `GateNode` and `Circuit` types are defined and follow the DAG approach.
- [ ] `CircuitBuilder` can successfully construct a valid circuit.
- [ ] Tests verify the integrity of the created DAG.
