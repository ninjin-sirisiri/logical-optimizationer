import React from 'react';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-gray-200 dark:selection:bg-gray-700">
      {/* 1024px minimum width desktop-first container constraint */}
      <div className="mx-auto w-full max-w-5xl px-6 lg:min-w-[1024px]">
        <header className="py-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Mu Logic
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
              Optimization Engine
            </p>
          </div>
          <nav className="flex gap-4">{/* Future: Mode toggles, help, etc. */}</nav>
        </header>

        <main className="py-12 flex flex-col gap-12">{children}</main>

        <footer className="py-12 mt-auto border-t border-gray-50 dark:border-gray-900 text-xs text-gray-400 flex justify-between">
          <p>© 2026 Mu Design System</p>
          <p>Built for efficiency</p>
        </footer>
      </div>
    </div>
  );
};
