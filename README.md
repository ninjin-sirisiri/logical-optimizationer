# Logical Optimizationer

A powerful, minimal logical expression optimizer and circuit synthesizer. Built with efficiency and aesthetics in mind.

## Features

- **Advanced Optimization**: Minimizes logical expressions using Quine-McCluskey (SOP/POS).
- **Dual Input Modes**:
  - **Expression**: Direct input (e.g., `A & B | ~C`) with symbol toolbar.
  - **Truth Table**: Interactive table editing for visual design.
- **Circuit Synthesis**: Generates gate-level netlists from optimized logic.
- **Custom Gate Sets**: supports generic (AND/OR/NOT), NAND-only, NOR-only, and Custom configurations.
- **Safe & Responsive**:
  - Variable limit guard (Max 6 variables for performance safety).
  - Fully responsive design for mobile and desktop.
  - Dark mode support.

## Supported Operators

- **AND**: `&` or `・`
- **OR**: `|` or `+`
- **NOT**: `~` or `¬`
- **XOR**: `^` or `⊕`
- **Parentheses**: `(` `)`

## Tech Stack

- **Core**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS v4 + Framer Motion + Sonner
- **State Management**: SimpleStack Store
- **Testing**: Playwright (E2E), Bun Test (Unit)
- **Deployment**: Cloudflare Pages / Static Hosting

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0+)

### Setup

```bash
git clone <repository-url>
cd logical-optimizationer
bun install
```

### Development

```bash
bun run dev
```

### Quality Assurance

```bash
# Linting
bun run lint
bun run lint:fix

# Formatting
bun run fmt

# Testing
bun test       # Unit tests
bun run test:e2e # E2E tests (Playwright)
```

### Production Build

```bash
bun run build
bun run preview
```

## Deployment

This project is optimized for **Cloudflare Pages**.

### Using CLI (Recommended)

1. Authenticate (first time):
   ```bash
   npx wrangler login
   ```
2. Deploy:
   ```bash
   bun run deploy
   ```

### Using Dashboard (Git Integration)

1. **Build Command**: `bun run build`
2. **Output Directory**: `dist`
3. **Environment**: Recommended Node.js compatibility (via Bun)

## Limitations

- Maximum of **6 input variables** to prevent browser freezes during optimization.
- "Don't Care" terms are currently treated as specific values in table mode (future update planned).

---

© 2026 Mu Design System
