import { useStoreValue } from '@simplestack/store/react';

import { convertASTToCircuit } from '../core/circuit/converter';
import { toNANDOnly, toNOROnly } from '../core/circuit/transformers';
import { minimize } from '../core/optimizer';
import { parse } from '../core/parser';
import { expressionToTruthTable } from '../core/truth-table';
import { appStore } from '../store';

export const useOptimize = () => {
  const { expression, options } = useStoreValue(appStore);

  const optimize = () => {
    if (!expression.trim()) return;

    try {
      // 1. Generate truth table from expression
      const table = expressionToTruthTable(expression);

      // 2. Run core optimizer
      const results = minimize(table, options.mode);

      // We assume single output for now (Y)
      const primaryResult = results[0];
      const optimizedStr = primaryResult.optimizedExpression;

      // 3. Convert optimized result to Circuit
      const optimizedAST = parse(optimizedStr);
      let circuit = convertASTToCircuit({ Y: optimizedAST });

      // 4. Transform gate sets if requested
      if (options.gateSet === 'nand') {
        circuit = toNANDOnly(circuit);
      } else if (options.gateSet === 'nor') {
        circuit = toNOROnly(circuit);
      }

      // 5. Update store
      appStore.set((state) => ({
        ...state,
        truthTable: table,
        results: {
          optimizedExpression: optimizedStr,
          circuit: circuit,
        },
      }));
    } catch (error) {
      console.error('Optimization failed:', error);
      // Future: Set error state in store for UI display
    }
  };

  return { optimize };
};
