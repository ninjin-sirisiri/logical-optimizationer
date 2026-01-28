---
phase: 4
plan: 3
wave: 2
---

# Plan 4.3: Petrick's Method Solver

## Objective

Implement Petrick's Method to solve the remaining PI table coverage problem, finding the set of PIs that minimizes the total cost (literals/terms).

## Context

- `.gsd/phases/4/RESEARCH.md`
- `src/core/optimizer/table.ts`

## Tasks

<task type="auto">
  <name>Implement Boolean Expansion (POS to SOP)</name>
  <files>
    - src/core/optimizer/petrick.ts
  </files>
  <action>
    Implement logic to:
    - Represent a POS expression where each clause is (PI_i OR PI_j OR ...).
    - Expand the POS to SOP form by distributing terms.
    - Simplified SOP reduction ($X + XY = X$, $X + X = X$).
  </action>
  <verify>Verify expansion logic with small manual examples.</verify>
  <done>POS expression is correctly converted to minimized SOP.</done>
</task>

<task type="auto">
  <name>Implement Solution Selection</name>
  <files>
    - src/core/optimizer/petrick.ts
  </files>
  <action>
    Implement `solveMinimumCover`:
    - From the SOP terms, choose the one with the smallest cost.
    - Cost function: Primary = number of PIs, Secondary = total literals.
    - Return the set of PIs for the chosen solution.
  </action>
  <verify>Verify optimal solution selection for known hard cases.</verify>
  <done>Optimal cover is selected based on defined cost function.</done>
</task>

<task type="auto">
  <name>Unit Tests for Petrick's Solver</name>
  <files>
    - src/core/optimizer/__tests__/petrick.test.ts
  </files>
  <action>
    Tests for:
    - Distributive expansion.
    - SOP simplification.
    - Full solver on non-trivial (cyclical) PI tables.
  </action>
  <verify>bun test src/core/optimizer/__tests__/petrick.test.ts</verify>
  <done>All tests pass.</done>
</task>

## Success Criteria

- [ ] Petrick's method finds a valid cover for all required minterms.
- [ ] The solution is minimal according to the cost function.
- [ ] Solver performs efficiently for tables resulting from up to 10-variable functions.
