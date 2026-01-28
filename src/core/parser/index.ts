import type { ASTNode } from './types';

import { evaluate, extractVariables, type VariableAssignment } from './evaluate';
import { Lexer } from './lexer';
import { Parser } from './parser';

export * from './types';
export * from './lexer';
export * from './parser';
export * from './evaluate';

/**
 * Parses a logic expression string into an AST.
 */
export function parse(input: string): ASTNode {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  return parser.parse();
}

/**
 * Evaluates a logic expression string with the given variable assignment.
 */
export function evaluateExpression(input: string, assignment: VariableAssignment): boolean {
  const ast = parse(input);
  return evaluate(ast, assignment);
}

/**
 * Extracts all variable names from a logic expression string.
 */
export function getVariables(input: string): string[] {
  const ast = parse(input);
  return extractVariables(ast);
}
