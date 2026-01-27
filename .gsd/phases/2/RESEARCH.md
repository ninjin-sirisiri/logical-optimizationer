---
phase: 2
level: 2
researched_at: 2026-01-27
---

# Phase 2 Research — 論理式パーサーの実装

## Questions Investigated

1. Prattパーサーの基本構造と実装パターンは？
2. TypeScriptでの最適な実装方法は？
3. レクサー（トークナイザー）のベストプラクティスは？
4. 論理式に特有の考慮事項は？

---

## Findings

### 1. Prattパーサーの核心概念

Prattパーサー（Top Down Operator Precedence Parser）は、Vaughan Prattが1973年に発表した手法で、演算子の優先順位と結合性を効率的に処理します。

#### 核心となる3つの概念

| 概念                      | 説明                                                   |
| ------------------------- | ------------------------------------------------------ |
| **Binding Power (BP)**    | 演算子の「結合力」を数値で表現。高いほど優先順位が高い |
| **NUD (Null Denotation)** | 前置演算子・リテラル用のパース関数（左オペランドなし） |
| **LED (Left Denotation)** | 中置・後置演算子用のパース関数（左オペランドあり）     |

#### Binding Powerの設計パターン

```typescript
// 左右の結合力を返す
function infixBindingPower(op: string): [number, number] {
  switch (op) {
    case '+': return [1, 2];  // 左結合（右BPが大きい）
    case '*': return [3, 4];  // 左結合
    case '^': return [6, 5];  // 右結合（左BPが大きい）
  }
}

// 前置演算子は右BPのみ
function prefixBindingPower(op: string): number {
  switch (op) {
    case '-':
    case '¬': return 7;  // 高優先度
  }
}
```

**結合性のルール:**
- **左結合** (a + b + c → (a + b) + c): 右BP > 左BP
- **右結合** (a ^ b ^ c → a ^ (b ^ c)): 左BP > 右BP

**Sources:**
- [Simple but Powerful Pratt Parsing - matklad](https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html)
- [Pratt Parsers: Expression Parsing Made Easy - Bob Nystrom](https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/)

---

### 2. 最小限のPrattパーサー構造

```typescript
function parseExpression(minBp: number = 0): ASTNode {
  // 1. 前置トークン（リテラル/前置演算子）を処理
  let lhs = parsePrefix();

  // 2. 中置演算子のループ
  while (true) {
    const op = peekToken();
    if (!isInfixOperator(op)) break;

    const [lBp, rBp] = infixBindingPower(op);

    // 左BPが現在の最小BPより小さければループ終了
    if (lBp < minBp) break;

    consumeToken();  // 演算子を消費

    // 右オペランドを再帰的にパース（rBpを新しいminBpとして）
    const rhs = parseExpression(rBp);

    lhs = { type: 'binary', operator: op, left: lhs, right: rhs };
  }

  return lhs;
}
```

**重要なポイント:**
1. `minBp`引数で「これより弱い演算子で止まる」を制御
2. `lBp < minBp`のチェックでループ脱出を判断
3. 再帰呼び出しには`rBp`を渡す（結合性の制御）

---

### 3. レクサー（トークナイザー）のベストプラクティス

#### トークン型定義

```typescript
enum TokenType {
  Variable,     // A, B, input_1
  Constant,     // 0, 1
  And,          // ・
  Or,           // +
  Not,          // ¬
  Xor,          // ⊕
  LeftParen,    // (
  RightParen,   // )
  Eof,
}

interface Token {
  type: TokenType;
  value: string;
  position: number;  // エラー報告用
}
```

#### 実装のポイント

1. **ステートフルなクラス設計**
   ```typescript
   class Lexer {
     private input: string;
     private position: number = 0;

     peek(): Token { ... }
     next(): Token { ... }
   }
   ```

2. **Unicode文字のサポート**
   - `¬`, `・`, `⊕` などの特殊文字を正しく処理
   - 添字（`₀`, `₁`）も変数名の一部として認識

3. **空白のスキップ**
   - トークン間の空白を自動的にスキップ

4. **エラー位置の追跡**
   - 各トークンにposition情報を持たせる

**Sources:**
- [Building a Lexer in TypeScript](https://mohitkarekar.com)
- [dev.to TypeScript Lexer Tutorial](https://dev.to)

---

### 4. 論理式パーサーへの適用

#### 演算子優先順位（決定済み）

| 優先順位 | 演算子 | 記法 | 結合性 | Binding Power |
| -------- | ------ | ---- | ------ | ------------- |
| 1 (低)   | OR     | `+`  | 左結合 | (1, 2)        |
| 2        | XOR    | `⊕`  | 左結合 | (3, 4)        |
| 3        | AND    | `・` | 左結合 | (5, 6)        |
| 4 (高)   | NOT    | `¬`  | 前置   | 7             |

#### 括弧の処理

括弧はprefixパースレットとして処理：
1. `(`を見たら`parseExpression(0)`を再帰呼び出し
2. `)`を期待して消費

```typescript
// prefixParselet for '('
function parseGrouped(): ASTNode {
  consumeToken(); // consume '('
  const expr = parseExpression(0);
  expect(TokenType.RightParen, "Expected ')'");
  return expr;
}
```

#### 定数（0/1）の処理

```typescript
type ASTNode =
  | { type: 'constant'; value: boolean }
  | { type: 'variable'; name: string }
  | { type: 'unary'; operator: 'not'; operand: ASTNode }
  | { type: 'binary'; operator: 'and' | 'or' | 'xor'; left: ASTNode; right: ASTNode };
```

---

## Decisions Made

| Decision             | Choice                 | Rationale                      |
| -------------------- | ---------------------- | ------------------------------ |
| パーサーアルゴリズム | Pratt Parser           | データ駆動型で演算子追加が容易 |
| レクサー構造         | クラスベース           | peek/next/positionの管理が明確 |
| Binding Power表現    | タプル `[left, right]` | 結合性を明確に表現できる       |
| エラー処理           | 例外スロー             | シンプルで十分                 |

---

## Patterns to Follow

### 1. Binding Power Table Pattern

```typescript
const BINDING_POWERS: Record<string, [number, number]> = {
  '+': [1, 2],   // OR
  '⊕': [3, 4],   // XOR
  '・': [5, 6],   // AND
};

const PREFIX_BP: Record<string, number> = {
  '¬': 7,        // NOT
};
```

### 2. Parselet Pattern（拡張性重視の場合）

```typescript
interface PrefixParselet {
  parse(parser: Parser, token: Token): ASTNode;
}

interface InfixParselet {
  parse(parser: Parser, left: ASTNode, token: Token): ASTNode;
  getPrecedence(): number;
}
```

### 3. Result Type Pattern（エラー処理）

```typescript
type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ParseError };
```

---

## Anti-Patterns to Avoid

| Anti-Pattern               | Why                            |
| -------------------------- | ------------------------------ |
| 演算子ごとに関数を書く     | Prattの利点が失われる          |
| 巨大なswitch文             | テーブル駆動の方が保守性が高い |
| 位置情報を持たないトークン | エラーメッセージが不親切になる |
| パーサーとレクサーの密結合 | テストしづらくなる             |

---

## Dependencies Identified

| Package | Version | Purpose              |
| ------- | ------- | -------------------- |
| なし    | -       | 外部依存なし（自作） |

すべてTypeScriptの標準機能のみで実装可能。

---

## Recommended File Structure

```
src/core/parser/
├── types.ts         # Token, ASTNode の型定義
├── lexer.ts         # Lexer クラス
├── parser.ts        # Parser クラス（Pratt実装）
├── evaluate.ts      # 評価エンジン
└── index.ts         # 公開API

src/core/parser/__tests__/
├── lexer.test.ts
├── parser.test.ts
└── evaluate.test.ts
```

---

## Risks

| Risk                               | Mitigation                           |
| ---------------------------------- | ------------------------------------ |
| Unicode文字の処理ミス              | 各特殊文字のテストケースを用意       |
| 添字表記のパースが複雑             | 正規表現で変数名パターンを定義       |
| 優先順位の誤り                     | 全パターンの網羅テスト               |
| 大きな式でのスタックオーバーフロー | 反復処理も検討（ただし論理式では稀） |

---

## Ready for Planning

- [x] Questions answered
- [x] Approach selected (Pratt Parser)
- [x] Dependencies identified (なし)
- [x] File structure proposed
- [x] Key patterns documented
