---
phase: 2
plan: 4
wave: 2
---

# Plan 2.4: 公開APIと統合テスト

## Objective

パーサーモジュールの公開APIを整備し、統合テストで全体の動作を検証する。
外部から使いやすいインターフェースを提供する。

## Context

- .gsd/SPEC.md
- .gsd/phases/2/RESEARCH.md
- src/core/parser/types.ts
- src/core/parser/lexer.ts
- src/core/parser/parser.ts
- src/core/parser/evaluate.ts

## Tasks

<task type="auto">
  <name>公開APIのエクスポート</name>
  <files>src/core/parser/index.ts</files>
  <action>
    パーサーモジュールの公開APIを定義:

    1. 便利関数:
       ```typescript
       // 文字列から直接パース
       export function parse(input: string): ASTNode

       // 文字列から直接評価
       export function evaluateExpression(
         input: string, 
         assignment: VariableAssignment
       ): boolean

       // 式内の変数を抽出
       export function getVariables(input: string): string[]
       ```

    2. 型のエクスポート:
       - TokenType, Token
       - ASTNode, BinaryOperator
       - VariableAssignment
       - ParseError, EvaluationError

    3. クラスのエクスポート（上級者向け）:
       - Lexer
       - Parser

    4. 低レベル関数のエクスポート:
       - evaluate
       - extractVariables
  </action>
  <verify>bun run typecheck</verify>
  <done>index.ts が存在し、全APIがエクスポートされている</done>
</task>

<task type="auto">
  <name>統合テスト</name>
  <files>src/core/parser/__tests__/integration.test.ts</files>
  <action>
    エンドツーエンドの統合テストを作成:

    1. parse → evaluate のフロー:
       ```typescript
       const ast = parse('A・B+C');
       const result = evaluate(ast, { A: true, B: false, C: true });
       expect(result).toBe(true);
       ```

    2. evaluateExpression ヘルパー:
       ```typescript
       expect(evaluateExpression('A・B', { A: true, B: true })).toBe(true);
       ```

    3. getVariables ヘルパー:
       ```typescript
       expect(getVariables('A・B+C')).toEqual(['A', 'B', 'C']);
       ```

    4. 複雑な式の検証:
       - '¬(A・B)+C⊕D'
       - 'A₀・A₁+B₀・B₁'（添字変数）
       - '((A+B)・(C+D))'（ネスト括弧）

    5. 真理値表の生成テスト:
       - 2変数のすべての組み合わせで評価
       - AND, OR, XOR, NAND(¬(A・B)), NOR(¬(A+B)) の真理値表

    6. エラー伝播の確認:
       - ParseError が正しくスローされる
       - EvaluationError が正しくスローされる
       - エラーメッセージに位置情報が含まれる
  </action>
  <verify>bun test src/core/parser/__tests__/integration.test.ts</verify>
  <done>全統合テストがパスする</done>
</task>

<task type="auto">
  <name>全テストの実行確認</name>
  <files>-</files>
  <action>
    パーサーモジュール全体のテストを実行:

    1. 全テストを実行:
       ```bash
       bun test src/core/parser/
       ```

    2. 型チェック:
       ```bash
       bun run typecheck
       ```

    3. リンティング:
       ```bash
       bun run lint
       ```

    4. 問題があれば修正
  </action>
  <verify>bun test src/core/parser/ && bun run typecheck && bun run lint</verify>
  <done>全テスト通過、型チェック成功、リント警告なし</done>
</task>

## Success Criteria

- [ ] `src/core/parser/index.ts` が存在し、全APIがエクスポート済み
- [ ] `parse()`, `evaluateExpression()`, `getVariables()` が正しく動作
- [ ] `src/core/parser/__tests__/integration.test.ts` の全テストがパス
- [ ] `bun test src/core/parser/` で全テストがパス
- [ ] `bun run typecheck` が成功
- [ ] `bun run lint` がエラーなし
