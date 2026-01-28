import React from 'react';

interface ExpressionDisplayProps {
  outputVariable: string;
  implicants: string[];
  inputVariables: string[];
  colorMap: Record<string, string>;
}

export const ExpressionDisplay: React.FC<ExpressionDisplayProps> = ({
  outputVariable,
  implicants,
  inputVariables,
  colorMap,
}) => {
  if (implicants.length === 0) {
    return (
      <div className="flex items-center gap-2 font-mono text-lg">
        <span className="text-blue-600 dark:text-blue-400 font-bold">{outputVariable}</span>
        <span className="text-gray-400">=</span>
        <span className="text-gray-900 dark:text-gray-100">0</span>
      </div>
    );
  }

  // Handle '1' case (tautology)
  if (implicants.length === 1 && implicants[0].split('').every((c) => c === '-')) {
    return (
      <div className="flex items-center gap-2 font-mono text-lg">
        <span className="text-blue-600 dark:text-blue-400 font-bold">{outputVariable}</span>
        <span className="text-gray-400">=</span>
        <span className="text-gray-900 dark:text-gray-100">1</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-y-2 font-mono text-lg">
      <span className="text-blue-600 dark:text-blue-400 font-bold mr-2">{outputVariable}</span>
      <span className="text-gray-400 mr-2">=</span>

      {implicants.map((pattern, idx) => {
        const colorClass = colorMap[pattern] || '';
        const literals = [];
        for (let i = 0; i < pattern.length; i++) {
          if (pattern[i] === '1') literals.push(inputVariables[i]);
          if (pattern[i] === '0') literals.push(`¬${inputVariables[i]}`);
        }

        const termStr = literals.length === 0 ? '1' : literals.join('・');

        return (
          <React.Fragment key={idx}>
            <span
              className={`px-1.5 py-0.5 rounded-md transition-colors ${
                colorClass
                  ? `${colorClass} ring-1 ring-inset ring-black/5 dark:ring-white/10`
                  : 'text-gray-900 dark:text-gray-100'
              }`}
              title={pattern}
            >
              {termStr}
            </span>
            {idx < implicants.length - 1 && <span className="mx-2 text-gray-400">+</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};
