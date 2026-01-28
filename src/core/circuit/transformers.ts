import type { Circuit } from './types.ts';

import { CircuitBuilder } from './builder.ts';

/**
 * Transforms a circuit to use only NAND gates.
 */
export function toNANDOnly(circuit: Circuit): Circuit {
  const builder = new CircuitBuilder();
  const memo = new Map<string, string>();

  // Add all inputs first
  for (const input of circuit.inputs) {
    builder.addInput(input);
  }

  function transformNode(nodeId: string): string {
    if (memo.has(nodeId)) return memo.get(nodeId)!;

    // If it's an input, return it directly
    if (circuit.inputs.includes(nodeId)) return nodeId;

    const node = circuit.gates[nodeId];
    if (!node) throw new Error(`Node ${nodeId} not found in circuit.`);

    const transformedInputs = node.inputs.map((input) => transformNode(input));
    let resultId: string;

    switch (node.type) {
      case 'not': {
        const a = transformedInputs[0];
        resultId = builder.addGate('nand', [a, a]);
        break;
      }
      case 'and': {
        const a = transformedInputs[0];
        const b = transformedInputs[1];
        const nandAB = builder.addGate('nand', [a, b]);
        resultId = builder.addGate('nand', [nandAB, nandAB]);
        break;
      }
      case 'or': {
        const a = transformedInputs[0];
        const b = transformedInputs[1];
        const notA = builder.addGate('nand', [a, a]);
        const notB = builder.addGate('nand', [b, b]);
        resultId = builder.addGate('nand', [notA, notB]);
        break;
      }
      case 'nand': {
        resultId = builder.addGate('nand', transformedInputs);
        break;
      }
      case 'vcc':
      case 'gnd':
        resultId = builder.addGate(node.type, []);
        break;
      default:
        // For complexity simplified, we focus on NOT, AND, OR.
        // Others could be decomposed too but might not be needed for basic SOP/POS result.
        throw new Error(`Transformer 'toNANDOnly' does not support gate type: ${node.type}`);
    }

    memo.set(nodeId, resultId);
    return resultId;
  }

  for (const [name, nodeId] of Object.entries(circuit.outputs)) {
    const transformedRoot = transformNode(nodeId);
    builder.setOutput(name, transformedRoot);
  }

  return builder.build();
}

/**
 * Transforms a circuit to use only NOR gates.
 */
export function toNOROnly(circuit: Circuit): Circuit {
  const builder = new CircuitBuilder();
  const memo = new Map<string, string>();

  for (const input of circuit.inputs) {
    builder.addInput(input);
  }

  function transformNode(nodeId: string): string {
    if (memo.has(nodeId)) return memo.get(nodeId)!;
    if (circuit.inputs.includes(nodeId)) return nodeId;

    const node = circuit.gates[nodeId];
    if (!node) throw new Error(`Node ${nodeId} not found in circuit.`);

    const transformedInputs = node.inputs.map((input) => transformNode(input));
    let resultId: string;

    switch (node.type) {
      case 'not': {
        const a = transformedInputs[0];
        resultId = builder.addGate('nor', [a, a]);
        break;
      }
      case 'or': {
        const a = transformedInputs[0];
        const b = transformedInputs[1];
        const norAB = builder.addGate('nor', [a, b]);
        resultId = builder.addGate('nor', [norAB, norAB]);
        break;
      }
      case 'and': {
        const a = transformedInputs[0];
        const b = transformedInputs[1];
        const notA = builder.addGate('nor', [a, a]);
        const notB = builder.addGate('nor', [b, b]);
        resultId = builder.addGate('nor', [notA, notB]);
        break;
      }
      case 'nor': {
        resultId = builder.addGate('nor', transformedInputs);
        break;
      }
      case 'vcc':
      case 'gnd':
        resultId = builder.addGate(node.type, []);
        break;
      default:
        throw new Error(`Transformer 'toNOROnly' does not support gate type: ${node.type}`);
    }

    memo.set(nodeId, resultId);
    return resultId;
  }

  for (const [name, nodeId] of Object.entries(circuit.outputs)) {
    const transformedRoot = transformNode(nodeId);
    builder.setOutput(name, transformedRoot);
  }

  return builder.build();
}

/**
 * Transforms a circuit to use only the enabled gates.
 */
export function toCustomGateSet(circuit: Circuit, enabledGates: Record<string, boolean>): Circuit {
  const builder = new CircuitBuilder();
  const memo = new Map<string, string>();

  // Add all inputs first
  for (const input of circuit.inputs) {
    builder.addInput(input);
  }

  function transformNode(nodeId: string): string {
    if (memo.has(nodeId)) return memo.get(nodeId)!;

    // If it's an input, return it directly
    if (circuit.inputs.includes(nodeId)) return nodeId;

    const node = circuit.gates[nodeId];
    if (!node) throw new Error(`Node ${nodeId} not found in circuit.`);

    const transformedInputs = node.inputs.map((input) => transformNode(input));
    const resultId = synthesize(node.type as any, transformedInputs);

    memo.set(nodeId, resultId);
    return resultId;
  }

  function synthesize(type: string, inputs: string[]): string {
    // Internal gates are always allowed
    if (type === 'vcc' || type === 'gnd' || type === 'buf') {
      return builder.addGate(type as any, inputs);
    }

    // If the gate itself is enabled, use it
    if (enabledGates[type]) {
      return builder.addGate(type as any, inputs);
    }

    // Decompositions
    switch (type) {
      case 'not':
        if (enabledGates.nand) return builder.addGate('nand', [inputs[0], inputs[0]]);
        if (enabledGates.nor) return builder.addGate('nor', [inputs[0], inputs[0]]);
        throw new Error('Cannot synthesize NOT gate with current enabled gates.');

      case 'and':
        if (enabledGates.nand) {
          const nand = builder.addGate('nand', inputs);
          return synthesize('not', [nand]);
        }
        if (enabledGates.nor) {
          const nots = inputs.map((i) => synthesize('not', [i]));
          return builder.addGate('nor', nots);
        }
        throw new Error('Cannot synthesize AND gate with current enabled gates.');

      case 'or':
        if (enabledGates.nor) {
          const nor = builder.addGate('nor', inputs);
          return synthesize('not', [nor]);
        }
        if (enabledGates.nand) {
          const nots = inputs.map((i) => synthesize('not', [i]));
          return builder.addGate('nand', nots);
        }
        throw new Error('Cannot synthesize OR gate with current enabled gates.');

      case 'nand':
        return synthesize('not', [synthesize('and', inputs)]);

      case 'nor':
        return synthesize('not', [synthesize('or', inputs)]);

      case 'xor': {
        const [a, b] = inputs;
        const notA = synthesize('not', [a]);
        const notB = synthesize('not', [b]);
        const term1 = synthesize('and', [a, notB]);
        const term2 = synthesize('and', [notA, b]);
        return synthesize('or', [term1, term2]);
      }

      case 'xnor':
        return synthesize('not', [synthesize('xor', inputs)]);

      default:
        throw new Error(`Unknown gate type for custom synthesis: ${type}`);
    }
  }

  for (const [name, nodeId] of Object.entries(circuit.outputs)) {
    const transformedRoot = transformNode(nodeId);
    builder.setOutput(name, transformedRoot);
  }

  return builder.build();
}
