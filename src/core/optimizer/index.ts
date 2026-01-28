import { TruthTable } from '../truth-table/types';
import { solveMinimumCover } from './petrick';
import { optimizePOS } from './pos';
import { generatePrimeImplicants } from './qm';
import { PITable, Target } from './table';
import { Term, OptimizationResult } from './types';

/**
 * Main entry point for logic optimization.
 * Minimizes a truth table into SOP or POS form.
 */
export function minimize(
  truthTable: TruthTable,
  form: 'SOP' | 'POS' = 'SOP',
): OptimizationResult[] {
  if (form === 'POS') {
    return optimizePOS(truthTable, minimizeSOP);
  }
  return minimizeSOP(truthTable);
}

/**
 * Public SOP minimization implementation.
 */
export function minimizeSOP(truthTable: TruthTable): OptimizationResult[] {
  const { inputVariables, outputVariables, entries } = truthTable;

  // 1. Prepare initial terms and targets
  const initialTerms: Term[] = [];
  const targets: Target[] = [];

  for (const [pattern, outputs] of entries.entries()) {
    let outputMask = 0;

    outputVariables.forEach((name, index) => {
      const val = outputs[name];
      if (val === true || val === 'x') {
        outputMask |= 1 << index;
      }
      if (val === true) {
        targets.push({ pattern, outputIndex: index });
      }
    });

    if (outputMask > 0) {
      initialTerms.push({
        pattern,
        outputMask,
        combined: false,
        weight: pattern.split('1').length - 1,
      });
    }
  }

  // 2. Generate Prime Implicants
  const pis = generatePrimeImplicants(initialTerms);

  // 3. Solve coverage problem
  const table = new PITable(pis, targets);

  // First, extract all EPIs and reduce the table
  const finalPIIndices = new Set<number>();
  const epis = table.findEPIs();
  for (const epiIdx of epis) {
    finalPIIndices.add(epiIdx);
    table.selectPI(epiIdx);
  }

  // Then solve remaining with Petrick's (if any)
  const remainingTargets = table.getActiveTargets();
  if (remainingTargets.length > 0) {
    const petriSolutions = solveMinimumCover(
      table.getActivePIs(),
      remainingTargets,
      table.getMatrix(),
      pis,
    );
    for (const idx of petriSolutions) {
      finalPIIndices.add(idx);
    }
  }

  const selectedPIs = Array.from(finalPIIndices).map((idx) => pis[idx]);

  // 4. Group results by output
  return outputVariables.map((name, index) => {
    const mask = 1 << index;
    const outputPIs = selectedPIs
      .filter((pi) => (pi.outputMask & mask) !== 0)
      .map((pi) => pi.pattern);

    return {
      outputIndex: index,
      implicants: outputPIs,
      optimizedExpression: implicantsToExpression(outputPIs, inputVariables),
    };
  });
}

/**
 * Converts a set of implicant patterns into a logical expression string (SOP).
 */
export function implicantsToExpression(patterns: string[], vars: string[]): string {
  if (patterns.length === 0) return '0';

  const terms = patterns.map((p) => {
    const literals = [];
    for (let i = 0; i < p.length; i++) {
      if (p[i] === '1') literals.push(vars[i]);
      if (p[i] === '0') literals.push(`${vars[i]}'`);
    }
    return literals.length === 0 ? '1' : literals.join('');
  });

  if (terms.includes('1')) return '1';
  return terms.join(' + ');
}
