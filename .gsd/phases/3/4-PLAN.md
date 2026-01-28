---
phase: 3
plan: 4
wave: 2
---

# Plan 3.4: Public API

## Objective

真理値表モジュールの統合APIを作成し、外部から利用しやすいインターフェースを提供する。Phase 2のパーサーモジュールと同様のAPI設計を採用する。

## Context

- src/core/parser/index.ts (参考: 既存のPublic API設計)
- src/core/truth-table/types.ts
- src/core/truth-table/utils.ts
- src/core/truth-table/generator.ts
- src/core/truth-table/converter.ts

## Tasks

<task type="auto">
  <name>Public APIを作成</name>
  <files>src/core/truth-table/index.ts</files>
  <action>
    以下の構成でPublic APIを作成:

    1. Re-exports（すべての型とクラス）
       - export * from './types'
       - export * from './utils'
       - export * from './generator'
       - export * from './converter'

    2. 便利関数（ラッパー）
       - expressionToTruthTable(expression: string, outputName?: string): TruthTable
         → generateTruthTableFromExpressionのエイリアス

       - truthTableToExpression(table: TruthTable, outputVar: string, form?: 'sop' | 'pos'): ASTNode
         → formに応じてtruthTableToSOPまたはtruthTableToPOSを呼ぶ
         → デフォルトは 'sop'

    3. JSDocコメント
       - モジュール全体の説明
       - 各エクスポートの説明
       - 使用例

    注意:
    - parser/index.tsのスタイルに合わせる
    - type-onlyインポートを適切に使用
  </action>
  <verify>bun run typecheck</verify>
  <done>index.tsがエラーなくコンパイルされ、すべてのAPIがエクスポートされている</done>
</task>

<task type="auto">
  <name>統合テスト作成</name>
  <files>src/core/truth-table/__tests__/integration.test.ts</files>
  <action>
    Public APIを使用した統合テストを作成:

    1. 基本的なワークフローテスト
       - 式をパース → 真理値表生成 → SOP変換 → 評価
       - 元の式と同じ結果になることを確認

    2. 複数出力のワークフロー
       - 2つの異なる式から真理値表を手動構築
       - 各出力を個別に変換

    3. エッジケース
       - 1変数の式
       - 定数式（"1", "0"）
       - 最大変数数（10変数）

    4. エラーケース
       - 11変数でエラー
       - 存在しない出力変数でエラー（オプション）

    5. expressionToTruthTableとtruthTableToExpressionの往復
       - 往復後に同じ真理値表が得られることを確認
  </action>
  <verify>bun test src/core/truth-table/__tests__/integration.test.ts</verify>
  <done>すべての統合テストがパスする</done>
</task>

<task type="auto">
  <name>全テスト実行と型チェック</name>
  <files>src/core/truth-table/</files>
  <action>
    truth-tableモジュール全体の品質確認:

    1. 型チェック
       - bun run typecheck

    2. リンティング
       - bun run lint

    3. 全テスト実行
       - bun test src/core/truth-table/

    4. 問題があれば修正
  </action>
  <verify>bun run typecheck && bun run lint && bun test src/core/truth-table/</verify>
  <done>型チェック、リンティング、テストがすべてパスする</done>
</task>

## Success Criteria

- [ ] src/core/truth-table/index.ts が作成されている
- [ ] expressionToTruthTable() が動作する
- [ ] truthTableToExpression() がSOP/POSを選択できる
- [ ] 統合テストがすべてパスする
- [ ] `bun run typecheck && bun run lint` がエラーなく完了する
