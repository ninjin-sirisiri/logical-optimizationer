/**
 * Truth Table Module Types
 *
 * This module defines the core data structures for truth table representation
 * and manipulation.
 *
 * @module truth-table/types
 */

/**
 * Maximum number of input variables supported in the truth table.
 * Limited to 10 for UI display (2^10 = 1024 rows).
 */
export const MAX_INPUT_VARIABLES = 10;

/**
 * Output value type supporting boolean values and "don't care" (x).
 * - true: output is 1
 * - false: output is 0
 * - 'x': don't care condition
 */
export type OutputValue = boolean | 'x';

/**
 * Output entry mapping output variable names to their values.
 * Each key is an output variable name, and the value is the output for that variable.
 *
 * @example
 * { Y: true, Z: false } // Two outputs: Y=1, Z=0
 */
export type OutputEntry = Record<string, OutputValue>;

/**
 * Truth table data structure.
 *
 * Uses a Map-based structure for efficient pattern-to-output lookup.
 * Patterns are stored as binary strings (e.g., "101" for A=1, B=0, C=1).
 *
 * @example
 * const table: TruthTable = {
 *   inputVariables: ['A', 'B'],
 *   outputVariables: ['Y'],
 *   entries: new Map([
 *     ['00', { Y: false }],
 *     ['01', { Y: false }],
 *     ['10', { Y: false }],
 *     ['11', { Y: true }],
 *   ])
 * };
 */
export interface TruthTable {
  /**
   * Ordered list of input variable names.
   * The order determines the bit position in pattern strings.
   */
  inputVariables: string[];

  /**
   * List of output variable names.
   */
  outputVariables: string[];

  /**
   * Map from input pattern (binary string) to output values.
   * Pattern string length equals inputVariables.length.
   */
  entries: Map<string, OutputEntry>;
}

/**
 * Error class for truth table operations.
 */
export class TruthTableError extends Error {
  public override message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'TruthTableError';
  }
}
