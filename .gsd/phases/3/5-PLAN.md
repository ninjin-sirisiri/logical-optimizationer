---
phase: 3
plan: 5
wave: 3
---

# Plan 3.5: 真理値表UIコンポーネント

## Objective

真理値表を表示・編集するためのReactコンポーネントを作成する。Phase 6で本格的なUI統合を行う前の、機能検証用の簡易UIとして実装する。

## Context

- .gsd/DECISIONS.md (ADR-017: 変数上限10, ADR-018: 簡易UI)
- .gsd/phases/3/RESEARCH.md (UI戦略)
- src/core/truth-table/index.ts
- src/components/ (既存コンポーネントディレクトリ)

## Tasks

<task type="auto">
  <name>TruthTableDisplayコンポーネントを作成</name>
  <files>src/components/TruthTable/TruthTableDisplay.tsx</files>
  <action>
    表示専用の真理値表コンポーネントを作成:

    Props:
    - table: TruthTable — 表示する真理値表
    - className?: string — 追加のCSSクラス

    機能:
    1. テーブルヘッダー
       - 入力変数名（左側）
       - 出力変数名（右側、背景色を変えて区別）

    2. テーブルボディ
       - 各行に入力パターンと出力値を表示
       - true → "1"、false → "0"、'x' → "X"（スタイル区別）
       - 行にストライプ（偶数/奇数で背景色変更）

    3. スタイリング
       - Tailwind CSSを使用
       - モノスペースフォント（数値の整列）
       - 固定ヘッダー（スクロール時も表示）
       - コンパクトなセルパディング

    4. 空テーブル対応
       - entriesが空の場合はメッセージ表示

    注意:
    - Phase 3では編集機能は含めない（表示のみ）
    - 仮想化は使用しない（256行まで想定）

  </action>
  <verify>bun run typecheck</verify>
  <done>TruthTableDisplay.tsxがエラーなくコンパイルされる</done>
</task>

<task type="auto">
  <name>TruthTableEditorコンポーネントを作成</name>
  <files>src/components/TruthTable/TruthTableEditor.tsx</files>
  <action>
    編集可能な真理値表コンポーネントを作成:

    Props:
    - table: TruthTable — 編集する真理値表
    - onChange: (table: TruthTable) => void — 変更コールバック
    - readOnly?: boolean — 読み取り専用モード
    - className?: string — 追加のCSSクラス

    機能:
    1. TruthTableDisplayを拡張
       - 出力セルをクリックで値をトグル
       - true → false → 'x' → true のサイクル

    2. インタラクション
       - ホバー時にセルをハイライト
       - クリック時に視覚的フィードバック
       - キーボードナビゲーション（オプション）

    3. 変更通知
       - onChangeで新しいTruthTableを返す
       - イミュータブルな更新（元のtableは変更しない）

    4. readOnlyモード
       - trueの場合はTruthTableDisplayと同じ動作

  </action>
  <verify>bun run typecheck</verify>
  <done>TruthTableEditor.tsxがエラーなくコンパイルされる</done>
</task>

<task type="auto">
  <name>インデックスファイルとエクスポート</name>
  <files>src/components/TruthTable/index.ts</files>
  <action>
    コンポーネントのエクスポート設定:

    1. 以下をエクスポート
       - TruthTableDisplay
       - TruthTableEditor

    2. 必要に応じてProps型もエクスポート
       - TruthTableDisplayProps
       - TruthTableEditorProps

    コンポーネントディレクトリ構造:
    src/components/TruthTable/
    ├── index.ts
    ├── TruthTableDisplay.tsx
    └── TruthTableEditor.tsx

  </action>
  <verify>bun run typecheck</verify>
  <done>index.tsがエラーなくコンパイルされ、コンポーネントがエクスポートされている</done>
</task>

## Success Criteria

- [ ] src/components/TruthTable/ ディレクトリが作成されている
- [ ] TruthTableDisplay が真理値表を正しく表示する
- [ ] TruthTableEditor が出力値の編集をサポートする
- [ ] Tailwind CSSでスタイリングされている
- [ ] `bun run typecheck` がエラーなく完了する

## Verification (Human)

Phase 3完了後、ブラウザで以下を確認:

- 真理値表が正しく表示される
- 出力値のトグルが動作する
- スクロール時にヘッダーが固定される
