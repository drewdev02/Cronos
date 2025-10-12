## Quick orientation for code-writing agents

This project is an Electron + Vite + React + TypeScript app with TailwindCSS. Keep changes small and local-first: the renderer lives under `src/`, Electron entry points under `electron/`, and the built artifacts are in `dist/` and `dist-electron/`.

Key places to inspect before editing
- `package.json` — scripts and dependencies (dev: `vite`, build: `tsc && vite build && electron-builder`).
- `vite.config.ts` — Vite plugins and electron plugin configuration (see `electron({ main: { entry: 'electron/main.ts' }, preload: { input: 'electron/preload.ts' } })`).
- `electron/main.ts` — main process bootstrap. Reads `VITE_DEV_SERVER_URL` to detect dev mode and shows the expected built layout (see top-of-file comment).
- `electron/preload.ts` — exposes a small `ipcRenderer` wrapper via `contextBridge` (methods: `on`, `off`, `send`, `invoke`). Use this wrapper in renderer code instead of importing Electron directly.
- `src/main.tsx` — renderer bootstrap (BrowserRouter, Tailwind import) and an example listener: `window.ipcRenderer.on('main-process-message', ...)`.
- `src/App.tsx` + `src/routes/index.tsx` — routing pattern: routes are exported as an array of `{ path, element }` and consumed by `App`.
- `src/modules/<feature>/` — feature structure convention (example: `login/` has `components/`, `hooks/`, and `usecases/`).

Project patterns and conventions (do not deviate unless refactoring with tests)
- Feature folders: place presentational components in `components/`, React hooks in `hooks/`, and business logic in `usecases/` (see `src/modules/login/`).
- Routing: add a route by appending to `src/routes/index.tsx` (exported `routes` array). `App` maps `routes.map(r => <Route key=... />)`.
- IPC: use the `window.ipcRenderer` methods exposed by `electron/preload.ts`. Example (renderer listens):

  ```ts
  // src/main.tsx
  window.ipcRenderer.on('main-process-message', (_e, message) => console.log(message))
  ```

  And to invoke/send:
  ```ts
  await window.ipcRenderer.invoke('some-channel', payload)
  window.ipcRenderer.send('fire-and-forget', payload)
  ```

- Error handling: many UI-level hooks rethrow after setting local state (see `useLogin`); follow that pattern for predictable UX and preserve thrown errors for callers/tests.

Build / dev notes (discovered from code)
- Start renderer dev server: `npm run dev` (runs `vite`).
- Production build: `npm run build` runs `tsc && vite build && electron-builder` and outputs renderer to `dist/` and electron artifacts to `dist-electron/` (see `electron/main.ts` comments).
- Dev-mode detection: `electron/main.ts` uses `process.env['VITE_DEV_SERVER_URL']` to decide whether to load a URL (dev) or `dist/index.html` (prod). If you need to run Electron pointed at the dev server, set that env var to the running vite dev server URL before launching the main process.

Files worth scanning for quick context
- `vite.config.ts` — plugin wiring and renderer-electron interop
- `electron/main.ts`, `electron/preload.ts` — main/preload responsibilities
- `src/main.tsx`, `src/App.tsx`, `src/routes/index.tsx` — app boot and routing
- `src/modules/login/*` — canonical example of feature layout (components, hooks, usecases)

Tests / linting
- There are no automated tests in the repo. The project has an ESLint script: `npm run lint`. When adding behavior, also ensure TypeScript types remain correct (`tsc`) because `build` runs `tsc` first.

What an agent should do when changing code
- Respect the folder conventions for features. Add exports in `src/modules/<feature>/index.tsx` if creating a new route.
- When touching IPC surface, update `electron/preload.ts` and the usages in `src/` together.
- Keep edits minimal and include a brief unit-style test or a small manual verification snippet in the changed file when possible (example: throw deterministic errors in `usecases/` to exercise catch paths).

If anything is unclear, point to the exact file(s) you want me to inspect and I will expand this file with concrete examples or add automation (scripts/tests) to make developer flows explicit.
