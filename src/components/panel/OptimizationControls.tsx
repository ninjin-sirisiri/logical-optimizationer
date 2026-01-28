import { useStoreValue } from '@simplestack/store/react';
import { Play } from 'lucide-react';
import React from 'react';

import { useOptimize } from '../../hooks/useOptimize';
import { cn } from '../../lib/utils';
import { appStore, type OptimizationMode, type GateSet } from '../../store';
import { GateSelector } from './GateSelector';
import { Button } from '../ui/Button';

export const OptimizationControls: React.FC = () => {
  const { options } = useStoreValue(appStore);
  const { optimize } = useOptimize();

  const setMode = (mode: OptimizationMode) => {
    appStore.set((state) => ({ ...state, options: { ...state.options, mode } }));
  };

  const setGateSet = (gateSet: GateSet) => {
    appStore.set((state) => ({ ...state, options: { ...state.options, gateSet } }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Optimization Mode
        </label>
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
          {(['SOP', 'POS'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              className={cn(
                'flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500',
                options.mode === mode
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
              )}
            >
              {mode === 'SOP' ? 'SOP (Sum of Products)' : 'POS (Product of Sums)'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Target Gate Set
        </label>
        <div className="flex flex-col gap-1">
          {[
            { id: 'default', label: 'Default (AND/OR/NOT)' },
            { id: 'nand', label: 'NAND Only' },
            { id: 'nor', label: 'NOR Only' },
            { id: 'custom', label: 'Custom' },
          ].map((set) => (
            <button
              key={set.id}
              onClick={() => setGateSet(set.id as GateSet)}
              className={cn(
                'w-full px-4 py-2 text-left text-sm rounded-md transition-colors border',
                options.gateSet === set.id
                  ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
              )}
            >
              {set.label}
            </button>
          ))}
        </div>
      </div>
      {options.gateSet === 'custom' && <GateSelector />}
      <div className="pt-2">
        <Button onClick={() => optimize()} className="w-full shadow-sm">
          <Play className="w-4 h-4 mr-2 fill-current" />
          Optimize
        </Button>
      </div>
    </div>
  );
};
