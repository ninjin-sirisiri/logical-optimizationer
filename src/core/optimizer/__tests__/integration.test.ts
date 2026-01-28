import { describe, expect, it } from 'bun:test';

import type { TruthTable } from '../../truth-table/types';

import { minimize } from '../index';

describe('Logic Optimizer Integration', () => {
  it('should optimize a 3-variable XOR truth table (SOP)', () => {
    // Y = A XOR B XOR C
    // 1 at 001, 010, 100, 111
    const table: TruthTable = {
      inputVariables: ['A', 'B', 'C'],
      outputVariables: ['Y'],
      entries: new Map([
        ['000', { Y: false }],
        ['001', { Y: true }],
        ['010', { Y: true }],
        ['011', { Y: false }],
        ['100', { Y: true }],
        ['101', { Y: false }],
        ['110', { Y: false }],
        ['111', { Y: true }],
      ]),
    };

    const results = minimize(table, 'SOP');
    expect(results).toHaveLength(1);
    // XOR cannot be simplified into simpler PIs than the minterms themselves (it's "full")
    expect(results[0].implicants).toHaveLength(4);
    // Optimized expression should contain the minterms
    expect(results[0].optimizedExpression).toContain('¬A・¬B・C');
    expect(results[0].optimizedExpression).toContain('A・B・C');
  });

  it('should optimize a simple function (SOP)', () => {
    // Y = AB + AC -> A(B+C) ?
    // No, SOP is AB + AC
    // 1 at 110, 111, 101
    const table: TruthTable = {
      inputVariables: ['A', 'B', 'C'],
      outputVariables: ['Y'],
      entries: new Map([
        ['110', { Y: true }],
        ['111', { Y: true }],
        ['101', { Y: true }],
        ['000', { Y: false }],
      ]),
    };

    const results = minimize(table, 'SOP');
    // PIs: AB ('11-'), AC ('1-1')
    expect(results[0].implicants.toSorted()).toEqual(['1-1', '11-']);
    expect(results[0].optimizedExpression).toBe('A・B + A・C');
  });

  it('should optimize to POS form', () => {
    // Y = A + B (OR)
    // SOP: A + B
    // POS: (A + B)
    const table: TruthTable = {
      inputVariables: ['A', 'B'],
      outputVariables: ['Y'],
      entries: new Map([
        ['00', { Y: false }],
        ['01', { Y: true }],
        ['10', { Y: true }],
        ['11', { Y: true }],
      ]),
    };

    const results = minimize(table, 'POS');
    expect(results[0].optimizedExpression).toBe('(A + B)');
  });

  it('should handle multiple outputs with shared terms', () => {
    // Y = A'B + AB = B
    // Z = AB + AB' = A
    const table: TruthTable = {
      inputVariables: ['A', 'B'],
      outputVariables: ['Y', 'Z'],
      entries: new Map([
        ['00', { Y: false, Z: false }],
        ['01', { Y: true, Z: false }],
        ['10', { Y: false, Z: true }],
        ['11', { Y: true, Z: true }],
      ]),
    };

    const results = minimize(table, 'SOP');
    expect(results[0].optimizedExpression).toBe('B');
    expect(results[1].optimizedExpression).toBe('A');
  });

  it("should handle Don't Cares gracefully", () => {
    // Y = A is 1 at 10, 11. If 11 is X, PI is still A.
    const table: TruthTable = {
      inputVariables: ['A', 'B'],
      outputVariables: ['Y'],
      entries: new Map([
        ['00', { Y: false }],
        ['01', { Y: false }],
        ['10', { Y: true }],
        ['11', { Y: 'x' }],
      ]),
    };

    const results = minimize(table, 'SOP');
    expect(results[0].implicants).toEqual(['1-']);
    expect(results[0].optimizedExpression).toBe('A');
  });
});
