import { toast } from 'sonner';

import { convertASTToCircuit } from '../core/circuit/converter';
import { circuitToExpressions, expressionNodeToString } from '../core/circuit/expression';
import { optimizeCircuit } from '../core/circuit/optimizer';
import { toNANDOnly, toNOROnly, toCustomGateSet } from '../core/circuit/transformers';
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
        if (!expression.trim()) {
          toast.error('Please enter an expression');
          return;
        }
        table = expressionToTruthTable(expression);
      } else {
        // Table mode: ensure table exists
        if (!table) {
          toast.error('No truth table available');
          return;
        }
      }

      if (!table) return;

      // Variable Limit Guard
      if (table.inputVariables.length > 6) {
        toast.error(`Too many variables: ${table.inputVariables.length}. Maximum allowed is 6.`);
        return;
      }

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
      } else if (options.gateSet === 'custom') {
        circuit = toCustomGateSet(circuit, options.enabledGates);
      }

      // 5. Run peephole optimization
      circuit = optimizeCircuit(circuit);

      // 6. Generate final expression string based on gate set
      let finalOptimizedExpression = optimizedStr;
      let expressionNodes: Record<string, any> | null = null;

      if (options.gateSet !== 'default') {
        const exprNodes = circuitToExpressions(circuit);
        expressionNodes = exprNodes;
        finalOptimizedExpression = Object.entries(exprNodes)
          .map(([name, node]) => `${name} = ${expressionNodeToString(node)}`)
          .join('\n');
      }

      // 7. Update store
      appStore.set((state) => ({
        ...state,
        // Only update truth table if generated from expression
        truthTable: inputMode === 'expression' ? table : state.truthTable,
        results: {
          optimizedExpression: finalOptimizedExpression,
          detailedResults: results,
          circuit: circuit,
          expressionNodes: expressionNodes,
        },
      }));

      toast.success('Optimization complete');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Optimization failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Optimization failed: ${message}`);
    }
  };

  return { optimize };
};
