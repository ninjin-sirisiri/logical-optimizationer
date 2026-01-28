import type { TruthTable } from '../truth-table/types';
import type { OptimizationResult } from './types';

/**
 * Converts a set of implicant patterns into a logical expression string (POS).
 * Logic: 0 -> Var, 1 -> ¬Var, - -> skip
 */
export function implicantsToPOSExpression(patterns: string[], vars: string[]): string {
  if (patterns.length === 0) return '1';

  const terms = patterns.map((p) => {
    const literals = [];
    for (let i = 0; i < p.length; i++) {
      if (p[i] === '0') literals.push(vars[i]);
      if (p[i] === '1') literals.push(`¬${vars[i]}`);
    }
    return literals.length === 0
      ? '0'
      : literals.length === 1
        ? literals[0]
        : `(${literals.join(' + ')})`;
  });

  if (terms.includes('0')) return '0';
  return terms.join('・');
}

/**
 * Internal POS minimization implementation using SOP core.
 */
export function optimizePOS(
  truthTable: TruthTable,
  minimizeSOP: (tt: TruthTable) => OptimizationResult[],
): OptimizationResult[] {
  // POS of F is SOP of !F inverted by De Morgan
  // 1. Invert truth table outputs (0 -> 1, 1 -> 0, X -> X)
  const invertedEntries = new Map();
  for (const [pattern, outputs] of truthTable.entries.entries()) {
    const invertedOutputs: any = {};
    for (const name of truthTable.outputVariables) {
      const val = outputs[name];
      invertedOutputs[name] = val === true ? false : val === false ? true : 'x';
    }
    invertedEntries.set(pattern, invertedOutputs);
  }

  const invertedTable: TruthTable = {
    ...truthTable,
    entries: invertedEntries,
  };

  // 2. Optimize SOP for inverted table
  // If !F = A'B' (pattern 00), then F = A+B (POS pattern 00)
  const invertedResults = minimizeSOP(invertedTable);

  // 3. Transform SOP terms to POS results
  return invertedResults.map((res) => {
    // We KEEP the patterns because SOP pattern 0 means A'
    // and POS pattern 0 means A.
    // Since we optimized !F, an SOP term A'B' (00) means !F is true when A=0, B=0.
    // This means F is 0 when A=0, B=0.
    // The POS term (A + B) (00) is also 0 when A=0, B=0.
    // So the patterns are identical!
    return {
      outputIndex: res.outputIndex,
      outputVariable: res.outputVariable,
      implicants: res.implicants,
      optimizedExpression: implicantsToPOSExpression(res.implicants, truthTable.inputVariables),
    };
  });
}
