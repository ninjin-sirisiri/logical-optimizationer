import { describe, expect, it } from 'bun:test';

import { parse } from '../../parser/index.ts';
import { convertASTToCircuit } from '../converter.ts';

describe('convertASTToCircuit', () => {
  it('should convert a basic expressions to a circuit', () => {
    const ast = parse('A & B | ~C');
    const circuit = convertASTToCircuit({ Y: ast });

    expect(circuit.inputs.toSorted()).toEqual(['A', 'B', 'C'].toSorted());
    expect(circuit.outputs['Y']).toBeDefined();

    const outputNodeId = circuit.outputs['Y'];
    const outputNode = circuit.gates[outputNodeId];
    expect(outputNode.type).toBe('or');
    expect(outputNode.inputs.length).toBe(2);
  });

  it('should share common sub-expressions (fan-out)', () => {
    // Both Y and Z share (A & B)
    const astY = parse('A & B | C');
    const astZ = parse('A & B & D');

    const circuit = convertASTToCircuit({ Y: astY, Z: astZ });

    // Check if (A & B) is a single gate ID used by both
    const gateIds = Object.keys(circuit.gates);
    const andABGates = gateIds.filter(
      (id) =>
        circuit.gates[id].type === 'and' &&
        circuit.gates[id].inputs.includes('A') &&
        circuit.gates[id].inputs.includes('B'),
    );

    expect(andABGates.length).toBe(1); // Should only be one gate for (A & B)
  });

  it('should handle commutative operators by sorting inputs', () => {
    // A & B and B & A should result in the same gate
    const astY = parse('A & B');
    const astZ = parse('B & A');

    const circuit = convertASTToCircuit({ Y: astY, Z: astZ });

    const andGateIds = Object.keys(circuit.gates).filter((id) => circuit.gates[id].type === 'and');
    expect(andGateIds.length).toBe(1);
    expect(circuit.outputs['Y']).toBe(circuit.outputs['Z']);
  });

  it('should handle constants', () => {
    const ast = parse('A & 1'); // Assuming the parser handles '1' as true
    const circuit = convertASTToCircuit({ Y: ast });

    const gateIds = Object.keys(circuit.gates);
    const vccGates = gateIds.filter((id) => circuit.gates[id].type === 'vcc');
    expect(vccGates.length).toBe(1);
  });
});
