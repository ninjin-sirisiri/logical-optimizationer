---
phase: 3
level: 2
researched_at: 2026-01-28
---

# Phase 3 Research — 真理値表の処理

## Questions Investigated

1. 真理値表 → SOP（積和形）変換のアルゴリズム
2. 論理式 → 真理値表生成のアルゴリズム
3. 複数出力・Don't Care対応のデータ構造
4. 大規模テーブルのUI表示戦略

---

## Findings

### 1. 真理値表 → SOP変換アルゴリズム

**調査結果:**

mintermベースの変換は以下の手順で行う：

1. **出力が1の行を特定**: 真理値表の各行をスキャンし、出力が `true` の行を抽出
2. **mintermを生成**: 各入力値に基づいてmintermを構築
   - 入力値が `0` → 変数の補数（NOT）
   - 入力値が `1` → 変数そのもの
3. **mintermをOR結合**: 生成したmintermをOR演算で結合

**実装例（TypeScript）:**

```typescript
function truthTableToSOP(table: TruthTable, outputVar: string): ASTNode | null {
  const minterms: ASTNode[] = [];

  for (const [pattern, outputs] of table.entries) {
    if (outputs[outputVar] === true) {
      const minterm = createMinterm(table.inputVariables, pattern);
      minterms.push(minterm);
    }
  }

  if (minterms.length === 0) return { type: 'constant', value: false };
  return minterms.reduce((acc, term) => ({
    type: 'binary',
    operator: 'or',
    left: acc,
    right: term,
  }));
}

function createMinterm(variables: string[], pattern: string): ASTNode {
  const terms: ASTNode[] = variables.map((v, i) => {
    const node: ASTNode = { type: 'variable', name: v };
    return pattern[i] === '0' ? { type: 'unary', operator: 'not', operand: node } : node;
  });

  return terms.reduce((acc, term) => ({
    type: 'binary',
    operator: 'and',
    left: acc,
    right: term,
  }));
}
```

**重要ポイント:**

- この段階では最適化は行わない（Phase 4のQuine-McCluskey法で実施）
- 空の真理値表（全て0）は定数 `false` を返す
- 全て1の真理値表は定数 `true` を返すか、すべてのmintermをOR結合

**Recommendation:** 上記アルゴリズムをそのまま実装。シンプルで理解しやすく、後の最適化フェーズとの接続も容易。

---

### 2. 論理式 → 真理値表生成アルゴリズム

**調査結果:**

1. **変数の抽出**: 論理式から全ての変数名を抽出（Phase 2の `extractVariables()` を使用）
2. **入力パターン生成**: n個の変数に対して 2^n 個のパターンを生成
3. **各パターンで評価**: Phase 2の `evaluate()` を使用して各パターンの出力を計算

**実装例（TypeScript）:**

```typescript
function expressionToTruthTable(ast: ASTNode, outputName: string = 'Y'): TruthTable {
  const variables = extractVariables(ast);
  const n = variables.length;
  const entries = new Map<string, OutputEntry>();

  // 2^n パターンを生成
  for (let i = 0; i < 1 << n; i++) {
    const pattern = i.toString(2).padStart(n, '0');
    const assignment: VariableAssignment = {};

    for (let j = 0; j < n; j++) {
      assignment[variables[j]] = pattern[j] === '1';
    }

    const result = evaluate(ast, assignment);
    entries.set(pattern, { [outputName]: result });
  }

  return {
    inputVariables: variables,
    outputVariables: [outputName],
    entries,
  };
}
```

**パフォーマンス考慮:**

- 10変数 = 1,024評価 → 瞬時
- 15変数 = 32,768評価 → 数百ミリ秒
- 20変数 = 1,048,576評価 → 数秒（許容範囲）

**Recommendation:** ビット演算でパターン生成し、Phase 2の既存関数を再利用。

---

### 3. データ構造設計

**確定設計（ADR-014〜016に基づく）:**

```typescript
// 出力値: true, false, または don't care
type OutputValue = boolean | 'x';

// 各入力パターンに対する出力値のマッピング
interface OutputEntry {
  [outputName: string]: OutputValue;
}

// 真理値表のメインデータ構造
interface TruthTable {
  inputVariables: string[]; // 入力変数名（順序付き）
  outputVariables: string[]; // 出力変数名（順序付き）
  entries: Map<string, OutputEntry>; // "010" -> { Y: true, Z: 'x' }
}

// UI表示用の上限定数
const MAX_INPUT_VARIABLES = 10; // UI表示上限
```

**マップベースのメリット:**

1. **スパース対応**: 未定義エントリ = 暗黙のDon't Care
2. **高速アクセス**: O(1)でパターンから出力を取得
3. **複数出力対応**: 各エントリに複数の出力値を格納可能

**パターン文字列の仕様:**

- 入力変数の順序に従って `'0'` または `'1'` を連結
- 例: 変数 `[A, B, C]` でパターン `A=1, B=0, C=1` → `"101"`

---

### 4. UIコンポーネント戦略

**調査結果:**

大規模テーブルのパフォーマンス最適化には仮想化が有効：

| ライブラリ                  | 特徴                          |
| --------------------------- | ----------------------------- |
| **@tanstack/react-virtual** | 軽量、ヘッドレス、60fps目標   |
| **react-window**            | シンプル、固定/可変サイズ対応 |
| **React Virtuoso**          | モダン、自動サイズ調整        |

**Phase 3での方針:**

簡易UIを実装するため、**仮想化は使用しない**（8変数=256行で十分高速）：

- 基本的なHTMLテーブルで実装
- CSSで固定ヘッダー
- 行のクリックで出力値トグル

**Phase 6で検討:**

- 10変数（1,024行）対応時に `@tanstack/react-virtual` を検討
- ページネーションとの組み合わせも候補

**Recommendation:** Phase 3はシンプルなテーブルで実装。変数数が多い場合は警告を表示。

---

## Decisions Made

| 決定                | 選択                     | 理由                                |
| ------------------- | ------------------------ | ----------------------------------- |
| SOP変換アルゴリズム | mintermベース            | 理解しやすく、Phase 4との接続が容易 |
| 真理値表生成        | ビット演算 + evaluate()  | Phase 2の資産を再利用               |
| データ構造          | Map<string, OutputEntry> | ADR-014で決定済み                   |
| UI方針              | シンプルHTMLテーブル     | Phase 3では256行まで想定            |

---

## Patterns to Follow

### 真理値表モジュール構造

```
src/core/truth-table/
├── types.ts          # TruthTable, OutputValue, OutputEntry
├── generator.ts      # expression → truth table
├── converter.ts      # truth table → SOP/POS expression
├── utils.ts          # ヘルパー関数（パターン生成など）
├── index.ts          # Public API
└── __tests__/
    ├── generator.test.ts
    └── converter.test.ts
```

### 命名規則

- `TruthTable` — データ構造
- `generateTruthTable(ast, outputName)` — 式→真理値表
- `truthTableToSOP(table, outputVar)` — 真理値表→SOP
- `truthTableToPOS(table, outputVar)` — 真理値表→POS

---

## Anti-Patterns to Avoid

| アンチパターン                 | 理由                                     |
| ------------------------------ | ---------------------------------------- |
| **配列ベースのデータ構造**     | Don't Careのスパース表現に不向き         |
| **Phase 3での最適化**          | 責務の分離違反（Phase 4で実施）          |
| **複雑なUI in Phase 3**        | スコープクリープの原因                   |
| **入力値バリデーションの省略** | 変数制限（10個）を強制しないと後で問題に |

---

## Dependencies Identified

| パッケージ | バージョン | 目的                    |
| ---------- | ---------- | ----------------------- |
| (なし)     | —          | Phase 3では新規依存なし |

**既存依存の活用:**

- Phase 2のパーサー (`src/core/parser/`)
- React + TypeScript（既存）
- Tailwind CSS v4（既存）

---

## Risks

| リスク                     | 軽減策                                           |
| -------------------------- | ------------------------------------------------ |
| **変数数超過**             | UIで10変数制限を強制、警告表示                   |
| **Don't Care処理の複雑化** | Phase 3では入力のDon't Care無視、出力のみ対応    |
| **複数出力のUI複雑化**     | Phase 3では単一出力のUIに限定、複数出力はPhase 6 |

---

## Ready for Planning

- [x] Questions answered
- [x] Approach selected
- [x] Dependencies identified
- [x] Data structure finalized (ADR-014〜018)
- [x] Algorithm design completed

---

## Implementation Checklist（計画時の参考）

### Wave 1: Types & Core

- [ ] `src/core/truth-table/types.ts` — 型定義
- [ ] `src/core/truth-table/utils.ts` — ヘルパー関数

### Wave 2: Generator

- [ ] `src/core/truth-table/generator.ts` — 式→真理値表
- [ ] テスト作成

### Wave 3: Converter

- [ ] `src/core/truth-table/converter.ts` — 真理値表→SOP/POS
- [ ] テスト作成

### Wave 4: Public API

- [ ] `src/core/truth-table/index.ts` — 統合API

### Wave 5: UI Component

- [ ] `src/components/TruthTable/` — 表示・編集コンポーネント
