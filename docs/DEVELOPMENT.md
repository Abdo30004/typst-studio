# Developer Guide & Local Environment Setup

This document provides setup instructions, testing commands, and technical workflows for contributing to Typst Studio.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+)
- **Typst CLI**: `v0.12.0` (optional if using Docker, required for local PDF export compilation)
- **Git**

### Installing Typst CLI Locally

#### macOS (Homebrew)
```bash
brew install typst
```

#### Linux
```bash
curl -fsSL https://github.com/typst/typst/releases/download/v0.12.0/typst-x86_64-unknown-linux-musl.tar.xz \
  | sudo tar -xJ --strip-components=1 -C /usr/local/bin typst-x86_64-unknown-linux-musl/typst
chmod +x /usr/local/bin/typst
```

#### Windows (Winget or Scoop)
```powershell
winget install --id Typst.Typst
# or
scoop install typst
```

---

## 2. Local Installation & Database Initialization

```bash
# Clone the repository
git clone https://github.com/Abdo30004/typst-studio.git
cd typst-studio

# Install dependencies
npm install

# Generate Prisma client bindings
npx prisma generate

# Synchronize local SQLite schema
npx prisma db push

# Start Next.js development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 3. Scripts & Tooling

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js App Router local development server with Hot Module Replacement. |
| `npm run build` | Generates Prisma bindings and produces the standalone production bundle. |
| `npm start` | Launches the Next.js standalone server in production mode. |
| `npm test` | Runs the Vitest unit and integration test suite. |
| `npm run test:watch` | Runs Vitest in interactive watch mode for TDD. |
| `npm run test:e2e` | Runs Playwright end-to-end browser automation tests. |
| `npm run lint` | Runs Next.js ESLint validation. |
| `npx tsc --noEmit` | Validates TypeScript types across the entire project. |
| `npm run db:studio` | Launches Prisma Studio for visual SQLite database exploration at `http://localhost:5555`. |

---

## 4. Testing Frameworks

### Vitest Unit & Integration Suite
Tests reside in `./tests/`:
- `tests/generator.test.ts`: Verifies Typst DSL output, `#set` rules, font fallbacks, and math formulas.
- `tests/layouts.test.ts`: Validates grid layouts, multi-column nesting, and track specifications.
- `tests/theme.test.ts`: Tests document palette conversions, hex-to-rgb parsers, and CSS variable injection.
- `tests/api.test.ts`: Tests `/api/export` compilation, response headers, and status codes.
- `tests/upload.test.ts`: Validates image upload size limits, MIME type validation, and file persistence.

Run tests:
```bash
npm test
```

### Playwright E2E Suite
Configured in `playwright.config.ts`. Tests user interaction, block reordering, theme switching, and live preview rendering.

Run E2E tests:
```bash
npx playwright install --with-deps
npm run test:e2e
```
