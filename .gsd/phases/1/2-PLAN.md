---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Linter / Formatter 設定

## Objective

oxlint と oxfmt を設定し、コード品質と一貫したスタイルを確保する。

## Context

- .gsd/phases/1/RESEARCH.md — oxlint/oxfmt の設定詳細
- package.json — 依存関係追加先

## Tasks

<task type="auto">
  <name>oxlint と oxfmt のインストールと設定</name>
  <files>
    - package.json (scripts 追加)
    - .oxlintrc.json
    - .oxfmtrc.json
  </files>
  <action>
    1. パッケージをインストール:
       ```bash
       bun add -D oxlint oxfmt
       ```
    
    2. `.oxlintrc.json` を作成:
       ```json
       {
         "$schema": "./node_modules/oxlint/configuration_schema.json",
         "plugins": ["react", "typescript", "unicorn"],
         "categories": {
           "correctness": "error",
           "suspicious": "warn"
         },
         "rules": {
           "no-console": "warn"
         },
         "env": {
           "browser": true
         }
       }
       ```
    
    3. `.oxfmtrc.json` を作成:
       ```json
       {
         "$schema": "./node_modules/oxfmt/configuration_schema.json",
         "printWidth": 100,
         "tabWidth": 2,
         "useTabs": false,
         "semi": true,
         "singleQuote": true,
         "trailingComma": "all",
         "experimentalSortImports": {
           "enabled": true
         }
       }
       ```
    
    4. package.json に scripts を追加:
       ```json
       {
         "scripts": {
           "lint": "oxlint",
           "lint:fix": "oxlint --fix",
           "fmt": "oxfmt .",
           "fmt:check": "oxfmt --check ."
         }
       }
       ```
  </action>
  <verify>
    bun run lint && bun run fmt:check
  </verify>
  <done>
    - `bun run lint` がエラーなく実行される
    - `bun run fmt:check` がエラーなく実行される
    - .oxlintrc.json と .oxfmtrc.json が存在する
  </done>
</task>

<task type="auto">
  <name>既存コードのフォーマット適用</name>
  <files>
    - src/**/*.tsx
    - src/**/*.ts
  </files>
  <action>
    1. フォーマッターを実行:
       ```bash
       bun run fmt
       ```
    
    2. Linter の自動修正を実行:
       ```bash
       bun run lint:fix
       ```
    
    3. 残りのエラー/警告を確認し、必要に応じて手動修正
  </action>
  <verify>
    bun run fmt:check && bun run lint
  </verify>
  <done>
    - すべてのソースファイルがフォーマット済み
    - Linter エラーがゼロ（警告は許容）
  </done>
</task>

## Success Criteria

- [ ] `bun run lint` がエラーなく完了する
- [ ] `bun run fmt:check` がエラーなく完了する
- [ ] .oxlintrc.json と .oxfmtrc.json が設定済み
