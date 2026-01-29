# Research Phase 9: 統合テストとポリッシュ

## 1. 外部依存の選定

### Toast 通知: Sonner
- **理由**: React 19 対応、Tailwind CSS との相性が良く、API がシンプル。
- **インストール**: `bun add sonner`

### E2E テスト: Playwright
- **理由**: モダンな機能（Auto-waiting, Trace Viewer）が強力で、クロスブラウザテストが標準。
- **インストール**: `bun add -d @playwright/test` および `npx playwright install`

## 2. 変数制限ガードの設計
- `src/store/index.ts` または `src/core/optimizer/` のエントリーポイントで、入力変数が 6 個を超えた場合に最適化を停止し、例外を投げるかエラーフラグを立てる。
- UI 側でそのエラーをキャッチし、Sonner で「変数が多すぎるため制限されています」と表示する。

## 3. デプロイ構成 (Cloudflare Pages)
- **Build command**: `bun run build`
- **Output directory**: `dist`
- **Bun version**: `latest`

## 4. モバイル対応 (最低限)
- 真理値表のコンポーネントに `overflow-x-auto` を設定。
- グリッドレイアウトを `grid-cols-1 md:grid-cols-2` 等に変更して縦積みできるように調整。
