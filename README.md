# Logical Optimizationer

論理式の最小化・最適化ツール。真理値表から論理式を生成し、Quine-McCluskey法などを用いて最適化を行います。

## Features

- 論理式のパースと評価
- 真理値表 ↔ 論理式の相互変換
- 論理式の最適化（SOP/POS形式）
- 使用ゲートのカスタマイズ（Nand-only, Nor-only等）
- 複数出力の共通項抽出

## Tech Stack

- **Core**: React + TypeScript + Vite
- **Package Manager**: Bun
- **Linter/Formatter**: oxlint / oxfmt
- **Testing**: Bun Test
- **CI/CD**: GitHub Actions
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0+)

### Setup

```bash
bun install
```

### Development

```bash
bun run dev
```

### Linting & Formatting

```bash
bun run lint      # Lint check
bun run lint:fix  # Lint fix
bun run fmt       # Format files
bun run fmt:check # Check formatting
```

### Testing

```bash
bun test
```

### Build

```bash
bun run build
```

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
