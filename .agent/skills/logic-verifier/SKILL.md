---
name: Logic Verifier
description: Verifies the equivalence of two logic functions or circuits by comparing their truth tables.
---

# Logic Verifier Skill

This skill is designed to verify that two logic implementations (e.g., an original unoptimized function and an optimized one) are logically equivalent.

## When to use
*   After implementing or modifying a logic optimization algorithm (e.g., Quine-McCluskey).
*   When refactoring logic circuit code.
*   To prove that a generated SOP/POS form matches the input truth table.

## Procedures

### 1. Preparation
Ensure you have two executable functions or objects representing the logic:
*   `Function A`: Original logic (Reference)
*   `Function B`: Optimized/Modified logic (Target)

Both functions must accept the same input vector types.

### 2. Identify Input Size
Determine the number of input variables ($N$).
*   **Small Scale ($N \le 16$)**: Use **Exhaustive Verification** (Full Truth Table).
*   **Large Scale ($N > 16$)**: Use **Random Sampling Verification** (Monte Carlo).

### 3. Execution (Exhaustive)
1.  Iterate through all $2^N$ possible input combinations (from $0$ to $2^N - 1$).
2.  For each input combination:
    *   Execute `Function A`.
    *   Execute `Function B`.
    *   Compare results.
3.  If any mismatch is found:
    *   **Stop immediately.**
    *   Report the **Counter Example** (the input pattern that caused the mismatch).
    *   Report the output of A and B.

### 4. Execution (Random Sampling)
1.  Generate $K$ random input patterns (Recommend $K \ge 10000$).
2.  Also include "Corner Cases" (all 0s, all 1s, walking 1s, walking 0s).
3.  Compare results for each pattern.

## Output Format
Report the verification result in the following format:

```markdown
## Logic Verification Report

*   **Status**: PASSED / FAILED
*   **Mode**: Exhaustive / Random Sampling
*   **Inputs**: N = [Number]
*   **Tested Patterns**: [Count]

### Details
(If Failed)
*   **Counter Example**: Input = [0, 1, 0, ...], Expected = [1], Actual = [0]
```

## Example Implementation (TypeScript)
You can create a temporary test script using this template:

```typescript
type LogicBasedFunction = (inputs: number[]) => number;

function verifyLogic(n: number, original: LogicBasedFunction, optimized: LogicBasedFunction) {
  const numPatterns = Math.pow(2, n);
  
  for (let i = 0; i < numPatterns; i++) {
    const inputs = i.toString(2).padStart(n, '0').split('').map(Number);
    
    const outA = original(inputs);
    const outB = optimized(inputs);
    
    if (outA !== outB) {
      console.error(`Mismatch found at input: ${inputs.join('')}`);
      console.error(`Original: ${outA}, Optimized: ${outB}`);
      return false;
    }
  }
  console.log("Verification PASSED: All patterns match.");
  return true;
}
```
