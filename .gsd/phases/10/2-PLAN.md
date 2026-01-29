---
phase: 10
plan: 2
wave: 2
---

# Plan 10.2: ネストされた論理式の表示と共通項の色分け

## Objective

ネストされた論理式（NAND(NAND(A, B), C) 等）をUI上でレンダリングし、複数の出力間で共有されているゲート（共通機構）を Netlist と同じ色でハイライト表示することで、視認性を向上させます。

## Context

- src/components/result/ResultView.tsx (表示の親コンポーネント)
- src/components/result/ExpressionDisplay.tsx (既存の表示コンポーネント)
- src/core/circuit/expression.ts (Plan 10.1 で作成予定)

## Tasks

<task type="auto">
  <name>ネストされた論理式表示用のコンポーネントの作成</name>
  <files>
    <file>src/components/result/GateExpressionDisplay.tsx</file>
  </files>
  <action>
    再帰的な構造を持つ論理式ツリーをレンダリングするコンポーネpt `GateExpressionDisplay` を作成してください。
    - ゲートごとに適切な括弧やカンマを表示する。
    - 各ゲートノードに `gateId` がある場合、`colorMap` を参照して背景色を適用する（Netlistでの色分けと統一）。
    - ホバー時にそのゲートの役割（タイプ）を表示するなどのUX向上を行う。
  </action>
  <verify>ストーリーブックまたはコンポーネントテストで、複雑なネスト構造と色付けが正しく表示されることを確認する。</verify>
  <done>ネストされたゲート式が色分け付きで正しく表示される。</done>
</task>

<task type="auto">
  <name>結果表示画面（ResultView）の統合</name>
  <files>
    <file>src/components/result/ResultView.tsx</file>
  </files>
  <action>
    - `ResultView` を修正し、ゲートセットが制限されている場合は `ExpressionDisplay` の代わりに `GateExpressionDisplay` を使用するようにします。
    - `netlistColorMap` を `GateExpressionDisplay` にも渡し、共通するゲートが同じ色でハイライトされるようにします。
    - 複数出力がある場合でも、すべての出力式で共通項の色分けが一貫していることを確認します。
  </action>
  <verify>
    ブラウザで動作確認を行い：
    1. ゲート制約をかけた際に式がネスト形式に変わること
    2. 複数出力間で共有されている項（NAND(A,B)等）が同じ色で塗られていること
    を確認する。
  </verify>
  <done>UI上でゲート制約に応じた式が表示され、共有項の色分けが正しく機能している。</done>
</task>

## Success Criteria

- [ ] カスタムゲートセットが使用されている際、論理式表示がツリー形式（関数形式）になっている。
- [ ] 複数の出力で同じゲート（回路ノード）が使われている場合、それらが同じハイライト色で表示される。
- [ ] NetlistのIDと論理式内のハイライトが一致している。
