# Agent Rules & Guidelines

このファイルは、AIエージェントがこのプロジェクト「logical-optimizationer」で開発を行う際に遵守すべきルールとガイドラインを定義します。

## 1. Domain Logic Rules (ドメインロジックのルール)

### 1.1 Separation of Concerns (関心の分離)
*   **ルール**: 論理回路の解析、最適化、真理値表生成などのコアロジックは、Reactコンポーネントから完全に分離してください。
*   **配置**: `src/core/` ディレクトリ配下に、純粋関数(Pure Functions)またはクラスとして実装してください。
*   **依存**: コアロジックはUIライブラリ（Reactなど）に依存してはいけません。

### 1.2 Data Structures (データ構造)
*   **ルール**: 論理値は曖昧さを避けるため、一貫した型定義を使用してください。
*   **推奨**: 単なる `boolean` ではなく、`type Bit = 0 | 1;` のような明確な数値型、あるいは `z` (ハイインピーダンス)や `x` (不定) を考慮した型定義を使用してください。

### 1.3 Verification (検証)
*   **ルール**: 最適化アルゴリズムを実装・修正した際は、必ず**論理的等価性**を保証してください。
*   **方法**: 真理値表を生成し、入力パターンの全網羅テスト（または十分なランダムテスト）を行うテストケースを含めてください。「最適化前と後で真理値表が一致するか」が合格基準です。

## 2. Coding Standards (コーディング規約)

### 2.1 Technology Stack
*   **Frontend**: React + TypeScript
*   **Build**: Vite
*   **Styling**: Vanilla CSS (CSS Modules推奨) または TailwindCSS (ユーザー指示による)
*   **Testing**: Vitest (ロジックテスト用)

### 2.2 TypeScript
*   **ルール**: `any` 型の使用は原則禁止です。
*   **ルール**: 可能な限り厳格な型チェックを維持してください。

### 2.3 Component Design
*   **ルール**: UIコンポーネントは再利用性を考慮して設計してください。
*   **構成**: `src/components/ui` (汎用部品) と `src/components/features` (機能固有) のような構成を推奨します。

## 3. Documentation
*   **ルール**: 複雑なアルゴリズム（Quine-McCluskey法、Espresso法など）を実装する際は、コード内にアルゴリズムの手順や参照元をJSDocコメントとして記載してください。
