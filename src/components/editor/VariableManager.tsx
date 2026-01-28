import { useStoreValue } from '@simplestack/store/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import { useCallback } from 'react';

import { createEmptyTruthTable } from '../../core/truth-table';
import { MAX_INPUT_VARIABLES } from '../../core/truth-table/types';
import { cn } from '../../lib/utils';
import { appStore } from '../../store';
import { Button } from '../ui/Button';

const VariableBadge = ({
  name,
  onDelete,
  type,
}: {
  name: string;
  onDelete: () => void;
  type: 'input' | 'output';
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border',
      type === 'input'
        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
        : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
    )}
  >
    <span>{name}</span>
    <button
      onClick={onDelete}
      className={cn(
        'p-0.5 rounded-md transition-colors',
        type === 'input'
          ? 'hover:bg-green-100 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400'
          : 'hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400',
      )}
      aria-label={`Remove ${name}`}
    >
      <Trash2 size={14} />
    </button>
  </motion.div>
);

export const VariableManager = () => {
  const { truthTable } = useStoreValue(appStore);

  const inputVars = truthTable?.inputVariables || [];
  const outputVars = truthTable?.outputVariables || [];

  const updateTable = useCallback((newInputs: string[], newOutputs: string[]) => {
    if (newInputs.length > MAX_INPUT_VARIABLES) return;
    const newTable = createEmptyTruthTable(newInputs, newOutputs);
    appStore.set((s) => ({ ...s, truthTable: newTable }));
  }, []);

  const addInputVar = () => {
    if (inputVars.length >= MAX_INPUT_VARIABLES) return;
    const usedNames = new Set([...inputVars, ...outputVars]);
    let charCode = 65;
    let newName = '';
    while (true) {
      newName = String.fromCharCode(charCode);
      if (!usedNames.has(newName)) break;
      charCode++;
      if (charCode > 90) {
        newName = `In${inputVars.length + 1}`;
        break;
      }
    }
    updateTable([...inputVars, newName], outputVars.length > 0 ? outputVars : ['Y']);
  };

  const removeInputVar = (name: string) => {
    updateTable(
      inputVars.filter((v) => v !== name),
      outputVars,
    );
  };

  const addOutputVar = () => {
    const usedNames = new Set([...inputVars, ...outputVars]);
    let newName = '';
    const preferred = ['Y', 'Z', 'W', 'V', 'X'];
    for (const p of preferred) {
      if (!usedNames.has(p)) {
        newName = p;
        break;
      }
    }
    if (!newName) newName = `Out${outputVars.length + 1}`;
    updateTable(inputVars, [...outputVars, newName]);
  };

  const removeOutputVar = (name: string) => {
    updateTable(
      inputVars,
      outputVars.filter((v) => v !== name),
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
        <Settings2 size={16} />
        <h3 className="text-sm font-semibold uppercase tracking-wider">Table Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Variables */}
        <div className="space-y-3">
          <div className="flex justify-between items-center rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Inputs ({inputVars.length})
            </span>
            <Button
              variant="outline"
              onClick={addInputVar}
              disabled={inputVars.length >= MAX_INPUT_VARIABLES}
              className="h-8 w-8 px-0 py-0 shrink-0"
              aria-label="Add input variable"
              title="Add Input Variable"
            >
              <Plus
                size={18}
                strokeWidth={2.5}
                className="text-gray-900 dark:text-gray-100 shrink-0"
              />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md border border-dashed border-gray-200 dark:border-gray-800">
            <AnimatePresence mode="popLayout">
              {inputVars.map((v) => (
                <VariableBadge key={v} name={v} type="input" onDelete={() => removeInputVar(v)} />
              ))}
              {inputVars.length === 0 && (
                <span className="text-gray-400 text-sm py-1.5 italic w-full text-center">
                  No input variables
                </span>
              )}
            </AnimatePresence>
          </div>

          {inputVars.length >= MAX_INPUT_VARIABLES && (
            <p className="text-xs text-amber-600 dark:text-amber-500">Maximum limit reached</p>
          )}
        </div>

        {/* Output Variables */}
        <div className="space-y-3">
          <div className="flex justify-between items-center rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Outputs ({outputVars.length})
            </span>
            <Button
              variant="outline"
              onClick={addOutputVar}
              className="h-8 w-8 px-0 py-0 shrink-0"
              aria-label="Add output variable"
              title="Add Output Variable"
            >
              <Plus
                size={18}
                strokeWidth={2.5}
                className="text-gray-900 dark:text-gray-100 shrink-0"
              />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md border border-dashed border-gray-200 dark:border-gray-800">
            <AnimatePresence mode="popLayout">
              {outputVars.map((v) => (
                <VariableBadge key={v} name={v} type="output" onDelete={() => removeOutputVar(v)} />
              ))}
              {outputVars.length === 0 && (
                <span className="text-gray-400 text-sm py-1.5 italic w-full text-center">
                  No output variables
                </span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
