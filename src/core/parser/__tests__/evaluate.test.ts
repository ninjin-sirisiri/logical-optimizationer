import { describe, expect, it } from 'bun:test';

import { evaluate, extractVariables } from '../evaluate';
import { Lexer } from '../lexer';
import { Parser } from '../parser';

describe('evaluate', () => {
  const parseStr = (input: string) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    return parser.parse();
  };

  it('should evaluate constants', () => {
    expect(evaluate(parseStr('0'), {})).toBe(false);
    expect(evaluate(parseStr('1'), {})).toBe(true);
  });

  it('should evaluate variables', () => {
    expect(evaluate(parseStr('A'), { A: true })).toBe(true);
    expect(evaluate(parseStr('A'), { A: false })).toBe(false);
  });

  it('should evaluate NOT', () => {
    expect(evaluate(parseStr('¬A'), { A: true })).toBe(false);
    expect(evaluate(parseStr('¬A'), { A: false })).toBe(true);
    expect(evaluate(parseStr('¬0'), {})).toBe(true);
  });

  it('should evaluate AND', () => {
    expect(evaluate(parseStr('A・B'), { A: true, B: true })).toBe(true);
    expect(evaluate(parseStr('A・B'), { A: true, B: false })).toBe(false);
  });

  it('should evaluate OR', () => {
    expect(evaluate(parseStr('A+B'), { A: false, B: false })).toBe(false);
    expect(evaluate(parseStr('A+B'), { A: true, B: false })).toBe(true);
  });

  it('should evaluate XOR', () => {
    expect(evaluate(parseStr('A⊕B'), { A: true, B: true })).toBe(false);
    expect(evaluate(parseStr('A⊕B'), { A: true, B: false })).toBe(true);
  });

  it('should evaluate complex expressions', () => {
    // A・B+C with A=1, B=0, C=1 => (1・0)+1 = 1
    expect(evaluate(parseStr('A・B+C'), { A: true, B: false, C: true })).toBe(true);
    // ¬(A+B) with A=0, B=0 => ¬(0) = 1
    expect(evaluate(parseStr('¬(A+B)'), { A: false, B: false })).toBe(true);
  });

  it('should throw EvaluationError for undefined variables', () => {
    expect(() => evaluate(parseStr('A'), {})).toThrow("Variable 'A' is not defined");
  });

  it('should extract variables correctly', () => {
    expect(extractVariables(parseStr('A・B+C'))).toEqual(['A', 'B', 'C']);
    expect(extractVariables(parseStr('¬A'))).toEqual(['A']);
    expect(extractVariables(parseStr('0+1'))).toEqual([]);
    // Ensure uniqueness
    expect(extractVariables(parseStr('A+A'))).toEqual(['A']);
  });
});
