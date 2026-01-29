import { describe, expect, it } from 'bun:test';

import type { Term } from '../types';

import { generatePrimeImplicants } from '../qm';

describe('generatePrimeImplicants', () => {
  it('should handle a simple AND table (single output)', () => {
    // A B | Y
    // 1 1 | 1
    const terms: Term[] = [{ pattern: '11', outputMask: 1, combined: false, weight: 2 }];
    const pis = generatePrimeImplicants(terms);
    expect(pis).toHaveLength(1);
    expect(pis[0].pattern).toBe('11');
    expect(pis[0].outputMask).toBe(1);
  });

  it('should handle a simple OR table (single output)', () => {
    // A B | Y
    // 0 1 | 1
    // 1 0 | 1
    // 1 1 | 1
    const terms: Term[] = [
      { pattern: '01', outputMask: 1, combined: false, weight: 1 },
      { pattern: '10', outputMask: 1, combined: false, weight: 1 },
      { pattern: '11', outputMask: 1, combined: false, weight: 2 },
    ];
    const pis = generatePrimeImplicants(terms);
    // OR(A,B) gives PIs: A ('1-'), B ('-1')
    expect(pis).toHaveLength(2);
    const patterns = pis.map((p) => p.pattern).toSorted();
    expect(patterns).toEqual(['-1', '1-']);
  });

  it("should handle Don't Cares", () => {
    // Example: Y = A'B' + AB (XOR inverted) but with (1,0) as Don't Care
    // A B | Y
    // 0 0 | 1
    // 0 1 | 0
    // 1 0 | X
    // 1 1 | 1
    const terms: Term[] = [
      { pattern: '00', outputMask: 1, combined: false, weight: 0 },
      { pattern: '10', outputMask: 1, combined: false, weight: 1 }, // Don't Care included in PI gen
      { pattern: '11', outputMask: 1, combined: false, weight: 2 },
    ];
    const pis = generatePrimeImplicants(terms);
    // (0,0) and (1,0) -> (-0)
    // (1,0) and (1,1) -> (1-)
    const patterns = pis.map((p) => p.pattern).toSorted();
    expect(patterns).toEqual(['-0', '1-']);
  });

  it('should handle multi-output cases', () => {
    // Output 0: Y = A (10, 11)
    // Output 1: Z = B (01, 11)
    // Combined terms:
    // (10, mask 1), (11, mask 3), (01, mask 2)
    const terms: Term[] = [
      { pattern: '10', outputMask: 1, combined: false, weight: 1 },
      { pattern: '01', outputMask: 2, combined: false, weight: 1 },
      { pattern: '11', outputMask: 3, combined: false, weight: 2 },
    ];
    const pis = generatePrimeImplicants(terms);

    // Output 0 (mask 1):
    // (10, mask 1) + (11, mask 1) -> (1-, mask 1)
    // Output 1 (mask 2):
    // (01, mask 2) + (11, mask 2) -> (-1, mask 2)
    // Shared PI?
    // In this case, 11 is shared, but combining (10,11) for mask 1
    // and (01,11) for mask 2 produces different PIs.

    const sortedPis = pis.toSorted((a, b) => a.pattern.localeCompare(b.pattern));
    expect(sortedPis).toHaveLength(2);
    expect(sortedPis[0].pattern).toBe('-1');
    expect(sortedPis[0].outputMask).toBe(2);
    expect(sortedPis[1].pattern).toBe('1-');
    expect(sortedPis[1].outputMask).toBe(1);
  });
});
