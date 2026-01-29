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
    expect(expressionNodeToString(exprs.Y)).toBe('A ・ B');
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
    expect(expressionNodeToString(exprs.Y)).toBe('¬(¬(A ・ B) ・ C)');
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
    expect(expressionNodeToString(exprs.Y)).toBe('A + 1');
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

  test('converts XOR and NOR', () => {
    const circuit: Circuit = {
      inputs: ['A', 'B'],
      outputs: { Y: 'g1', Z: 'g2' },
      gates: {
        g1: { id: 'g1', type: 'xor', inputs: ['A', 'B'] },
        g2: { id: 'g2', type: 'nor', inputs: ['A', 'B'] },
      },
    };

    const exprs = circuitToExpressions(circuit);
    expect(expressionNodeToString(exprs.Y)).toBe('A ⊕ B');
    expect(expressionNodeToString(exprs.Z)).toBe('¬(A + B)');
  });

  test('removes redundant parentheses with precedence', () => {
    const circuit: Circuit = {
      inputs: ['A', 'B', 'C'],
      outputs: { Y: 'g2', Z: 'g4' },
      gates: {
        // A + B ・ C -> A + (B ・ C) -> A + B ・ C
        g1: { id: 'g1', type: 'and', inputs: ['B', 'C'] },
        g2: { id: 'g2', type: 'or', inputs: ['A', 'g1'] },
        // (A + B) ・ C
        g3: { id: 'g3', type: 'or', inputs: ['A', 'B'] },
        g4: { id: 'g4', type: 'and', inputs: ['g3', 'C'] },
      },
    };

    const exprs = circuitToExpressions(circuit);
    expect(expressionNodeToString(exprs.Y)).toBe('A + B ・ C');
    expect(expressionNodeToString(exprs.Z)).toBe('(A + B) ・ C');
  });
});
