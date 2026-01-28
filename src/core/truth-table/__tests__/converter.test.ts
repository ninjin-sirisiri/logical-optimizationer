import { describe, expect, test } from 'bun:test';

import type { TruthTable, OutputEntry } from '../types';

import { parse } from '../../parser';
import { evaluate } from '../../parser/evaluate';
import { truthTableToSOP, truthTableToPOS } from '../converter';
import { generateTruthTable } from '../generator';

/**
 * Helper to create a truth table from a map of patterns to output values.
 */
function createTable(
  inputVars: string[],
  outputVar: string,
  values: Record<string, boolean | 'x'>,
): TruthTable {
  const entries = new Map<string, OutputEntry>();
  for (const [pattern, value] of Object.entries(values)) {
    entries.set(pattern, { [outputVar]: value });
  }
  return {
    inputVariables: inputVars,
    outputVariables: [outputVar],
    entries,
  };
}

/**
 * Evaluates an AST against all patterns and returns the truth table values.
 */
function evaluateAllPatterns(
  ast: ReturnType<typeof parse>,
  variables: string[],
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  const n = variables.length;
  const total = n === 0 ? 1 : 1 << n;

  for (let i = 0; i < total; i++) {
    const pattern = n === 0 ? '' : i.toString(2).padStart(n, '0');
    const assignment: Record<string, boolean> = {};
    for (let j = 0; j < n; j++) {
      assignment[variables[j]] = pattern[j] === '1';
    }
    result[pattern] = evaluate(ast, assignment);
  }

  return result;
}

describe('truthTableToSOP', () => {
  describe('basic cases', () => {
    test('AND function (single minterm)', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': false,
        '01': false,
        '10': false,
        '11': true,
      });

      const ast = truthTableToSOP(table, 'Y');

      // Should produce A・B
      expect(ast.type).toBe('binary');
      const results = evaluateAllPatterns(ast, ['A', 'B']);
      expect(results['00']).toBe(false);
      expect(results['01']).toBe(false);
      expect(results['10']).toBe(false);
      expect(results['11']).toBe(true);
    });

    test('OR function (3 minterms)', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': false,
        '01': true,
        '10': true,
        '11': true,
      });

      const ast = truthTableToSOP(table, 'Y');

      const results = evaluateAllPatterns(ast, ['A', 'B']);
      expect(results['00']).toBe(false);
      expect(results['01']).toBe(true);
      expect(results['10']).toBe(true);
      expect(results['11']).toBe(true);
    });

    test('XOR function', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': false,
        '01': true,
        '10': true,
        '11': false,
      });

      const ast = truthTableToSOP(table, 'Y');

      const results = evaluateAllPatterns(ast, ['A', 'B']);
      expect(results['00']).toBe(false);
      expect(results['01']).toBe(true);
      expect(results['10']).toBe(true);
      expect(results['11']).toBe(false);
    });

    test('all false returns constant false', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': false,
        '01': false,
        '10': false,
        '11': false,
      });

      const ast = truthTableToSOP(table, 'Y');

      expect(ast).toEqual({ type: 'constant', value: false });
    });

    test('all true returns all minterms', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': true,
        '01': true,
        '10': true,
        '11': true,
      });

      const ast = truthTableToSOP(table, 'Y');

      const results = evaluateAllPatterns(ast, ['A', 'B']);
      expect(Object.values(results).every((v) => v)).toBe(true);
    });
  });
});

describe('truthTableToPOS', () => {
  describe('basic cases', () => {
    test('AND function', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': false,
        '01': false,
        '10': false,
        '11': true,
      });

      const ast = truthTableToPOS(table, 'Y');

      const results = evaluateAllPatterns(ast, ['A', 'B']);
      expect(results['00']).toBe(false);
      expect(results['01']).toBe(false);
      expect(results['10']).toBe(false);
      expect(results['11']).toBe(true);
    });

    test('OR function (single maxterm)', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': false,
        '01': true,
        '10': true,
        '11': true,
      });

      const ast = truthTableToPOS(table, 'Y');

      // Should produce A+B (single maxterm)
      const results = evaluateAllPatterns(ast, ['A', 'B']);
      expect(results['00']).toBe(false);
      expect(results['01']).toBe(true);
      expect(results['10']).toBe(true);
      expect(results['11']).toBe(true);
    });

    test('all false returns all maxterms', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': false,
        '01': false,
        '10': false,
        '11': false,
      });

      const ast = truthTableToPOS(table, 'Y');

      const results = evaluateAllPatterns(ast, ['A', 'B']);
      expect(Object.values(results).every((v) => !v)).toBe(true);
    });

    test('all true returns constant true', () => {
      const table = createTable(['A', 'B'], 'Y', {
        '00': true,
        '01': true,
        '10': true,
        '11': true,
      });

      const ast = truthTableToPOS(table, 'Y');

      expect(ast).toEqual({ type: 'constant', value: true });
    });
  });
});

describe("Don't Care handling", () => {
  test('SOP skips dont care rows', () => {
    const table = createTable(['A', 'B'], 'Y', {
      '00': false,
      '01': 'x',
      '10': true,
      '11': 'x',
    });

    const ast = truthTableToSOP(table, 'Y');

    // Only pattern '10' is true, so should be A・¬B
    const results = evaluateAllPatterns(ast, ['A', 'B']);
    expect(results['00']).toBe(false);
    expect(results['10']).toBe(true);
    // '01' and '11' are don't care so their results don't matter for verification
  });

  test('POS skips dont care rows', () => {
    const table = createTable(['A', 'B'], 'Y', {
      '00': 'x',
      '01': false,
      '10': 'x',
      '11': true,
    });

    const ast = truthTableToPOS(table, 'Y');

    // Only pattern '01' is false
    const results = evaluateAllPatterns(ast, ['A', 'B']);
    expect(results['01']).toBe(false);
    expect(results['11']).toBe(true);
  });
});

describe('multiple output handling', () => {
  test('converts correct output variable', () => {
    const entries = new Map<string, OutputEntry>();
    entries.set('00', { Y: false, Z: true });
    entries.set('01', { Y: true, Z: false });
    entries.set('10', { Y: false, Z: true });
    entries.set('11', { Y: true, Z: false });

    const table: TruthTable = {
      inputVariables: ['A', 'B'],
      outputVariables: ['Y', 'Z'],
      entries,
    };

    const astY = truthTableToSOP(table, 'Y');
    const astZ = truthTableToSOP(table, 'Z');

    // Y is true for '01' and '11' (B=1)
    const resultsY = evaluateAllPatterns(astY, ['A', 'B']);
    expect(resultsY['01']).toBe(true);
    expect(resultsY['11']).toBe(true);
    expect(resultsY['00']).toBe(false);
    expect(resultsY['10']).toBe(false);

    // Z is true for '00' and '10' (B=0)
    const resultsZ = evaluateAllPatterns(astZ, ['A', 'B']);
    expect(resultsZ['00']).toBe(true);
    expect(resultsZ['10']).toBe(true);
    expect(resultsZ['01']).toBe(false);
    expect(resultsZ['11']).toBe(false);
  });
});

describe('roundtrip conversion', () => {
  test('expression -> truth table -> SOP -> truth table', () => {
    // Original expression
    const originalAst = parse('A⊕B');
    const originalTable = generateTruthTable(originalAst, 'Y');

    // Convert to SOP
    const sopAst = truthTableToSOP(originalTable, 'Y');

    // Generate truth table from SOP
    const variables = ['A', 'B'];
    const sopResults = evaluateAllPatterns(sopAst, variables);

    // Compare with original
    for (const [pattern, entry] of originalTable.entries) {
      expect(sopResults[pattern]).toBe(entry.Y as boolean);
    }
  });

  test('expression -> truth table -> POS -> truth table', () => {
    // Original expression
    const originalAst = parse('(A+B)・C');
    const originalTable = generateTruthTable(originalAst, 'Y');

    // Convert to POS
    const posAst = truthTableToPOS(originalTable, 'Y');

    // Generate truth table from POS
    const variables = ['A', 'B', 'C'];
    const posResults = evaluateAllPatterns(posAst, variables);

    // Compare with original
    for (const [pattern, entry] of originalTable.entries) {
      expect(posResults[pattern]).toBe(entry.Y as boolean);
    }
  });
});
