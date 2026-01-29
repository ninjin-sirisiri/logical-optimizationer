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
      <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">{outputVariable}</span>
      <span className="text-gray-400 shrink-0">=</span>
      <div className="flex-1 flex flex-wrap items-baseline gap-x-1">
        <NodeRenderer node={expression} colorMap={colorMap} />
      </div>
    </div>
  );
};

const PRECEDENCE: Record<string, number> = {
  not: 4,
  and: 3,
  nand: 4, // NAND is ¬(SOP), effectively a NOT at the top
  xor: 2,
  xnor: 4,
  or: 1,
  nor: 4,
  buf: 5,
};

const NodeRenderer: React.FC<{
  node: ExpressionNode;
  colorMap: Record<string, string>;
  parentPrecedence?: number;
}> = ({ node, colorMap, parentPrecedence = 0 }) => {
  if (node.type === 'input' || node.type === 'constant') {
    return (
      <span className="text-gray-900 dark:text-gray-100">
        {node.value === 'VCC' ? '1' : node.value === 'GND' ? '0' : node.value}
      </span>
    );
  }

  const op = node.value.toLowerCase();
  const currentPrecedence = PRECEDENCE[op] ?? 0;
  const colorClass = node.gateId ? colorMap[node.gateId] : '';

  const wrapWithColor = (content: React.ReactNode) => (
    <span
      className={cn(
        'px-0.5 rounded-sm transition-all hover:ring-2 ring-blue-500/20 cursor-default inline-flex items-baseline',
        colorClass || 'text-indigo-600 dark:text-indigo-400 font-bold',
      )}
      title={node.gateId ? `Gate ID: ${node.gateId} (${node.value})` : undefined}
    >
      {content}
    </span>
  );

  const renderChildrenWithOp = (
    operator: string,
    needsExtraParen: boolean,
    innerPrecedence?: number,
  ) => (
    <span className="inline-flex items-baseline gap-x-1">
      {(needsExtraParen || (parentPrecedence > currentPrecedence && currentPrecedence > 0)) && (
        <span className="text-gray-400 mr-0.5">(</span>
      )}
      {node.children?.map((child, idx) => (
        <React.Fragment key={idx}>
          <NodeRenderer
            node={child}
            colorMap={colorMap}
            parentPrecedence={innerPrecedence ?? currentPrecedence}
          />
          {idx < (node.children?.length ?? 0) - 1 && (
            <span className="text-gray-400 font-normal mx-0.5">{operator}</span>
          )}
        </React.Fragment>
      ))}
      {(needsExtraParen || (parentPrecedence > currentPrecedence && currentPrecedence > 0)) && (
        <span className="text-gray-400 ml-0.5">)</span>
      )}
    </span>
  );

  switch (op) {
    case 'not':
      return (
        <span className="inline-flex items-baseline">
          {wrapWithColor(<span>¬</span>)}
          <NodeRenderer
            node={node.children![0]}
            colorMap={colorMap}
            parentPrecedence={PRECEDENCE.not}
          />
        </span>
      );
    case 'and':
      return wrapWithColor(renderChildrenWithOp('・', false));
    case 'or':
      return wrapWithColor(renderChildrenWithOp('+', false));
    case 'nand':
      return (
        <span className="inline-flex items-baseline">
          {wrapWithColor(<span>¬</span>)}
          {wrapWithColor(renderChildrenWithOp('・', true, 3))}
        </span>
      );
    case 'nor':
      return (
        <span className="inline-flex items-baseline">
          {wrapWithColor(<span>¬</span>)}
          {wrapWithColor(renderChildrenWithOp('+', true, 1))}
        </span>
      );
    case 'xor':
      return wrapWithColor(renderChildrenWithOp('⊕', false));
    case 'xnor':
      return (
        <span className="inline-flex items-baseline">
          {wrapWithColor(<span>¬</span>)}
          {wrapWithColor(renderChildrenWithOp('⊕', true, 2))}
        </span>
      );
    case 'buf':
      return node.children ? (
        <NodeRenderer
          node={node.children[0]}
          colorMap={colorMap}
          parentPrecedence={parentPrecedence}
        />
      ) : null;
    default:
      return (
        <span className="inline-flex items-baseline">
          {wrapWithColor(<span>{node.value}</span>)}
          <span className="text-gray-400">(</span>
          {node.children?.map((child, idx) => (
            <React.Fragment key={idx}>
              <NodeRenderer node={child} colorMap={colorMap} parentPrecedence={0} />
              {idx < (node.children?.length ?? 0) - 1 && (
                <span className="text-gray-400 px-1">,</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-gray-400">)</span>
        </span>
      );
  }
};
