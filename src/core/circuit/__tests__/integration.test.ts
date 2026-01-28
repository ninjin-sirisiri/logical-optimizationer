import { describe, expect, it } from 'bun:test';

import { evaluate } from '../../parser/evaluate.ts';
import { parse } from '../../parser/index.ts';
import { convertASTToCircuit } from '../converter.ts';
import { optimizeCircuit } from '../optimizer.ts';
import { toNANDOnly, toNOROnly } from '../transformers.ts';

describe('Circuit Integration: Transformers and Optimizer', () => {
  const testExpression = 'A & B | ~C';
  const inputs = ['A', 'B', 'C'];

  function checkEquivalence(originalAST: any, circuit: any) {
    // Generate all combinations of inputs
    const combinations = 1 << inputs.length;
    for (let i = 0; i < combinations; i++) {
      const values: Record<string, boolean> = {};
      inputs.forEach((input, index) => {
        values[input] = !!(i & (1 << index));
      });

      // Original evaluation
      const originalResult = evaluate(originalAST, values);

      // Circuit evaluation
      const circuitResult = evaluateCircuit(circuit, 'Y', values);

      expect(circuitResult).toBe(originalResult);
    }
  }

  /**
   * Helper to evaluate a circuit recursively
   */
  function evaluateCircuit(
    circuit: any,
    outputName: string,
    inputValues: Record<string, boolean>,
  ): boolean {
    const rootId = circuit.outputs[outputName];
    const memo = new Map<string, boolean>();

    function evalNode(nodeId: string): boolean {
      if (inputValues.hasOwnProperty(nodeId)) return inputValues[nodeId];
      if (memo.has(nodeId)) return memo.get(nodeId)!;

      const node = circuit.gates[nodeId];
      const inputs = node.inputs.map((id: string) => evalNode(id));
      let result: boolean;

      switch (node.type) {
        case 'and':
          result = inputs[0] && inputs[1];
          break;
        case 'or':
          result = inputs[0] || inputs[1];
          break;
        case 'not':
          result = !inputs[0];
          break;
        case 'nand':
          result = !(inputs[0] && inputs[1]);
          break;
        case 'nor':
          result = !(inputs[0] || inputs[1]);
          break;
        case 'xor':
          result = inputs[0] !== inputs[1];
          break;
        case 'vcc':
          result = true;
          break;
        case 'gnd':
          result = false;
          break;
        default:
          throw new Error(`Unknown gate type: ${node.type}`);
      }

      memo.set(nodeId, result);
      return result;
    }

    return evalNode(rootId);
  }

  it('should maintain logical equivalence after NAND-only conversion', () => {
    const ast = parse(testExpression);
    const initialCircuit = convertASTToCircuit({ Y: ast });
    const nandCircuit = toNANDOnly(initialCircuit);

    // Check if only NAND (or vcc/gnd) gates exist
    for (const gate of Object.values(nandCircuit.gates)) {
      expect(['nand', 'vcc', 'gnd']).toContain(gate.type);
    }

    checkEquivalence(ast, nandCircuit);
  });

  it('should maintain logical equivalence after NOR-only conversion', () => {
    const ast = parse(testExpression);
    const initialCircuit = convertASTToCircuit({ Y: ast });
    const norCircuit = toNOROnly(initialCircuit);

    for (const gate of Object.values(norCircuit.gates)) {
      expect(['nor', 'vcc', 'gnd']).toContain(gate.type);
    }

    checkEquivalence(ast, norCircuit);
  });

  it('should remove double negations via optimization', () => {
    // NOT(NOT(A))
    const ast = parse('~(~A)');
    const initialCircuit = convertASTToCircuit({ Y: ast });
    const optimized = optimizeCircuit(initialCircuit);

    // Result should be just A (no gates)
    expect(Object.keys(optimized.gates).length).toBe(0);
    expect(optimized.outputs['Y']).toBe('A');
  });

  it('should optimize NAND-based double negation', () => {
    const ast = parse('A & B');
    const initialCircuit = convertASTToCircuit({ Y: ast });
    const nandCircuit = toNANDOnly(initialCircuit);

    // nandCircuit is NAND(NAND(A, B), NAND(A, B)) -> 2 gates
    expect(Object.keys(nandCircuit.gates).length).toBe(2);

    const optimized = optimizeCircuit(nandCircuit);
    // After optimization, if A & B were just A, it would be gone.
    // But here NAND(A, B) is not a double negation.
    // Wait, NAND(NAND(A, B), NAND(A, B)) is NOT(NOT(AND(A, B))) -> AND(A, B).
    // But in NAND-only, AND(A, B) is represented as NAND(NAND(A,B), NAND(A,B)).
    // So optimization should NOT reduce this if it wants to stay AND.
    // Wait, my optimizer does: nand(nand(x,x), nand(x,x)) -> x.
    // For A & B converted to NAND:
    // 1. g1 = NAND(A, B)
    // 2. g2 = NAND(g1, g1)
    // Here g2 is NAND(g1, g1), but g1 is NOT NAND(x, x).
    // So it stays. This is correct as we can't represent AND with 1 NAND.

    // Let's test actual double negation in NAND form:
    // NOT(NOT(A)) in NAND is NAND(NAND(A, A), NAND(A, A))
    const notNotA = convertASTToCircuit({ Y: parse('~(~A)') });
    const nandNotNotA = toNANDOnly(notNotA);
    expect(Object.keys(nandNotNotA.gates).length).toBe(2);

    const optimizedNotNot = optimizeCircuit(nandNotNotA);
    expect(Object.keys(optimizedNotNot.gates).length).toBe(0);
    expect(optimizedNotNot.outputs['Y']).toBe('A');
  });
});
