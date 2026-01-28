import { convertASTToCircuit } from '../core/circuit/converter';
import { toNANDOnly, toNOROnly } from '../core/circuit/transformers';
import { minimize } from '../core/optimizer';
import { parse } from '../core/parser';
import { expressionToTruthTable } from '../core/truth-table';
import { appStore } from '../store';

export const useOptimize = () => {
  const optimize = () => {
    try {
      const state = appStore.get();
      const { expression, inputMode, truthTable, options } = state;
      let table = truthTable;

      // 1. Determine source of Truth Table
      if (inputMode === 'expression') {
        if (!expression.trim()) return;
        table = expressionToTruthTable(expression);
      } else {
        // Table mode: ensure table exists
        if (!table) return;
      }

      if (!table) return;

      // 2. Run core optimizer
      const results = minimize(table, options.mode);

      // Handle multiple outputs by joining them
      // TODO: Update store to support structured multiple outputs
      const optimizedStr = results
        .map((r) => `${r.outputVariable} = ${r.optimizedExpression}`)
        .join('\n');

      // 3. Convert optimized result to Circuit
      // Convert all outputs to ASTs and merge into one Circuit
      const circuitInputs: Record<string, any> = {};

      for (const res of results) {
        circuitInputs[res.outputVariable] = parse(res.optimizedExpression);
      }

      let circuit = convertASTToCircuit(circuitInputs);

      // 4. Transform gate sets if requested
      if (options.gateSet === 'nand') {
        circuit = toNANDOnly(circuit);
      } else if (options.gateSet === 'nor') {
        circuit = toNOROnly(circuit);
      }

      // 5. Update store
      appStore.set((state) => ({
        ...state,
        // Only update truth table if generated from expression
        truthTable: inputMode === 'expression' ? table : state.truthTable,
        results: {
          optimizedExpression: optimizedStr,
          circuit: circuit,
        },
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Optimization failed:', error);
      alert('Optimization failed. Check console for details.');
    }
  };

  return { optimize };
};
