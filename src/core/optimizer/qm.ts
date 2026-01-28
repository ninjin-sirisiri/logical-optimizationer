import { Implicant, Term } from './types';

/**
 * Computes the Hamming weight of a pattern string (number of '1's).
 */
function getWeight(pattern: string): number {
  let count = 0;
  for (const char of pattern) {
    if (char === '1') count++;
  }
  return count;
}

/**
 * Checks if two patterns can be combined (differ by exactly one bit).
 * Returns the combined pattern or null if they cannot be combined.
 */
function combinePatterns(p1: string, p2: string): string | null {
  if (p1.length !== p2.length) return null;

  let diffCount = 0;
  let combined = '';

  for (let i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i]) {
      // If the difference is at a position where one has '-' and other has 0/1,
      // or both have different '-' positions (shouldn't happen if grouped by weight),
      // they cannot be combined.
      if (p1[i] === '-' || p2[i] === '-') return null;
      diffCount++;
      combined += '-';
    } else {
      combined += p1[i];
    }
  }

  return diffCount === 1 ? combined : null;
}

/**
 * Generates all Prime Implicants from a set of terms using the Quine-McCluskey algorithm.
 * Supports multi-output optimization via bitmasks.
 */
export function generatePrimeImplicants(initialTerms: Term[]): Implicant[] {
  if (initialTerms.length === 0) return [];

  // Track uncovered masks for each term at each level
  // level -> pattern -> mask
  let currentTerms = new Map<string, number>();
  for (const term of initialTerms) {
    currentTerms.set(term.pattern, (currentTerms.get(term.pattern) || 0) | term.outputMask);
  }

  const primeImplicants = new Map<string, number>();

  while (currentTerms.size > 0) {
    const nextTerms = new Map<string, number>();
    const combinedMasks = new Map<string, number>(); // pattern -> mask of bits that were successfully combined

    // Group current patterns by weight
    const patterns = Array.from(currentTerms.keys());
    const groups: Map<number, string[]> = new Map();
    for (const p of patterns) {
      const w = getWeight(p);
      if (!groups.has(w)) groups.set(w, []);
      groups.get(w)!.push(p);
    }

    const weights = Array.from(groups.keys()).sort((a, b) => a - b);

    // Try combining patterns in adjacent weight groups
    for (let i = 0; i < weights.length - 1; i++) {
      const w1 = weights[i];
      const w2 = weights[i + 1];

      // Weight difference must be 1 (or more if some groups are empty, but we only skip empty groups)
      // Actually strictly 1 because combinePatterns checks for diffCount === 1
      if (w2 !== w1 + 1) continue;

      for (const p1 of groups.get(w1)!) {
        for (const p2 of groups.get(w2)!) {
          const combined = combinePatterns(p1, p2);
          if (combined) {
            const intersection = currentTerms.get(p1)! & currentTerms.get(p2)!;
            if (intersection > 0) {
              // Mark both p1 and p2 as combined for these bits
              combinedMasks.set(p1, (combinedMasks.get(p1) || 0) | intersection);
              combinedMasks.set(p2, (combinedMasks.get(p2) || 0) | intersection);

              // Add combined term to next level
              nextTerms.set(combined, (nextTerms.get(combined) || 0) | intersection);
            }
          }
        }
      }
    }

    // Identify Prime Implicants at this level
    // Any bit in a term's mask that was NOT combined into a larger term is a PI
    for (const [pattern, mask] of currentTerms.entries()) {
      const combined = combinedMasks.get(pattern) || 0;
      const piMask = mask & ~combined;
      if (piMask > 0) {
        primeImplicants.set(pattern, (primeImplicants.get(pattern) || 0) | piMask);
      }
    }

    currentTerms = nextTerms;
  }

  return Array.from(primeImplicants.entries()).map(([pattern, outputMask]) => ({
    pattern,
    outputMask,
  }));
}
