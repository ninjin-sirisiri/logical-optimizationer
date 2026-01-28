import { describe, expect, it } from 'bun:test';

import { parse, evaluateExpression, getVariables, ParseError } from '../index';

describe('Parser Integration', () => {
  it('should parse and evaluate a complex expression', () => {
    // ¬(A ・ B) + C ⊕ D
    const expr = '¬(A ・ B) + C ⊕ D';

    // A=T, B=T, C=F, D=F => ¬(T) + F ⊕ F = F + F = F
    expect(evaluateExpression(expr, { A: true, B: true, C: false, D: false })).toBe(false);

    // A=F, B=T, C=F, D=T => ¬(F) + F ⊕ T = T + T = T
    expect(evaluateExpression(expr, { A: false, B: true, C: false, D: true })).toBe(true);
  });

  it('should handle superscript variables', () => {
    const expr = 'A₀ ・ A₁ + B₀ ・ B₁';
    const vars = getVariables(expr);
    expect(vars).toContain('A₀');
    expect(vars).toContain('A₁');
    expect(vars).toContain('B₀');
    expect(vars).toContain('B₁');

    expect(evaluateExpression(expr, { 'A₀': true, 'A₁': true, 'B₀': false, 'B₁': false })).toBe(
      true,
    );
    expect(evaluateExpression(expr, { 'A₀': false, 'A₁': true, 'B₀': true, 'B₁': true })).toBe(
      true,
    );
    expect(evaluateExpression(expr, { 'A₀': false, 'A₁': false, 'B₀': false, 'B₁': false })).toBe(
      false,
    );
  });

  it('should handle nested parentheses', () => {
    const expr = '((A + B) ・ (C + D))';
    expect(evaluateExpression(expr, { A: true, B: false, C: false, D: true })).toBe(true);
    expect(evaluateExpression(expr, { A: false, B: false, C: true, D: true })).toBe(false);
  });

  it('should correctly extract variables', () => {
    expect(getVariables('A ・ B + C')).toEqual(['A', 'B', 'C']);
  });

  it('should propagate ParseError with position', () => {
    try {
      parse('A + @');
      expect.unreachable('Should have thrown ParseError');
    } catch (e) {
      expect(e).toBeInstanceOf(ParseError);
      expect((e as any).position).toBe(4);
    }
  });

  it('should generate a truth table', () => {
    const expr = 'A ⊕ B';
    const combinations = [
      { A: false, B: false, expected: false },
      { A: false, B: true, expected: true },
      { A: true, B: false, expected: true },
      { A: true, B: true, expected: false },
    ];

    for (const { A, B, expected } of combinations) {
      expect(evaluateExpression(expr, { A, B })).toBe(expected);
    }
  });
});
