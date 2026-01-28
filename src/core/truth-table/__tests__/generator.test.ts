import { describe, expect, test } from 'bun:test';

import { parse } from '../../parser';
import { generateTruthTable, generateTruthTableFromExpression } from '../generator';
import { TruthTableError } from '../types';

describe('generateTruthTable', () => {
  describe('single variable expressions', () => {
    test('single variable A', () => {
      const ast = parse('A');
      const table = generateTruthTable(ast);

      expect(table.inputVariables).toEqual(['A']);
      expect(table.outputVariables).toEqual(['Y']);
      expect(table.entries.size).toBe(2);
      expect(table.entries.get('0')?.Y).toBe(false);
      expect(table.entries.get('1')?.Y).toBe(true);
    });

    test('constant true', () => {
      const ast = parse('1');
      const table = generateTruthTable(ast);

      expect(table.inputVariables).toEqual([]);
      expect(table.entries.size).toBe(1);
      expect(table.entries.get('')?.Y).toBe(true);
    });

    test('constant false', () => {
      const ast = parse('0');
      const table = generateTruthTable(ast);

      expect(table.inputVariables).toEqual([]);
      expect(table.entries.size).toBe(1);
      expect(table.entries.get('')?.Y).toBe(false);
    });
  });

  describe('two variable expressions', () => {
    test('A ・ B (AND)', () => {
      const ast = parse('A・B');
      const table = generateTruthTable(ast);

      expect(table.inputVariables).toEqual(['A', 'B']);
      expect(table.entries.size).toBe(4);
      expect(table.entries.get('00')?.Y).toBe(false);
      expect(table.entries.get('01')?.Y).toBe(false);
      expect(table.entries.get('10')?.Y).toBe(false);
      expect(table.entries.get('11')?.Y).toBe(true);
    });

    test('A + B (OR)', () => {
      const ast = parse('A+B');
      const table = generateTruthTable(ast);

      expect(table.entries.get('00')?.Y).toBe(false);
      expect(table.entries.get('01')?.Y).toBe(true);
      expect(table.entries.get('10')?.Y).toBe(true);
      expect(table.entries.get('11')?.Y).toBe(true);
    });

    test('A ⊕ B (XOR)', () => {
      const ast = parse('A⊕B');
      const table = generateTruthTable(ast);

      expect(table.entries.get('00')?.Y).toBe(false);
      expect(table.entries.get('01')?.Y).toBe(true);
      expect(table.entries.get('10')?.Y).toBe(true);
      expect(table.entries.get('11')?.Y).toBe(false);
    });
  });

  describe('complex expressions', () => {
    test('¬A ・ B + C (3 variables)', () => {
      const ast = parse('¬A・B+C');
      const table = generateTruthTable(ast);

      expect(table.inputVariables).toEqual(['A', 'B', 'C']);
      expect(table.entries.size).toBe(8);
    });

    test('expression with parentheses', () => {
      const ast = parse('(A+B)・C');
      const table = generateTruthTable(ast);

      expect(table.inputVariables).toEqual(['A', 'B', 'C']);
      expect(table.entries.get('000')?.Y).toBe(false);
      expect(table.entries.get('001')?.Y).toBe(false);
      expect(table.entries.get('011')?.Y).toBe(true);
      expect(table.entries.get('101')?.Y).toBe(true);
      expect(table.entries.get('111')?.Y).toBe(true);
    });
  });

  describe('custom output name', () => {
    test('uses custom output name', () => {
      const ast = parse('A・B');
      const table = generateTruthTable(ast, 'F');

      expect(table.outputVariables).toEqual(['F']);
      expect(table.entries.get('11')?.F).toBe(true);
    });
  });
});

describe('generateTruthTableFromExpression', () => {
  test('generates table from string expression', () => {
    const table = generateTruthTableFromExpression('A・B');

    expect(table.inputVariables).toEqual(['A', 'B']);
    expect(table.entries.size).toBe(4);
    expect(table.entries.get('11')?.Y).toBe(true);
  });

  test('uses custom output name', () => {
    const table = generateTruthTableFromExpression('A+B', 'Output');

    expect(table.outputVariables).toEqual(['Output']);
    expect(table.entries.get('00')?.Output).toBe(false);
  });
});

describe('variable count validation', () => {
  test('rejects more than 10 variables', () => {
    // Create an expression with 11 variables using ・ operator
    const vars = Array.from({ length: 11 }, (_, i) => `V${i}`).join('・');
    const ast = parse(vars);

    expect(() => generateTruthTable(ast)).toThrow(TruthTableError);
  });

  test('accepts exactly 10 variables', () => {
    const vars = Array.from({ length: 10 }, (_, i) => `V${i}`).join('・');
    const ast = parse(vars);

    expect(() => generateTruthTable(ast)).not.toThrow();
    const table = generateTruthTable(ast);
    expect(table.entries.size).toBe(1024); // 2^10
  });
});
