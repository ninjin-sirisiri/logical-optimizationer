/**
 * Truth Table Module
 *
 * This module provides functionality for truth table representation,
 * generation from logical expressions, and conversion to SOP/POS forms.
 *
 * @module truth-table
 *
 * @example
 * // Generate truth table from expression
 * import { expressionToTruthTable, truthTableToExpression } from './truth-table';
 *
 * const table = expressionToTruthTable('A・B+C');
 * const sopAst = truthTableToExpression(table, 'Y', 'sop');
 */

import type { ASTNode } from '../parser/types';
import type { TruthTable } from './types';

import { truthTableToSOP, truthTableToPOS } from './converter';
import { generateTruthTableFromExpression } from './generator';

// Re-export all types and functions
export * from './types';
export * from './utils';
export * from './generator';
export * from './converter';

/**
 * Convenience function to generate a truth table from a logic expression string.
 *
 * This is an alias for {@link generateTruthTableFromExpression}.
 *
 * @param expression - Logic expression string (e.g., 'A・B+C')
 * @param outputName - Name for the output variable (default: 'Y')
 * @returns Complete truth table with all input patterns evaluated
 *
 * @example
 * const table = expressionToTruthTable('A⊕B');
 * console.log(table.entries.get('01')?.Y); // true (XOR)
 */
export function expressionToTruthTable(expression: string, outputName = 'Y'): TruthTable {
  return generateTruthTableFromExpression(expression, outputName);
}

/**
 * Converts a truth table to a logic expression AST.
 *
 * @param table - The truth table to convert
 * @param outputVar - Name of the output variable to convert
 * @param form - Output form: 'sop' (Sum of Products) or 'pos' (Product of Sums)
 * @returns AST node representing the logic expression
 *
 * @example
 * const table = expressionToTruthTable('A・B');
 * const sopAst = truthTableToExpression(table, 'Y', 'sop');
 * const posAst = truthTableToExpression(table, 'Y', 'pos');
 */
export function truthTableToExpression(
  table: TruthTable,
  outputVar: string,
  form: 'sop' | 'pos' = 'sop',
): ASTNode {
  if (form === 'pos') {
    return truthTableToPOS(table, outputVar);
  }
  return truthTableToSOP(table, outputVar);
}
