# CLAUDE.md

Context for Claude Code sessions in this repository.

## What this is

A self-contained React learning + interview-prep app built for Ashish, an experienced
Angular/Java developer learning React. Goal: learn by reading/running commented code and
crack React interviews. Portable by design — **all data is stubbed JSON** (`src/data/`
imported at build time, `public/data/` fetched at runtime as a fake API). **Never add a
backend, database, or Oracle dependency.**

## How to work in this repo

- **Explain React via Angular analogies** — the learner knows Angular deeply
  (NgRx→Redux Toolkit, RxJS→effects/queries, @Input/@Output→props/callbacks,
  ViewChild→useRef, ng-content→children, OnPush→memo). `docs/ANGULAR_TO_REACT.md` is the dictionary.
- Every concept lives in `src/concepts/<nn-name>/`: a heavily commented demo component
  + a `NOTES.md` (theory, Angular mapping, interview questions). **Keep that pattern**
  for anything new: rich teaching comments, a NOTES.md, and an entry in
  `src/concepts/registry.jsx` (lazy-loaded routes — the sidebar/table of contents).
- Plain JavaScript (JSX), not TypeScript — deliberate, to keep React concepts front and
  center. TS migration is a planned exercise (`docs/TYPESCRIPT_WITH_REACT.md`).

## Commands

```bash
npm run dev      # Vite dev server → http://localhost:5173
npm test         # Vitest + React Testing Library (src/__tests__/)
npm run build    # production build; each concept becomes its own lazy chunk
```

## Layout

- `src/main.jsx` — createRoot + StrictMode + Redux Provider + BrowserRouter
- `src/App.jsx` — sidebar shell, lazy routes under Suspense
- `src/concepts/00…19` — 00 is an in-app "Start Here" onboarding page (the landing
  route); then the syllabus: JSX → props → state → lists/keys → forms →
  effects → refs → context → reducer → memoization → custom hooks → performance →
  router → Redux Toolkit → data fetching → error boundaries → portals → concurrent →
  capstone (Rewards Store composing everything; on-page exercises)
- `src/concepts/14-redux-toolkit/store.js` — the Redux store (provided app-wide in main.jsx)
- `docs/` — README is the index/reading order. Beginner layer (easy language, keep
  it that way): START_HERE (guided
  path), HOW_THE_APP_WORKS (runtime tour), SETUP_FROM_SCRATCH (how the project was
  scaffolded/configured, command by command), BUILD_A_FEATURE (ticket-style Members-page
  exercise; expects folder `src/concepts/20-members/`), GLOSSARY, EXERCISES (2-3
  tasks per concept), DEBUGGING (errors, DevTools). Reference layer:
  ANGULAR_TO_REACT, INTERVIEW_QUESTIONS (52 Q&A + 10 coding challenges),
  HOOKS_CHEATSHEET, RENDERING_AND_RECONCILIATION, TESTING, TYPESCRIPT_WITH_REACT,
  ECOSYSTEM_AND_BEYOND

## Status / next steps

Built 2026-07-03; build + all tests verified. Git initialized (first commit `ba84d2b`),
no remote yet. Natural next work: capstone exercises (listed on the capstone page),
convert one module to TypeScript, the guided Members-page ticket in
`docs/BUILD_A_FEATURE.md` (reserves `src/concepts/20-members/`), add TanStack Query
as a new concept module, run mock
interviews from `docs/INTERVIEW_QUESTIONS.md`, or rebuild the capstone as a separate
Next.js app (planned exercise — see `docs/ECOSYSTEM_AND_BEYOND.md`; this repo itself
deliberately stays a Vite SPA).
