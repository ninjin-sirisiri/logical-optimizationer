---
phase: 10
plan: 1
wave: 1
---

# Plan 10.1: ゲート制約に応じた論理式生成と最適化の強化

## Objective

「Optimized Expression」表示においても指定されたゲート制約を反映させるため、回路（Circuit）からネストされた論理式文字列を生成する機能を実装します。また、二重否定（not(not(x))）などの冗長なゲートを自動で消去するように最適化処理を強化します。

## Context

- .gsd/SPEC.md
- src/core/circuit/types.ts (Circuit構造の理解)
- src/core/circuit/optimizer.ts (既存の最適化ロジック)
- src/hooks/useOptimize.ts (最適化プロセスの要)

## Tasks

<task type="auto">
  <name>回路から論理式への変換ユーティリティの実装</name>
  <files>
    <file>src/core/circuit/expression.ts</file>
  </files>
  <action>
    回路（Circuit）の各出力を起点として、再帰的にゲートを辿り、指定されたゲート名を用いたネストされた文字列式を生成する `circuitToExpression` 関数を実装してください。
    例: NANDゲートのみの場合は `NAND(NAND(A, B), C)` のような形式にします。
    また、各部分式がどのゲートIDに対応するかを追跡できるデータ構造（ExpressionTree）も定義してください。
  </action>
  <verify>ユニットテストを作成し、各種ゲートセット（NAND, NOR, Custom）で正しく文字列が生成されることを確認する。</verify>
  <done>回路オブジェクトから、指定ゲートを用いた論理式が正しく復元できる。</done>
</task>

<task type="auto">
  <name>回路最適化の強化とプロセスへの統合</name>
  <files>
    <file>src/core/circuit/optimizer.ts</file>
    <file>src/hooks/useOptimize.ts</file>
  </files>
  <action>
    1. `src/core/circuit/optimizer.ts` の `optimizeCircuit` を強化し、より広範な二重否定や冗長なバッファを消去できるようにします（例：NAND(x,x) -> NOT(x) の正規化やその逆など）。
    2. `src/hooks/useOptimize.ts` において、ゲート変換（toNANDOnly等）の後に `optimizeCircuit` を呼び出すように修正します。
    3. ゲートセットがデフォルト以外（NAND, NOR, Custom）の場合、`optimizedExpression` 文字列を `circuitToExpression` を用いて生成するように変更します。
  </action>
  <verify>
    実際に入力を行い、NANDのみの設定で `~~A` が `A` に簡略化され、かつ表示が `NAND` を用いた形式に変わることをブラウザまたはテストで確認する。
  </verify>
  <done>
    - 二重否定が自動で消去される。
    - 制限されたゲートセットでの「Optimized Expression」が指定ゲートのみを用いている。
  </done>
</task>

## Success Criteria

- [ ] `NAND` や `NOR` 等の制約下で、出力される論理式がそれらのゲートのみを使用している。
- [ ] `NOT(NOT(A))` 等の冗長な論理が自動的に最小化されている。
- [ ] テストコードで論理的等価性が維持されていることが確認できる。
