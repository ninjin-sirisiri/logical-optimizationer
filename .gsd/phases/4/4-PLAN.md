---
phase: 4
plan: 4
wave: 2
---

# Plan 4.4: Optimization API and POS Integration

## Objective

Integrate the QM and Petrick components into a unified Optimization API, and implement the POS (Product of Sums) minimization wrapper.

## Context

- `src/core/optimizer/qm.ts`
- `src/core/optimizer/petrick.ts`
- `src/core/truth-table/types.ts`
- `src/core/parser/ast.ts`

## Tasks

<task type="auto">
  <name>Implement Optimization API</name>
  <files>
    - src/core/optimizer/index.ts
  </files>
  <action>
    Create a public API for optimization:
    - `optimizeSOP(truthTable: TruthTable): LogicExpression[]` (one expression per output).
    - `minimize(truthTable: TruthTable, form: 'SOP' | 'POS')`.
    - Function to convert selected Implicants back into logic AST or expression strings.
  </action>
  <verify>Integration test with full flow.</verify>
  <done>Full optimization flow is available via a simple API.</done>
</task>

<task type="auto">
  <name>Implement POS Minimization Wrapper</name>
  <files>
    - src/core/optimizer/pos.ts
  </files>
  <action>
    Implement `optimizePOS` using the strategy:
    1. Create an inverted TruthTable (outputs 0 -> 1, 1 -> 0).
    2. Apply `optimizeSOP` to the inverted table.
    3. Apply De Morgan transformation to the resulting SOP to get POS.
  </action>
  <verify>Verify POS results correctly match the original truth table.</verify>
  <done>POS optimization is implemented using the SOP core.</done>
</task>

<task type="auto">
  <name>Full Integration and Performance Tests</name>
  <files>
    - src/core/optimizer/__tests__/integration.test.ts
  </files>
  <action>
    - Test optimization of multi-output truth tables.
    - Test conversion of results back to valid logical expressions.
    - Benchmarking: Ensure 10-variable optimization completes in < 5 seconds.
  </action>
  <verify>bun test src/core/optimizer/__tests__/integration.test.ts</verify>
  <done>System is robust and meets performance requirements.</done>
</task>

## Success Criteria

- [ ] Users can optimize both SOP and POS forms via the API.
- [ ] Multiple outputs sharing common terms result in shared AST nodes or optimized results.
- [ ] Integration status in ROADMAP.md can be updated to ✅.
