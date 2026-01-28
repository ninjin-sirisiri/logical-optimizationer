import { type ASTNode, EvaluationError } from './types';

export type VariableAssignment = Record<string, boolean>;

/**
 * Evaluates an AST node with a given variable assignment.
 */
export function evaluate(ast: ASTNode, assignment: VariableAssignment): boolean {
  switch (ast.type) {
    case 'constant':
      return ast.value;

    case 'variable': {
      const val = assignment[ast.name];
      if (val === undefined) {
        throw new EvaluationError(`Variable '${ast.name}' is not defined in the assignment.`);
      }
      return val;
    }

    case 'unary':
      if (ast.operator === 'not') {
        return !evaluate(ast.operand, assignment);
      }
      throw new Error(`Unknown unary operator: ${(ast as any).operator}`);

    case 'binary': {
      const left = evaluate(ast.left, assignment);
      const right = evaluate(ast.right, assignment);

      switch (ast.operator) {
        case 'and':
          return left && right;
        case 'or':
          return left || right;
        case 'xor':
          return left !== right;
        default:
          throw new Error(`Unknown binary operator: ${(ast as any).operator}`);
      }
    }

    default:
      throw new Error(`Unknown node type: ${(ast as any).type}`);
  }
}

/**
 * Extracts all unique variable names from an AST.
 */
export function extractVariables(ast: ASTNode): string[] {
  const variables = new Set<string>();

  function walk(node: ASTNode) {
    if (node.type === 'variable') {
      variables.add(node.name);
    } else if (node.type === 'unary') {
      walk(node.operand);
    } else if (node.type === 'binary') {
      walk(node.left);
      walk(node.right);
    }
  }

  walk(ast);
  return Array.from(variables);
}
