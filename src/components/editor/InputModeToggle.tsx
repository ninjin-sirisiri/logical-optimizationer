import { useStoreValue } from '@simplestack/store/react';

import { createEmptyTruthTable } from '../../core/truth-table';
import { cn } from '../../lib/utils';
import { appStore } from '../../store';

export const InputModeToggle = () => {
  const { inputMode } = useStoreValue(appStore);

  const setMode = (mode: 'expression' | 'table') => {
    appStore.set((state) => {
      let newTable = state.truthTable;
      if (mode === 'table' && !newTable) {
        // Initialize with default 2 inputs, 1 output
        newTable = createEmptyTruthTable(['A', 'B'], ['Y']);
      }
      return {
        ...state,
        inputMode: mode,
        truthTable: newTable,
      };
    });
  };

  return (
    <div className="flex flex-col gap-3 w-fit self-center">
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={() => setMode('expression')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500',
            inputMode === 'expression'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
          )}
        >
          Logic Expression
        </button>
        <button
          onClick={() => setMode('table')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500',
            inputMode === 'table'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
          )}
        >
          Truth Table
        </button>
      </div>
    </div>
  );
};
