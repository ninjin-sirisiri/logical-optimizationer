import React from 'react';
import type { ExpressionNode } from '../../core/circuit/expression';
import { cn } from '../../lib/utils';

interface GateExpressionDisplayProps {
  outputVariable: string;
  expression: ExpressionNode;
  colorMap: Record<string, string>;
}

export const GateExpressionDisplay: React.FC<GateExpressionDisplayProps> = ({
  outputVariable,
  expression,
  colorMap,
}) => {
  return (
    <div className="flex items-baseline gap-2 font-mono text-lg">
      <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">
        {outputVariable}
      </span>
      <span className="text-gray-400 shrink-0">=</span>
      <div className="flex-1 flex flex-wrap items-baseline gap-x-1">
        <NodeRenderer node={expression} colorMap={colorMap} />
      </div>
    </div>
  );
};

const NodeRenderer: React.FC<{ node: ExpressionNode; colorMap: Record<string, string> }> = ({
  node,
  colorMap,
}) => {
  if (node.type === 'input' || node.type === 'constant') {
    return <span className="text-gray-900 dark:text-gray-100">{node.value}</span>;
  }

  const colorClass = node.gateId ? colorMap[node.gateId] : '';

  return (
    <span className="inline-flex items-baseline whitespace-nowrap">
      <span
        className={cn(
          'px-1 py-0.5 rounded-md font-bold transition-all hover:ring-2 ring-blue-500/20 cursor-default',
          colorClass || 'text-indigo-600 dark:text-indigo-400'
        )}
        title={node.gateId ? `Gate ID: ${node.gateId}` : undefined}
      >
        {node.value}
      </span>
      <span className="text-gray-400">(</span>
      <span className="inline-flex items-baseline">
        {node.children?.map((child, idx) => (
          <React.Fragment key={idx}>
            <NodeRenderer node={child} colorMap={colorMap} />
            {idx < (node.children?.length ?? 0) - 1 && (
              <span className="text-gray-400 mr-1">,</span>
            )}
          </React.Fragment>
        ))}
      </span>
      <span className="text-gray-400">)</span>
    </span>
  );
};
