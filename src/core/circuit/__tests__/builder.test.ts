import { describe, expect, it } from 'bun:test';

import { CircuitBuilder } from '../builder.ts';

describe('CircuitBuilder', () => {
  it('should build a simple circuit with inputs and gates', () => {
    const builder = new CircuitBuilder();

    // Y = (A & B) | ~C
    const a = builder.addInput('A');
    const b = builder.addInput('B');
    const c = builder.addInput('C');

    const and1 = builder.addGate('and', [a, b]);
    const not1 = builder.addGate('not', [c]);
    const or1 = builder.addGate('or', [and1, not1]);

    builder.setOutput('Y', or1);

    const circuit = builder.build();

    expect(circuit.inputs).toEqual(['A', 'B', 'C']);
    expect(circuit.outputs['Y']).toBeDefined();
    expect(circuit.gates[circuit.outputs['Y']].type).toBe('or');
    expect(circuit.gates[and1].inputs).toEqual(['A', 'B']);
    expect(Object.keys(circuit.gates).length).toBe(3);
  });

  it('should generate unique IDs', () => {
    const builder = new CircuitBuilder();
    const g1 = builder.addGate('and', []);
    const g2 = builder.addGate('and', []);
    expect(g1).not.toBe(g2);
  });

  it('should reset its state', () => {
    const builder = new CircuitBuilder();
    builder.addInput('A');
    builder.addGate('and', []);
    builder.setOutput('Y', 'and_0');

    builder.reset();
    const circuit = builder.build();

    expect(circuit.inputs.length).toBe(0);
    expect(Object.keys(circuit.gates).length).toBe(0);
    expect(Object.keys(circuit.outputs).length).toBe(0);
  });
});
