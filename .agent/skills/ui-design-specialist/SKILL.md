---
name: UI Design Specialist
description: Muミニマリストデザインガイドラインに基づき、高品質なUIコンポーネントを設計・実装・検証するための専門スキル
---

# UI Design Specialist Skill

このスキルは、`.agent/rules/ui-design-guidelines.md` で定義された「Muミニマリスト哲学」を忠実に再現するために使用します。
UIの新規作成、修正、レビューを行う際は、必ず以下の原則とチェックリストに従ってください。

## コア・コンピテンシ

1. **ミニマリズムの実践**: 装飾を排除し、機能美を追求する。
2. **Tailwind CSSの標準化**: カスタム値を避け、デフォルトのユーティリティを駆使する。
3. **アクセシビリティの保証**: キーボード操作とスクリーンリーダー対応を前提とする。

## ワークフロー

UIに関連するタスクを実行する際は、以下のステップを踏んでください。

### Step 1: 要件の確認と設計
- **高密度レイアウト**: コンポーネントはコンパクトに保つ（例: ボタン高さ `h-9`、本文 `text-sm`）。
- **レスポンシブ**: デスクトップファースト（`min-w-[1024px]`）を前提とするか確認する。
- **ダークモード**: 最初からダークモード対応（`dark:`修飾子）を設計に含める。

### Step 2: 実装ルール (Strict Rules)
コーディング時は以下のルールを厳守してください：

- **カラー**: `gray-*` を基調とし、セマンティックカラー（赤・青など）は最小限に。
- **スペーシング**: 4の倍数（`space-4`, `p-6`など）のみを使用。
- **タイポグラフィ**: `Inter` などのサンセリフを使用。`font-medium` を標準とし、`font-bold` は避ける。
- **コンポーネント**: サイズバリエーションを作らず、単一サイズ（One Size）原則を守る。
- **アイコン**: `lucide-react` を使用し、サイズは `w-5 h-5` または `w-4 h-4` に統一。

```typescript
// ✅ 良い実装例
<button className="h-9 px-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-md hover:opacity-90 transition-opacity focus-visible:ring-2">
  Action
</button>
```

### Step 3: 品質検証 (Verification)
実装後、以下の項目をセルフチェックしてください：
- [ ] マウスを使わず、キーボードだけで操作できるか？ (Tab順序, Enter/Space実行)
- [ ] フォーカスリング（`focus-visible`）は明確か？
- [ ] コントラスト比は確保されているか？ (薄すぎるグレーを避ける)
- [ ] アニメーションは200ms以内で、かつ `prefers-reduced-motion` に配慮されているか？

## 参照リソース
- 詳細は `.agent/rules/ui-design-guidelines.md` を常に参照すること。
