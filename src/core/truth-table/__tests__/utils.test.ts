import { describe, expect, test } from 'bun:test';

import { TruthTableError } from '../types';
import {
  generateAllPatterns,
  patternToAssignment,
  assignmentToPattern,
  validateVariableCount,
} from '../utils';

describe('generateAllPatterns', () => {
  test('n=0 returns empty pattern', () => {
    expect(generateAllPatterns(0)).toEqual(['']);
  });

  test('n=1 returns 2 patterns', () => {
    expect(generateAllPatterns(1)).toEqual(['0', '1']);
  });

  test('n=2 returns 4 patterns in order', () => {
    expect(generateAllPatterns(2)).toEqual(['00', '01', '10', '11']);
  });

  test('n=3 returns 8 patterns', () => {
    const patterns = generateAllPatterns(3);
    expect(patterns.length).toBe(8);
    expect(patterns[0]).toBe('000');
    expect(patterns[7]).toBe('111');
  });

  test('negative n throws error', () => {
    expect(() => generateAllPatterns(-1)).toThrow(TruthTableError);
  });
});

describe('patternToAssignment', () => {
  test('converts binary pattern to assignment', () => {
    const result = patternToAssignment('101', ['A', 'B', 'C']);
    expect(result).toEqual({ A: true, B: false, C: true });
  });

  test('converts all zeros', () => {
    const result = patternToAssignment('00', ['X', 'Y']);
    expect(result).toEqual({ X: false, Y: false });
  });

  test('converts all ones', () => {
    const result = patternToAssignment('111', ['A', 'B', 'C']);
    expect(result).toEqual({ A: true, B: true, C: true });
  });

  test('handles empty pattern with empty variables', () => {
    const result = patternToAssignment('', []);
    expect(result).toEqual({});
  });

  test('throws on mismatched length', () => {
    expect(() => patternToAssignment('101', ['A', 'B'])).toThrow(TruthTableError);
  });
});

describe('assignmentToPattern', () => {
  test('converts assignment to binary pattern', () => {
    const result = assignmentToPattern({ A: true, B: false, C: true }, ['A', 'B', 'C']);
    expect(result).toBe('101');
  });

  test('converts all false to zeros', () => {
    const result = assignmentToPattern({ X: false, Y: false }, ['X', 'Y']);
    expect(result).toBe('00');
  });

  test('handles empty assignment', () => {
    const result = assignmentToPattern({}, []);
    expect(result).toBe('');
  });

  test('roundtrip with patternToAssignment', () => {
    const variables = ['A', 'B', 'C'];
    const original = '110';
    const assignment = patternToAssignment(original, variables);
    const pattern = assignmentToPattern(assignment, variables);
    expect(pattern).toBe(original);
  });

  test('throws on missing variable', () => {
    expect(() => assignmentToPattern({ A: true }, ['A', 'B'])).toThrow(TruthTableError);
  });
});

describe('validateVariableCount', () => {
  test('accepts count within limit', () => {
    expect(() => validateVariableCount(0)).not.toThrow();
    expect(() => validateVariableCount(5)).not.toThrow();
    expect(() => validateVariableCount(10)).not.toThrow();
  });

  test('throws for count exceeding limit', () => {
    expect(() => validateVariableCount(11)).toThrow(TruthTableError);
    expect(() => validateVariableCount(20)).toThrow(TruthTableError);
  });
});
