# 🛠️ How this app was set up — from an empty folder

The README tells you how to *run* this project. This doc tells you how it was
*built*: every command, every installed package, every config file — and **what
every single line of those files does**. Work through it once and you'll be
able to scaffold a production-grade React project yourself — a very common
interview task ("set up a React app with routing, state management, and tests").

**Angular analogy for the whole doc:** in Angular, `ng new` does all of this in
one command and hides it. In React there is no single official CLI — you compose
the pieces yourself. That sounds worse, but it means you actually understand
what each piece does. This doc is the `ng new` you do by hand.

You can follow along literally: make a new folder somewhere (NOT inside this
repo) and run each command. At the end you'll have a skeleton identical in
shape to this project.

---

## Step 0 — The toolchain you need first

| Tool | What it is | Angular equivalent |
|---|---|---|
| **Node.js** (v18+) | JavaScript runtime that executes the build tools | Same — Angular CLI also runs on Node |
| **npm** | Package manager, ships with Node | Same — you already use it |
| **Vite** | Dev server + bundler (installed per-project, below) | The build half of Angular CLI (`ng serve` + `ng build`) |

Check what you have:

```bash
node -v     # want v18 or newer
npm -v      # any recent version is fine
```

Line by line:

- `node -v` — asks Node.js to print its own version (`-v` = version). If the
  terminal says `command not found`, Node isn't installed — get the LTS from
  nodejs.org. React code itself runs in the *browser*; Node is only needed to
  run the *tooling* (dev server, bundler, test runner).
- `npm -v` — same check for npm. It ships inside the Node installer, so if
  `node -v` worked, this will too.

Nothing else is installed globally. Vite, React, the test runner — all of it
lives in the project's `node_modules`, which is why the repo runs anywhere
after a plain `npm install`.

---

## Step 1 — Scaffold the project with Vite

The one-command way (what most teams do):

```bash
npm create vite@latest react-interview-lab -- --template react
cd react-interview-lab
npm install
```

Line by line:

- `npm create vite@latest …` — `npm create X` is shorthand for "download the
  package named `create-X` and run it once". So this fetches **create-vite**,
  Vite's project generator (like `ng new`, but tiny: it writes ~8 files and
  exits). `@latest` pins it to the newest published version.
- `react-interview-lab` — the argument the generator receives: your
  project/folder name.
- `--` — the first double-dash tells **npm** "stop reading flags; pass
  everything after this to the generator". Without it, npm would try to
  interpret `--template` itself.
- `--template react` — picks the **plain-JavaScript React** starter. Other
  choices: `react-ts` (TypeScript), `vue`, `svelte`… This repo deliberately
  chose plain JS to keep React concepts front and center — see
  `TYPESCRIPT_WITH_REACT.md`.
- `cd react-interview-lab` — step into the folder the generator just made.
  Every command from here on runs *inside* the project.
- `npm install` — reads `package.json`, downloads every listed dependency into
  `node_modules/`, and writes the exact resolved versions to
  `package-lock.json` (commit that file — same idea as in your Angular repos:
  it guarantees teammates get byte-identical dependency trees).

The template gives you:

```
index.html          ← the ONE html page (Vite serves it; the script tag loads your code)
package.json        ← deps + scripts
vite.config.js      ← build config (≈ angular.json, but ~10 lines)
src/main.jsx        ← entry point (≈ main.ts)
src/App.jsx         ← root component
src/index.css       ← global styles
public/             ← static files served as-is at the URL root
```

### `index.html`, line by line

This project's actual `index.html` is only a few lines — and it's the **only**
HTML file in the entire app:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Interview Lab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- `<!doctype html>` — tells the browser "modern HTML5, standards mode". Every
  page needs it; nothing React-specific.
- `<meta charset="UTF-8" />` — text encoding, so special characters render.
- `<meta name="viewport" …>` — makes the page scale properly on phones
  (without it, mobile browsers render a zoomed-out desktop view).
- `<title>` — the browser-tab text.
- `<div id="root"></div>` — **the most important line.** An empty div that
  React takes over. Angular analogy: `<app-root></app-root>`. The entire app —
  sidebar, routes, everything — gets rendered *inside* this one element by
  JavaScript.
- `<script type="module" src="/src/main.jsx">` — loads the entry file.
  `type="module"` enables ES-module `import`/`export` syntax in the browser —
  this is the hook Vite uses to serve your code file-by-file in dev (that's
  why its dev server starts in milliseconds: no upfront bundling).
  Note the file sits at the project **root**, not in `public/`: Vite treats
  `index.html` itself as the build entry point and follows this script tag to
  discover all your code.

<details>
<summary><b>Doing even Step 1 manually (no generator)</b> — worth reading once</summary>

The generator is only a convenience. The fully manual version is:

```bash
mkdir react-interview-lab && cd react-interview-lab
npm init -y
npm install react react-dom
npm install -D vite @vitejs/plugin-react
```

- `mkdir … && cd …` — make the folder, enter it (`&&` = "run the second
  command only if the first succeeded").
- `npm init -y` — creates a bare `package.json`. `-y` answers "yes" to all the
  interactive questions (name, version, license…) so you get defaults
  instantly.
- `npm install react react-dom` — the library itself, as two packages:
  **react** is the core (components, hooks, the element model — platform-agnostic),
  **react-dom** is the renderer that knows how to turn that into real browser
  DOM. They're split because other renderers exist (react-native for mobile).
- `npm install -D vite @vitejs/plugin-react` — the build tooling. `-D` puts
  them in `devDependencies` (needed to develop/build, never shipped to users).
  `@vitejs/plugin-react` adds the React integration — most importantly Fast
  Refresh (hot reload that keeps component state). Vite itself can transpile
  JSX syntax, but without the plugin you'd lose Fast Refresh.

Then hand-write four files: `index.html` (as above), a minimal
`src/main.jsx`:

```jsx
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
```

- `import { createRoot } from 'react-dom/client'` — pulls in the React 18+
  bootstrapping API from the renderer package.
- `import App from './App.jsx'` — your root component. The `./` matters:
  paths starting with `./` are your files; bare names like `'react'` come
  from `node_modules`.
- `createRoot(document.getElementById('root'))` — finds the empty div from
  `index.html` and creates a React "root" attached to it.
- `.render(<App />)` — renders your component tree into that root. Angular
  analogy: the whole line ≈ `bootstrapApplication(AppComponent)`.

…a trivial `src/App.jsx` returning any JSX, and `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- `import { defineConfig } from 'vite'` — `defineConfig` is technically just
  an identity function, but it gives your editor autocomplete for every config
  option. Convention: always use it.
- `import react from '@vitejs/plugin-react'` — imports the React plugin
  (a function you call below).
- `export default defineConfig({ … })` — Vite reads this file at startup and
  uses whatever object you export as its configuration.
- `plugins: [react()]` — enables **Fast Refresh** (hot reload that keeps your
  component state while you edit) and React-specific transforms. Precision
  point: Vite can already transpile `.jsx` files on its own (its bundled
  esbuild handles the syntax), so JSX wouldn't error without the plugin — but
  you'd lose Fast Refresh, so every React project includes it. This one line
  replaces pages of webpack/babel config from the old days.

Finally add `"dev": "vite"` and `"build": "vite build"` under `"scripts"` in
`package.json`, run `npm run dev`, and you have a React app. That's the entire
magic of the generator.
</details>

### `.gitignore`, line by line

The generator writes one; this repo's version is:

```
node_modules
dist
coverage
.DS_Store
*.local
.idea
```

- `node_modules` — thousands of downloaded packages, fully re-creatable from
  `package.json` via `npm install`. Committing it would bloat the repo by
  hundreds of MB for zero benefit.
- `dist` — the production build output (`npm run build`). Build artifacts are
  generated, not source — same reason you don't commit Angular's `dist/`.
- `coverage` — test-coverage reports, if you ever run `vitest --coverage`.
- `.DS_Store` — junk metadata files macOS Finder drops into folders.
- `*.local` — Vite's convention for machine-local env files
  (e.g. `.env.local` with secrets that must never be committed).
- `.idea` — IntelliJ IDEA's per-user project settings (window layout, caches).

### `package.json`, line by line

After all the installs below, this project's `package.json` looks like this —
it's worth understanding every key because it's the manifest of the whole app:

```json
{
  "name": "react-interview-lab",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.7.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^6.30.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@vitejs/plugin-react": "^4.4.1",
    "jsdom": "^26.1.0",
    "vite": "^6.3.5",
    "vitest": "^3.1.3"
  }
}
```

- `"name"` / `"version"` — identify the package. Only matters if you publish
  to npm; for an app it's just a label.
- `"private": true` — a safety latch: npm will refuse to publish this package
  to the public registry, even by accident.
- `"type": "module"` — makes `.js` files in this project use ES-module syntax
  (`import`/`export`) instead of old CommonJS (`require`). Vite expects this.
- `"scripts"` — named shortcuts run with `npm run <name>`. Each value is just
  a terminal command, with `node_modules/.bin` automatically on the PATH —
  that's why `"dev": "vite"` works without a global Vite install:
  - `"dev": "vite"` — start the dev server with hot reload (≈ `ng serve`).
  - `"build": "vite build"` — optimized production bundle into `dist/` (≈ `ng build`).
  - `"preview": "vite preview"` — serve the built `dist/` locally, to check
    the *real* production output, not the dev server.
  - `"test": "vitest run"` — run the whole suite once and exit (CI mode).
  - `"test:watch": "vitest"` — keep watching and re-run tests on save (≈ `ng test`).
- `"dependencies"` — code that ships to the user's browser inside the bundle.
  Each `^` means "any compatible newer version": `^19.1.0` accepts anything
  from `19.1.0` up to (but not including) `20.0.0` — so `19.2.5` is fine but
  `19.0.x` and `20.0.0` are not. Standard semver, identical to Angular repos.
- `"devDependencies"` — tools used while developing (bundler, test stack).
  Never included in the production bundle; `npm install --production` on a
  server would skip them entirely.

---

## Step 2 — Install the app libraries

The template only gives you React itself. This project added two capabilities,
each one `npm install` away:

```bash
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
```

Line by line:

- `npm install react-router-dom` — routing (URL ↔ component mapping).
  Angular's Router is built in; in React it's a third-party library and this
  is the standard one. This repo uses **v6** (`^6.30.0`). The `-dom` suffix:
  like React itself, the router has a core package and per-platform bindings —
  `react-router-dom` is "router for the browser".
- `npm install @reduxjs/toolkit react-redux` — global state, as a pair:
  **`@reduxjs/toolkit`** (RTK) is the modern, official way to write Redux
  (≈ NgRx minus most of the boilerplate — `createSlice` generates the actions
  and reducers you'd hand-write in NgRx). **`react-redux`** is the separate
  bridge that provides `<Provider>`, `useSelector`, `useDispatch` — RTK itself
  is framework-agnostic; this binds it to React. You always install both.
- No install needed for local state, context, refs, effects — hooks are part
  of the `react` package you already have.

Every `npm install <pkg>` does two things: downloads the package into
`node_modules/` **and** records it under `"dependencies"` in `package.json`.
That record is why a fresh clone + `npm install` reproduces the setup exactly.

---

## Step 3 — Install and wire up the test stack

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

One command, five packages, all with `-D` (= `--save-dev`, into
`devDependencies` — test tools never ship to users):

| Package | Role | Angular equivalent |
|---|---|---|
| `vitest` | Test runner + assertions (Jest-compatible API) | Karma + Jasmine |
| `jsdom` | Fake browser DOM so tests run in plain Node, no real browser | what Karma launched a real browser for |
| `@testing-library/react` | Renders components and queries them like a user would | TestBed + fixture queries |
| `@testing-library/jest-dom` | Extra matchers: `expect(el).toBeInTheDocument()` etc. | custom Jasmine matchers |
| `@testing-library/user-event` | Simulates real typing/clicking | `triggerEventHandler`, but higher-level |

Installing isn't enough — three bits of wiring make `npm test` work:

**1. Tell Vitest how to run** — extend `vite.config.js` with a `test` block.
Vitest reads the *same config file* as Vite (its whole appeal — one config,
one plugin pipeline, tests see your code exactly as the dev server does).
This is the project's complete, final `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
```

- `plugins: [react()]` — (from Step 1) the React integration / Fast Refresh;
  also active when running tests, so `.jsx` test files just work.
- `test: { … }` — the Vitest section. Plain Vite ignores it; Vitest reads it.
- `globals: true` — makes `describe`, `it`, `expect` available in every test
  file without importing them — the Jasmine/Jest style you know from Angular.
  (Without this line you'd `import { describe, it, expect } from 'vitest'`
  in every file.)
- `environment: 'jsdom'` — run tests inside the fake DOM from the `jsdom`
  package, so `document`, `window`, and rendering all work in Node.
- `setupFiles: './src/setupTests.js'` — a file to execute before *every* test
  file — the hook for global test setup (next step).

**2. Create `src/setupTests.js`** — the entire file is one line:

```js
import '@testing-library/jest-dom';
```

- Importing this package has a side effect: it registers the extra DOM
  matchers (`toBeInTheDocument`, `toBeDisabled`, `toHaveTextContent`…) onto
  `expect`. Because this file runs before every test (via `setupFiles`
  above), every test gets the matchers for free.

**3. Add the scripts** to `package.json` (explained in the Step 1 walkthrough):

```json
"test": "vitest run",
"test:watch": "vitest"
```

Now `npm test` finds every `*.test.jsx` / `*.test.js` file (this repo keeps
them in `src/__tests__/`) and runs it. See `TESTING.md` for how to *write* them.

---

## Step 4 — Wire the providers in `main.jsx`

Installing router + Redux gives you the libraries; the app has to opt in at
the entry point. This project's `src/main.jsx` (the real file has teaching
comments too — read it) is:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './concepts/14-redux-toolkit/store.js';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

Line by line:

- `import React from 'react'` — needed here because the file references
  `React.StrictMode`. (Modern JSX compiles without importing React, so you
  only import it when you use the `React.` namespace explicitly.)
- `import { createRoot } from 'react-dom/client'` — the React 18+ bootstrap
  API. Interview note: the legacy `ReactDOM.render()` ran in "sync mode";
  `createRoot` is what enables concurrent rendering (concept 18).
- `import { BrowserRouter } from 'react-router-dom'` — the router's top-level
  component; uses the browser History API for clean URLs (no `#/`).
- `import { Provider } from 'react-redux'` — the component that makes one
  Redux store reachable by every component underneath it (it uses React
  context internally — concept 08 explains the mechanism).
- `import App from './App.jsx'` — the root component: sidebar shell + routes.
- `import { store } from './concepts/14-redux-toolkit/store.js'` — the single
  Redux store instance. It lives inside the Redux concept folder so the
  teaching material stays together, but it's provided app-wide from here.
- `import './index.css'` — importing a CSS file in Vite injects it globally
  into the page. This replaces Angular's `styles` array in `angular.json`.
- `createRoot(document.getElementById('root'))` — attach React to the empty
  `<div id="root">` from `index.html`.
- `.render( … )` — render the tree below into it. ≈ `bootstrapApplication()`.
- `<React.StrictMode>` — **dev-only** checks: it double-invokes renders and
  re-runs effects (mount → unmount → mount) to expose impure renders and
  missing effect cleanups. It does nothing in production builds. If you see
  effects firing twice in dev — this is why, not a bug.
- `<Provider store={store}>` — Redux for the whole tree (≈ providing a
  service in root; any component can now `useSelector`/`useDispatch`).
- `<BrowserRouter>` — ≈ `RouterModule.forRoot()`; enables `<Routes>`,
  `<Link>`, `useParams`, etc. anywhere below.
- `<App />` — your app, innermost, so it can use everything above it.

The pattern to remember: **each installed capability becomes a wrapper
component around `<App />`**. Angular does the same with root providers in
`app.config.ts` — React just makes the nesting visible as JSX.

---

## Step 5 — The conventions this repo added on top

Everything above is generic React setup. These choices are this project's own
architecture — no installs involved, just files:

- **`src/concepts/<nn-name>/`** — one folder per concept: a heavily commented
  demo component + a `NOTES.md`. The numbering is the syllabus order.
- **`src/concepts/registry.jsx`** — the table of contents. Each concept is
  registered with `React.lazy(() => import(...))`, and `App.jsx` renders the
  routes under `<Suspense>`. This is what makes `npm run build` split each
  concept into its own chunk (≈ Angular lazy-loaded routes with
  `loadComponent`). Add a folder + a registry entry = new sidebar page.
- **Stub data instead of a backend** — two flavors, deliberately:
  - `src/data/*.json` — **imported** at build time (`import products from
    '../data/products.json'`). Vite turns JSON into a module. Data is baked
    into the bundle.
  - `public/data/*.json` — **fetched** at runtime (`fetch('/data/posts.json')`).
    Files in `public/` are served at the URL root untouched, so this behaves
    exactly like a real HTTP API — which is why the data-fetching concept and
    its loading/error states are honest. A fake API with zero infrastructure.

---

## Step 6 — Version control

```bash
git init
git add -A
git commit -m "Initial commit"
```

Line by line:

- `git init` — turns the folder into a git repository (creates the hidden
  `.git/` directory). This project's actual first commit is `ba84d2b`.
- `git add -A` — stage every file for the commit. **The `.gitignore` from
  Step 1 must exist before this**, or you'll stage 40,000 files of
  `node_modules`.
- `git commit -m "Initial commit"` — record the snapshot; `-m` supplies the
  message inline instead of opening an editor.

---

## Step 7 — Verify the setup (the commands you'll run forever)

```bash
npm run dev      # dev server + hot reload → http://localhost:5173  (≈ ng serve)
npm test         # run the test suite once                          (≈ ng test, headless)
npm run build    # optimized production build into dist/            (≈ ng build)
npm run preview  # serve dist/ locally to sanity-check the real build
```

(One quirk: `npm test` works without `run` because `test` is one of npm's
built-in script names; everything custom needs `npm run <name>`.)

After `npm run build`, look inside `dist/assets/` — you'll see one JS file per
concept module. That's the `React.lazy` + registry pattern from Step 5 paying
off: users download a concept's code only when they visit its route.

---

## Recap — the entire setup as a copy-paste block

```bash
# scaffold
npm create vite@latest my-app -- --template react
cd my-app && npm install

# app libraries
npm install react-router-dom @reduxjs/toolkit react-redux

# test stack
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# then by hand:
#   1. vite.config.js  → add the test { globals, environment: 'jsdom', setupFiles } block
#   2. src/setupTests.js → import '@testing-library/jest-dom'
#   3. package.json    → "test": "vitest run", "test:watch": "vitest"
#   4. src/main.jsx    → wrap <App /> in <Provider> and <BrowserRouter>
#   5. .gitignore      → node_modules, dist   (then git init && git commit)

npm run dev
```

Eight installed packages, three config files, one entry-point edit. That's a complete
modern React workstation — and now you know what every line of it is for.

**Interview tip:** "How would you start a new React project?" is a real
question. The strong answer names Vite (and why not Create React App — it's
deprecated), knows that routing and global state are separate installs, and
can explain `dependencies` vs `devDependencies`. You just read all of that.
