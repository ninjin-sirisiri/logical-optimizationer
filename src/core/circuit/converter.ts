import type { ASTNode } from '../parser/types.ts';
import type { Circuit } from './types.ts';

import { CircuitBuilder } from './builder.ts';

/**
 * Generates a structural key for an AST node to detect common sub-expressions.
 */
function getASTKey(node: ASTNode): string {
  switch (node.type) {
    case 'constant':
      return `const:${node.value}`;
    case 'variable':
      return `var:${node.name}`;
    case 'unary':
      return `${node.operator}(${getASTKey(node.operand)})`;
    case 'binary':
      // Sort inputs for commutative operators (and, or, xor) to improve sharing
      const k1 = getASTKey(node.left);
      const k2 = getASTKey(node.right);
      if (node.operator === 'and' || node.operator === 'or' || node.operator === 'xor') {
        const sorted = [k1, k2].toSorted();
        return `${node.operator}(${sorted[0]},${sorted[1]})`;
      }
      return `${node.operator}(${k1},${k2})`;
  }
}

/**
 * Converts an AST to a Circuit DAG.
 * Supports multiple outputs by taking a map of output names to AST nodes.
 */
export function convertASTToCircuit(outputs: Record<string, ASTNode>): Circuit {
  const builder = new CircuitBuilder();
  const memo = new Map<string, string>();

  function processNode(node: ASTNode): string {
    const key = getASTKey(node);
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    let nodeId: string;
    switch (node.type) {
      case 'constant':
        nodeId = builder.addGate(node.value ? 'vcc' : 'gnd', []);
        break;
      case 'variable':
        nodeId = builder.addInput(node.name);
        break;
      case 'unary':
        const operandId = processNode(node.operand);
        nodeId = builder.addGate(node.operator, [operandId]);
        break;
      case 'binary':
        const leftId = processNode(node.left);
        const rightId = processNode(node.right);
        nodeId = builder.addGate(node.operator, [leftId, rightId]);
        break;
    }

    memo.set(key, nodeId);
    return nodeId;
  }

  for (const [name, node] of Object.entries(outputs)) {
    const rootId = processNode(node);
    builder.setOutput(name, rootId);
  }

  return builder.build();
}
