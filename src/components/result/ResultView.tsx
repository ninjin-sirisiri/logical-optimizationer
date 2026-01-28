import React from 'react';
import { useStoreValue } from '@simplestack/store/react';
import { appStore } from '../../store';
import { Copy, Check } from 'lucide-react';

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
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Optimized Expression
          </label>
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg">
          <code className="text-xl font-mono text-gray-900 dark:text-gray-100 break-all">
            {results.optimizedExpression || '0'}
          </code>
        </div>
      </div>

      {results.circuit && (
        <div className="flex flex-col gap-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Circuit Netlist (Abstract)
          </label>
          <div className="p-6 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono text-gray-600 dark:text-gray-400">
              {Object.entries(results.circuit.gates).map(([id, node]) => (
                <div key={id}>
                  {id}: {node.type.toUpperCase()}({node.inputs.join(', ')})
                </div>
              ))}
              {Object.entries(results.circuit.outputs).map(([name, id]) => (
                <div key={name} className="mt-2 text-blue-500 font-bold">
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
