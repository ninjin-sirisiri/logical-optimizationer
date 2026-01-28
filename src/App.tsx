import { useState } from 'react';
import { TruthTableDisplay, TruthTableEditor } from './components/TruthTable';
import { expressionToTruthTable, type TruthTable } from './core/truth-table';

function App() {
  const [expression, setExpression] = useState('A・B + C');
  const [table, setTable] = useState<TruthTable>(() => expressionToTruthTable('A・B + C'));

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setExpression(val);
    try {
      const newTable = expressionToTruthTable(val);
      setTable(newTable);
    } catch (err) {
      // Ignore parse errors while typing
    }
  };

  const handleTableChange = (newTable: TruthTable) => {
    setTable(newTable);
  };

  return (
    <div className="min-h-screen w-screen bg-neutral-50 dark:bg-neutral-950 p-8 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Logical Optimizationer</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            真理値表コンポーネントの動作確認
          </p>
        </header>

        <section className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold">1. 入力値から生成 (Display)</h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="expression" className="text-sm font-medium">
              論理式を入力:
            </label>
            <input
              id="expression"
              type="text"
              value={expression}
              onChange={handleExpressionChange}
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="e.g. A・B + C"
            />
          </div>
          <div className="mt-4 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <TruthTableDisplay table={table} />
          </div>
        </section>

        <section className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold">2. 直接編集 (Editor)</h2>
          <p className="text-sm text-neutral-500">
            出力列（青色のヘッダー）のセルをクリックすると値を切り替えられます (0 → 1 → X)
          </p>
          <div className="mt-4 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <TruthTableEditor table={table} onChange={handleTableChange} />
          </div>
        </section>

        <footer className="pt-8 text-center text-sm text-neutral-500">
          &copy; 2026 Logical Optimizationer Project
        </footer>
      </div>
    </div>
  );
}

export default App;
