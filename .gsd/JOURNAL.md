# JOURNAL.md — Development Journal

## 2026-01-27: プロジェクト開始

### Session Summary

`/new-project` ワークフローでプロジェクトを初期化。

### What We Discussed

- 論理回路最適化ツールのビジョン
- 入出力形式（論理式、真理値表）
- 最適化の範囲（SOP/POS、ゲート選択、共通項抽出）
- 技術スタック（React + TypeScript + Vite）
- スコープ（v1.0 は組み合わせ回路、v2.0 で順序回路）

### Key Decisions

- Web アプリとして構築
- 組み合わせ回路を優先
- 回路図の可視化は後のフェーズ

### Files Created

- `.gsd/SPEC.md` — プロジェクト仕様書
- `.gsd/ROADMAP.md` — 7フェーズのロードマップ
- `.gsd/STATE.md` — プロジェクト状態
- `.gsd/DECISIONS.md` — 技術決定記録
- `.gsd/JOURNAL.md` — 開発ジャーナル
- `.gsd/TODO.md` — TODOリスト

- `/plan 1` で Phase 1 の詳細計画を作成

---

## 2026-01-27: Tailwind CSS 移行と UI リデザイン

### Session Summary

プロジェクトのスタイリング手法を従来の CSS から Tailwind CSS (v4) へ移行。これに伴い、`App.tsx` をプレミアムなデザインにリデザイン。

### What We Changed

- `tailwindcss` および `@tailwindcss/vite` の導入
- `vite.config.ts` でのプラグイン設定
- `src/index.css` の Tailwind 指令への更新
- `src/App.tsx` の Tailwind クラスによるフルリデザイン
- 不要になった `src/App.css` の削除

### Key Decisions

- **ADR-008**: 開発効率とデザインの一貫性のために Tailwind CSS v4 を採用。

### Next Step

- `/plan 2` で Phase 2（論理式パーサー実装）のプランを作成

---

## 2026-01-28: TypeScript 型インポートの修正 (verbatimModuleSyntax)

### Session Summary

`tsconfig.app.json` で `verbatimModuleSyntax` が有効になっているため、型のみのインポートには `import type` を使用する必要があるというエラーを修正しました。

### What We Changed

- `src/core/parser/evaluate.ts`, `lexer.ts`, `parser.ts`, `index.ts` のインポート文を修正。
- `import { type ASTNode, ... }` または `import type { ASTNode }` の形式に統一。
- `bun x tsc --noEmit` により全ファイルで型エラーがないことを確認。

### Key Decisions

- TypeScript 5.0+ の `verbatimModuleSyntax` 設定に準拠し、型安全かつランタイムに影響を与えないインポート方法を徹底。

---

## 2026-01-28: コード品質の向上と Lint エラーの修正

### Session Summary

`bun lint` を実行し、コードベース全体の静的解析エラーおよび警告を修正しました。これにより、コードの可読性と保守性が向上しました。

### What We Changed

- **src/core/circuit/converter.ts**: `getASTKey` を外部スコープに移動し、不要な関数再生成を防止。
- **src/core/circuit/transformers.ts**: 未使用の型インポート `GateNode` を削除。
- **src/core/circuit/__tests__/integration.test.ts**: 未使用変数 `optimized` の削除、ヘルパー関数 `evaluateCircuit` と `checkEquivalence` のスコープ修正。
- **src/core/circuit/__tests__/converter.test.ts**: `Array#sort()` をイミュータブルな `Array#toSorted()` に置き換え（oxlint による修正）。
- **共通**: すべての `oxlint` 警告とエラーを解消し、`bun lint` が正常に終了（Exit 0）することを確認。

### Key Decisions

- 静的解析ルール（oxlint/unicorn）に従い、潜在的なバグ（配列のミューテーション）やパフォーマンス上の懸念（関数スコープ）を早期に解消。
- テストコードもプロダクションコードと同様の品質基準を適用。

### Next Step

- Phase 6 (WebUI Implementation) の計画作成に進む。
