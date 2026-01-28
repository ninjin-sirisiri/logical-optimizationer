import { useStoreValue } from '@simplestack/store/react';
import React from 'react';

import { cn } from '../../lib/utils';
import { appStore } from '../../store';
import type { GateType } from '../../core/circuit/types';

export const GateSelector: React.FC = () => {
  const { options } = useStoreValue(appStore);

  const toggleGate = (gate: GateType) => {
    appStore.set((state) => ({
      ...state,
      options: {
        ...state.options,
        enabledGates: {
          ...state.options.enabledGates,
          [gate]: !state.options.enabledGates[gate],
        },
      },
    }));
  };

  const gates: { type: GateType; label: string }[] = [
    { type: 'and', label: 'AND' },
    { type: 'or', label: 'OR' },
    { type: 'not', label: 'NOT' },
    { type: 'nand', label: 'NAND' },
    { type: 'nor', label: 'NOR' },
    { type: 'xor', label: 'XOR' },
    { type: 'xnor', label: 'XNOR' },
  ];

  const { enabledGates } = options;
  const isComplete =
    enabledGates.nand ||
    enabledGates.nor ||
    (enabledGates.and && enabledGates.not) ||
    (enabledGates.or && enabledGates.not);

  return (
    <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Enabled Gates
        </label>
        {!isComplete && (
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 animate-pulse">
            Incomplete Set
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {gates.map((gate) => (
          <button
            key={gate.type}
            onClick={() => toggleGate(gate.type)}
            className={cn(
              'px-3 py-2 text-xs font-medium rounded-md border transition-all',
              options.enabledGates[gate.type]
                ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'border-transparent text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
            )}
          >
            {gate.label}
          </button>
        ))}
      </div>
      {!isComplete && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
          Warning: The selected gates may not be able to represent all logic functions.
        </p>
      )}
      <p className="text-[11px] text-gray-500 dark:text-gray-400">
        * BUF, VCC, and GND are always enabled internally.
      </p>
    </div>
  );
};
