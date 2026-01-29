---
phase: 9
plan: 3
wave: 3
---

# Plan 9.3: Finalization & Deployment Preparation

## Objective
リリースに向けた最終調整を行い、ドキュメントの更新とデプロイ設定を完了させる。

## Context
- .gsd/SPEC.md
- README.md
- package.json

## Tasks

<task type="auto">
  <name>ドキュメントの更新</name>
  <files>README.md</files>
  <action>
    - アプリケーションの使用方法、サポートされている演算子、制限事項（変数制限）を追記する。
    - 開発者向けのセットアップ手順（Bun 使用）を最新化する。
  </action>
  <verify>README.md をプレビューして内容が正確であること</verify>
  <done>ユーザーおよび開発者向けのドキュメントが完成している</done>
</task>

<task type="auto">
  <name>デプロイ設定の確認と最終ビルドテスト</name>
  <files>package.json</files>
  <action>
    - Cloudflare Pages 向けのビルド設定を確認する。
    - ローカルで `bun run build` を実行し、エラーなく完了することを確認する。
    - `bun run preview` でビルド成果物が正しく動作することを確認する。
  </action>
  <verify>dist/ インデックスファイルが正しく生成され、プレビューで動作すること</verify>
  <done>ビルド成果物が正常であり、デプロイ準備が整っている</done>
</task>

## Success Criteria
- [ ] README.md が最新の状態になっている
- [ ] 本番用ビルドが正常に動作する
