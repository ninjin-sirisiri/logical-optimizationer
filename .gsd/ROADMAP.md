# ROADMAP.md

> **Current Phase**: 7
> **Milestone**: v1.0 — 組み合わせ回路の最適化

## Must-Haves (from SPEC)

- [x] 論理式のパースと評価
- [x] 真理値表 ↔ 論理式の相互変換
- [x] 論理式の最適化（SOP/POS）
- [x] 使用ゲートのカスタム選択
- [x] 複数出力の共通項抽出
- [x] WebベースのUI

## Phases

### Phase 1: プロジェクト基盤構築

**Status**: ✅ Complete
**Objective**: React + TypeScript + Vite でプロジェクトをセットアップし、開発環境を整える

**Deliverables**:

- Vite + React + TypeScript プロジェクトの初期化（Bun 使用）
- oxlint / oxfmt の設定
- 基本的なプロジェクト構造の作成（`src/core/`, `src/components/` 分離）
- CI/CD パイプラインの準備（GitHub Actions → Cloudflare Pages）
- Bun テストランナーのセットアップ

---

### Phase 2: 論理式パーサーの実装

**Status**: ✅ Complete
**Objective**: 論理式（例: `A & B | ~C`）をパースし、抽象構文木（AST）に変換する

**Deliverables**:

- 論理式の文法定義
- レクサー（トークン化）の実装
- パーサー（AST生成）の実装
- 論理式の評価エンジン
- ユニットテスト

**Key Algorithms**:

- 再帰下降パーサー または Pratt パーサー

---

### Phase 3: 真理値表の処理

**Status**: ✅ Complete
**Objective**: 真理値表の入力・表示と、論理式との相互変換を実装

**Deliverables**:

- 真理値表のデータ構造定義
- 真理値表 → 論理式（SOP形式）の変換
- 論理式 → 真理値表の生成
- 真理値表UIコンポーネント
- ユニットテスト

---

### Phase 4: 論理式の最適化エンジン

**Status**: ✅ Complete
**Objective**: Quine-McCluskey法 または 同等のアルゴリズムで論理式を最適化

**Deliverables**:

- Quine-McCluskey法の実装
- SOP（積和形）の最小化
- POS（和積形）の最小化
- 複数出力の共通項抽出（マルチレベル最適化）
- ユニットテスト

**Key Algorithms**:

- Quine-McCluskey法
- Petrick法（最小被覆問題）
- 共通因子抽出

---

### Phase 5: ゲート変換機能

**Status**: ✅ Complete
**Objective**: 最適化された論理式を指定されたゲートのみを使用する形式に変換

**Deliverables**:

- ゲート種類の定義（AND, OR, NOT, NAND, NOR, XOR, XNOR）
- NAND/NOR のみの変換アルゴリズム
- カスタムゲートセットへの変換
- 変換結果の表示
- ユニットテスト

**Key Algorithms**:

- De Morgan の法則
- 二重否定の消去
- ゲート置換ルール

---

### Phase 6: WebUI の実装

**Status**: ✅ Complete
**Objective**: 直感的で使いやすいWebインターフェースを構築

**Deliverables**:

- 論理式入力エディタ
- 真理値表入力/表示コンポーネント
- 最適化オプションパネル（SOP/POS選択、ゲート選択）
- 結果表示エリア
- レスポンシブデザイン
- ダークモード対応

---

### Phase 7: 真理値表ベースの入力定義機能

**Status**: ✅ Complete
**Objective**: 論理式の代わりに真理値表を直接編集して、論理関数をゼロから定義できるようにする。

**Deliverables**:

- 入出力変数の管理UI（変数の追加・削除・名前変更）
- 新規真理値表の生成・初期化機能
- 真理値表モード ↔ 論理式モードの切り替え
- 編集済み真理値表の最適化エンジンへの連携
- ユニットテスト

---

### Phase 8: 統合テストとポリッシュ

**Status**: ⬜ Not Started
**Objective**: 全機能を統合し、品質を確保してリリース準備

**Deliverables**:

- E2Eテストの作成
- パフォーマンス最適化
- エラーハンドリングの強化
- ドキュメント（README、使用方法）
- デプロイ設定（GitHub Pages / Vercel）

---

## Future Milestones

### v1.1 — 回路図の可視化

- 回路図のビジュアル表示（react-flow / D3.js）
- 回路図のエクスポート（PNG/SVG）

### v1.2 — HDL サポート

- Verilog 形式の入出力
- VHDL 形式の入出力

### v2.0 — 順序回路対応

- FSM（有限状態機械）の入力
- 状態最小化アルゴリズム
- 状態割り当ての最適化
- フリップフロップ変換（D-FF ↔ JK-FF ↔ T-FF）
