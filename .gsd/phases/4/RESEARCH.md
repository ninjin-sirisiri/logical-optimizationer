# RESEARCH Phase 4: Logic Optimization Engine

## Quine-McCluskey (QM) Method Summary

The QM method consists of two main steps:

1. Finding all prime implicants (PIs) of the function.
2. Using those PIs in a prime implicant table to find the essential prime implicants (EPIs) and other PIs needed to cover the function.

## Petrick's Method Summary

Petrick's method is used for determining all minimum sum-of-products (SOP) solutions from a prime implicant table.

- It transforms the PI table into a boolean expression where each clause represents a minterm that must be covered by at least one PI.
- The expression is multiplied out to find the minimal set of PIs.

## Multi-output Optimization

For Multiple Output functions ($F_1, F_2, ..., F_m$):

- Minterms are tagged with their source output(s).
- Combinations are done between terms sharing at least one output.
- Resulting terms inherit the intersection of output tags.
- PI table includes all outputs. A PI covers a minterm-output pair $(m, F_i)$ if the PI contains $m$ and includes $F_i$ in its output tag.

## Technical Implementation Details

### Data Structures

- `Implicant`: Represented by a bit string with 'don't cares' (e.g., `1-0`) and an `outputMask` (bitmask for multiple outputs).
- `Minterm`: An integer index or binary string.
- `PITable`: A mapping from Minterms to the PIs that cover them.

### Algorithm Flow

1. **PI Generation**:
   - Collect all minterms for ALL outputs (including Don't Cares).
   - Group them by Hamming weight.
   - Iteratively combine terms using the 1-bit difference rule AND output mask intersection.
   - Keep track of which terms were used in combinations to identify PIs.

2. **PI Table & Essential PIs**:
   - Filter minterms to keep only those that are NOT Don't Cares (must be covered).
   - Identify EPIs (PIs that are the only ones covering a specific minterm).
   - Reduce the table by removing EPIs and the minterms they cover.

3. **Petrick's Solver**:
   - For remaining minterms, create a POS expression.
   - Convert POS to SOP using distributive laws.
   - Select the SOP term with the minimum Literals/Terms.

4. **Multi-level / POS Wrapper**:
   - POS is handled by inverting inputs/outputs and applying SOP optimization.
