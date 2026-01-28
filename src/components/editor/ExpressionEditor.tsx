import React, { useRef } from 'react';
import { useStoreValue } from '@simplestack/store/react';
import { appStore } from '../../store';
import { Play } from 'lucide-react';
import { useOptimize } from '../../hooks/useOptimize';

export const ExpressionEditor: React.FC = () => {
  const { expression } = useStoreValue(appStore);
  const { optimize } = useOptimize();
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

  const handleOptimize = () => {
    optimize();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Logic Expression
        </label>
        <div className="flex gap-1">
          {['¬', '・', '+', '⊕', '(', ')'].map((symbol) => (
            <button
              key={symbol}
              onClick={() => insertSymbol(symbol)}
              className="w-8 h-8 flex items-center justify-center text-sm border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-mono"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={expression}
          onChange={handleChange}
          placeholder="e.g. A & B | ~C"
          className="w-full h-32 p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-lg font-mono placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all resize-none"
        />

        <button
          onClick={handleOptimize}
          className="absolute bottom-4 right-4 h-9 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-offset-gray-900"
        >
          <Play className="w-4 h-4 fill-current" />
          Optimize
        </button>
      </div>

      <p className="text-[10px] text-gray-400">
        Tip: You can use standard symbols like & (AND), | (OR), ~ (NOT), ^ (XOR).
      </p>
    </div>
  );
};
