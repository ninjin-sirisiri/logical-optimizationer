import type { Circuit } from './types';

export interface ExpressionNode {
  type: 'gate' | 'input' | 'constant';
  value: string; // "AND", "OR", "A", "VCC", etc.
  gateId?: string;
  children?: ExpressionNode[];
}

/**
 * Converts a Circuit to a set of nested ExpressionNodes, one for each output.
 */
export function circuitToExpressions(circuit: Circuit): Record<string, ExpressionNode> {
  const expressions: Record<string, ExpressionNode> = {};

  for (const [outputName, nodeId] of Object.entries(circuit.outputs)) {
    expressions[outputName] = buildExpressionNode(nodeId, circuit);
  }

  return expressions;
}

function buildExpressionNode(nodeId: string, circuit: Circuit): ExpressionNode {
  // If it's directly an input variable ID
  if (circuit.inputs.includes(nodeId)) {
    return {
      type: 'input',
      value: nodeId,
    };
  }

  const gate = circuit.gates[nodeId];
  if (!gate) {
    // Special case for constants if they aren't explicitly in gates
    if (nodeId === 'VCC' || nodeId === 'GND') {
      return {
        type: 'constant',
        value: nodeId,
      };
    }
    return {
      type: 'constant',
      value: 'Unknown',
    };
  }

  if (gate.type === 'vcc' || gate.type === 'gnd') {
    return {
      type: 'constant',
      value: gate.type.toUpperCase(),
      gateId: gate.id,
    };
  }

  if (gate.type === 'input') {
    return {
      type: 'input',
      value: gate.label || nodeId,
      gateId: gate.id,
    };
  }

  return {
    type: 'gate',
    value: gate.type.toUpperCase(),
    gateId: gate.id,
    children: gate.inputs.map((inputId) => buildExpressionNode(inputId, circuit)),
  };
}

const PRECEDENCE: Record<string, number> = {
  not: 4,
  and: 3,
  nand: 4, // NAND is ¬(AND), effectively a NOT at the top
  xor: 2,
  xnor: 4, // XNOR is ¬(XOR)
  or: 1,
  nor: 4, // NOR is ¬(OR)
  buf: 5,
};

/**
 * Converts an ExpressionNode to a string representation using Boolean algebra notation.
 * Removes redundant parentheses based on operator precedence.
 */
export function expressionNodeToString(node: ExpressionNode, parentPrecedence = 0): string {
  if (node.type === 'input' || node.type === 'constant') {
    return node.value === 'VCC' ? '1' : node.value === 'GND' ? '0' : node.value;
  }

  if (!node.children || node.children.length === 0) {
    return node.value;
  }

  const op = node.value.toLowerCase();
  const currentPrecedence = PRECEDENCE[op] ?? 0;

  let result = '';
  const children = node.children;

  switch (op) {
    case 'not':
      result = '¬' + expressionNodeToString(children[0], PRECEDENCE.not);
      break;
    case 'and':
    case 'or':
    case 'xor': {
      const symbol = op === 'and' ? ' ・ ' : op === 'or' ? ' + ' : ' ⊕ ';
      result = children
        .map((child) => expressionNodeToString(child, currentPrecedence))
        .join(symbol);
      break;
    }
    case 'nand':
    case 'nor':
    case 'xnor': {
      const innerSymbol = op === 'nand' ? ' ・ ' : op === 'nor' ? ' + ' : ' ⊕ ';
      const innerPrecedence = op === 'nand' ? 3 : op === 'nor' ? 1 : 2;
      const innerStr = children
        .map((child) => expressionNodeToString(child, innerPrecedence))
        .join(innerSymbol);
      result = `¬(${innerStr})`;
      break;
    }
    case 'buf':
      return expressionNodeToString(children[0], parentPrecedence);
    default:
      result = `${node.value}(${children
        .map((child) => expressionNodeToString(child, 0))
        .join(', ')})`;
  }

  if (parentPrecedence > currentPrecedence && currentPrecedence > 0) {
    return `(${result})`;
  }

  return result;
}
