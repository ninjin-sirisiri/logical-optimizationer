---
phase: 1
plan: 3
wave: 2
---

# Plan 1.3: CI/CD と テスト設定

## Objective

GitHub Actions で CI パイプラインを構築し、Cloudflare Pages へのデプロイを準備する。Bun のテストランナーをセットアップする。

## Context

- .gsd/DECISIONS.md — Cloudflare Pages 選択
- .gsd/phases/1/RESEARCH.md — CI での oxlint/oxfmt 使用方法
- package.json — scripts 定義済み

## Tasks

<task type="auto">
  <name>GitHub Actions CI ワークフロー作成</name>
  <files>
    - .github/workflows/ci.yml
  </files>
  <action>
    1. `.github/workflows/ci.yml` を作成:
       ```yaml
       name: CI

       on:
         push:
           branches: [main]
         pull_request:
           branches: [main]

       jobs:
         ci:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v4

             - name: Setup Bun
               uses: oven-sh/setup-bun@v1
               with:
                 bun-version: latest

             - name: Install dependencies
               run: bun install --frozen-lockfile

             - name: Check formatting
               run: bun run fmt:check

             - name: Lint
               run: bun run lint

             - name: Type check
               run: bun run typecheck

             - name: Test
               run: bun test

             - name: Build
               run: bun run build
       ```
    
    2. package.json に typecheck script を追加:
       ```json
       {
         "scripts": {
           "typecheck": "tsc --noEmit"
         }
       }
       ```
  </action>
  <verify>
    cat .github/workflows/ci.yml
  </verify>
  <done>
    - .github/workflows/ci.yml が存在する
    - ワークフローが lint, fmt, typecheck, test, build を実行する
  </done>
</task>

<task type="auto">
  <name>Bun テストランナーのセットアップ</name>
  <files>
    - src/core/__tests__/example.test.ts
    - bunfig.toml (オプション)
  </files>
  <action>
    1. テスト用ディレクトリとサンプルテストを作成:
       ```typescript
       // src/core/__tests__/example.test.ts
       import { describe, expect, test } from 'bun:test';

       describe('Example', () => {
         test('sanity check', () => {
           expect(1 + 1).toBe(2);
         });
       });
       ```
    
    2. bun test が動作することを確認
    
    注意: Bun はビルトインのテストランナーを持つため、追加の依存関係は不要
  </action>
  <verify>
    bun test
  </verify>
  <done>
    - `bun test` がパスする
    - サンプルテストファイルが存在する
  </done>
</task>

<task type="auto">
  <name>Cloudflare Pages デプロイ設定</name>
  <files>
    - wrangler.toml (または README にデプロイ手順)
  </files>
  <action>
    1. README.md にデプロイ手順を追記:
       ```markdown
       ## Deployment

       This project is deployed to Cloudflare Pages.

       ### Setup (First time)
       1. Connect your GitHub repository to Cloudflare Pages
       2. Build settings:
          - Build command: `bun run build`
          - Build output directory: `dist`
          - Environment variables: None required

       ### Automatic Deployment
       - Push to `main` branch triggers automatic deployment
       ```
    
    2. GitHub リポジトリに Cloudflare Pages を接続する手順は手動で行う
       （Cloudflare ダッシュボードから設定）
    
    注意: wrangler.toml は静的サイトには不要。Cloudflare Pages は自動検出する。
  </action>
  <verify>
    bun run build && ls dist/
  </verify>
  <done>
    - `bun run build` が成功する
    - dist/ ディレクトリにビルド出力がある
    - README.md にデプロイ手順が記載されている
  </done>
</task>

## Success Criteria

- [ ] .github/workflows/ci.yml が存在する
- [ ] `bun test` がパスする
- [ ] `bun run build` が成功する
- [ ] README.md にデプロイ手順が記載されている
