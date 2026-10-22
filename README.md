# Typst Drag & Drop Builder

A visual document composition platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **@dnd-kit**, backed by a containerized native **Typst CLI** and **SQLite (Prisma)**.

---

## Features

- **Drag-and-Drop Block Canvas**: Reorder cards, headings, text, media, callouts, and columns using `@dnd-kit`.
- **Component Palette**:
  - **Cards**: Customizable fill, stroke, radius, and padding.
  - **Semantic Callouts**: Note, Tip, Warning, and Caution cards.
  - **KPI Metric Cards**: Key value indicators with positive/negative trend badges.
  - **Profile Cards**: Author bio, avatar, and contact links.
  - **Headings & Text**: H1–H4 with inline markdown, bullet lists, and math equations ($x^2$).
  - **Multi-Column Containers**: 2-column and 3-column split layouts with nested blocks.
  - **Data Tables**: Visual editor or upload CSV to auto-generate tables.
  - **Code Blocks**: Syntax-highlighted code snippets with language selector.
- **Interactive Canva-Grade Sheet**: Direct click-to-edit inline preview for titles, subtitles, card descriptions, KPI metrics, author profiles, and tables without dialogs.
- **Resizable Split View**: Draggable splitter bar with real-time mouse tracking, quick ratio presets (`40:60`, `50:50`, `60:40`), and pane swapping (`↔ Swap Panels`).
- **Context Menu & History**: Right-click block duplication, deletion, moving, and snippet export, with keyboard undo/redo (`Ctrl+Z` / `Ctrl+Y`).
- **Hybrid Compilation Engine**:
  - Instant live vector document preview (<50ms).
  - High-fidelity PDF export via native Typst CLI running inside Docker.
- **Typst Code Inspector Drawer**: Slide-over drawer to inspect, copy, or download the generated `.typ` source code.
- **Template Gallery**: Pre-built presets for A4 Executive Briefs, Resumes, Cheatsheets, and Presentation Slides (16:9).
- **Automated Testing Suite**: Vitest unit/integration tests and Playwright E2E studio interaction tests.
- **Persistent Storage**: SQLite with Prisma mounted on a persistent Docker volume (`./data:/data`).
- **Zero Vulnerabilities**: Verified with `npm audit` (0 vulnerabilities).

---

## Testing

### Unit & Integration Tests (Vitest)
```bash
npm test
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e
```

---

## Quickstart with Docker

### 1. Build and Run Container
```bash
docker compose up --build -d
```
The application will automatically run Prisma schema migrations and start at **http://localhost:3000**.

### 2. View Container Logs
```bash
docker compose logs -f
```

### 3. Run Internal Tests Inside Docker
The multi-stage `Dockerfile` automatically executes the Vitest test suite during build. To manually trigger tests inside Docker:
```bash
docker compose run --rm app npm test
```

### 4. Stop Container
```bash
docker compose down
```

---

## Local Development (Without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Push database schema:
   ```bash
   npx prisma db push
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```
Open **http://localhost:3000** in your browser.
