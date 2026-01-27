---
phase: 2
plan: 3
wave: 2
---

# Plan 2.3: 評価エンジンの実装

## Objective

ASTを評価して論理値を計算するエンジンを実装する。
変数に対する値（真理値割り当て）を受け取り、式の評価結果を返す。

## Context

- .gsd/SPEC.md
- .gsd/phases/2/RESEARCH.md
- src/core/parser/types.ts
- src/core/parser/parser.ts

## Tasks

<task type="auto">
  <name>評価エンジンの実装</name>
  <files>src/core/parser/evaluate.ts</files>
  <action>
    evaluate 関数を実装:

    1. 型定義:
       ```typescript
       type VariableAssignment = Record<string, boolean>;
       
       function evaluate(ast: ASTNode, assignment: VariableAssignment): boolean
       ```

    2. 各ノードタイプの評価:
       - constant: value を返す
       - variable: assignment[name] を返す（未定義はエラー）
       - unary (not): !operand
       - binary (and): left && right
       - binary (or): left || right
       - binary (xor): left !== right

    3. エラー処理:
       - 未定義の変数に対して EvaluationError をスロー
       - エラーメッセージに変数名を含める

    4. 補助関数:
       - extractVariables(ast: ASTNode): string[] — AST内の全変数名を抽出
  </action>
  <verify>bun run typecheck</verify>
  <done>evaluate.ts が存在し、型チェックが通る</done>
</task>

<task type="auto">
  <name>評価エンジンのユニットテスト</name>
  <files>src/core/parser/__tests__/evaluate.test.ts</files>
  <action>
    以下のテストケースを作成:

    1. 定数:
       - parse('0'), {} → false
       - parse('1'), {} → true

    2. 変数:
       - parse('A'), { A: true } → true
       - parse('A'), { A: false } → false

    3. NOT:
       - parse('¬A'), { A: true } → false
       - parse('¬A'), { A: false } → true
       - parse('¬0'), {} → true
       - parse('¬1'), {} → false

    4. AND:
       - parse('A・B'), { A: true, B: true } → true
       - parse('A・B'), { A: true, B: false } → false
       - parse('A・B'), { A: false, B: true } → false
       - parse('A・B'), { A: false, B: false } → false

    5. OR:
       - parse('A+B'), { A: false, B: false } → false
       - parse('A+B'), { A: true, B: false } → true

    6. XOR:
       - parse('A⊕B'), { A: true, B: true } → false
       - parse('A⊕B'), { A: true, B: false } → true
       - parse('A⊕B'), { A: false, B: true } → true
       - parse('A⊕B'), { A: false, B: false } → false

    7. 複合式:
       - parse('A・B+C'), { A: true, B: false, C: true } → true
       - parse('¬(A+B)'), { A: false, B: false } → true
       - parse('(A⊕B)・C'), 各組み合わせ

    8. extractVariables:
       - 'A・B+C' → ['A', 'B', 'C']
       - '¬A' → ['A']
       - '0+1' → []

    9. エラーケース:
       - parse('A'), {} → EvaluationError (変数Aが未定義)
  </action>
  <verify>bun test src/core/parser/__tests__/evaluate.test.ts</verify>
  <done>全テストケースがパスする</done>
</task>

## Success Criteria

- [ ] `src/core/parser/evaluate.ts` が存在
- [ ] `evaluate()` 関数が正しく論理式を評価する
- [ ] `extractVariables()` 関数がAST内の変数を正しく抽出する
- [ ] `src/core/parser/__tests__/evaluate.test.ts` の全テストがパス
