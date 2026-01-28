import { describe, expect, test } from 'bun:test';

import { parse } from '../../parser';
import { evaluate } from '../../parser/evaluate';
import {
  expressionToTruthTable,
  truthTableToExpression,
  TruthTableError,
  type TruthTable,
  type OutputEntry,
} from '../index';

/**
 * Evaluates an AST against all patterns and compares with expected values.
 */
function compareTruthTables(
  ast: ReturnType<typeof parse>,
  table: TruthTable,
  outputVar: string,
): boolean {
  const variables = table.inputVariables;

  for (const [pattern, entry] of table.entries) {
    const assignment: Record<string, boolean> = {};
    for (let i = 0; i < variables.length; i++) {
      assignment[variables[i]] = pattern[i] === '1';
    }

    const expected = entry[outputVar];
    if (expected === 'x') continue; // Skip don't care

    const result = evaluate(ast, assignment);
    if (result !== expected) {
      return false;
    }
  }

  return true;
}

describe('Integration: Basic Workflow', () => {
  test('expression -> truth table -> SOP -> verify equivalence', () => {
    const expression = 'A・B+C';
    const table = expressionToTruthTable(expression, 'Y');
    const sopAst = truthTableToExpression(table, 'Y', 'sop');

    expect(compareTruthTables(sopAst, table, 'Y')).toBe(true);
  });

  test('expression -> truth table -> POS -> verify equivalence', () => {
    const expression = '(A+B)・¬C';
    const table = expressionToTruthTable(expression, 'Y');
    const posAst = truthTableToExpression(table, 'Y', 'pos');

    expect(compareTruthTables(posAst, table, 'Y')).toBe(true);
  });

  test('default form is SOP', () => {
    const table = expressionToTruthTable('A⊕B');
    const defaultAst = truthTableToExpression(table, 'Y');
    const sopAst = truthTableToExpression(table, 'Y', 'sop');

    // Both should produce equivalent results
    expect(compareTruthTables(defaultAst, table, 'Y')).toBe(true);
    expect(compareTruthTables(sopAst, table, 'Y')).toBe(true);
  });
});

describe('Integration: Multiple Outputs', () => {
  test('manually constructed multi-output table', () => {
    // Create a table with two outputs: Y = A・B, Z = A+B
    const entries = new Map<string, OutputEntry>();
    entries.set('00', { Y: false, Z: false });
    entries.set('01', { Y: false, Z: true });
    entries.set('10', { Y: false, Z: true });
    entries.set('11', { Y: true, Z: true });

    const table: TruthTable = {
      inputVariables: ['A', 'B'],
      outputVariables: ['Y', 'Z'],
      entries,
    };

    const yAst = truthTableToExpression(table, 'Y', 'sop');
    const zAst = truthTableToExpression(table, 'Z', 'sop');

    // Verify Y behaves like AND
    expect(compareTruthTables(yAst, table, 'Y')).toBe(true);

    // Verify Z behaves like OR
    expect(compareTruthTables(zAst, table, 'Z')).toBe(true);
  });
});

describe('Integration: Edge Cases', () => {
  test('single variable expression', () => {
    const table = expressionToTruthTable('A');

    expect(table.inputVariables).toEqual(['A']);
    expect(table.entries.size).toBe(2);

    const ast = truthTableToExpression(table, 'Y');
    expect(compareTruthTables(ast, table, 'Y')).toBe(true);
  });

  test('constant true expression', () => {
    const table = expressionToTruthTable('1');

    expect(table.inputVariables).toEqual([]);
    expect(table.entries.size).toBe(1);
    expect(table.entries.get('')?.Y).toBe(true);

    const ast = truthTableToExpression(table, 'Y');
    // For constant true with no inputs, SOP should return the single minterm
    expect(evaluate(ast, {})).toBe(true);
  });

  test('constant false expression', () => {
    const table = expressionToTruthTable('0');

    expect(table.inputVariables).toEqual([]);
    expect(table.entries.size).toBe(1);
    expect(table.entries.get('')?.Y).toBe(false);

    const ast = truthTableToExpression(table, 'Y');
    expect(ast).toEqual({ type: 'constant', value: false });
  });

  test('maximum 10 variables', () => {
    const vars = Array.from({ length: 10 }, (_, i) => `V${i}`).join('・');
    const table = expressionToTruthTable(vars);

    expect(table.inputVariables.length).toBe(10);
    expect(table.entries.size).toBe(1024); // 2^10
  });
});

describe('Integration: Error Cases', () => {
  test('11 variables throws TruthTableError', () => {
    const vars = Array.from({ length: 11 }, (_, i) => `V${i}`).join('・');

    expect(() => expressionToTruthTable(vars)).toThrow(TruthTableError);
  });
});

describe('Integration: Roundtrip Verification', () => {
  test('complex expression roundtrip', () => {
    const originalExpr = '¬A・B+A・¬B';
    const table = expressionToTruthTable(originalExpr, 'Y');

    // Convert to SOP
    const sopAst = truthTableToExpression(table, 'Y', 'sop');
    expect(compareTruthTables(sopAst, table, 'Y')).toBe(true);

    // Convert to POS
    const posAst = truthTableToExpression(table, 'Y', 'pos');
    expect(compareTruthTables(posAst, table, 'Y')).toBe(true);
  });

  test('XOR expression roundtrip', () => {
    const table = expressionToTruthTable('A⊕B');

    // XOR truth table check
    expect(table.entries.get('00')?.Y).toBe(false);
    expect(table.entries.get('01')?.Y).toBe(true);
    expect(table.entries.get('10')?.Y).toBe(true);
    expect(table.entries.get('11')?.Y).toBe(false);

    // SOP form should be equivalent
    const sopAst = truthTableToExpression(table, 'Y');
    expect(compareTruthTables(sopAst, table, 'Y')).toBe(true);
  });

  test('three variable expression roundtrip', () => {
    const originalExpr = 'A・B・C+¬A・¬B';
    const table = expressionToTruthTable(originalExpr);

    const sopAst = truthTableToExpression(table, 'Y', 'sop');
    const posAst = truthTableToExpression(table, 'Y', 'pos');

    expect(compareTruthTables(sopAst, table, 'Y')).toBe(true);
    expect(compareTruthTables(posAst, table, 'Y')).toBe(true);
  });
});
