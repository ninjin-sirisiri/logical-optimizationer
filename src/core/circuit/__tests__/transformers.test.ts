import { describe, expect, it } from 'bun:test';

import { evaluate } from '../../parser/evaluate.ts';
import { parse } from '../../parser/index.ts';
import { convertASTToCircuit } from '../converter.ts';
import { toCustomGateSet } from '../transformers.ts';

function evaluateCircuit(
  circuit: any,
  outputName: string,
  inputValues: Record<string, boolean>,
): boolean {
  const rootId = circuit.outputs[outputName];
  if (!rootId) return false;
  const memo = new Map<string, boolean>();

  function evalNode(nodeId: string): boolean {
    if (inputValues.hasOwnProperty(nodeId)) return inputValues[nodeId];
    if (memo.has(nodeId)) return memo.get(nodeId)!;

    const node = circuit.gates[nodeId];
    if (!node) return false;
    const nodeInputs = node.inputs.map((id: string) => evalNode(id));
    let result: boolean;

    switch (node.type) {
      case 'and':
        result = nodeInputs[0] && nodeInputs[1];
        break;
      case 'or':
        result = nodeInputs[0] || nodeInputs[1];
        break;
      case 'not':
        result = !nodeInputs[0];
        break;
      case 'nand':
        result = !(nodeInputs[0] && (nodeInputs[1] ?? nodeInputs[0]));
        break;
      case 'nor':
        result = !(nodeInputs[0] || (nodeInputs[1] ?? nodeInputs[0]));
        break;
      case 'xor':
        result = nodeInputs[0] !== nodeInputs[1];
        break;
      case 'xnor':
        result = nodeInputs[0] === nodeInputs[1];
        break;
      case 'vcc':
        result = true;
        break;
      case 'gnd':
        result = false;
        break;
      case 'buf':
        result = nodeInputs[0];
        break;
      default:
        throw new Error(`Unknown gate type: ${node.type}`);
    }

    memo.set(nodeId, result);
    return result;
  }

  return evalNode(rootId);
}

function checkEquivalence(originalAST: any, circuit: any, inputs: string[]) {
  const combinations = 1 << inputs.length;
  for (let i = 0; i < combinations; i++) {
    const values: Record<string, boolean> = {};
    inputs.forEach((input, index) => {
      values[input] = !!(i & (1 << index));
    });

    const originalResult = evaluate(originalAST, values);
    const circuitResult = evaluateCircuit(circuit, 'Y', values);

    expect(circuitResult).toBe(originalResult);
  }
}

describe('toCustomGateSet', () => {
  const expr = 'A & B | ~C';
  const inputs = ['A', 'B', 'C'];
  const ast = parse(expr);
  const initialCircuit = convertASTToCircuit({ Y: ast });

  it('should maintain logical equivalence with NAND and NOT enabled', () => {
    const enabled = { nand: true, not: true };
    const circuit = toCustomGateSet(initialCircuit, enabled as any);
    for (const gate of Object.values(circuit.gates)) {
      expect(['nand', 'not', 'vcc', 'gnd', 'buf']).toContain(gate.type);
    }
    checkEquivalence(ast, circuit, inputs);
  });

  it('should maintain logical equivalence with only NOR enabled', () => {
    const enabled = { nor: true };
    const circuit = toCustomGateSet(initialCircuit, enabled as any);
    for (const gate of Object.values(circuit.gates)) {
      expect(['nor', 'vcc', 'gnd', 'buf']).toContain(gate.type);
    }
    checkEquivalence(ast, circuit, inputs);
  });

  it('should work with a mix of complex gates', () => {
    const enabled = { xor: true, not: true, and: true, or: true };
    const circuit = toCustomGateSet(initialCircuit, enabled as any);
    checkEquivalence(ast, circuit, inputs);
  });

  it('should decompose NAND correctly when only AND/NOT are enabled', () => {
    const nandExpr = '~(A & B)';
    const nandAst = parse(nandExpr);
    const nandCircuit = convertASTToCircuit({ Y: nandAst });
    const enabled = { and: true, not: true };

    const result = toCustomGateSet(nandCircuit, enabled as any);
    for (const gate of Object.values(result.gates)) {
      expect(['and', 'not', 'vcc', 'gnd', 'buf']).toContain(gate.type);
    }
    checkEquivalence(nandAst, result, ['A', 'B']);
  });
});
