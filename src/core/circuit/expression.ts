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

/**
 * Converts an ExpressionNode to a string representation.
 */
export function expressionNodeToString(node: ExpressionNode): string {
  if (node.type === 'input' || node.type === 'constant') {
    return node.value;
  }

  if (!node.children || node.children.length === 0) {
    return node.value;
  }

  // Use operator style for standard gates if requested, but functional style is safer for custom gates
  // The plan suggests functional style: NAND(A, B)
  const childrenStr = node.children.map(expressionNodeToString).join(', ');
  return `${node.value}(${childrenStr})`;
}
