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
  inputVariables: string[];           // 入力変数名（順序付き）
  outputVariables: string[];          // 出力変数名（順序付き）
  entries: Map<string, OutputEntry>;  // 入力パターン -> 出力値
}

type OutputValue = boolean | 'x';     // true, false, または don't care

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
