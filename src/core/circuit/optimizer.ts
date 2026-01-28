import type { Circuit } from './types.ts';

import { CircuitBuilder } from './builder.ts';

/**
 * Performs peephole optimization on a circuit to remove redundant gates.
 * Currently supports:
 * - not(not(X)) -> X
 * - nand(nand(X, X), nand(X, X)) -> X
 * - nor(nor(X, X), nor(X, X)) -> X
 */
export function optimizeCircuit(circuit: Circuit): Circuit {
  const builder = new CircuitBuilder();
  const memo = new Map<string, string>();

  for (const input of circuit.inputs) {
    builder.addInput(input);
  }

  function getEffectiveNode(nodeId: string): string {
    if (memo.has(nodeId)) return memo.get(nodeId)!;
    if (circuit.inputs.includes(nodeId)) return nodeId;

    const node = circuit.gates[nodeId];
    if (!node) return nodeId;

    // Optimization: Double Negation check
    if (node.type === 'not') {
      const inputId = node.inputs[0];
      const inputNode = circuit.gates[inputId];
      if (inputNode && inputNode.type === 'not') {
        const result = getEffectiveNode(inputNode.inputs[0]);
        memo.set(nodeId, result);
        return result;
      }
    }

    // Optimization: NAND-based double negation: nand(nand(x,x), nand(x,x)) -> x
    if (node.type === 'nand' && node.inputs[0] === node.inputs[1]) {
      const inputId = node.inputs[0];
      const inputNode = circuit.gates[inputId];
      if (inputNode && inputNode.type === 'nand' && inputNode.inputs[0] === inputNode.inputs[1]) {
        const result = getEffectiveNode(inputNode.inputs[0]);
        memo.set(nodeId, result);
        return result;
      }
    }

    // Optimization: NOR-based double negation: nor(nor(x,x), nor(x,x)) -> x
    if (node.type === 'nor' && node.inputs[0] === node.inputs[1]) {
      const inputId = node.inputs[0];
      const inputNode = circuit.gates[inputId];
      if (inputNode && inputNode.type === 'nor' && inputNode.inputs[0] === inputNode.inputs[1]) {
        const result = getEffectiveNode(inputNode.inputs[0]);
        memo.set(nodeId, result);
        return result;
      }
    }

    // No optimization found, reconstruct node
    const optimizedInputs = node.inputs.map((input) => getEffectiveNode(input));
    const newNodeId = builder.addGate(node.type, optimizedInputs);
    memo.set(nodeId, newNodeId);
    return newNodeId;
  }

  for (const [name, nodeId] of Object.entries(circuit.outputs)) {
    const rootId = getEffectiveNode(nodeId);
    builder.setOutput(name, rootId);
  }

  return builder.build();
}
