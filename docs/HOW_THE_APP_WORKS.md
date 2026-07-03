# 🔍 How This App Works — a plain-language tour of a real React project

Every React project at a job has the same skeleton as this one. Understand this file
and you can find your way around any React codebase. No prior knowledge assumed.

## The 30-second version

```
Browser asks for the page
        │
        ▼
index.html            (nearly empty — has one <div id="root"> and one <script>)
        │
        ▼
src/main.jsx          (the entry point — starts React, plugs in Redux + Router)
        │
        ▼
src/App.jsx           (the shell — sidebar + the area where pages appear)
        │
        ▼
src/concepts/registry.jsx   (the list of all pages/routes)
        │
        ▼
src/concepts/06-effects/Effects.jsx   (whichever page the URL points at)
```

React apps are **single-page applications (SPA)**: the browser loads ONE html page,
and from then on JavaScript redraws the screen as you click around. The page never
reloads. (Angular works exactly the same way.)

## The tour, file by file

### 1. `index.html` (project root) — the only HTML there is

Open it. It's tiny: an empty `<div id="root"></div>` and a `<script>` tag pointing at
`/src/main.jsx`. That's the whole HTML of the app. Everything you see in the browser
is created by JavaScript inside that one div.

### 2. `src/main.jsx` — the ignition key

This file runs once, when the page loads. Reading it bottom-up it says: *"Find the
`root` div, and render the `<App />` component into it."* Around `<App />` it wraps
three helpers:

- **`<React.StrictMode>`** — a dev-only safety net. It deliberately runs things twice
  in development to expose bugs. (This is why you'll see effects fire twice — it's a
  feature, not a bug.)
- **`<Provider store={store}>`** — makes the Redux store (a global data container)
  available to every component. Angular analogy: providing a service at root.
- **`<BrowserRouter>`** — turns browser URL changes into page switches without
  reloading. Angular analogy: `RouterModule`.

This "wrap the app in providers" pattern is in every real React project you'll ever see.

### 3. `src/App.jsx` — the shell (sidebar + content area)

`App` is the first real component. It renders two things:

- the **sidebar** — it loops over the list of concepts and makes a link for each one
- the **content area** — a `<Routes>` block that says "look at the URL and render the
  matching page component here". Angular analogy: `<router-outlet>`.

### 4. `src/concepts/registry.jsx` — the table of contents

One array, `CONCEPTS`, where each entry is `{ path, title, Component }`. The sidebar
and the routes are both generated from this single list — add an entry here and a new
page appears in the app automatically. (You'll do exactly that in
[`BUILD_A_FEATURE.md`](BUILD_A_FEATURE.md).)

Each `Component` is wrapped in `lazy(() => import(...))`, which means: *don't download
this page's code until someone actually visits it.* That's *code splitting* — it keeps
the initial load fast, and it's why the build produces many small JS files.

### 5. `src/concepts/<nn-name>/` — the pages themselves

Each folder is one self-contained page: a component file (the demo) and a `NOTES.md`
(the theory). This "feature folder" layout — everything for a feature in one folder —
is how real teams organize React code.

### 6. Where the "data" comes from (there is no server)

Two flavors, both fake on purpose:

- **`src/data/*.json`** — imported at the top of a file like any other import
  (`import products from '../../data/products.json'`). Baked into the app at build
  time. Instant, always there.
- **`public/data/*.json`** — fetched over HTTP at runtime with `fetch('/data/posts.json')`.
  This *behaves* exactly like calling a real backend API — there's a delay, it can
  fail, you need loading/error states — which is what concept 15 teaches. Swap the URL
  for a real API later and the code stays the same.

### 7. `src/index.css` — the styling (deliberately boring)

One small global stylesheet, imported once in `main.jsx`. Components use plain
`className="card"` etc. Real projects often use fancier tools (CSS Modules, Tailwind),
but the concepts are identical.

### 8. `src/__tests__/` — the tests

Run with `npm test`. They use **Vitest** (the test runner) + **React Testing Library**
(renders a component in a fake browser and interacts with it like a user: find the
button, click it, check what appeared). See `docs/TESTING.md` when you get there.

## What happens when you click a sidebar link? (the full chain)

Good interview warm-up — trace it once yourself:

1. You click "06 · useEffect & Lifecycle" in the sidebar.
2. `NavLink` updates the browser URL to `/06-effects` — **no page reload**.
3. `<Routes>` in `App.jsx` re-checks the URL and finds the matching `<Route>`.
4. That route's component is lazy — if this is your first visit, its JS chunk downloads
   now (you may glimpse the "Loading chunk…" message from `<Suspense>`).
5. React renders `Effects.jsx` into the content area, and only what changed on screen
   gets touched.

## What happens when you edit a file while `npm run dev` is running?

Vite (the dev server) notices the save, sends the changed module to the browser, and
React swaps it in **without reloading the page or losing your state**. That's Hot
Module Replacement (HMR). This tight loop is the main reason modern frontend dev feels
fast — use it constantly: change something, glance at the browser, repeat.

## And `npm run build`?

Turns the whole `src/` folder into plain, minified JS/CSS files in `dist/` — no JSX, no
Vite — ready to be served by any static file host. `npm run preview` lets you try that
production build locally. Deploying a React SPA = uploading `dist/` somewhere
(Netlify, Vercel, S3, any web server).
