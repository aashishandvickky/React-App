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

New to React or frontend tooling? The section below walks through every step.

## 🚀 First time here? How to open the app in your browser, step by step

You only need to do steps 1–3 once. After that, starting the app is just step 4.

### Step 1 — Install Node.js (one-time)

Node.js runs the development tools. This project needs **Node.js 18 or newer**.

1. Open a terminal (on Mac: press `Cmd + Space`, type `Terminal`, press Enter).
2. Check if Node.js is already installed:

   ```bash
   node -v
   ```

   - Version `v18.x` or higher (e.g. `v20.11.0`) → you're set, go to Step 2.
   - `command not found` or an older version → install the **LTS** version from
     [nodejs.org](https://nodejs.org), then close and reopen the terminal and run
     `node -v` again to confirm.

### Step 2 — Get the code (one-time)

If you already have this folder on your machine, skip ahead. Otherwise clone it:

```bash
git clone https://github.com/aashishandvickky/React-App.git
cd React-App
```

### Step 3 — Install dependencies (one-time)

From inside the project folder:

```bash
npm install
```

This downloads all the libraries the app needs (React, Vite, Redux, …) into a
`node_modules` folder. It takes a minute or two. Re-run it only if `package.json`
ever changes.

### Step 4 — Start the app

```bash
npm run dev
```

Wait for output like:

```
  VITE v6.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

### Step 5 — Open it in your browser

Go to **http://localhost:5173** in any browser (Chrome, Safari, Firefox…).
You should see the app with a sidebar listing all 19 concept modules — click any of
them to explore. In most terminals you can also `Cmd + click` the link in the output.

While the app is running, every file you edit and save reloads instantly in the
browser — no manual refresh needed (Vite calls this Hot Module Replacement).

### Step 6 — Stop the app

Go back to the terminal where it's running and press **`Ctrl + C`**. Closing the
browser tab does *not* stop the server — it keeps running until you stop it here.

### Running it from IntelliJ IDEA / WebStorm instead

1. **File → Open…** and select the project folder.
2. Open the built-in terminal (**View → Tool Windows → Terminal**, or the Terminal
   tab at the bottom).
3. Run `npm run dev` there, then `Cmd + click` the `http://localhost:5173` link.

### If something goes wrong

| Problem | Fix |
|---|---|
| `command not found: npm` | Node.js isn't installed, or the terminal needs restarting after installing it. Redo Step 1. |
| `Port 5173 is in use` | The app is already running in another terminal. `Ctrl + C` it there, or just use the alternate URL Vite prints (e.g. `http://localhost:5174`). |
| Errors during `npm install` | Check `node -v` — below 18? Install the current LTS from nodejs.org and retry. |
| Browser says "site can't be reached" | The dev server isn't running. Make sure `npm run dev` shows the "ready" message in a terminal. |
| Blank page after editing code | Check the terminal and the browser console (`Cmd + Option + J` in Chrome) for a red error — usually a typo in the file you just changed. |

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
