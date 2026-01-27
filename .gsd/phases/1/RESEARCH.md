---
phase: 1
level: 2
researched_at: 2026-01-27
---

# Phase 1 Research: oxlint + oxfmt

## Questions Investigated

1. oxlint と oxfmt のインストール方法と npm パッケージ名は？
2. 設定ファイルの形式と推奨設定は？
3. ESLint/Prettier との比較とパフォーマンスは？
4. React + TypeScript プロジェクトでの推奨設定は？
5. CI での使用方法は？

## Findings

### oxlint（Linter）

**概要**:

- Rust ベースの高速 JavaScript/TypeScript Linter
- Oxc (Oxidation Compiler) プロジェクトの一部
- 2025年6月に v1.0 リリース

**パフォーマンス**:
| プロジェクト規模 | ESLint | oxlint | 高速化倍率 |
| --------------------- | ------ | ------ | ---------- |
| 小規模 (50ファイル) | 2.3秒 | 0.08秒 | 28.75x |
| 中規模 (500ファイル) | 18.7秒 | 0.3秒 | 62.3x |
| 大規模 (2000ファイル) | 94.2秒 | 1.1秒 | 85.6x |

**特徴**:

- 660+ のビルトインルール
- TypeScript、React、Jest、Unicorn、jsx-a11y 等のプラグインがネイティブ実装
- ESLint v8 互換の設定形式 (`.oxlintrc.json`)
- Type-aware linting（TypeScript 7 / tsgo ベース）
- Multi-file analysis（import/no-cycle 等）

**npm パッケージ**: `oxlint`

**設定ファイル**: `.oxlintrc.json`

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "unicorn"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

**Sources:**

- https://oxc.rs/docs/guide/usage/linter.html
- https://betterstack.com/community/guides/code-quality/oxlint-eslint-comparison/

---

### oxfmt（Formatter）

**概要**:

- Rust ベースの高速コードフォーマッター
- Prettier 互換を目指している
- Prettier の JS/TS テストの約 95% をパス

**パフォーマンス**:

- Prettier の約 30x 高速
- Biome の約 2x 高速

**対応言語**:
JavaScript, JSX, TypeScript, TSX, JSON, JSONC, JSON5, YAML, TOML, HTML, Vue, CSS, SCSS, Less, Markdown, MDX, GraphQL

**ビルトイン機能**（Prettier ではプラグインが必要だったもの）:

- Import ソート
- Tailwind CSS クラスソート
- package.json フィールドソート
- 埋め込みフォーマット（CSS-in-JS, GraphQL など）

**npm パッケージ**: `oxfmt`

**設定ファイル**: `.oxfmtrc.json`

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

**デフォルト値**:
| オプション | デフォルト |
| ------------- | ---------- |
| printWidth | 100 |
| tabWidth | 2 |
| useTabs | false |
| semi | true |
| singleQuote | false |
| trailingComma | "all" |

**Sources:**

- https://oxc.rs/docs/guide/usage/formatter.html
- https://oxc.rs/docs/guide/usage/formatter/config.html

---

## Decisions Made

| Decision  | Choice                                   | Rationale                                              |
| --------- | ---------------------------------------- | ------------------------------------------------------ |
| Linter    | oxlint                                   | ESLint より 50-100x 高速、ネイティブ React/TS サポート |
| Formatter | oxfmt                                    | Prettier 互換で 30x 高速、Import ソートビルトイン      |
| 設定形式  | JSON (`.oxlintrc.json`, `.oxfmtrc.json`) | JSON Schema でエディタ補完が効く                       |

## Patterns to Follow

### oxlint

1. **カテゴリベースの設定**を使用
   - `correctness`: エラー（間違いなくバグ）
   - `suspicious`: 警告（おそらくバグ）
   - `style`: 必要に応じて有効化

2. **プラグインを明示的に指定**
   - React プロジェクトなら `["react", "typescript", "unicorn"]`

3. **--fix オプション**で自動修正を活用

### oxfmt

1. **Prettier との互換性**を維持するため、同じオプション名を使用
2. **experimentalSortImports**を有効化して import 順序を自動化
3. **--check**オプションで CI でのチェックに使用

## Anti-Patterns to Avoid

- **ESLint との併用時の注意**: 同じルールを両方で有効にすると競合する
  - `eslint-plugin-oxlint` を使って ESLint 側のルールを無効化するか、完全に移行する
- **設定ファイルのネスト**: oxfmt は最も近い設定ファイルのみ読み込む（マージしない）

- **jsPlugins の乱用**: 実験的機能なので安定性に注意

## Dependencies Identified

| Package  | Version | Purpose   |
| -------- | ------- | --------- |
| `oxlint` | latest  | Linter    |
| `oxfmt`  | latest  | Formatter |

## Bun での使用

Bun は npm 互換なので、以下のコマンドでインストール可能:

```bash
bun add -D oxlint oxfmt
```

package.json scripts:

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

## CI での使用（GitHub Actions）

```yaml
- name: Lint
  run: bun run lint

- name: Check formatting
  run: bun run fmt:check
```

## Risks

| Risk                                | Mitigation                                       |
| ----------------------------------- | ------------------------------------------------ |
| oxfmt が Prettier 100% 互換ではない | JS/TS では 95%+ 互換、差異はほぼ無視できるレベル |
| jsPlugins が experimental           | ネイティブプラグインのみ使用する                 |
| 新しいツールなので情報が少ない      | 公式ドキュメントを参照                           |

## Ready for Planning

- [x] Questions answered
- [x] Approach selected
- [x] Dependencies identified
