import { useStore } from '@simplestack/store/react';
import { appStore } from '../../store';
import { motion } from 'framer-motion';

export const InputModeToggle = () => {
  const { inputMode } = useStore(appStore);

  const setMode = (mode: 'expression' | 'table') => {
    appStore.update((state) => {
      state.inputMode = mode;
    });
  };

  return (
    <div className="flex p-1 bg-neutral-900/50 backdrop-blur-md rounded-xl border border-white/5 w-fit self-center">
      <button
        onClick={() => setMode('expression')}
        className="relative px-6 py-2 text-sm font-medium transition-colors"
      >
        {inputMode === 'expression' && (
          <motion.div
            layoutId="active-toggle"
            className="absolute inset-0 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className={`relative z-10 ${inputMode === 'expression' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
          Logic Expression
        </span>
      </button>
      <button
        onClick={() => setMode('table')}
        className="relative px-6 py-2 text-sm font-medium transition-colors"
      >
        {inputMode === 'table' && (
          <motion.div
            layoutId="active-toggle"
            className="absolute inset-0 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className={`relative z-10 ${inputMode === 'table' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
          Truth Table
        </span>
      </button>
    </div>
  );
};
