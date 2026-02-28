# Copilot / AI agent instructions for Cronos

Purpose
- Help AI coding agents be productive quickly: architecture, key files, developer workflows, and repo-specific conventions.

Big picture
- This is an Electron + React (Vite) app with two primary runtimes:
  - Main process: Node/Electron code under `src/main` that manages the app lifecycle, tray, and database. See [src/main/index.ts](src/main/index.ts).
  - Renderer: React + TypeScript app built with Vite under `src/renderer/src` (entry: [src/renderer/src/main.tsx](src/renderer/src/main.tsx)).
- Local DB: uses `better-sqlite3` + `drizzle-orm`. Schema and migrations live in `src/main/database` and the `drizzle/` folder.
- IPC contract: main exposes database handlers via `ipcMain.handle('db:<entity>:<action>', ...)` in [src/main/database/ipc-handlers.ts](src/main/database/ipc-handlers.ts). The preload layer exposes a grouped API at `window.api` (see [src/preload/index.ts](src/preload/index.ts)).

Key patterns & conventions
- Module layering: each feature under `src/renderer/src/modules/<feature>/` follows data → domain → presentation (usecases, repositories, viewmodels). Use these layers when adding features.
- Dependency injection: Inversify container is configured at [src/renderer/src/shared/di/container.ts](src/renderer/src/shared/di/container.ts). Bindings typically use classes as tokens; register new implementations there.
- IPC naming: follow `db:<entity>:<action>` (examples: `db:clients:getAll`, `db:tasks:create`) and keep parity between main handlers, preload exports, and renderer callers.
- Preload / contextBridge: expose any new IPC group under `api` in [src/preload/index.ts]. When adding an IPC handler, update both main and preload.
- Database changes: add drizzle migration files in `drizzle/` and run the `db:migrate`/`db:push` scripts.

Developer workflows (commands)
- Install: `pnpm install` (repo uses pnpm lockfile). Alternately: `npm install`.
- Dev (hot reload renderer + electron): `pnpm dev` or `npm run dev` (runs `electron-vite dev`).
- Build (typecheck + bundle): `pnpm build` or `npm run build`.
- Platform builds: `npm run build:mac|win|linux`.
- Type checks: `npm run typecheck` (runs node + web TS checks).
- Database helpers: `npm run db:generate`, `npm run db:migrate`, `npm run db:push`, `npm run db:studio`, `npm run db:sync`.

What to touch when adding a feature that needs persistence
1. Add/modify schema in `src/main/database/schema.ts` and add a drizzle migration under `drizzle/`.
2. Add server-side handlers in [src/main/database/ipc-handlers.ts](src/main/database/ipc-handlers.ts) following the `ipcMain.handle('db:<entity>:<action>', ...)` pattern.
3. Export client methods in [src/preload/index.ts] by grouping under `api.<entity>`.
4. In renderer, implement repository methods in `src/renderer/src/modules/<feature>/data/repositories` to call `window.api.<entity>.*`.
5. Update DI bindings in [src/renderer/src/shared/di/container.ts] if you add new repositories/usecases/viewmodels.

Debug & run tips
- Renderer HMR: the main process loads `process.env.ELECTRON_RENDERER_URL` in dev. To test renderer only, run `pnpm dev` which launches electron-vite with HMR.
- Main process logs: use `console.log` in `src/main` files; `ipcMain.on('ping', ...)` is already used as an example. Quit hooks call `closeDatabase()` on `before-quit`.

Files to reference when changing architecture
- [package.json](package.json) — scripts and deps
- [src/main/index.ts](src/main/index.ts) — app bootstrap, migrations, tray, IPC setup
- [src/main/database/ipc-handlers.ts](src/main/database/ipc-handlers.ts) — canonical IPC patterns
- [src/preload/index.ts](src/preload/index.ts) — how renderer accesses IPC safely
- [src/renderer/src/shared/di/container.ts](src/renderer/src/shared/di/container.ts) — DI bindings and usage examples

Do not assume
- The renderer can call `ipcRenderer` directly: prefer `window.api` via preload for context isolation safety.
- Any new main-side API is automatically exposed to renderer — update preload explicitly.

If uncertain, ask for clarification and point to the exact file(s) you plan to edit.

Project rules (source: .agents/rules)
- The repo contains authoritative, always-on generation rules under `.agents/rules/`. Read them before changing architecture or generating code.

- Architecture & scaffolding (`.agents/rules/scaffolding-style.md`, `.agents/rules/code-style-guide.md`):
  - Feature-first modules under `src/renderer/src/modules/<feature>/` with strict layers: `domain/`, `data/`, `presentation/`.
  - `domain` defines contracts (models, repositories, usecases) and must not depend on external libs or UI.
  - `data` implements `domain` contracts (api, repositories, mappers) and contains no business rules.
  - `presentation` follows MVVM: `screens/`, `components/`, `viewmodels/`. Only `presentation` may use MobX.
  - All dependency wiring goes through the Inversify `container` ([src/renderer/src/shared/di/container.ts](src/renderer/src/shared/di/container.ts)). Do not `new` implementations outside the container.

- Component rules (`.agents/rules/components-style.md`):
  - UI components are pure; state belongs only to ViewModels (MobX). Do not use `useState`, `useReducer` or `useContext` for state.
  - Observer wrap: any component consuming observables must be `observer` from `mobx-react-lite`.
  - Screens obtain ViewModels via DI (`useInjection`) and delegate events to the VM; components receive props only.

- Import rules (`.agents/rules/import-alias.md`):
  - Use alias imports starting with `@` (maps to `src/renderer/src`). No deep relative imports (`../../..`) except `./` for same-directory files.
  - Import ordering: external libs, `@` aliases, then local `./` imports.

- Routing (`.agents/rules/router.md`):
  - Use `wouter` exclusively. Define centralized routes (suggested `src/renderer/src/router/*`).
  - Routes render `Screens` (observer components). Navigation from screens uses `useLocation`/`navigate` and route constants; ViewModels must not import `wouter`.

- Styles & UI system (`.agents/rules/styles-guide.md`):
  - UI uses `shadcn` components + Tailwind CSS. Prefer composed shadcn primitives and design tokens (bg-background, text-foreground, etc.).
  - No arbitrary inline styles or hardcoded HEX values; use Tailwind classes and theme tokens.
  - Class composition and `cva` patterns preferred for variants; keep components responsive and include hover/focus/disabled/loading states.

Quick checklist for AI agents before generating code
- Confirm module path and layer (domain/data/presentation).
- Add/extend domain contracts first, implement in `data`, wire in DI container, expose via `window.api` if it touches main process.
- Use alias imports `@/...` and follow import ordering.
- For UI, use shadcn primitives and Tailwind classes; put state in ViewModel and wrap consumers with `observer`.
- For routing, add routes to the central router and use `ROUTES` constants.

Testing (Vitest)
- Use `Vitest` as the standard test runner for the renderer code. Prefer `pnpm vitest` / `pnpm test` scripts from `package.json` when running tests.
- Write tests using the Vitest API: import `{ describe, it, expect, vi }` from `vitest`.
- Place tests next to the code under test in a `__tests__` folder inside the module layer (domain/data/presentation).
- Do NOT create inline mock objects inside specs. Instead, add concrete mock implementations that satisfy the interface contract as separate files inside `__tests__` (e.g. `__tests__/MockAuthApi.ts`).
- Examples in this repo follow that pattern (see [src/renderer/src/modules/clients/data/mappers/__tests__/ClientMapper.spec.ts](src/renderer/src/modules/clients/data/mappers/__tests__/ClientMapper.spec.ts)).
- For React component tests use `@testing-library/react` together with Vitest. Keep component tests focused on rendering and events; state and business rules belong in ViewModel/usecase tests.
- Prefer importing mock classes in tests and asserting against their `vi.fn()` spies, e.g. `const mockApi = new MockAuthApi(); expect(mockApi.login).toHaveBeenCalled()`.
 - Always use TypeScript types in tests; never use `any` in test files. Use concrete typed mocks or interfaces for dependencies.

— End of file
