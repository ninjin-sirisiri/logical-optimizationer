/**
 * Truth Table Converter
 *
 * Converts truth tables to Sum of Products (SOP) or Product of Sums (POS) form.
 *
 * @module truth-table/converter
 */

import type { ASTNode, BinaryOperator } from '../parser/types';
import type { TruthTable } from './types';

// Utils imported if needed in future

/**
 * Converts a truth table to Sum of Products (SOP) form.
 *
 * SOP collects all rows where output is true and creates minterms
 * (AND of literals), then combines them with OR.
 *
 * @param table - The truth table to convert
 * @param outputVar - Name of the output variable to convert
 * @returns AST node representing the SOP expression
 *
 * @example
 * // For AND gate truth table, returns AST for "A・B"
 * const ast = truthTableToSOP(andTable, 'Y');
 */
export function truthTableToSOP(table: TruthTable, outputVar: string): ASTNode {
  const minterms: ASTNode[] = [];

  for (const [pattern, outputs] of table.entries) {
    const value = outputs[outputVar];
    // Skip false and don't care values
    if (value === true) {
      const minterm = createMinterm(table.inputVariables, pattern);
      minterms.push(minterm);
    }
  }

  // Handle edge cases
  if (minterms.length === 0) {
    return { type: 'constant', value: false };
  }
  if (minterms.length === 1) {
    return minterms[0];
  }

  // Combine minterms with OR
  return combineWithOperator(minterms, 'or');
}

/**
 * Converts a truth table to Product of Sums (POS) form.
 *
 * POS collects all rows where output is false and creates maxterms
 * (OR of literals), then combines them with AND.
 *
 * @param table - The truth table to convert
 * @param outputVar - Name of the output variable to convert
 * @returns AST node representing the POS expression
 *
 * @example
 * // For OR gate truth table, returns AST for "A+B"
 * const ast = truthTableToPOS(orTable, 'Y');
 */
export function truthTableToPOS(table: TruthTable, outputVar: string): ASTNode {
  const maxterms: ASTNode[] = [];

  for (const [pattern, outputs] of table.entries) {
    const value = outputs[outputVar];
    // Skip true and don't care values
    if (value === false) {
      const maxterm = createMaxterm(table.inputVariables, pattern);
      maxterms.push(maxterm);
    }
  }

  // Handle edge cases
  if (maxterms.length === 0) {
    return { type: 'constant', value: true };
  }
  if (maxterms.length === 1) {
    return maxterms[0];
  }

  // Combine maxterms with AND
  return combineWithOperator(maxterms, 'and');
}

/**
 * Creates a minterm (AND term) from a pattern.
 *
 * For SOP: '0' becomes NOT(var), '1' becomes var
 *
 * @internal
 */
function createMinterm(variables: string[], pattern: string): ASTNode {
  if (variables.length === 0) {
    return { type: 'constant', value: true };
  }

  const literals: ASTNode[] = [];

  for (let i = 0; i < variables.length; i++) {
    const varNode: ASTNode = { type: 'variable', name: variables[i] };

    if (pattern[i] === '0') {
      // Negated literal
      literals.push({ type: 'unary', operator: 'not', operand: varNode });
    } else {
      // Positive literal
      literals.push(varNode);
    }
  }

  if (literals.length === 1) {
    return literals[0];
  }

  return combineWithOperator(literals, 'and');
}

/**
 * Creates a maxterm (OR term) from a pattern.
 *
 * For POS: '0' becomes var, '1' becomes NOT(var)
 * (opposite of minterm)
 *
 * @internal
 */
function createMaxterm(variables: string[], pattern: string): ASTNode {
  if (variables.length === 0) {
    return { type: 'constant', value: false };
  }

  const literals: ASTNode[] = [];

  for (let i = 0; i < variables.length; i++) {
    const varNode: ASTNode = { type: 'variable', name: variables[i] };

    if (pattern[i] === '1') {
      // Negated literal (opposite of minterm)
      literals.push({ type: 'unary', operator: 'not', operand: varNode });
    } else {
      // Positive literal
      literals.push(varNode);
    }
  }

  if (literals.length === 1) {
    return literals[0];
  }

  return combineWithOperator(literals, 'or');
}

/**
 * Combines multiple AST nodes with a binary operator.
 *
 * Creates a left-associative tree: ((a op b) op c) op d
 *
 * @internal
 */
function combineWithOperator(nodes: ASTNode[], operator: BinaryOperator): ASTNode {
  if (nodes.length === 0) {
    throw new Error('Cannot combine empty node list');
  }
  if (nodes.length === 1) {
    return nodes[0];
  }

  let result = nodes[0];
  for (let i = 1; i < nodes.length; i++) {
    result = {
      type: 'binary',
      operator,
      left: result,
      right: nodes[i],
    };
  }
  return result;
}
