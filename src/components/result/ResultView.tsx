import { useStoreValue } from '@simplestack/store/react';
import { Copy, Check } from 'lucide-react';
import React from 'react';

import { appStore } from '../../store';
import { Button } from '../ui/Button';

export const ResultView: React.FC = () => {
  const { results } = useStoreValue(appStore);
  const [copied, setCopied] = React.useState(false);

  if (!results.optimizedExpression && !results.circuit) {
    return null;
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
          <code className="text-xl font-mono text-gray-900 dark:text-gray-100 break-all">
            {results.optimizedExpression || '0'}
          </code>
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
