import { useStoreValue } from '@simplestack/store/react';
import { Copy, Check } from 'lucide-react';
import React from 'react';

import { appStore } from '../../store';
import { Button } from '../ui/Button';
import { ExpressionDisplay } from './ExpressionDisplay';

export const ResultView: React.FC = () => {
  const { results, truthTable } = useStoreValue(appStore);
  const [copied, setCopied] = React.useState(false);

  if (!results.detailedResults && !results.optimizedExpression && !results.circuit) {
    return null;
  }

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

    const colors = [
      'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
      'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
      'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
      'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
      'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
      'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
    ];

    sharedImplicants.forEach((imp, i) => {
      colorMap[imp] = colors[i % colors.length];
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
            {results.detailedResults && truthTable ? (
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
        </div>
      </div>

      {results.circuit && (
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Circuit Netlist (Abstract)
          </label>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto shadow-sm">
            <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 leading-relaxed">
              {Object.entries(results.circuit.gates).map(([id, node]) => (
                <div key={id}>
                  {id}: {node.type.toUpperCase()}({node.inputs.join(', ')})
                </div>
              ))}
              {Object.entries(results.circuit.outputs).map(([name, id]) => (
                <div key={name} className="mt-2 text-blue-600 dark:text-blue-400 font-bold">
                  OUT {name} = {id}
                </div>
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
