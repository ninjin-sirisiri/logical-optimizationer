---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: 型定義とユーティリティ

## Objective

真理値表のコアデータ構造と基本ユーティリティ関数を定義する。これにより後続のすべてのタスクで一貫したデータ型を使用できる。

## Context

- .gsd/SPEC.md
- .gsd/DECISIONS.md (ADR-014〜018)
- .gsd/phases/3/RESEARCH.md
- src/core/parser/types.ts (参考: 既存の型定義スタイル)

## Tasks

<task type="auto">
  <name>真理値表の型定義を作成</name>
  <files>src/core/truth-table/types.ts</files>
  <action>
    以下の型を定義する:

    1. OutputValue型 — `boolean | 'x'` (Don't Care対応)
    2. OutputEntry型 — 各出力変数の値を持つオブジェクト
    3. TruthTable型 — マップベースのデータ構造
       - inputVariables: string[] — 入力変数名（順序付き）
       - outputVariables: string[] — 出力変数名
       - entries: Map<string, OutputEntry> — パターン → 出力マッピング
    4. MAX_INPUT_VARIABLES定数 — 10（UI表示上限）
    5. TruthTableError — エラークラス

    注意:
    - 既存のparser/types.tsのスタイルに合わせる
    - エクスポートはnamed exportを使用
    - JSDocコメントを追加
  </action>
  <verify>bun run typecheck</verify>
  <done>types.tsがエラーなくコンパイルされ、すべての型がエクスポートされている</done>
</task>

<task type="auto">
  <name>ユーティリティ関数を実装</name>
  <files>src/core/truth-table/utils.ts</files>
  <action>
    以下のヘルパー関数を実装する:

    1. generateAllPatterns(n: number): string[]
       - n個の変数に対する全2^nパターンを生成
       - 例: n=2 → ["00", "01", "10", "11"]
       - ビット演算で効率的に実装

    2. patternToAssignment(pattern: string, variables: string[]): VariableAssignment
       - パターン文字列を変数割り当てに変換
       - 例: "101", ["A","B","C"] → { A: true, B: false, C: true }

    3. assignmentToPattern(assignment: VariableAssignment, variables: string[]): string
       - 変数割り当てをパターン文字列に変換
       - 上記の逆変換

    4. validateVariableCount(count: number): void
       - MAX_INPUT_VARIABLESを超える場合はTruthTableErrorをスロー

    注意:
    - parser/evaluate.tsのVariableAssignment型を再利用
    - type-onlyインポートを使用（verbatimModuleSyntax対応）
  </action>
  <verify>bun run typecheck</verify>
  <done>utils.tsがエラーなくコンパイルされ、すべての関数がエクスポートされている</done>
</task>

<task type="auto">
  <name>ユーティリティ関数のテスト作成</name>
  <files>src/core/truth-table/__tests__/utils.test.ts</files>
  <action>
    以下のテストケースを作成:

    1. generateAllPatterns
       - n=0 → [""]
       - n=1 → ["0", "1"]
       - n=2 → ["00", "01", "10", "11"]
       - n=3 → 8パターン

    2. patternToAssignment
       - 基本変換
       - 空パターン

    3. assignmentToPattern
       - patternToAssignmentの逆変換を確認

    4. validateVariableCount
       - 10以下 → エラーなし
       - 11以上 → TruthTableErrorをスロー
  </action>
  <verify>bun test src/core/truth-table/__tests__/utils.test.ts</verify>
  <done>すべてのテストがパスする</done>
</task>

## Success Criteria

- [ ] src/core/truth-table/types.ts が作成され、TruthTable型がエクスポートされている
- [ ] src/core/truth-table/utils.ts が作成され、4つのユーティリティ関数がエクスポートされている
- [ ] ユーティリティ関数のテストがすべてパスする
- [ ] `bun run typecheck` がエラーなく完了する
