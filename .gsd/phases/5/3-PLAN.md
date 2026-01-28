---
phase: 5
plan: 3
wave: 2
---

# Plan 5.3: Specialized Gate Sets and Peephole Optimization

## Objective
Enable conversion to specialized gate sets (NAND-only, NOR-only) and implement optimization passes to remove redundant gates (like double negations).

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md (ADR-024, ADR-025)
- .gsd/phases/5/RESEARCH.md

## Tasks

<task type="auto">
  <name>Implement Target Gate Transformers</name>
  <files>
    - src/core/circuit/transformers.ts
  </files>
  <action>
    Implement functions to transform a standard Circuit into specific gate sets:
    - `toNANDOnly(circuit: Circuit): Circuit`
    - `toNOROnly(circuit: Circuit): Circuit`
    - Use the rules defined in `RESEARCH.md` for substitution.
  </action>
  <verify>Verify that resulting circuit only contains NAND or NOR gates.</verify>
  <done>
    Circuit can be restricted to NAND-only or NOR-only gate sets.
  </done>
</task>

<task type="auto">
  <name>Implement Peephole Optimizer</name>
  <files>
    - src/core/circuit/optimizer.ts
  </files>
  <action>
    Implement `optimizeCircuit(circuit: Circuit): Circuit`:
    - Perform a pass to remove double negations (NOT-NOT).
    - Simplify redundant gates (e.g., OR with constant input if applicable).
    - Ensure the graph integrity is maintained after removals.
  </action>
  <verify>Check if redundant gates are removed in test cases.</verify>
  <done>
    Peephole optimization reduces total gate count by removing redundancies.
  </done>
</task>

<task type="auto">
  <name>Comprehensive tests for gate sets and optimization</name>
  <files>
    - src/core/circuit/__tests__/integration.test.ts
  </files>
  <action>
    Write tests covering the full pipeline:
    1. Parse expression.
    2. Optimize (Phase 4 logic).
    3. Convert to Circuit.
    4. Transform to NAND-only.
    5. Optimize Circuit.
    6. Verify truth table equivalence with original expression.
  </action>
  <verify>bun test src/core/circuit/__tests__/integration.test.ts</verify>
  <done>
    Full pipeline is verified to be logically correct and optimized.
  </done>
</task>

## Success Criteria
- [ ] Circuits can be successfully converted to NAND-only and NOR-only forms.
- [ ] Redundant gates (especially double negations) are removed automatically.
- [ ] Truth table verification ensures logical equivalence after all transformations.
