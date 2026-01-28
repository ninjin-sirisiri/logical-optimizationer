import { Implicant } from './types';

/**
 * Petrick's Method Solver.
 * Finds the minimum cost set of PIs that cover a set of targets.
 */

interface SOPTerm {
  piIndices: Set<number>;
}

/**
 * Multiplies two SOP expressions: (A + B)(C + D) -> AC + AD + BC + BD
 * And applies simplification rules:
 * - X + X = X
 * - X + XY = X
 */
function multiplySOP(sop1: SOPTerm[], sop2: SOPTerm[]): SOPTerm[] {
  const result: SOPTerm[] = [];

  for (const t1 of sop1) {
    for (const t2 of sop2) {
      const combined = new Set([...t1.piIndices, ...t2.piIndices]);
      result.push({ piIndices: combined });
    }
  }

  return simplifySOP(result);
}

/**
 * Simplifies an SOP expression using:
 * - X + X = X
 * - X + XY = X (Absorption law)
 */
function simplifySOP(sop: SOPTerm[]): SOPTerm[] {
  if (sop.length === 0) return [];

  // Sort by size to make absorption check easier
  const sorted = [...sop].sort((a, b) => a.piIndices.size - b.piIndices.size);
  const simplified: SOPTerm[] = [];

  for (const term of sorted) {
    // Check if term is already covered by a simpler term (absorption)
    // or if it's a duplicate
    const isRedundant = simplified.some((existing) => {
      // If existing is a subset of term, term is redundant (X + XY = X)
      for (const idx of existing.piIndices) {
        if (!term.piIndices.has(idx)) return false;
      }
      return true;
    });

    if (!isRedundant) {
      simplified.push(term);
    }
  }

  return simplified;
}

/**
 * Calculates the cost of a set of PIs.
 * Primary cost: Number of PIs.
 * Secondary cost: Total literals (non-'-' characters).
 */
function calculateCost(
  piIndices: Set<number>,
  allPIs: Implicant[],
): { terms: number; literals: number } {
  let literals = 0;
  for (const idx of piIndices) {
    const pattern = allPIs[idx].pattern;
    for (const char of pattern) {
      if (char !== '-') literals++;
    }
  }
  return { terms: piIndices.size, literals };
}

/**
 * Solves the cyclic coverage problem using Petrick's Method.
 * matrix[piIdx][targetIdx] is true if PI covers target.
 */
export function solveMinimumCover(
  activePIs: number[],
  activeTargets: number[],
  matrix: boolean[][],
  allPIs: Implicant[],
): number[] {
  if (activeTargets.length === 0) return [];
  if (activePIs.length === 0) return [];

  // 1. Build POS: Product of (Sums of PIs covering each target)
  const pos: SOPTerm[][] = activeTargets.map((tIdx) => {
    return activePIs
      .filter((piIdx) => matrix[piIdx][tIdx])
      .map((piIdx) => ({ piIndices: new Set([piIdx]) }));
  });

  // 2. Expand POS to SOP
  let currentSOP = pos[0];
  for (let i = 1; i < pos.length; i++) {
    currentSOP = multiplySOP(currentSOP, pos[i]);

    // Optimization: if SOP becomes too large, this might be slow.
    // However, for < 10 variables, it should be fine.
    if (currentSOP.length > 1000) {
      // Risk management: stop if too complex?
      // For now, let's keep it simple.
    }
  }

  // 3. Choose the best solution from SOP
  let bestSolution: Set<number> | null = null;
  let minCost = { terms: Infinity, literals: Infinity };

  for (const term of currentSOP) {
    const cost = calculateCost(term.piIndices, allPIs);
    if (
      cost.terms < minCost.terms ||
      (cost.terms === minCost.terms && cost.literals < minCost.literals)
    ) {
      minCost = cost;
      bestSolution = term.piIndices;
    }
  }

  return bestSolution ? Array.from(bestSolution) : [];
}
