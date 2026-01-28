---
phase: 3
plan: 3
wave: 2
---

# Plan 3.3: 真理値表 → SOP/POS変換

## Objective

真理値表から論理式（SOP: 積和形、POS: 和積形）への変換機能を実装する。これにより真理値表と論理式の双方向変換が可能になる。

## Context

- .gsd/phases/3/RESEARCH.md
- src/core/parser/types.ts (ASTNode, BinaryOperator)
- src/core/truth-table/types.ts
- src/core/truth-table/utils.ts

## Tasks

<task type="auto">
  <name>SOP/POS変換関数を実装</name>
  <files>src/core/truth-table/converter.ts</files>
  <action>
    以下の関数を実装する:

    1. truthTableToSOP(table: TruthTable, outputVar: string): ASTNode
       - 出力がtrueの行からmintermを生成
       - mintermをOR演算で結合
       - 手順:
         a. entriesからoutputVar=trueの行を抽出
         b. 各行に対してcreateMintermでAND項を生成
         c. すべてのmintermをOR演算で結合
         d. 空の場合は { type: 'constant', value: false } を返す
         e. 1つの場合はそのmintermを返す

    2. truthTableToPOS(table: TruthTable, outputVar: string): ASTNode
       - 出力がfalseの行からmaxtermを生成
       - maxtermをAND演算で結合
       - 手順:
         a. entriesからoutputVar=falseの行を抽出
         b. 各行に対してcreateMaxtermでOR項を生成
         c. すべてのmaxtermをAND演算で結合
         d. 空の場合は { type: 'constant', value: true } を返す

    3. createMinterm(variables: string[], pattern: string): ASTNode
       - 内部ヘルパー関数
       - パターン文字列から積項を生成
       - '0' → NOT(変数), '1' → 変数

    4. createMaxterm(variables: string[], pattern: string): ASTNode
       - 内部ヘルパー関数
       - パターン文字列から和項を生成
       - '0' → 変数, '1' → NOT(変数)（mintermと逆）

    注意:
    - Don't Care ('x') の出力はスキップ
    - 複数出力の場合は指定されたoutputVarのみ処理
    - 空のテーブルや全Don't Careはエラーではなく定数を返す

  </action>
  <verify>bun run typecheck</verify>
  <done>converter.tsがエラーなくコンパイルされ、truthTableToSOPとtruthTableToPOSがエクスポートされている</done>
</task>

<task type="auto">
  <name>変換関数のテスト作成</name>
  <files>src/core/truth-table/__tests__/converter.test.ts</files>
  <action>
    以下のテストケースを作成:

    1. SOP変換テスト
       - AND関数（出力が1つ）→ 単一minterm
       - OR関数（出力が3つ）→ 3つのmintermのOR
       - XOR関数 → 正しいSOP形式
       - 全て0 → constant false
       - 全て1 → すべてのmintermのOR

    2. POS変換テスト
       - AND関数 → 正しいPOS形式
       - OR関数 → 単一maxterm
       - 全て0 → すべてのmaxtermのAND
       - 全て1 → constant true

    3. Don't Care処理
       - 一部が'x'のテーブル → 'x'の行はスキップ

    4. 複数出力テスト
       - 2つの出力を持つテーブル
       - 各出力ごとに正しく変換

    5. 往復変換テスト（roundtrip）
       - 式 → 真理値表 → SOP → 真理値表
       - 元の真理値表と一致することを確認

  </action>
  <verify>bun test src/core/truth-table/__tests__/converter.test.ts</verify>
  <done>すべてのテストがパスする</done>
</task>

## Success Criteria

- [ ] src/core/truth-table/converter.ts が作成されている
- [ ] truthTableToSOP() が正しくSOP形式のASTを生成する
- [ ] truthTableToPOS() が正しくPOS形式のASTを生成する
- [ ] Don't Care値が適切に処理される
- [ ] すべてのテストがパスする
