import { describe, expect, it } from 'bun:test';

import { Lexer } from '../lexer';
import { TokenType } from '../types';

describe('Lexer', () => {
  it('should tokenize basic variables and constants', () => {
    const lexer = new Lexer('A 0 1');

    let token = lexer.next();
    expect(token.type).toBe(TokenType.Variable);
    expect(token.value).toBe('A');

    token = lexer.next();
    expect(token.type).toBe(TokenType.Constant);
    expect(token.value).toBe('0');

    token = lexer.next();
    expect(token.type).toBe(TokenType.Constant);
    expect(token.value).toBe('1');

    token = lexer.next();
    expect(token.type).toBe(TokenType.Eof);
  });

  it('should tokenize operators', () => {
    const lexer = new Lexer('A・B + C ¬ D ⊕ E');

    expect(lexer.next().type).toBe(TokenType.Variable);
    expect(lexer.next().type).toBe(TokenType.And);
    expect(lexer.next().type).toBe(TokenType.Variable);
    expect(lexer.next().type).toBe(TokenType.Or);
    expect(lexer.next().type).toBe(TokenType.Variable);
    expect(lexer.next().type).toBe(TokenType.Not);
    expect(lexer.next().type).toBe(TokenType.Variable);
    expect(lexer.next().type).toBe(TokenType.Xor);
    expect(lexer.next().type).toBe(TokenType.Variable);
    expect(lexer.next().type).toBe(TokenType.Eof);
  });

  it('should tokenize parentheses', () => {
    const lexer = new Lexer('(A)');
    expect(lexer.next().type).toBe(TokenType.LeftParen);
    expect(lexer.next().type).toBe(TokenType.Variable);
    expect(lexer.next().type).toBe(TokenType.RightParen);
    expect(lexer.next().type).toBe(TokenType.Eof);
  });

  it('should handle complex variable names with subscripts', () => {
    const lexer = new Lexer('input_1 A₀ B₁₂₃');

    let token = lexer.next();
    expect(token.type).toBe(TokenType.Variable);
    expect(token.value).toBe('input_1');

    token = lexer.next();
    expect(token.type).toBe(TokenType.Variable);
    expect(token.value).toBe('A₀');

    token = lexer.next();
    expect(token.type).toBe(TokenType.Variable);
    expect(token.value).toBe('B₁₂₃');
  });

  it('should throw ParseError on unexpected characters', () => {
    const lexer = new Lexer('A @ B');
    lexer.next(); // A
    expect(() => lexer.next()).toThrow('Unexpected character: @');
  });

  it('should peek without advancing position', () => {
    const lexer = new Lexer('A');
    const peeked = lexer.peek();
    expect(peeked.type).toBe(TokenType.Variable);
    expect(peeked.value).toBe('A');

    const next = lexer.next();
    expect(next).toEqual(peeked);

    expect(lexer.next().type).toBe(TokenType.Eof);
  });
});
