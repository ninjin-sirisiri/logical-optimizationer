# DECISIONS.md — Architecture Decision Records

## ADR-001: Web アプリケーションとして構築

**Date**: 2026-01-27
**Status**: Accepted

### Context
論理回路最適化ツールをどの形態で構築するか。

### Options Considered
1. Web アプリ（ブラウザベース）
2. デスクトップアプリ（Electron など）
3. CLI ツール

### Decision
**Web アプリ**を選択。

### Rationale
- インストール不要でアクセスしやすい
- クロスプラットフォーム対応
- 将来の公開が容易（GitHub Pages / Vercel）
- 回路図の可視化に適している（Canvas/SVG）

---

## ADR-002: React + TypeScript + Vite を採用

**Date**: 2026-01-27
**Status**: Accepted

### Context
Web アプリのフロントエンド技術スタックの選定。

### Options Considered
1. React + TypeScript + Vite
2. Vue + TypeScript + Vite
3. Solid.js + TypeScript
4. Vanilla TypeScript

### Decision
**React + TypeScript + Vite** を選択。

### Rationale
- TypeScript で論理回路のデータ構造を型安全に表現
- Vite による高速な開発体験
- React の豊富なエコシステム（将来の回路図可視化に react-flow が使える）
- 広く使われており、情報が得やすい

---

## ADR-003: 組み合わせ回路を優先

**Date**: 2026-01-27
**Status**: Accepted

### Context
組み合わせ回路と順序回路の両方をサポートしたいが、どちらを優先するか。

### Decision
**組み合わせ回路を v1.0 で実装**し、順序回路は v2.0 で対応。

### Rationale
- 組み合わせ回路の最適化は基盤となる
- 順序回路は組み合わせ回路の知識を前提とする
- 早期に動作するものをリリースし、フィードバックを得たい

---

## Phase 1 Decisions

**Date**: 2026-01-27

### ADR-004: Bun をパッケージマネージャー兼ランタイムとして採用

**Status**: Accepted

#### Context
パッケージマネージャーとテストランナーの選定。

#### Options Considered
1. npm + Vitest
2. pnpm + Vitest
3. Bun（パッケージマネージャー + 組み込みテストランナー）

#### Decision
**Bun** を選択。

#### Rationale
- 高速なパッケージインストールとビルド
- 組み込みのテストランナーで追加依存が不要
- モダンな開発体験

---

### ADR-005: oxlint + oxfmt を Linter/Formatter として採用

**Status**: Accepted

#### Context
コード品質ツールの選定。

#### Options Considered
1. ESLint + Prettier
2. oxlint + oxfmt

#### Decision
**oxlint + oxfmt** を選択。

#### Rationale
- Rust ベースで高速
- 設定がシンプル
- ESLint との互換性のある設定が可能

---

### ADR-006: Cloudflare Pages をデプロイ先として採用

**Status**: Accepted

#### Context
デプロイ先の選定。

#### Options Considered
1. GitHub Pages
2. Vercel
3. Cloudflare Pages

#### Decision
**Cloudflare Pages** を選択。

#### Rationale
- 高速なエッジネットワーク
- 無料枠が充実
- GitHub との連携が容易

---

### ADR-007: ディレクトリ構造の分離

**Status**: Accepted

#### Decision
`src/core/`（ロジック）と `src/components/`（UI）を分離する。

#### Rationale
- 論理回路の処理は UI 非依存
- テストしやすい設計
- 将来的な CLI や他のフロントエンドへの再利用が容易
