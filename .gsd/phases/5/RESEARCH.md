# Phase 5 Research: Gate Conversion Rules

## NAND-only conversion rules

- NOT A = NAND(A, A)
- A AND B = NOT (NAND(A, B)) = NAND(NAND(A, B), NAND(A, B))
- A OR B = NAND(NOT A, NOT B) = NAND(NAND(A, A), NAND(B, B))

## NOR-only conversion rules

- NOT A = NOR(A, A)
- A OR B = NOT (NOR(A, B)) = NOR(NOR(A, B), NOR(NOR(A, B)))
- A AND B = NOR(NOT A, NOT B) = NOR(NOR(A, A), NOR(B, B))

## Implementation Approach: Template Substitution

The conversion will walk through the optimized AST (SOP/POS) and replace each node with a sub-graph of gates.
Common sub-expressions (Terms in SOP/POS) should be converted once and reused using the DAG structure.

## Peephole Optimization

Post-conversion, we will look for:

- NOT(NOT(X)) -> X
- NAND(X, X) where X is NAND(Y, Z) can be simplified to AND(Y, Z) but if target is NAND-only, it stays. Wait, NOT(NOT(X)) is the most common one to remove.

## DAG Structure

The `Circuit` interface will hold the mapping from output names to the final gate output or variable.
