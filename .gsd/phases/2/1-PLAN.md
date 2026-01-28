---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: 型定義とレクサーの実装

## Objective

論理式パーサーの基盤となる型定義（Token, ASTNode）とレクサー（Lexer）を実装する。
レクサーは入力文字列をトークン列に変換し、パーサーの入力として使用される。

## Context

- .gsd/SPEC.md
- .gsd/DECISIONS.md (Phase 2 Decisions: ADR-009〜013)
- .gsd/phases/2/RESEARCH.md

## Tasks

<task type="auto">
  <name>型定義の作成</name>
  <files>src/core/parser/types.ts</files>
  <action>
    以下の型を定義:

    1. TokenType enum:
       - Variable (変数)
       - Constant (定数 0/1)
       - And (・)
       - Or (+)
       - Not (¬)
       - Xor (⊕)
       - LeftParen, RightParen
       - Eof

    2. Token interface:
       - type: TokenType
       - value: string
       - position: number

    3. ASTNode type (判別共用体):
       - { type: 'constant'; value: boolean }
       - { type: 'variable'; name: string }
       - { type: 'unary'; operator: 'not'; operand: ASTNode }
       - { type: 'binary'; operator: BinaryOperator; left: ASTNode; right: ASTNode }

    4. BinaryOperator type: 'and' | 'or' | 'xor'

    5. ParseError class:
       - message: string
       - position: number
       - expected?: string[]

  </action>
  <verify>bun run typecheck</verify>
  <done>types.ts が存在し、型チェックが通る</done>
</task>

<task type="auto">
  <name>Lexerクラスの実装</name>
  <files>src/core/parser/lexer.ts</files>
  <action>
    Lexer クラスを実装:

    1. コンストラクタ:
       - input: string を受け取る
       - position を 0 に初期化

    2. メソッド:
       - peek(): Token — 現在のトークンを返す（位置を進めない）
       - next(): Token — 現在のトークンを返し、位置を進める
       - private skipWhitespace(): void
       - private readVariable(): Token — 変数名（添字含む）を読み取る
       - private readToken(): Token — 1トークン読み取る

    3. 特殊文字のサポート:
       - ・(U+30FB), +(U+002B), ¬(U+00AC), ⊕(U+2295)
       - 添字文字: ₀₁₂₃₄₅₆₇₈₉ (U+2080〜U+2089)

    4. 変数名パターン:
       - アルファベットで始まる
       - 英数字、アンダースコア、添字を含む
       - 例: A, B₀, input_1, CLK₂

    5. エラー処理:
       - 未知の文字は ParseError をスロー

  </action>
  <verify>bun run typecheck</verify>
  <done>lexer.ts が存在し、型チェックが通る</done>
</task>

<task type="auto">
  <name>Lexerのユニットテスト</name>
  <files>src/core/parser/__tests__/lexer.test.ts</files>
  <action>
    以下のテストケースを作成:

    1. 基本トークン化:
       - 'A' → [Variable('A'), Eof]
       - '0' → [Constant('0'), Eof]
       - '1' → [Constant('1'), Eof]

    2. 演算子:
       - 'A・B' → [Variable, And, Variable, Eof]
       - 'A+B' → [Variable, Or, Variable, Eof]
       - '¬A' → [Not, Variable, Eof]
       - 'A⊕B' → [Variable, Xor, Variable, Eof]

    3. 括弧:
       - '(A)' → [LeftParen, Variable, RightParen, Eof]

    4. 空白処理:
       - 'A ・ B' → [Variable, And, Variable, Eof]

    5. 複雑な変数名:
       - 'input_1' → [Variable('input_1'), Eof]
       - 'A₀' → [Variable('A₀'), Eof]

    6. 複合式:
       - 'A・B+C' → [Variable, And, Variable, Or, Variable, Eof]
       - '¬(A+B)' → [Not, LeftParen, Variable, Or, Variable, RightParen, Eof]

    7. エラーケース:
       - '@' → ParseError

  </action>
  <verify>bun test src/core/parser/__tests__/lexer.test.ts</verify>
  <done>全テストケースがパスする</done>
</task>

## Success Criteria

- [ ] `src/core/parser/types.ts` が存在し、型定義が完了
- [ ] `src/core/parser/lexer.ts` が存在し、Lexerクラスが実装済み
- [ ] `src/core/parser/__tests__/lexer.test.ts` の全テストがパス
- [ ] `bun run typecheck` が成功
