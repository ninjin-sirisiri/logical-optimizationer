---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: QM Core — Prime Implicant Generation

## Objective

Implement the first half of the Quine-McCluskey algorithm: generating all Prime Implicants from a set of minterms and don't cares, with support for multiple outputs via bitmasks.

## Context

- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`
- `.gsd/phases/4/RESEARCH.md`
- `src/core/truth-table/types.ts`

## Tasks

<task type="auto">
  <name>Define Optimizer Types and Data Structures</name>
  <files>
    - src/core/optimizer/types.ts
  </files>
  <action>
    Create a new file `src/core/optimizer/types.ts` to define:
    - `Implicant`: Represented as a string pattern (e.g., "1-0") and an `outputMask` (number).
    - `Minterm`: Object containing value and output mask.
    - Result types for the optimizer.
  </action>
  <verify>Check file existence and type definitions.</verify>
  <done>Types are defined and exported.</done>
</task>

<task type="auto">
  <name>Implement Prime Implicant Generation</name>
  <files>
    - src/core/optimizer/qm.ts
  </files>
  <action>
    Implement `generatePrimeImplicants` function in `src/core/optimizer/qm.ts`:
    - Group minterms by Hamming weight (number of 1s).
    - Iteratively combine terms that differ by exactly one '-' or '0/1' position.
    - Handle `outputMask` intersection: terms can only be combined if `(mask1 & mask2) > 0`.
    - Mark used terms to identify Prime Implicants (unused terms).
  </action>
  <verify>Run unit tests for PI generation.</verify>
  <done>Function correctly identifies all PIs for single and multiple outputs.</done>
</task>

<task type="auto">
  <name>Unit Tests for PI Generation</name>
  <files>
    - src/core/optimizer/__tests__/qm.test.ts
  </files>
  <action>
    Create tests for `generatePrimeImplicants`:
    - Basic single-output cases (AND, OR, XOR).
    - Cases with Don't Cares.
    - Simple multi-output cases where terms are shared.
  </action>
  <verify>bun test src/core/optimizer/__tests__/qm.test.ts</verify>
  <done>All tests pass.</done>
</task>

## Success Criteria

- [ ] Prime Implicants are correctly generated for arbitrary inputs within 10 variables.
- [ ] Multi-output masks are correctly handled during combination.
- [ ] Tests cover edge cases like all-zeros or all-ones.
