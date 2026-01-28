import React from 'react';
import { useStoreValue } from '@simplestack/store/react';
import { appStore, type OptimizationMode, type GateSet } from '../../store';

export const OptimizationControls: React.FC = () => {
  const { options } = useStoreValue(appStore);

  const setMode = (mode: OptimizationMode) => {
    appStore.set((state) => ({ ...state, options: { ...state.options, mode } }));
  };

  const setGateSet = (gateSet: GateSet) => {
    appStore.set((state) => ({ ...state, options: { ...state.options, gateSet } }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/30 dark:bg-gray-900/30">
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Optimization Mode
        </label>
        <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-md w-fit">
          <button
            onClick={() => setMode('SOP')}
            className={`px-4 py-1.5 text-xs font-medium rounded transition-all ${options.mode === 'SOP'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            SOP (積和形)
          </button>
          <button
            onClick={() => setMode('POS')}
            className={`px-4 py-1.5 text-xs font-medium rounded transition-all ${options.mode === 'POS'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            POS (和積形)
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Target Gate Set
        </label>
        <div className="grid grid-cols-1 gap-1">
          {[
            { id: 'default', label: 'Default (AND/OR/NOT)' },
            { id: 'nand', label: 'NAND Only' },
            { id: 'nor', label: 'NOR Only' },
          ].map((set) => (
            <button
              key={set.id}
              onClick={() => setGateSet(set.id as GateSet)}
              className={`px-4 py-2 text-left text-xs rounded-md transition-colors ${options.gateSet === set.id
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              {set.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
