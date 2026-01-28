---
phase: 4
plan: 2
wave: 1
---

# Plan 4.2: PI Table and Essential Prime Implicants

## Objective

Implement the PI Table structure, identification of Essential Prime Implicants (EPIs), and table reduction to simplify the remaining minimization problem.

## Context

- `.gsd/phases/4/RESEARCH.md`
- `src/core/optimizer/types.ts`
- `src/core/optimizer/qm.ts`

## Tasks

<task type="auto">
  <name>Implement PI Table and EPI Identification</name>
  <files>
    - src/core/optimizer/table.ts
  </files>
  <action>
    Implement `PITable` class or utility functions:
    - Build a mapping of (Minterm, OutputIndex) pairs to the PIs that cover them.
    - Identify Essential Prime Implicants (EPIs): PIs that are the ONLY cover for at least one (Minterm, OutputIndex) pair.
    - Logic to "select" an EPI and remove the covered points from the table.
  </action>
  <verify>Check EPI identification logic with known examples.</verify>
  <done>EPIs are correctly identified and table can be reduced.</done>
</task>

<task type="auto">
  <name>Implement Table Reduction Logic</name>
  <files>
    - src/core/optimizer/table.ts
  </files>
  <action>
    Implement secondary reduction rules:
    - Row dominance (if minterm A is covered by a subset of PIs that cover minterm B, B can be removed).
    - Column dominance (if PI A covers a subset of minterms that PI B covers, and A is more expensive, A can be removed).
    - Note: For QM, simple reduction after EPI selection is often enough before Petrick's.
  </action>
  <verify>Run tests with complex tables requiring reduction.</verify>
  <done>Table is minimized as much as possible before solver.</done>
</task>

<task type="auto">
  <name>Unit Tests for Table Logic</name>
  <files>
    - src/core/optimizer/__tests__/table.test.ts
  </files>
  <action>
    Create tests for PI Table operations:
    - Construction from PIs and Minterms.
    - EPI detection.
    - Table reduction.
  </action>
  <verify>bun test src/core/optimizer/__tests__/table.test.ts</verify>
  <done>All tests pass.</done>
</task>

## Success Criteria

- [ ] EPIs are correctly identified in multi-output contexts.
- [ ] Table reduction correctly simplifies the problem without losing the optimal solution.
- [ ] Logic handles overlapping PIs correctly.
