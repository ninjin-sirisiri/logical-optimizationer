---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: プロジェクト初期化と基本構造

## Objective

Bun + Vite + React + TypeScript でプロジェクトを初期化し、論理回路最適化ツールに適したディレクトリ構造を作成する。

## Context

- .gsd/SPEC.md — プロジェクト要件
- .gsd/DECISIONS.md — 技術選定（Bun、React + TypeScript + Vite）
- .gsd/phases/1/RESEARCH.md — oxlint/oxfmt の研究結果

## Tasks

<task type="auto">
  <name>Vite + React + TypeScript プロジェクト初期化</name>
  <files>
    - package.json
    - tsconfig.json
    - vite.config.ts
    - index.html
    - src/main.tsx
    - src/App.tsx
    - src/App.css
    - src/index.css
  </files>
  <action>
    1. `bun create vite . --template react-ts` を実行（既存の .gsd フォルダを保持）
       - 注意: 空でないディレクトリなので確認が出る場合がある
    
    2. `bun install` で依存関係をインストール
    
    3. 生成された不要なファイルを整理:
       - src/assets/* は削除可能（後で必要なら追加）
       - README.md は後で上書き
  </action>
  <verify>
    bun run dev --host 2>&1 | head -20
    # "Local:" の URL が表示されることを確認
  </verify>
  <done>
    - package.json が存在し、react と vite が依存関係に含まれる
    - `bun run dev` でローカル開発サーバーが起動する
  </done>
</task>

<task type="auto">
  <name>ディレクトリ構造の作成</name>
  <files>
    - src/core/.gitkeep
    - src/components/.gitkeep
    - src/hooks/.gitkeep
    - src/types/index.ts
  </files>
  <action>
    1. 以下のディレクトリを作成:
       ```
       src/
       ├── core/           # 論理回路ロジック（UI非依存）
       │   └── .gitkeep
       ├── components/     # React コンポーネント
       │   └── .gitkeep
       ├── hooks/          # カスタムフック
       │   └── .gitkeep
       └── types/          # 共有型定義
           └── index.ts
       ```
    
    2. src/types/index.ts に基本的な型プレースホルダーを作成:
       ```typescript
       // Core types will be added in Phase 2
       export {};
       ```
    
    注意: .gitkeep は空のディレクトリを Git で追跡するため
  </action>
  <verify>
    ls -la src/core src/components src/hooks src/types
  </verify>
  <done>
    - src/core/, src/components/, src/hooks/, src/types/ が存在する
    - 各ディレクトリが Git で追跡される
  </done>
</task>

## Success Criteria

- [ ] `bun run dev` で開発サーバーが起動する
- [ ] package.json に React + TypeScript の依存関係がある
- [ ] src/core/, src/components/, src/hooks/, src/types/ ディレクトリが存在する
