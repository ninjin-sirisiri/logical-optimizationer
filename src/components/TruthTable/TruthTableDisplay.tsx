import { type TruthTable, type OutputValue } from '../../core/truth-table';

export interface TruthTableDisplayProps {
  /** The truth table to display */
  table: TruthTable;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays a truth table in a read-only table format.
 *
 * Features:
 * - Distinct styling for input and output columns
 * - Alternating row colors (stripes)
 * - Monospace font for value alignment
 * - Compact, readable design
 */
export function TruthTableDisplay({ table, className = '' }: TruthTableDisplayProps) {
  const { inputVariables, outputVariables, entries } = table;

  // Sort patterns for consistent display order
  const sortedPatterns = Array.from(entries.keys()).toSorted();

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
                {/* Input values */}
                {pattern.split('').map((bit, i) => (
                  <td
                    key={`in-${i}`}
                    className="px-3 py-1.5 text-center text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-700"
                  >
                    {bit}
                  </td>
                ))}
                {/* Output values */}
                {outputVariables.map((varName) => {
                  const value = outputEntry[varName];
                  return (
                    <td
                      key={`out-${varName}`}
                      className="px-3 py-1.5 text-center border-b border-neutral-200 dark:border-neutral-700"
                    >
                      <OutputValueCell value={value} />
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
 * Renders an output value with appropriate styling.
 */
function OutputValueCell({ value }: { value: OutputValue }) {
  if (value === true) {
    return <span className="text-green-600 dark:text-green-400 font-medium">1</span>;
  }
  if (value === false) {
    return <span className="text-red-600 dark:text-red-400 font-medium">0</span>;
  }
  // Don't care
  return <span className="text-amber-600 dark:text-amber-400 font-medium">X</span>;
}

export default TruthTableDisplay;
