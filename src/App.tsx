import { Shell } from './components/layout/Shell';
import { ExpressionEditor } from './components/editor/ExpressionEditor';
import { TruthTableEditor } from './components/table/TruthTableEditor';
import { OptimizationControls } from './components/panel/OptimizationControls';
import { ResultView } from './components/result/ResultView';

function App() {
  return (
    <Shell>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-12 items-start">
        <div className="flex flex-col gap-12">
          <section>
            <ExpressionEditor />
          </section>

          <section>
            <TruthTableEditor />
          </section>
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
