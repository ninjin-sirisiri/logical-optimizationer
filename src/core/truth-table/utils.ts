/**
 * Truth Table Utility Functions
 *
 * Provides helper functions for pattern generation, conversion between
 * patterns and variable assignments, and validation.
 *
 * @module truth-table/utils
 */

import type { VariableAssignment } from '../parser/evaluate';

import { MAX_INPUT_VARIABLES, TruthTableError } from './types';

/**
 * Generates all binary patterns for n variables.
 *
 * @param n - Number of variables (0 <= n <= MAX_INPUT_VARIABLES)
 * @returns Array of binary pattern strings, sorted in ascending order
 *
 * @example
 * generateAllPatterns(2) // => ['00', '01', '10', '11']
 * generateAllPatterns(0) // => ['']
 */
export function generateAllPatterns(n: number): string[] {
  if (n < 0) {
    throw new TruthTableError('Number of variables cannot be negative');
  }
  if (n === 0) {
    return [''];
  }

  const totalPatterns = 1 << n; // 2^n using bit shift
  const patterns: string[] = [];

  for (let i = 0; i < totalPatterns; i++) {
    patterns.push(i.toString(2).padStart(n, '0'));
  }

  return patterns;
}

/**
 * Converts a binary pattern string to a variable assignment object.
 *
 * @param pattern - Binary string (e.g., '101')
 * @param variables - Variable names in order (e.g., ['A', 'B', 'C'])
 * @returns Variable assignment object
 *
 * @example
 * patternToAssignment('101', ['A', 'B', 'C'])
 * // => { A: true, B: false, C: true }
 */
export function patternToAssignment(pattern: string, variables: string[]): VariableAssignment {
  if (pattern.length !== variables.length) {
    throw new TruthTableError(
      `Pattern length (${pattern.length}) does not match variable count (${variables.length})`,
    );
  }

  const assignment: VariableAssignment = {};
  for (let i = 0; i < variables.length; i++) {
    assignment[variables[i]] = pattern[i] === '1';
  }
  return assignment;
}

/**
 * Converts a variable assignment to a binary pattern string.
 *
 * @param assignment - Variable assignment object
 * @param variables - Variable names in order
 * @returns Binary pattern string
 *
 * @example
 * assignmentToPattern({ A: true, B: false, C: true }, ['A', 'B', 'C'])
 * // => '101'
 */
export function assignmentToPattern(assignment: VariableAssignment, variables: string[]): string {
  let pattern = '';
  for (const variable of variables) {
    if (assignment[variable] === undefined) {
      throw new TruthTableError(`Variable '${variable}' not found in assignment`);
    }
    pattern += assignment[variable] ? '1' : '0';
  }
  return pattern;
}

/**
 * Validates that the variable count does not exceed the maximum limit.
 *
 * @param count - Number of variables to validate
 * @throws TruthTableError if count exceeds MAX_INPUT_VARIABLES
 *
 * @example
 * validateVariableCount(5);  // OK
 * validateVariableCount(11); // Throws TruthTableError
 */
export function validateVariableCount(count: number): void {
  if (count > MAX_INPUT_VARIABLES) {
    throw new TruthTableError(
      `Variable count (${count}) exceeds maximum allowed (${MAX_INPUT_VARIABLES})`,
    );
  }
}
