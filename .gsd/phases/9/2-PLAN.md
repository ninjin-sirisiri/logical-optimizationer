---
phase: 9
plan: 2
wave: 2
---

# Plan 9.2: E2E Testing with Playwright

## Objective
主要なユーザーフローが正しく動作することを Playwright を用いた E2E テストで保証する。

## Context
- .gsd/SPEC.md
- package.json

## Tasks

<task type="auto">
  <name>Playwright のセットアップ</name>
  <files>package.json, playwright.config.ts</files>
  <action>
    - `@playwright/test` をインストールする (`bun add -d @playwright/test`)。
    - `playwright.config.ts` を作成し、ローカル開発サーバー (`http://localhost:5173`) を対象に設定する。
    - `package.json` に `test:e2e` スクリプトを追加する。
  </action>
  <verify>npx playwright --version が正常に応答すること</verify>
  <done>Playwright がインストールされ、設定ファイルが作成されている</done>
</task>

<task type="auto">
  <name>主要フローのテスト実装</name>
  <files>e2e/logical-flow.spec.ts</files>
  <action>
    - 以下のテストケースを実装する：
      1. 論理式の入力 -> 最適化結果の表示
      2. 真理値表の編集 -> 変数追加 -> 最適化
      3. ゲート選択の変更 -> 変換結果の更新
      4. 6変数制限のガード発動の確認
  </action>
  <verify>bun run test:e2e を実行し、全てのテストがパスすること</verify>
  <done>e2e/ ディレクトリにテストコードが存在し、パスする</done>
</task>

## Success Criteria
- [ ] Playwright がプロジェクトに統合されている
- [ ] 主要な全機能（式入力、真理値表、最適化、ゲート変換）が自動テストでカバーされている
