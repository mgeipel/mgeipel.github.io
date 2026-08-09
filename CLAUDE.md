# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is Markus Geipel's personal blog/GitHub Pages site (`mgeipel.github.io`). It has two independent parts:

- **`app/`** — an Angular 22 application (the actual blog: post list + post detail pages) that is developed and tested here.
- **`pages/`** — the static output actually served by GitHub Pages via `.github/workflows/deploy.yml`. It currently contains only a placeholder `index.html` ("Coming Soon"). **The Angular app in `app/` is not yet wired into the deploy workflow** — building `app/` does not currently produce what gets published. Don't assume changes to `app/` are live until the deploy step is updated to build and publish it.

All Angular work happens inside `app/`; commands below assume `cd app` first (or pass `--path app` to `npm`/`ng` invocations from the repo root).

## Commands

Run from `app/`:

```bash
npm start              # ng serve — dev server at http://localhost:4200/
npm run start:devcontainer  # ng serve --host 0.0.0.0 --poll 2000 (for use inside the devcontainer)
npm run build          # ng build — production build to dist/
npm run watch          # ng build --watch --configuration development
npm test               # ng test — runs unit tests via Vitest
```

- Single test file: `ng test --include='**/post-list.spec.ts'` (standard Vitest/Angular CLI test filtering).
- There is no e2e test setup and no lint script configured in `package.json`.
- Formatting uses Prettier (`app/.prettierrc`); no separate lint step exists — use `npx prettier --check .` / `--write .` from `app/`.

## Architecture

### Routing and pages
Routes are defined in [app.routes.ts](app/src/app/app.routes.ts), both lazy-loaded standalone components:
- `''` → `PostList` ([posts/post-list](app/src/app/posts/post-list/)) — the post index.
- `'posts/:id'` → `PostDetail` ([posts/post-detail](app/src/app/posts/post-detail/)) — a single post.

### Post content model
Posts are **not** individual routed/compiled Angular content — they're metadata + externally-hosted HTML/PDF:
- [posts/post.model.ts](app/src/app/posts/post.model.ts) defines the `Post` interface (`id`, `title`, `description`, `date`, `pdfUrl`, `contentUrl`).
- [posts/posts.service.ts](app/src/app/posts/posts.service.ts) holds a hardcoded in-memory array of posts (no backend/CMS). Adding a post means adding an entry here.
- `contentUrl`/`pdfUrl` point into `app/public/post-files/` (e.g. `agentic-coding.html`, `agentic-coding.pdf`) — pre-rendered article HTML and a PDF version, served as static assets.
- `PostDetail` fetches the article body via `httpResource.text()` and renders it with `[innerHTML]` after `sanitizer.bypassSecurityTrustHtml()` — the content is trusted (authored by the site owner), not user input.
- Because the article body isn't real Angular DOM, `PostDetail` manually wires up accessibility/interaction behavior after render (`afterRenderEffect`) — e.g. making SVG figures (`figure.tex-marginfigure svg`) keyboard-focusable and opening them in a lightbox `<dialog>` on click/Enter/Space via event delegation on the wrapping div, since individual `(click)` bindings aren't possible on non-Angular-rendered elements.

### Styling
- Design tokens (colors, font families) are CSS custom properties defined once in [src/styles.scss](app/src/styles.scss) (`--color-*`, `--font-family-*`). Component styles must reference these tokens rather than hardcoding values — see the `.cursor`-style rules in [app/.claude/CLAUDE.md](app/.claude/CLAUDE.md) for the full Angular/styling conventions used in this project (standalone components by default, signals, no `ngClass`/`ngStyle`, `NgOptimizedImage` for static images, etc.). That file is scoped to `app/` and takes precedence for Angular-specific conventions.

## Environment notes
- Designed to run inside the provided devcontainer (`.devcontainer/devcontainer.json`), Node 24, with the Claude Code and GitHub CLI devcontainer features preinstalled.
- VS Code tasks (`.vscode/tasks.json`) run `npm start:devcontainer` and `npm test` with `path: app` already set.
