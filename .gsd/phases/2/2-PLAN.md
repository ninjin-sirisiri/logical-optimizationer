---
phase: 2
plan: 2
wave: 1
---

# Plan 2.2: Prattパーサーの実装

## Objective

Prattパーサーを実装し、トークン列を抽象構文木（AST）に変換する。
Binding Power テーブル駆動型で、演算子の優先順位と結合性を正しく処理する。

## Context

- .gsd/SPEC.md
- .gsd/DECISIONS.md (ADR-010: Prattパーサー, ADR-011: AST構造)
- .gsd/phases/2/RESEARCH.md
- src/core/parser/types.ts
- src/core/parser/lexer.ts

## Tasks

<task type="auto">
  <name>Parserクラスの実装</name>
  <files>src/core/parser/parser.ts</files>
  <action>
    Pratt Parser を実装:

    1. Binding Power テーブル:
       ```typescript
       const INFIX_BP: Record<string, [number, number]> = {
         '+': [1, 2],   // OR - 左結合
         '⊕': [3, 4],   // XOR - 左結合
         '・': [5, 6],   // AND - 左結合
       };
       const PREFIX_BP: Record<string, number> = {
         '¬': 7,        // NOT
       };
       ```

    2. Parser クラス:
       - constructor(lexer: Lexer)
       - parse(): ASTNode — エントリーポイント
       - private parseExpression(minBp: number): ASTNode — メインループ
       - private parsePrefix(): ASTNode — 前置トークン処理

    3. parseExpression アルゴリズム:
       - 前置トークン（変数/定数/NOT/括弧）を処理
       - ループで中置演算子を処理
       - lBp < minBp でループ脱出
       - 再帰呼び出しに rBp を渡す

    4. 括弧処理:
       - '(' を見たら parseExpression(0) を呼び出し
       - ')' を期待して消費

    5. エラー処理:
       - 予期しないトークンで ParseError をスロー
       - 閉じ括弧がない場合のエラー

    注意:
    - Lexer への依存は constructor injection で
    - Token の位置情報をエラーメッセージに含める

  </action>
  <verify>bun run typecheck</verify>
  <done>parser.ts が存在し、型チェックが通る</done>
</task>

<task type="auto">
  <name>Parserのユニットテスト</name>
  <files>src/core/parser/__tests__/parser.test.ts</files>
  <action>
    以下のテストケースを作成:

    1. 単純な式:
       - 'A' → { type: 'variable', name: 'A' }
       - '0' → { type: 'constant', value: false }
       - '1' → { type: 'constant', value: true }

    2. 単項演算子:
       - '¬A' → { type: 'unary', operator: 'not', operand: { type: 'variable', name: 'A' } }
       - '¬¬A' → 二重NOT

    3. 二項演算子:
       - 'A・B' → AND
       - 'A+B' → OR
       - 'A⊕B' → XOR

    4. 優先順位:
       - 'A+B・C' → A+(B・C) (ANDがORより優先)
       - 'A・B+C' → (A・B)+C
       - 'A+B⊕C' → A+(B⊕C) (XORがORより優先)
       - '¬A・B' → (¬A)・B (NOTが最優先)

    5. 結合性（左結合）:
       - 'A+B+C' → (A+B)+C
       - 'A・B・C' → (A・B)・C

    6. 括弧:
       - '(A+B)・C' → 括弧でOR優先
       - 'A・(B+C)' → 括弧でOR優先
       - '(A)' → 単純なグループ化

    7. 複合式:
       - '¬(A・B)+C'
       - 'A⊕B・C+D'

    8. エラーケース:
       - '' → 空の入力
       - '(' → 閉じ括弧なし
       - 'A+' → オペランドなし

  </action>
  <verify>bun test src/core/parser/__tests__/parser.test.ts</verify>
  <done>全テストケースがパスする</done>
</task>

## Success Criteria

- [ ] `src/core/parser/parser.ts` が存在し、Parserクラスが実装済み
- [ ] 演算子の優先順位が正しく処理される（NOT > AND > XOR > OR）
- [ ] 左結合性が正しく処理される
- [ ] 括弧によるグループ化が正しく処理される
- [ ] `src/core/parser/__tests__/parser.test.ts` の全テストがパス
