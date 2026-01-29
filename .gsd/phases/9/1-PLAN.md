---
phase: 9
plan: 1
wave: 1
---

# Plan 9.1: Application Polish & Infrastructure

## Objective
アプリケーションの品質向上のため、通知機能（Toast）の導入、計算負荷ガードの実装、およびモバイル表示の微調整を行う。

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md
- src/core/optimizer/qm.ts
- src/store/index.ts
- src/components/

## Tasks

<task type="auto">
  <name>通知ライブラリの導入とベース設定</name>
  <files>package.json, src/App.tsx</files>
  <action>
    - `sonner` をインストールする (`bun add sonner`)。
    - `App.tsx` のルートに `<Toaster />` コンポーネントを配置する。
  </action>
  <verify>bun run dev で起動し、コンソールエラーが出ないこと</verify>
  <done>sonner が依存関係に追加され、App.tsx に配置されている</done>
</task>

<task type="auto">
  <name>変数制限ガードとエラーハンドリングの実装</name>
  <files>src/store/index.ts, src/components/TruthTableEditor.tsx</files>
  <action>
    - 最適化実行前に入力変数の数を確認するロジックを追加する（6変数超でガード）。
    - 制限を超えた場合、`sonner` の `toast.error` を使用してユーザーに通知する。
    - 最適化中にエラーが発生した場合のエラーハンドリングを強化し、ユーザーにフィードバックを表示する。
  </action>
  <verify>6変数以上の真理値表で最適化ボタンを押した際に Toast で警告が表示されること</verify>
  <done>変数制限ガードが動作し、Toast で通知される</done>
</task>

<task type="auto">
  <name>レスポンシブ表示の微調整</name>
  <files>src/App.tsx, src/components/TruthTableEditor.tsx</files>
  <action>
    - 真理値表コンポーネントに `overflow-x-auto` を設定し、小画面でも崩れないようにする。
    - メインレイアウトのコンテナに適切なパディングを設定し、モバイルでの視認性を向上させる。
  </action>
  <verify>ブラウザのデベロッパーツールでモバイルサイズ（375px等）にした際に大きなレイアウト崩れがないこと</verify>
  <done>モバイルでの最低限の操作性が確保されている</done>
</task>

## Success Criteria
- [ ] エラーや成功時に Toast 通知が表示される
- [ ] 6変数を超える計算に対してガードがかかる
- [ ] モバイルサイズで真理値表がスクロール可能になっている
