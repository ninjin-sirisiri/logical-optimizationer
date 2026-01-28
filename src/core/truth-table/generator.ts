/**
 * Truth Table Generator
 *
 * Generates truth tables from logical expressions or ASTs.
 *
 * @module truth-table/generator
 */

import type { ASTNode } from '../parser/types';
import type { TruthTable, OutputEntry } from './types';

import { evaluate, extractVariables } from '../parser/evaluate';
import { parse } from '../parser/index';
import { generateAllPatterns, patternToAssignment, validateVariableCount } from './utils';

/**
 * Generates a truth table from a logic expression AST.
 *
 * @param ast - The AST of the logic expression
 * @param outputName - Name for the output variable (default: 'Y')
 * @returns Complete truth table with all input patterns evaluated
 *
 * @throws TruthTableError if variable count exceeds MAX_INPUT_VARIABLES
 *
 * @example
 * const ast = parse('A & B');
 * const table = generateTruthTable(ast);
 * // table.entries.get('11').Y === true
 */
export function generateTruthTable(ast: ASTNode, outputName = 'Y'): TruthTable {
  // Extract and sort input variables
  const inputVariables = [...extractVariables(ast)].toSorted();

  // Validate variable count
  validateVariableCount(inputVariables.length);

  // Generate all input patterns
  const patterns = generateAllPatterns(inputVariables.length);

  // Evaluate each pattern
  const entries = new Map<string, OutputEntry>();
  for (const pattern of patterns) {
    const assignment = patternToAssignment(pattern, inputVariables);
    const result = evaluate(ast, assignment);
    entries.set(pattern, { [outputName]: result });
  }

  return {
    inputVariables,
    outputVariables: [outputName],
    entries,
  };
}

/**
 * Generates a truth table from a logic expression string.
 *
 * This is a convenience wrapper that parses the expression first.
 *
 * @param expression - Logic expression string (e.g., 'A & B | ~C')
 * @param outputName - Name for the output variable (default: 'Y')
 * @returns Complete truth table
 *
 * @throws ParseError if expression is invalid
 * @throws TruthTableError if variable count exceeds MAX_INPUT_VARIABLES
 *
 * @example
 * const table = generateTruthTableFromExpression('A ^ B');
 * // Creates XOR truth table
 */

export function generateTruthTableFromExpression(expression: string, outputName = 'Y'): TruthTable {
  const ast = parse(expression);
  return generateTruthTable(ast, outputName);
}
