# DECISIONS.md — Architecture Decision Records

## ADR-001: Web アプリケーションとして構築

**Date**: 2026-01-27
**Status**: Accepted

### Context

論理回路最適化ツールをどの形態で構築するか。

### Options Considered

1. Web アプリ（ブラウザベース）
2. デスクトップアプリ（Electron など）
3. CLI ツール

### Decision

**Web アプリ**を選択。

### Rationale

- インストール不要でアクセスしやすい
- クロスプラットフォーム対応
- 将来の公開が容易（GitHub Pages / Vercel）
- 回路図の可視化に適している（Canvas/SVG）

---

## ADR-002: React + TypeScript + Vite を採用

**Date**: 2026-01-27
**Status**: Accepted

### Context

Web アプリのフロントエンド技術スタックの選定。

### Options Considered

1. React + TypeScript + Vite
2. Vue + TypeScript + Vite
3. Solid.js + TypeScript
4. Vanilla TypeScript

### Decision

**React + TypeScript + Vite** を選択。

### Rationale

- TypeScript で論理回路のデータ構造を型安全に表現
- Vite による高速な開発体験
- React の豊富なエコシステム（将来の回路図可視化に react-flow が使える）
- 広く使われており、情報が得やすい

---

## ADR-003: 組み合わせ回路を優先

**Date**: 2026-01-27
**Status**: Accepted

### Context

組み合わせ回路と順序回路の両方をサポートしたいが、どちらを優先するか。

### Decision

**組み合わせ回路を v1.0 で実装**し、順序回路は v2.0 で対応。

### Rationale

- 組み合わせ回路の最適化は基盤となる
- 順序回路は組み合わせ回路の知識を前提とする
- 早期に動作するものをリリースし、フィードバックを得たい

---

## Phase 1 Decisions

**Date**: 2026-01-27

### ADR-004: Bun をパッケージマネージャー兼ランタイムとして採用

**Status**: Accepted

#### Context

パッケージマネージャーとテストランナーの選定。

#### Options Considered

1. npm + Vitest
2. pnpm + Vitest
3. Bun（パッケージマネージャー + 組み込みテストランナー）

#### Decision

**Bun** を選択。

#### Rationale

- 高速なパッケージインストールとビルド
- 組み込みのテストランナーで追加依存が不要
- モダンな開発体験

---

### ADR-005: oxlint + oxfmt を Linter/Formatter として採用

**Status**: Accepted

#### Context

コード品質ツールの選定。

#### Options Considered

1. ESLint + Prettier
2. oxlint + oxfmt

#### Decision

**oxlint + oxfmt** を選択。

#### Rationale

- Rust ベースで高速
- 設定がシンプル
- ESLint との互換性のある設定が可能

---

### ADR-006: Cloudflare Pages をデプロイ先として採用

**Status**: Accepted

#### Context

デプロイ先の選定。

#### Options Considered

1. GitHub Pages
2. Vercel
3. Cloudflare Pages

#### Decision

**Cloudflare Pages** を選択。

#### Rationale

- 高速なエッジネットワーク
- 無料枠が充実
- GitHub との連携が容易

---

### ADR-007: ディレクトリ構造の分離

**Status**: Accepted

#### Decision

`src/core/`（ロジック）と `src/components/`（UI）を分離する。

#### Rationale

- 論理回路の処理は UI 非依存
- テストしやすい設計
- 将来的な CLI や他のフロントエンドへの再利用が容易

---

## ADR-008: Tailwind CSS v4 を採用

**Date**: 2026-01-27
**Status**: Accepted

### Context

スタイリング手法の選定。

### Options Considered

1. Vanilla CSS / CSS Modules
2. Tailwind CSS
3. Styled Components / Emotion

### Decision

**Tailwind CSS (v4)** を選択。

### Rationale

- 迅速な UI 開発が可能
- ユーティリティファーストによる一貫性
- Vite プラグイン（@tailwindcss/vite）による高速なビルドと開発体験
- モバイルスムーズなレスポンシブデザインの容易さ
- モダンで洗練されたデザインシステムを構築しやすい

---

## Phase 2 Decisions

**Date**: 2026-01-27

### ADR-009: 論理式の文法定義

**Status**: Accepted

#### Context

論理式パーサーでサポートする演算子と記法の決定。

#### Decision

以下の演算子記法を採用:

| 演算子 | 記法 |
| ------ | ---- |
| AND    | `・` |
| OR     | `+`  |
| NOT    | `¬`  |
| XOR    | `⊕`  |

#### 変数名ルール

- 添字表記を許可（例: `A₀`, `input_1`, `A[0]`）
- 括弧のネストに制限なし
- 定数 `0`（FALSE）/ `1`（TRUE）をサポート

#### 演算子優先順位（高い順）

1. NOT（単項演算子）
2. AND
3. XOR
4. OR

---

### ADR-010: Pratt パーサーの採用

**Status**: Accepted

#### Context

論理式をパースしてASTを生成するアルゴリズムの選定。

#### Options Considered

1. 再帰下降パーサー
2. Pratt パーサー（演算子優先順位パーサー）

#### Decision

**Pratt パーサー** を選択。

#### Rationale

- 演算子の追加・変更が容易（データ駆動型）
- 優先順位の変更が柔軟
- 将来のゲート追加に対応しやすい
- 演算子ごとの優先順位設定がテーブルベースで管理しやすい

---

### ADR-011: ASTデータ構造 — 汎用的な二項演算子型

**Status**: Accepted

#### Context

論理式のASTをどのようなデータ構造で表現するか。

#### Decision

汎用的な二項演算子型を採用:

```typescript
type BinaryOperator = 'and' | 'or' | 'xor';
type UnaryOperator = 'not';

type ASTNode =
  | { type: 'variable'; name: string }
  | { type: 'constant'; value: boolean }
  | { type: 'unary'; operator: UnaryOperator; operand: ASTNode }
  | { type: 'binary'; operator: BinaryOperator; left: ASTNode; right: ASTNode };
```

#### Rationale

- 新しい演算子の追加が容易
- パターンマッチングで処理しやすい
- 最適化フェーズでの変換が統一的に行える

---

### ADR-012: パーサーの自作

**Status**: Accepted

#### Context

パーサーを自作するか、既存ライブラリを使用するか。

#### Decision

**パーサーを自作する**。

#### Rationale

- 学習目的に適している
- 論理式は比較的シンプルな文法
- 外部依存を減らせる
- パーサーの内部動作を完全に把握できる

---

### ADR-013: シンプルなエラーハンドリング

**Status**: Accepted

#### Context

パースエラー時のエラーハンドリング方針。

#### Decision

シンプルなエラーハンドリングを採用:

```typescript
interface ParseError {
  message: string; // エラーメッセージ
  position: number; // 文字位置（0-indexed）
  expected?: string[]; // 期待していたトークン（任意）
}
```

#### Rationale

- 学習ツールとして十分な情報
- 複雑な回復ロジックは不要
- 必要に応じて後から拡張可能
- 入力は比較的短いため、最初のエラーで停止しても問題ない

---

## Phase 3 Decisions

**Date**: 2026-01-28

### ADR-014: 真理値表のデータ構造 — マップベース設計

**Status**: Accepted

#### Context

真理値表のデータ構造を配列ベースにするかマップベースにするか。

#### Options Considered

1. **配列ベース**: `{ variables: string[], rows: { inputs: boolean[], output: boolean }[] }`
2. **マップベース**: `{ variables: string[], outputs: Map<string, OutputValue> }`

#### Decision

**マップベース（Option B）** を選択。

#### Rationale

- Don't Care（未定義値）を効率的に表現できる
- スパースな真理値表（大部分がDon't Care）をメモリ効率よく扱える
- 複数出力への拡張が容易
- 特定の入力組み合わせへの高速アクセスが可能

---

### ADR-015: 複数出力のサポート

**Status**: Accepted

#### Context

真理値表で複数の出力変数をサポートするか。

#### Decision

**Phase 3 から複数出力を考慮した設計**を行う。

#### Design

```typescript
interface TruthTable {
  inputVariables: string[]; // 入力変数名（順序付き）
  outputVariables: string[]; // 出力変数名（順序付き）
  entries: Map<string, OutputEntry>; // 入力パターン -> 出力値
}

type OutputValue = boolean | 'x'; // true, false, または don't care

interface OutputEntry {
  [outputName: string]: OutputValue;
}
```

#### Rationale

- Phase 4（最適化）で複数出力の共通項抽出が必要
- SPECの「複数出力の共通項抽出」に対応
- 後から設計変更するよりも最初から対応する方が効率的

---

### ADR-016: Don't Care（未定義値）のサポート

**Status**: Accepted

#### Context

真理値表でDon't Care（'x'）をサポートするか。

#### Decision

**Phase 3 から Don't Care を設計に含める**。

#### Representation

- 入力側: マップに存在しないエントリ = Don't Care として扱う
- 出力側: `'x'` リテラル値で明示的に表現

#### Rationale

- Phase 4 の Quine-McCluskey 法で Don't Care が最適化に重要
- ハードウェア設計では実際に頻繁に使用される
- 最初から設計に含めることで後からの変更を回避

---

### ADR-017: 変数数の上限

**Status**: Accepted

#### Context

UIで扱える入力変数の最大数を定めるか。

#### Decision

**入力変数の上限を 10 変数**とする。

| 変数数 | 行数（最大） | 判断         |
| ------ | ------------ | ------------ |
| 8      | 256          | ✓ 快適       |
| 10     | 1,024        | ✓ **UI上限** |
| 12     | 4,096        | ✗ 過負荷     |

#### Implementation

- **UIコンポーネント**: 10変数を超える入力を警告/拒否
- **コアロジック**: 制限なし（計算可能な範囲で処理）
- 必要に応じてページネーションや仮想スクロールで大きなテーブルに対応

#### Rationale

- 1,024行はスクロール可能だがユーザビリティの限界
- 教育・学習目的では10変数で十分
- ブラウザのパフォーマンスを考慮

---

### ADR-018: Phase 3 での簡易UIの実装

**Status**: Accepted

#### Context

UIコンポーネントを Phase 3 で実装するか、Phase 6 まで待つか。

#### Decision

**Phase 3 で簡易的なUIコンポーネントを実装**する。

#### Scope

- 真理値表の表示コンポーネント
- 基本的なインタラクション（行の選択、出力値の切り替え）
- スタイリングはシンプルに（Phase 6 でポリッシュ）

#### Rationale

- コア機能のテストと検証が視覚的に行える
- 早期のフィードバックが得られる
- Phase 6 では他のUI要素との統合に集中できる

---

## Phase 4 Decisions

**Date**: 2026-01-28

### ADR-019: Quine-McCluskey (QM) 法 + Petrick 法の採用

**Status**: Accepted

#### Context

論理式の最小化（最適化）アルゴリズムの選定。入力変数が最大 10 個という制約下で、最適な結果（厳密解）を求める必要がある。

#### Options Considered

1. **Quine-McCluskey (QM) 法 + Petrick 法**: 厳密解を求める手法。
2. **Espresso 法**: 経験則に基づいたヒューリスティックな手法。大規模回路向け。

#### Decision

**Quine-McCluskey (QM) 法 + Petrick 法** を採用。

#### Rationale

- 10変数以内であれば QM 法でも十分なパフォーマンスとメモリ使用量で動作する。
- 最小化された SOP/POS 形式（厳密な最小解）を確実に得ることができる。
- アルゴリズムの構造が整理されており、ユニットテストによる検証が容易。
- 教育・学習ツールとして、正しい最小解を表示することが重要である。

---

### ADR-020: SOP ベースの最適化アーキテクチャ

**Status**: Accepted

#### Context

SOP（積和形）と POS（和積形）の最小化をどのように実装するか。

#### Decision

**SOP 最適化をコアとし、POS はそのラッパーとして実装**する。

- **SOP 最小化**: 出力が `true`（1）および `'x'`（Don't Care）の項を使用して QM 法を適用。
- **POS 最小化**:
  1. 真理値表の出力を反転させる（0 -> 1, 1 -> 0, x -> x）。
  2. 反転した表に対して SOP 最小化を行う。
  3. 得られた SOP 式にド・モルガンの法則を適用して POS 式に変換する。

#### Rationale

- 実装の重複を避け、バグの混入リスクを低減できる。
- メンテナンス性が向上する。

---

### ADR-021: マルチ出力 QM 法の初期実装

**Status**: Accepted

#### Context

複数出力を持つ回路において、共通項を抽出して全体的なゲート数を削減する（マルチレベル最適化）必要がある。

#### Decision

**最初から複数出力を同時に処理する QM 法**を実装する。

#### Design

- 各主項（Prime Implicant）が「どの出力変数をカバーしているか」という情報を保持する。
- Petrick 法において、複数の出力関数の充足条件を結合して解（最小被覆）を求める。

#### Rationale

- 単一出力の最適化を繰り返すだけでは、複数出力間の共通項を抽出できない。
- SPEC の「複数出力の共通項抽出」を確実に達成するため、最初からこの設計で進める。

---

### ADR-022: API 中心の実装 (中間表示なし)

**Status**: Accepted

#### Context

最適化プロセスの詳細（中間ステップ）を表示するか。

#### Decision

**初期実装では結果（最小化された式）の出力に集中する**。

#### Rationale

- まずは最適化の正確性を優先。
- UI 側の複雑さを抑え、最短で Phase 4 を完了させる。
- 中間ステップの表示は将来的な機能追加（学習モードなど）として検討する。

---

## Phase 5 Decisions

**Date**: 2026-01-28

### ADR-023: ゲートレベルの回路表現 — GateNode と DAG の導入

**Status**: Accepted

#### Context

最適化された論理式を実際のゲート（AND, OR, NAND, NOR等）の構成に変換する際、どのようなデータ構造で保持すべきか。

#### Decision

**`GateNode` を導入し、有向非巡回グラフ（DAG）で回路を表現する**。

```typescript
type GateType = 'and' | 'or' | 'not' | 'nand' | 'nor' | 'xor' | 'xnor' | 'buf';

interface GateNode {
  id: string;
  type: GateType;
  inputs: (string | GateNode)[]; // 変数IDまたは他のゲートへの参照
}

interface Circuit {
  inputs: string[];
  outputs: Map<string, GateNode | string>;
  gates: GateNode[];
}
```

#### Rationale

- AST（木構造）では共通項（ファンアウト）を表現しにくいため、グラフ構造が適している。
- 各ノードが独立した「ゲート」として振る舞い、物理的な回路構成に直結する。
- ゲートごとの接続関係（ネットリスト）の管理が容易。

---

### ADR-024: 変換アルゴリズム — ルールベースの再帰置換とピープホール最適化

**Status**: Accepted

#### Context

任意の論理式を特定のゲートセット（例: NANDのみ）に変換するための手法。

#### Decision

**「テンプレートベースの再帰置換」と「ピープホール最適化」の二段階方式**を採用。

1. **基本変換**: 論理式（AND, OR, NOT）をターゲットゲートセットで表現された部分グラフに置換する。
2. **クリーンアップ（ピープホール最適化）**: 二重否定（NOT-NOT）の除去や、余剰なバッファの削除などのローカルな最適化パスを実行する。

#### Rationale

- シンプルなルール（例: `A | B` -> `~( ~A & ~B )`）の組み合わせで複雑なセットにも対応可能。
- 変換直後の冗長なゲートをクリーンアップパスで分離して処理することで、変換ロジックを簡潔に保てる。

---

### ADR-025: カスタムゲートセットの考慮

**Status**: Accepted

#### Context

ユーザーが使用可能なゲートを制限した場合の挙動。

#### Decision

**主要なターゲットセット（NANDのみ、NORのみ、標準ゲートセット等）をあらかじめ定義し、順次拡張可能にする**。

#### Rationale

- 最初から完全な自動セルマッピングを実装するのは複雑すぎるため、典型的なユースケース（NAND/NOR化）から実装を開始する。
- 将来的にはユーザーが独自の変換ルールを定義できる余地を残す。

---

## Phase 6 Decisions

**Date**: 2026-01-28

### ADR-026: WebUI のスコープ and 機能の確定

**Status**: Accepted

#### Context

Phase 6 で実装する WebUI の具体的な機能範囲を決定する。

#### Decision

以下の機能を実装範囲とする：

- **入力エディタ**: 論理式をテキスト入力するシンプルなエリア。補完や構文エラーのリアルタイム表示は行わず、パース実行時にエラーを表示する。
- **真理値表**: 入力変数に応じて動的にサイズが変化し、セルの直接編集（0/1/x）が可能なテーブル。
- **最適化設定**: SOP/POSの切り替え、使用可能ゲートの選択（NANDのみ、等）を行うパネル。
- **結果表示**: 最適化された論理式およびゲート変換結果を表示する。計算の中間過程（QM法の表など）は表示しない。

#### Rationale

- 開発効率を優先し、コアロジックの成果を確認することに特化させる。
- 複雑なエディタ機能よりも、データ構造の正確な表現と操作性に注力する。

---

### ADR-027: @simple-stack/store による状態管理の採用

**Status**: Accepted

#### Context

アプリケーション全体のグローバルな状態（論理式、真理値表、設定）を管理する手法の選定。

#### Decision

**[@simple-stack/store](https://simple-stack.dev/store)** を採用する。

#### Rationale

- ユーザーからの指定があり、プロジェクトの要件に合致している。
- シンプルでボイラープレートが少なく、リアクティブな状態管理が可能。
- コンポーネント間の疎結合を維持しつつ、共通の状態にアクセスしやすい。

---

### ADR-028: Mu ミニマリスト・ガイドラインに基づく UI デザイン

**Status**: Accepted

#### Context

WebUI のビジュアルデザインおよびインタフェース設計の指針。

#### Decision

**`.agent/rules/ui-design-guidelines.md`（Mu デザイン哲学）** に従い、以下の原則で構築する：

- **ミニマリズム**: 視覚的ノイズを排除し、白・黒・グレーを基調とした高密度なレイアウト。
- **キーボード中心**: 入力エリアやボタンなどのアクセシビリティを確保。
- **デスクトップ優先**: 画面幅 1024px 以上をターゲットとし、モバイル対応は優先度を下げる。
- **Tailwind CSS v4**: 標準値を最大限活用し、カスタムトークンを避ける。

#### Rationale

- プロジェクトの一貫した美学を維持するため。
- 機能性を最優先し、インターフェースが「消える」体験を提供するため。

---

### ADR-029: 真理値表の局所スクロールと入力支援

**Status**: Accepted

#### Context

真理値表の操作性と論理式入力の利便性を向上させるための具体的な UI 設計。

#### Decision

1. **真理値表の局所スクロール**: 真理値表コンポーネントのみを横スクロール（最大幅を超えた場合）および縦スクロール可能にし、画面全体がスクロールして操作しづらくなるのを防ぐ。
2. **論理式入力支援**: `&`, `|`, `~`, `^` などの論理記号をワンクリックで入力できるボタン（仮想キーボード）を配置する。

#### Rationale

- 行数や変数数が増えた際のユーザビリティを確保するため。
- 特殊記号の入力負荷を軽減するため。

---

## Phase 9 Decisions

**Date**: 2026-01-29

### ADR-030: Playwright による E2E テストの採用

**Status**: Accepted

#### Context

統合されたアプリケーションの品質を保証するためのテスト手法の選定。

#### Decision

**Playwright** を採用する。

#### Scope

以下の主要なユーザーフローをテスト対象とする：
- 論理式の入力とパース
- 真理値表の編集（変数の追加・削除、セルの切り替え）
- 最適化の実行（SOP/POS の検証）
- ゲート選択と変換結果の整合性

#### Rationale

- クロスブラウザテストが容易
- 高速で信頼性の高い実行（Auto-waiting 機能）
- 複雑な UI インタラクション（真理値表の編集など）のテストに適している

---

### ADR-031: 5-6 変数制限のガード導入

**Status**: Accepted

#### Context

Quine-McCluskey 法の計算負荷によるパフォーマンス低下への対策。

#### Decision

**5-6 変数を超える場合に警告またはガードを表示する**。初期状態では 6 変数を超えると計算を行わない、またはユーザーに確認を促す。

#### Rationale

- 10変数までは理論上可能だが、ブラウザ上での Quine-McCluskey 法は指数関数的に重くなるため、快適な操作性を維持するために制限を設ける。

---

### ADR-032: Toast によるエラー通知の採用

**Status**: Accepted

#### Context

変換失敗やバリデーションエラーをユーザーに通知する方法。

#### Decision

**Toast 通知**（Sonner 等）を採用する。

#### Rationale

- 操作を妨げずにフィードバックを提供できる
- モダンの UI デザイン（ADR-028）に合致する

---

### ADR-033: Cloudflare Pages を推奨デプロイ先として確定

**Status**: Accepted

#### Context

デプロイ先の最終決定.

#### Decision

**Cloudflare Pages** を使用する。

#### Rationale

- Phase 1 での検討事項を継承
- 高速なエッジ配信と Bun との相性が良い
- プレビューデプロイ機能が強力

---

### ADR-034: モバイル対応の最小化

**Status**: Accepted

#### Context

レスポンシブデザインの優先順位。

#### Decision

**最低限の操作（論理式の確認、最適化の実行）ができる程度**のレスポンシブ対応とする。

#### Rationale

- 本ツールは高密度な情報を扱うため、主にデスクトップでの利用を想定している。
- 開発コストを抑え、コア機能の品質向上に注力する。

