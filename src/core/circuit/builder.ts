import type { Circuit, GateNode, GateType } from './types.ts';

/**
 * Utility class to build a Circuit Directed Acyclic Graph (DAG).
 */
export class CircuitBuilder {
  private gates: Record<string, GateNode> = {};
  private inputs: Set<string> = new Set();
  private outputs: Record<string, string> = {};
  private idCounter = 0;

  /**
   * Generates a unique ID for a gate.
   */
  private generateId(type: string): string {
    return `${type}_${this.idCounter++}`;
  }

  /**
   * Adds an input variable to the circuit.
   */
  addInput(name: string): string {
    this.inputs.add(name);
    // Inputs are represented by their names in this simple DAG implementation
    return name;
  }

  /**
   * Adds a gate to the circuit.
   * @param type The type of gate to add.
   * @param inputs Array of IDs or input names that serve as inputs to this gate.
   * @returns The unique ID of the newly created gate.
   */
  addGate(type: GateType, inputs: string[]): string {
    const id = this.generateId(type);
    this.gates[id] = {
      id,
      type,
      inputs,
    };
    return id;
  }

  /**
   * Marks a specific node (gate or input) as an output of the circuit.
   * @param name The name of the output.
   * @param nodeId The ID of the gate or the name of the input.
   */
  setOutput(name: string, nodeId: string): void {
    this.outputs[name] = nodeId;
  }

  /**
   * Finalizes and returns the Circuit object.
   */
  build(): Circuit {
    return {
      inputs: Array.from(this.inputs),
      outputs: { ...this.outputs },
      gates: { ...this.gates },
    };
  }

  /**
   * Resets the builder state.
   */
  reset(): void {
    this.gates = {};
    this.inputs.clear();
    this.outputs = {};
    this.idCounter = 0;
  }
}
