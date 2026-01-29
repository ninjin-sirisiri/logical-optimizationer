import { expect, test, describe } from 'bun:test';

import type { Circuit } from '../types';

import { circuitToExpressions, expressionNodeToString } from '../expression';

describe('circuitToExpressions', () => {
  test('converts simple AND circuit', () => {
    const circuit: Circuit = {
      inputs: ['A', 'B'],
      outputs: { Y: 'g1' },
      gates: {
        g1: { id: 'g1', type: 'and', inputs: ['A', 'B'] },
      },
    };

    const exprs = circuitToExpressions(circuit);
    expect(exprs.Y.type).toBe('gate');
    expect(exprs.Y.value).toBe('AND');
    expect(exprs.Y.children?.length).toBe(2);
    expect(expressionNodeToString(exprs.Y)).toBe('AND(A, B)');
  });

  test('converts nested NAND circuit', () => {
    const circuit: Circuit = {
      inputs: ['A', 'B', 'C'],
      outputs: { Y: 'g2' },
      gates: {
        g1: { id: 'g1', type: 'nand', inputs: ['A', 'B'] },
        g2: { id: 'g2', type: 'nand', inputs: ['g1', 'C'] },
      },
    };

    const exprs = circuitToExpressions(circuit);
    expect(expressionNodeToString(exprs.Y)).toBe('NAND(NAND(A, B), C)');
  });

  test('handles constants', () => {
    const circuit: Circuit = {
      inputs: ['A'],
      outputs: { Y: 'g1' },
      gates: {
        g1: { id: 'g1', type: 'or', inputs: ['A', 'VCC'] },
      },
    };

    const exprs = circuitToExpressions(circuit);
    expect(expressionNodeToString(exprs.Y)).toBe('OR(A, VCC)');
  });

  test('removes double negation when optimized', () => {
    const { optimizeCircuit } = require('../optimizer');
    const circuit: Circuit = {
      inputs: ['A'],
      outputs: { Y: 'g2' },
      gates: {
        g1: { id: 'g1', type: 'not', inputs: ['A'] },
        g2: { id: 'g2', type: 'not', inputs: ['g1'] },
      },
    };

    const optimized = optimizeCircuit(circuit);
    const exprs = circuitToExpressions(optimized);
    expect(expressionNodeToString(exprs.Y)).toBe('A');
  });
});
