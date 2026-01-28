---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: 論理式 → 真理値表生成

## Objective

論理式（AST）から真理値表を生成する機能を実装する。Phase 2のパーサーと評価エンジンを活用し、全入力パターンに対する出力を計算する。

## Context

- .gsd/phases/3/RESEARCH.md
- .gsd/phases/3/1-PLAN.md (依存: types.ts, utils.ts)
- src/core/parser/index.ts (parse, evaluate, extractVariables)
- src/core/parser/types.ts (ASTNode)
- src/core/truth-table/types.ts
- src/core/truth-table/utils.ts

## Tasks

<task type="auto">
  <name>真理値表生成関数を実装</name>
  <files>src/core/truth-table/generator.ts</files>
  <action>
    以下の関数を実装する:

    1. generateTruthTable(ast: ASTNode, outputName?: string): TruthTable
       - 論理式ASTから真理値表を生成
       - outputNameのデフォルトは "Y"
       - 手順:
         a. extractVariables(ast)で入力変数を抽出
         b. validateVariableCount()で変数数をチェック
         c. generateAllPatterns()で全パターン生成
         d. 各パターンでevaluate()を実行
         e. 結果をTruthTableに格納

    2. generateTruthTableFromExpression(expression: string, outputName?: string): TruthTable
       - 文字列の論理式から真理値表を生成
       - parse(expression)でASTに変換してからgenerateTruthTableを呼ぶ
       - ラッパー関数として提供

    注意:
    - パーサーからのインポートはtype-onlyを使用（ASTNode）
    - 評価関数は通常インポート
    - 変数名の順序はextractVariablesの戻り値順（アルファベット順）
  </action>
  <verify>bun run typecheck</verify>
  <done>generator.tsがエラーなくコンパイルされ、2つの生成関数がエクスポートされている</done>
</task>

<task type="auto">
  <name>真理値表生成のテスト作成</name>
  <files>src/core/truth-table/__tests__/generator.test.ts</files>
  <action>
    以下のテストケースを作成:

    1. 単純な式のテスト
       - "A" → 2行（A=0→Y=false, A=1→Y=true）
       - "1" → 1行（定数true）
       - "0" → 1行（定数false）

    2. 複数変数のテスト
       - "A & B" → 4行、正しい真理値表
       - "A | B" → 4行、正しい真理値表
       - "A ^ B" → 4行、XORの真理値表

    3. 複雑な式のテスト
       - "~A & B | C" → 8行
       - 括弧を含む式

    4. カスタム出力名
       - outputName: "F" が正しく設定される

    5. 変数数制限
       - 11変数 → TruthTableErrorをスロー

    6. 文字列入力のテスト
       - generateTruthTableFromExpressionが正しく動作
  </action>
  <verify>bun test src/core/truth-table/__tests__/generator.test.ts</verify>
  <done>すべてのテストがパスする</done>
</task>

## Success Criteria

- [ ] src/core/truth-table/generator.ts が作成されている
- [ ] generateTruthTable() が正しく真理値表を生成する
- [ ] generateTruthTableFromExpression() が文字列入力に対応する
- [ ] 10変数を超える入力でエラーがスローされる
- [ ] すべてのテストがパスする
