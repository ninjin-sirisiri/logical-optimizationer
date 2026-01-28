import { describe, expect, it } from 'bun:test';

import { solveMinimumCover } from '../petrick';
import { Implicant } from '../types';

describe("Petrick's Solver", () => {
  it('should solve a simple set-cover problem', () => {
    // Targets: T0, T1
    // PIs:
    // P0 covers T0
    // P1 covers T0, T1
    // P2 covers T1
    const allPIs: Implicant[] = [
      { pattern: '00', outputMask: 1 }, // P0
      { pattern: '0-', outputMask: 1 }, // P1
      { pattern: '01', outputMask: 1 }, // P2
    ];
    const activePIs = [0, 1, 2];
    const activeTargets = [0, 1];
    const matrix = [
      [true, false], // P0 covers T0
      [true, true], // P1 covers T0, T1
      [false, true], // P2 covers T1
    ];

    const solution = solveMinimumCover(activePIs, activeTargets, matrix, allPIs);

    // P1 is the best solution (1 term)
    expect(solution).toEqual([1]);
  });

  it('should choose cheaper solution (literals) when term count is equal', () => {
    // P0: 1 term, 2 literals (01)
    // P1: 1 term, 1 literal (0-)
    // Both cover T0
    const allPIs: Implicant[] = [
      { pattern: '01', outputMask: 1 },
      { pattern: '0-', outputMask: 1 },
    ];
    const activePIs = [0, 1];
    const activeTargets = [0];
    const matrix = [[true], [true]];

    const solution = solveMinimumCover(activePIs, activeTargets, matrix, allPIs);
    expect(solution).toEqual([1]);
  });

  it('should solve cyclic table example', () => {
    // Simplest cyclic table:
    // T0 covered by P0, P1
    // T1 covered by P1, P2
    // T2 covered by P2, P0
    const allPIs: Implicant[] = [
      { pattern: '000', outputMask: 1 },
      { pattern: '001', outputMask: 1 },
      { pattern: '010', outputMask: 1 },
    ];
    const activePIs = [0, 1, 2];
    const activeTargets = [0, 1, 2];
    const matrix = [
      [true, false, true], // P0 covers T0, T2
      [true, true, false], // P1 covers T0, T1
      [false, true, true], // P2 covers T1, T2
    ];

    const solution = solveMinimumCover(activePIs, activeTargets, matrix, allPIs);

    // Minimum cover needs 2 terms. Any pair would work, but solver should return one.
    expect(solution).toHaveLength(2);
  });
});
