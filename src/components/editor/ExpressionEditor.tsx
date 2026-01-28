import { useStoreValue } from '@simplestack/store/react';
import React, { useRef } from 'react';

import { appStore } from '../../store';
import { Button } from '../ui/Button';

export const ExpressionEditor: React.FC = () => {
  const { expression } = useStoreValue(appStore);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    appStore.set((state) => ({ ...state, expression: e.target.value }));
  };

  const insertSymbol = (symbol: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + symbol + text.substring(end);

    appStore.set((state) => ({ ...state, expression: newText }));

    // Re-focus and set cursor position after symbol
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="expression-input"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          Logic Expression
        </label>
        <div className="flex gap-1" role="toolbar" aria-label="Symbol insertion">
          {['¬', '・', '+', '⊕', '(', ')'].map((symbol) => (
            <Button
              key={symbol}
              variant="secondary"
              onClick={() => insertSymbol(symbol)}
              className="w-8 h-8 p-0 text-base font-mono"
              title={`Insert ${symbol}`}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <textarea
          id="expression-input"
          ref={textareaRef}
          value={expression}
          onChange={handleChange}
          placeholder="e.g. A & B | ~C"
          className="w-full h-32 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-lg font-mono placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all resize-none shadow-sm"
          spellCheck={false}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Supported operators: AND (・, &), OR (+, |), NOT (¬, ~), XOR (⊕, ^)
      </p>
    </div>
  );
};
