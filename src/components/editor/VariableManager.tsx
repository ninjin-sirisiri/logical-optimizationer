import { useState, useCallback } from 'react';
import { useStore } from '@simplestack/store/react';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { appStore } from '../../store';
import { createEmptyTruthTable } from '../../core/truth-table';
import { MAX_INPUT_VARIABLES } from '../../core/truth-table/types';

export const VariableManager = () => {
  const { truthTable } = useStore(appStore);

  // Local state for management, synced with store on specific actions if needed,
  // but here we might want to derive from store or just directly manipulate store.
  // Since we need to re-generate the table on every change, direct store interaction is best.

  const inputVars = truthTable?.inputVariables || [];
  const outputVars = truthTable?.outputVariables || [];

  const updateTable = useCallback((newInputs: string[], newOutputs: string[]) => {
    // Basic validation
    if (newInputs.length > MAX_INPUT_VARIABLES) return;

    // Generate new table structure
    // Note: This resets values. In a more advanced version, we could preserve existing patterns.
    const newTable = createEmptyTruthTable(newInputs, newOutputs);

    appStore.update(s => {
      s.truthTable = newTable;
    });
  }, []);

  const addInputVar = () => {
    if (inputVars.length >= MAX_INPUT_VARIABLES) return;

    // Auto-generate name: A, B, C...
    const usedNames = new Set([...inputVars, ...outputVars]);
    let charCode = 65; // 'A'
    let newName = '';

    while (true) {
      newName = String.fromCharCode(charCode);
      if (!usedNames.has(newName)) break;
      charCode++;
      if (charCode > 90) {
        // Fallback for many variables (shouldn't happen with MAX=10)
        newName = `In${inputVars.length + 1}`;
        break;
      }
    }

    updateTable([...inputVars, newName], outputVars.length > 0 ? outputVars : ['Y']);
  };

  const removeInputVar = (name: string) => {
    updateTable(inputVars.filter(v => v !== name), outputVars);
  };

  const addOutputVar = () => {
    const usedNames = new Set([...inputVars, ...outputVars]);
    let charCode = 89; // Start from 'Y' for outputs (Y, Z, W...)
    let newName = '';

    // Try Y, Z, then W, V, U...
    const preferred = ['Y', 'Z', 'W', 'V', 'X'];
    // Note: X is often used for don't care, but can be a var name too.

    for (const p of preferred) {
      if (!usedNames.has(p)) {
        newName = p;
        break;
      }
    }

    if (!newName) {
      // Fallback
      newName = `Out${outputVars.length + 1}`;
    }

    updateTable(inputVars, [...outputVars, newName]);
  };

  const removeOutputVar = (name: string) => {
    updateTable(inputVars, outputVars.filter(v => v !== name));
  };

  const VariableBadge = ({ name, onDelete, type }: { name: string, onDelete: () => void, type: 'input' | 'output' }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium
        ${type === 'input'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}
      `}
    >
      <span>{name}</span>
      <button
        onClick={onDelete}
        className="p-0.5 hover:bg-white/10 rounded-md transition-colors"
        aria-label={`Remove ${name}`}
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );

  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6 space-y-6">
      <div className="flex items-center gap-3 text-neutral-400 mb-2">
        <Settings2 size={18} />
        <h3 className="text-sm font-medium uppercase tracking-wider">Table Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Variables */}
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
            <span className="text-sm text-neutral-300 font-medium">Inputs ({inputVars.length})</span>
            <button
              onClick={addInputVar}
              disabled={inputVars.length >= MAX_INPUT_VARIABLES}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              aria-label="Add input variable"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px]">
            <AnimatePresence mode="popLayout">
              {inputVars.map(v => (
                <VariableBadge
                  key={v}
                  name={v}
                  type="input"
                  onDelete={() => removeInputVar(v)}
                />
              ))}
              {inputVars.length === 0 && (
                <span className="text-neutral-600 text-sm py-1.5 italic">No input variables</span>
              )}
            </AnimatePresence>
          </div>

          {inputVars.length >= MAX_INPUT_VARIABLES && (
            <p className="text-xs text-amber-500/80">Maximum limit reached</p>
          )}
        </div>

        {/* Output Variables */}
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
            <span className="text-sm text-neutral-300 font-medium">Outputs ({outputVars.length})</span>
            <button
              onClick={addOutputVar}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              aria-label="Add output variable"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px]">
            <AnimatePresence mode="popLayout">
              {outputVars.map(v => (
                <VariableBadge
                  key={v}
                  name={v}
                  type="output"
                  onDelete={() => removeOutputVar(v)}
                />
              ))}
              {outputVars.length === 0 && (
                <span className="text-neutral-600 text-sm py-1.5 italic">No output variables</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
