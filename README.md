# ⚛️ React Interview Lab

A self-contained React app for learning React **by reading and running code**, built for
an experienced developer coming from Angular. Every concept is a page in the app, with
heavily commented source and a `NOTES.md` (theory + interview questions) sitting next to it.

**No backend, no database.** All data comes from JSON files (`src/data/`, `public/data/`)
— clone it anywhere and it runs.

## Quick start

```bash
npm install
npm run dev        # → http://localhost:5173
npm test           # run the Vitest + Testing Library suite
npm run build      # production build (dist/)
```

## How to use this repo

1. Run the app and open a concept page in the sidebar.
2. Open the matching folder in `src/concepts/<nn-name>/` — read `NOTES.md` first,
   then the `.jsx` with its comments, then interact with the demo.
3. Answer the interview questions at the bottom of each `NOTES.md` out loud.
4. Do the exercises in the capstone (concept 19).

## Learning path (the sidebar order is the syllabus)

| # | Concept | The one thing to internalize |
|---|---|---|
| 01 | JSX Basics | JSX compiles to element objects; `{}` takes expressions |
| 02 | Components & Props | data down, events up; props are read-only |
| 03 | State & Events | each render is a snapshot; setters schedule, never mutate |
| 04 | Conditionals & Lists | keys = identity for reconciliation; never array index |
| 05 | Forms | controlled vs uncontrolled = who owns the value |
| 06 | useEffect | effects sync with external systems; cleanup is half the story |
| 07 | Refs & DOM | mutable box that doesn't re-render; @ViewChild's cousin |
| 08 | Context | fixes prop drilling; a transport, not a state manager |
| 09 | useReducer | pure (state, action) → state; the road to Redux |
| 10 | Memoization | memo/useMemo/useCallback live or die by reference stability |
| 11 | Custom Hooks | THE reuse mechanism; shares logic, not state |
| 12 | Performance | measure → colocate → memo → virtualize → code-split |
| 13 | React Router | nested routes, Outlet, params, guards |
| 14 | Redux Toolkit | slices, Immer, thunks, selector subscriptions |
| 15 | Data Fetching | the race condition + AbortController; server vs client state |
| 16 | Error Boundaries | the one thing still requiring classes |
| 17 | Portals | render elsewhere in DOM, stay in the React tree |
| 18 | Concurrent | useTransition/useDeferredValue; interruptible rendering |
| 19 | ★ Capstone | everything composed into one feature + exercises |

## Reference docs (`docs/`)

- **ANGULAR_TO_REACT.md** — the translation dictionary you'll reach for daily
- **INTERVIEW_QUESTIONS.md** — 60+ questions with crisp answers, by topic
- **HOOKS_CHEATSHEET.md** — every hook on one page
- **RENDERING_AND_RECONCILIATION.md** — virtual DOM, Fiber, keys, batching (the senior-round doc)
- **TESTING.md** — RTL philosophy, queries, async, hooks testing
- **TYPESCRIPT_WITH_REACT.md** — typing props, hooks, events (you know TS from Angular)
- **ECOSYSTEM_AND_BEYOND.md** — Next.js, RSC, TanStack Query, styling, what to name-drop

## Project layout

```
src/
  main.jsx                 entry: createRoot + StrictMode + providers
  App.jsx                  shell: sidebar + lazy routes + Suspense
  concepts/
    registry.jsx           table of contents (lazy imports)
    01-jsx-basics/         ← each folder: Demo.jsx + NOTES.md
    ...
    19-capstone/
  data/*.json              stub data imported at build time
  __tests__/               Vitest + Testing Library examples
public/data/*.json         stub data fetched at runtime (fake API)
docs/*.md                  cross-cutting reference docs
```
