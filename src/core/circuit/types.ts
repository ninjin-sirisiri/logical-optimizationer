/**
 * Supported gate types in the circuit.
 * 'buf' is a buffer gate (echoes input).
 */
export type GateType =
  | 'and'
  | 'or'
  | 'not'
  | 'nand'
  | 'nor'
  | 'xor'
  | 'xnor'
  | 'buf'
  | 'vcc'
  | 'gnd';

/**
 * Represents a single gate or input variable in the circuit graph.
 */
export interface GateNode {
  /** Unique identifier for the gate/node */
  id: string;
  /** Type of the gate. For input variables, this might be handled specially or use a specific type. */
  type: GateType | 'input';
  /** Array of input IDs (referencing other GateNode IDs or initial variable names) */
  inputs: string[];
  /** Optional: human-readable name or label */
  label?: string;
}

/**
 * Represents the overall circuit structure as a Directed Acyclic Graph (DAG).
 */
export interface Circuit {
  /** Initial input variables of the circuit */
  inputs: string[];
  /**
   * Map of output names to their corresponding node IDs.
   * This allows multiple outputs to point to different nodes in the same DAG.
   */
  outputs: Record<string, string>;
  /**
   * Flattened list of all gate nodes in the circuit.
   * The IDs should correspond to keys in this map for fast lookup.
   */
  gates: Record<string, GateNode>;
}
