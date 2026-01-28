import { useStoreValue } from '@simplestack/store/react';
import { RotateCcw } from 'lucide-react';
import React from 'react';

import type { OutputValue } from '../../core/truth-table/types';

import { appStore } from '../../store';
import { Button } from '../ui/Button';

const renderValue = (val: OutputValue) => {
  if (val === true) return <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>;
  if (val === false) return <span className="text-gray-400 dark:text-gray-500">0</span>;
  return <span className="text-yellow-600 dark:text-yellow-400 font-bold">x</span>;
};

export const TruthTableEditor: React.FC = () => {
  const { truthTable } = useStoreValue(appStore);

  if (!truthTable) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
        <p className="text-sm font-medium">No truth table data available</p>
        <p className="text-xs mt-1 text-gray-400">Enter a valid expression to generate a table</p>
      </div>
    );
  }

  const { inputVariables, outputVariables, entries } = truthTable;

  const handleReset = () => {
    const newEntries = new Map(entries);
    for (const [pattern, outputs] of newEntries) {
      const newOutputs = { ...outputs };
      for (const outVar of outputVariables) {
        newOutputs[outVar] = false;
      }
      newEntries.set(pattern, newOutputs);
    }

    appStore.set((state) => ({
      ...state,
      truthTable: state.truthTable
        ? {
            ...state.truthTable,
            entries: newEntries,
          }
        : state.truthTable,
    }));
  };

  const handleToggleOutput = (pattern: string, outputName: string) => {
    const currentEntry = entries.get(pattern);
    if (!currentEntry) return;

    const currentValue = currentEntry[outputName];
    let newValue: OutputValue;

    if (currentValue === false) newValue = true;
    else if (currentValue === true) newValue = 'x';
    else newValue = false;

    const newEntries = new Map(entries);
    newEntries.set(pattern, { ...currentEntry, [outputName]: newValue });

    appStore.set((state) => ({
      ...state,
      truthTable: state.truthTable
        ? { ...state.truthTable, entries: newEntries }
        : state.truthTable,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, pattern: string, outputName: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleOutput(pattern, outputName);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-transparent">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Truth Table</h3>
        <Button
          variant="ghost"
          onClick={handleReset}
          className="h-8 px-2 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 gap-2"
          aria-label="Reset all outputs to 0"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                {inputVariables.map((name) => (
                  <th
                    key={name}
                    className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800/50 last:border-r-0 w-12 text-center"
                  >
                    {name}
                  </th>
                ))}
                {outputVariables.map((name) => (
                  <th
                    key={name}
                    className="px-4 py-3 text-xs font-semibold text-blue-600 dark:text-blue-400 w-16 text-center bg-blue-50/5 dark:bg-blue-900/10 border-l border-gray-200 dark:border-gray-800"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {Array.from(entries.entries()).map(([pattern, outputs]) => (
                <tr
                  key={pattern}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {pattern.split('').map((bit, i) => (
                    <td
                      key={i}
                      className="px-4 py-2 text-sm font-mono text-center border-r border-gray-100 dark:border-gray-800 last:border-r-0 text-gray-600 dark:text-gray-400"
                    >
                      {bit}
                    </td>
                  ))}
                  {outputVariables.map((name) => (
                    <td
                      key={name}
                      className="px-4 py-2 text-center border-l border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 transition-colors"
                      onClick={() => handleToggleOutput(pattern, name)}
                      onKeyDown={(e) => handleKeyDown(e, pattern, name)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Toggle output ${name} for input ${pattern}, current value ${outputs[name]}`}
                    >
                      {renderValue(outputs[name])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
