import { describe, expect, it } from 'bun:test';

import { Lexer } from '../lexer';
import { Parser } from '../parser';

describe('Parser', () => {
  const parse = (input: string) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    return parser.parse();
  };

  it('should parse basic atoms', () => {
    expect(parse('A')).toEqual({ type: 'variable', name: 'A' });
    expect(parse('0')).toEqual({ type: 'constant', value: false });
    expect(parse('1')).toEqual({ type: 'constant', value: true });
  });

  it('should parse unary NOT', () => {
    expect(parse('¬A')).toEqual({
      type: 'unary',
      operator: 'not',
      operand: { type: 'variable', name: 'A' },
    });
    expect(parse('¬¬A')).toEqual({
      type: 'unary',
      operator: 'not',
      operand: {
        type: 'unary',
        operator: 'not',
        operand: { type: 'variable', name: 'A' },
      },
    });
  });

  it('should parse binary operators', () => {
    expect(parse('A・B')).toEqual({
      type: 'binary',
      operator: 'and',
      left: { type: 'variable', name: 'A' },
      right: { type: 'variable', name: 'B' },
    });
    expect(parse('A+B')).toEqual({
      type: 'binary',
      operator: 'or',
      left: { type: 'variable', name: 'A' },
      right: { type: 'variable', name: 'B' },
    });
    expect(parse('A⊕B')).toEqual({
      type: 'binary',
      operator: 'xor',
      left: { type: 'variable', name: 'A' },
      right: { type: 'variable', name: 'B' },
    });
  });

  it('should handle operator precedence (NOT > AND > XOR > OR)', () => {
    // A + B ・ C => A + (B ・ C)
    expect(parse('A+B・C')).toEqual({
      type: 'binary',
      operator: 'or',
      left: { type: 'variable', name: 'A' },
      right: {
        type: 'binary',
        operator: 'and',
        left: { type: 'variable', name: 'B' },
        right: { type: 'variable', name: 'C' },
      },
    });

    // A ・ B + C => (A ・ B) + C
    expect(parse('A・B+C')).toEqual({
      type: 'binary',
      operator: 'or',
      left: {
        type: 'binary',
        operator: 'and',
        left: { type: 'variable', name: 'A' },
        right: { type: 'variable', name: 'B' },
      },
      right: { type: 'variable', name: 'C' },
    });

    // ¬A ・ B => (¬A) ・ B
    expect(parse('¬A・B')).toEqual({
      type: 'binary',
      operator: 'and',
      left: {
        type: 'unary',
        operator: 'not',
        operand: { type: 'variable', name: 'A' },
      },
      right: { type: 'variable', name: 'B' },
    });
  });

  it('should handle left associativity', () => {
    // A + B + C => (A + B) + C
    expect(parse('A+B+C')).toEqual({
      type: 'binary',
      operator: 'or',
      left: {
        type: 'binary',
        operator: 'or',
        left: { type: 'variable', name: 'A' },
        right: { type: 'variable', name: 'B' },
      },
      right: { type: 'variable', name: 'C' },
    });
  });

  it('should handle parentheses', () => {
    // (A + B) ・ C
    expect(parse('(A+B)・C')).toEqual({
      type: 'binary',
      operator: 'and',
      left: {
        type: 'binary',
        operator: 'or',
        left: { type: 'variable', name: 'A' },
        right: { type: 'variable', name: 'B' },
      },
      right: { type: 'variable', name: 'C' },
    });
  });

  it('should throw Error on invalid syntax', () => {
    expect(() => parse('')).toThrow('Unexpected end of input');
    expect(() => parse('(')).toThrow('Unexpected end of input');
    expect(() => parse('(A')).toThrow('Expected closing parenthesis');
    expect(() => parse('A+')).toThrow('Unexpected end of input');
  });
});
