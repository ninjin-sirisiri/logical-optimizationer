import React from 'react';
import { useStoreValue } from '@simplestack/store/react';
import { appStore } from '../../store';
import type { OutputValue } from '../../core/truth-table/types';

const renderValue = (val: OutputValue) => {
  if (val === true) return <span className="text-blue-500 font-bold">1</span>;
  if (val === false) return <span className="text-gray-400">0</span>;
  return <span className="text-yellow-500">x</span>;
};

export const TruthTableEditor: React.FC = () => {
  const { truthTable } = useStoreValue(appStore);

  if (!truthTable) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-950/50 text-gray-400">
        <p className="text-sm">No truth table data available.</p>
        <p className="text-xs mt-1">Enter a valid expression or import a table.</p>
      </div>
    );
  }

  const { inputVariables, outputVariables, entries } = truthTable;

  // Toggle output value: 0 -> 1 -> x -> 0
  const handleToggleOutput = (pattern: string, outputName: string) => {
    const currentEntry = entries.get(pattern);
    if (!currentEntry) return;

    const currentValue = currentEntry[outputName];
    let newValue: OutputValue;

    if (currentValue === false) newValue = true;
    else if (currentValue === true) newValue = 'x';
    else newValue = false;

    // Create a new Map to trigger store update
    const newEntries = new Map(entries);
    newEntries.set(pattern, { ...currentEntry, [outputName]: newValue });

    appStore.set((state) => ({
      ...state,
      truthTable: {
        ...truthTable,
        entries: newEntries,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Truth Table
      </label>

      <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              {inputVariables.map((name) => (
                <th key={name} className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-200 dark:border-gray-800">
                  {name}
                </th>
              ))}
              {outputVariables.map((name) => (
                <th key={name} className="px-4 py-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {Array.from(entries.entries()).map(([pattern, outputs]) => (
              <tr key={pattern} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                {pattern.split('').map((bit, i) => (
                  <td key={i} className="px-4 py-1.5 text-sm font-mono border-r border-gray-200 dark:border-gray-800">
                    <span className={bit === '1' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-300 dark:text-gray-700'}>
                      {bit}
                    </span>
                  </td>
                ))}
                {outputVariables.map((name) => (
                  <td
                    key={name}
                    className="px-4 py-1.5 text-sm font-mono cursor-pointer select-none"
                    onClick={() => handleToggleOutput(pattern, name)}
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
  );
};
