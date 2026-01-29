import { useStoreValue } from '@simplestack/store/react';
import { Copy, Check } from 'lucide-react';
import React from 'react';

import { cn } from '../../lib/utils';
import { appStore } from '../../store';
import { Button } from '../ui/Button';
import { ExpressionDisplay } from './ExpressionDisplay';
import { GateExpressionDisplay } from './GateExpressionDisplay';

export const ResultView: React.FC = () => {
  const { results, truthTable } = useStoreValue(appStore);
  const [copied, setCopied] = React.useState(false);

  if (!results.detailedResults && !results.optimizedExpression && !results.circuit) {
    return null;
  }

  const COLORS = [
    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
    'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
    'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  ];

  // Generate color map for shared implicants
  const colorMap: Record<string, string> = {};
  if (results.detailedResults) {
    const implicantCounts: Record<string, number> = {};
    results.detailedResults.forEach((res) => {
      res.implicants.forEach((imp) => {
        implicantCounts[imp] = (implicantCounts[imp] || 0) + 1;
      });
    });

    const sharedImplicants = Object.entries(implicantCounts)
      .filter(([_, count]) => count > 1)
      .map(([imp]) => imp);

    sharedImplicants.forEach((imp, i) => {
      colorMap[imp] = COLORS[i % COLORS.length];
    });
  }

  // Generate netlist color map for shared gates
  const netlistColorMap: Record<string, string> = {};
  if (results.circuit) {
    const usages: Record<string, number> = {};
    Object.values(results.circuit.gates).forEach((node) => {
      node.inputs.forEach((input) => {
        usages[input] = (usages[input] || 0) + 1;
      });
    });
    Object.values(results.circuit.outputs).forEach((id) => {
      usages[id] = (usages[id] || 0) + 1;
    });

    const sharedGateIds = Object.entries(usages)
      .filter(([id, count]) => count > 1 && results.circuit?.gates[id])
      .map(([id]) => id);

    sharedGateIds.forEach((id, i) => {
      netlistColorMap[id] = COLORS[i % COLORS.length];
    });
  }

  const handleCopy = () => {
    if (results.optimizedExpression) {
      navigator.clipboard.writeText(results.optimizedExpression);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Optimized Expression
          </label>
          <Button
            variant="ghost"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
            title="Copy to clipboard"
            aria-label="Copy optimized expression"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4">
            {results.expressionNodes && results.circuit ? (
              Object.entries(results.expressionNodes).map(([name, node]) => (
                <GateExpressionDisplay
                  key={name}
                  outputVariable={name}
                  expression={node}
                  colorMap={netlistColorMap}
                />
              ))
            ) : results.detailedResults && truthTable ? (
              results.detailedResults.map((res) => (
                <ExpressionDisplay
                  key={res.outputVariable}
                  outputVariable={res.outputVariable}
                  implicants={res.implicants}
                  inputVariables={truthTable.inputVariables}
                  colorMap={colorMap}
                />
              ))
            ) : (
              <code className="text-xl font-mono text-gray-900 dark:text-gray-100 break-all">
                {results.optimizedExpression || '0'}
              </code>
            )}
          </div>
          {appStore.get().options.gateSet === 'custom' && (
            <p className="mt-4 text-[10px] text-amber-600 dark:text-amber-400 font-medium border-t border-amber-100 dark:border-amber-900/50 pt-3">
              * The logic expression above shows the minimized SOP/POS form. The actual gate
              synthesis results are shown in the netlist below.
            </p>
          )}
        </div>
      </div>

      {results.circuit && (
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Circuit Netlist (Abstract)
          </label>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto shadow-sm">
            <div className="text-xs font-mono text-gray-600 dark:text-gray-400 leading-relaxed flex flex-col gap-1">
              {Object.entries(results.circuit.gates).map(([id, node]) => (
                <div key={id} className="flex flex-wrap items-center gap-x-1">
                  <span
                    className={cn(
                      'px-1 rounded-sm transition-colors',
                      netlistColorMap[id] || 'text-gray-900 dark:text-gray-100',
                    )}
                  >
                    {id}
                  </span>
                  <span className="text-gray-400">:</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {node.type.toUpperCase()}
                  </span>
                  <span className="text-gray-400">(</span>
                  {node.inputs.map((input, i) => (
                    <React.Fragment key={`${id}-in-${i}`}>
                      <span
                        className={cn(
                          'px-1 rounded-sm transition-colors',
                          netlistColorMap[input] || 'text-gray-500 dark:text-gray-400',
                        )}
                      >
                        {input}
                      </span>
                      {i < node.inputs.length - 1 && <span className="text-gray-400">,</span>}
                    </React.Fragment>
                  ))}
                  <span className="text-gray-400">)</span>
                </div>
              ))}
              {Object.entries(results.circuit.outputs).map(([name, id]) => (
                <div
                  key={name}
                  className="mt-2 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2"
                >
                  <span>OUT {name}</span>
                  <span className="text-gray-400 font-normal">=</span>
                  <span
                    className={cn(
                      'px-1 rounded-sm transition-colors font-mono',
                      netlistColorMap[id],
                    )}
                  >
                    {id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
