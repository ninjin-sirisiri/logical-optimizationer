import { useCallback } from 'react';
import { type TruthTable, type OutputValue, type OutputEntry } from '../../core/truth-table';

export interface TruthTableEditorProps {
  /** The truth table to edit */
  table: TruthTable;
  /** Callback when the table is modified */
  onChange: (table: TruthTable) => void;
  /** If true, the table is read-only */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Editable truth table component.
 *
 * Features:
 * - Click output cells to cycle values: true → false → 'x' → true
 * - Visual feedback on hover and click
 * - Immutable updates (original table is not modified)
 * - Optional read-only mode
 */
export function TruthTableEditor({
  table,
  onChange,
  readOnly = false,
  className = '',
}: TruthTableEditorProps) {
  const { inputVariables, outputVariables, entries } = table;

  // Sort patterns for consistent display order
  const sortedPatterns = Array.from(entries.keys()).toSorted();

  /**
   * Cycles the output value: true → false → 'x' → true
   */
  const cycleValue = (current: OutputValue): OutputValue => {
    if (current === true) return false;
    if (current === false) return 'x';
    return true;
  };

  /**
   * Handles clicking on an output cell
   */
  const handleCellClick = useCallback(
    (pattern: string, outputVar: string) => {
      if (readOnly) return;

      const currentEntry = entries.get(pattern);
      if (!currentEntry) return;

      const currentValue = currentEntry[outputVar];
      const newValue = cycleValue(currentValue);

      // Create new entries map with updated value
      const newEntries = new Map(entries);
      const newEntry: OutputEntry = { ...currentEntry, [outputVar]: newValue };
      newEntries.set(pattern, newEntry);

      // Call onChange with new table
      onChange({
        inputVariables: [...inputVariables],
        outputVariables: [...outputVariables],
        entries: newEntries,
      });
    },
    [entries, inputVariables, outputVariables, onChange, readOnly]
  );

  if (entries.size === 0) {
    return (
      <div className={`text-neutral-500 dark:text-neutral-400 text-center py-4 ${className}`}>
        真理値表が空です
      </div>
    );
  }

  return (
    <div className={`overflow-auto ${className}`}>
      <table className="min-w-full border-collapse font-mono text-sm">
        <thead className="sticky top-0 z-10">
          <tr>
            {/* Input variable headers */}
            {inputVariables.map((varName) => (
              <th
                key={`in-${varName}`}
                className="px-3 py-2 text-center font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-b border-neutral-300 dark:border-neutral-600"
              >
                {varName}
              </th>
            ))}
            {/* Output variable headers - distinct background */}
            {outputVariables.map((varName) => (
              <th
                key={`out-${varName}`}
                className="px-3 py-2 text-center font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-b border-neutral-300 dark:border-neutral-600"
              >
                {varName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPatterns.map((pattern, rowIndex) => {
            const outputEntry = entries.get(pattern);
            if (!outputEntry) return null;

            const isEven = rowIndex % 2 === 0;
            const rowBg = isEven
              ? 'bg-white dark:bg-neutral-900'
              : 'bg-neutral-50 dark:bg-neutral-800/50';

            return (
              <tr key={pattern} className={rowBg}>
                {/* Input values (read-only) */}
                {pattern.split('').map((bit, i) => (
                  <td
                    key={`in-${i}`}
                    className="px-3 py-1.5 text-center text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-700"
                  >
                    {bit}
                  </td>
                ))}
                {/* Output values (editable) */}
                {outputVariables.map((varName) => {
                  const value = outputEntry[varName];
                  return (
                    <td
                      key={`out-${varName}`}
                      className={`px-3 py-1.5 text-center border-b border-neutral-200 dark:border-neutral-700 ${readOnly ? '' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'
                        }`}
                      onClick={() => handleCellClick(pattern, varName)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCellClick(pattern, varName);
                        }
                      }}
                      tabIndex={readOnly ? -1 : 0}
                      role={readOnly ? undefined : 'button'}
                      aria-label={`${varName} for ${pattern}: ${formatValue(value)}`}
                    >
                      <OutputValueCell value={value} interactive={!readOnly} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Formats a value for accessibility label
 */
function formatValue(value: OutputValue): string {
  if (value === true) return '1';
  if (value === false) return '0';
  return "don't care";
}

/**
 * Renders an output value with appropriate styling.
 */
function OutputValueCell({
  value,
  interactive,
}: {
  value: OutputValue;
  interactive: boolean;
}) {
  const baseClass = interactive ? 'select-none' : '';

  if (value === true) {
    return (
      <span className={`text-green-600 dark:text-green-400 font-medium ${baseClass}`}>1</span>
    );
  }
  if (value === false) {
    return <span className={`text-red-600 dark:text-red-400 font-medium ${baseClass}`}>0</span>;
  }
  // Don't care
  return (
    <span className={`text-amber-600 dark:text-amber-400 font-medium ${baseClass}`}>X</span>
  );
}

export default TruthTableEditor;
