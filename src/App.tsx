import { useStoreValue } from '@simplestack/store/react';
import { Toaster } from 'sonner';

import { ExpressionEditor } from './components/editor/ExpressionEditor';
import { InputModeToggle } from './components/editor/InputModeToggle';
import { VariableManager } from './components/editor/VariableManager';
import { Shell } from './components/layout/Shell';
import { OptimizationControls } from './components/panel/OptimizationControls';
import { ResultView } from './components/result/ResultView';
import { TruthTableEditor } from './components/table/TruthTableEditor';
import { appStore } from './store';

function App() {
  const { inputMode } = useStoreValue(appStore);

  return (
    <Shell>
      <Toaster position="top-right" />
      <div className="flex flex-col gap-8 mb-12">
        <InputModeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-12 items-start">
        <div className="flex flex-col gap-12">
          {inputMode === 'expression' ? (
            <section>
              <ExpressionEditor />
            </section>
          ) : (
            <section className="flex flex-col gap-8">
              <VariableManager />
              <TruthTableEditor />
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-12 lg:sticky lg:top-12">
          <section>
            <OptimizationControls />
          </section>

          <section>
            <ResultView />
          </section>
        </aside>
      </div>
    </Shell>
  );
}

export default App;
