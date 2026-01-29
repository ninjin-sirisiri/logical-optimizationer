import { describe, expect, it } from 'bun:test';

import type { Target } from '../table';
import type { Implicant } from '../types';

import { PITable } from '../table';

describe('PITable', () => {
  it('should identify Essential Prime Implicants', () => {
    // Standard example from textbooks
    const pis: Implicant[] = [
      { pattern: '00--', outputMask: 1 }, // P1 covers 0, 1, 2, 3
      { pattern: '1-0-', outputMask: 1 }, // P2 covers 8, 9, 10, 11
      { pattern: '-1-1', outputMask: 1 }, // P3 covers 5, 7, 13, 15
    ];

    // Let's say we have minterms 0, 8, 5
    const targets: Target[] = [
      { pattern: '0000', outputIndex: 0 }, // 0
      { pattern: '1000', outputIndex: 0 }, // 8
      { pattern: '0101', outputIndex: 0 }, // 5
    ];

    const table = new PITable(pis, targets);
    const epis = table.findEPIs();

    // All of them are essential because each is the only one covering their respective minterm
    expect(epis.toSorted()).toEqual([0, 1, 2]);
  });

  it('should identify non-essential PIs', () => {
    const pis: Implicant[] = [
      { pattern: '0-', outputMask: 1 }, // covers 0, 1
      { pattern: '-1', outputMask: 1 }, // covers 1, 3
      { pattern: '01', outputMask: 1 }, // covers 1 (redundant)
    ];

    const targets: Target[] = [
      { pattern: '00', outputIndex: 0 }, // 0
      { pattern: '01', outputIndex: 0 }, // 1
      { pattern: '11', outputIndex: 0 }, // 3
    ];

    const table = new PITable(pis, targets);
    const epis = table.findEPIs();

    // P1 is essential for 0
    // P2 is essential for 3
    // P3 covers 1, but 1 is also covered by P1 and P2. P3 is not essential for anything.
    expect(epis.toSorted()).toEqual([0, 1]);
  });

  it('should reduce table correctly', () => {
    const pis: Implicant[] = [
      { pattern: '0-', outputMask: 1 }, // P0
      { pattern: '-1', outputMask: 1 }, // P1
    ];
    const targets: Target[] = [
      { pattern: '00', outputIndex: 0 },
      { pattern: '01', outputIndex: 0 },
      { pattern: '11', outputIndex: 0 },
    ];

    const table = new PITable(pis, targets);
    table.reduce();

    // Both P0 and P1 should be selected as EPIs, leaving 0 targets
    expect(table.getActiveTargets()).toHaveLength(0);
  });
});
