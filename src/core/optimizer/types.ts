/**
 * Represents an implicant in the Quine-McCluskey algorithm.
 * pattern: string like "1-0" where '-' is a don't care bit.
 * outputMask: bitmask representing which outputs this implicant applies to.
 */
export interface Implicant {
  pattern: string;
  outputMask: number;
}

/**
 * Represents a minterm or a combined term during PI generation.
 * value: The numeric value (for base terms) or the bit pattern.
 * outputMask: Bitmask of outputs where this term is 1 (or X).
 * combined: Internal flag to track if this term has been combined into a larger one.
 */
export interface Term {
  pattern: string;
  outputMask: number;
  combined: boolean;
  // Weight is number of '1's in the pattern
  weight: number;
}

/**
 * Result of the optimization process for a single output.
 */
export interface OptimizationResult {
  outputIndex: number;
  originalExpression?: string;
  optimizedExpression: string;
  implicants: string[];
}
