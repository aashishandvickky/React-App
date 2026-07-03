# 📖 Glossary — every confusing word, in plain language

Look things up here whenever a term in the code, docs, or an error message makes you
pause. Ordered roughly by when you'll first meet each word, grouped by topic.

## The project & tooling words

- **Node.js** — a program that runs JavaScript outside the browser. The dev tools
  (Vite, tests, npm) run on it. Your React code itself runs in the browser.
- **npm** — Node's package manager. Installs libraries and runs the scripts defined in
  `package.json` (`npm run dev`, `npm test`).
- **package.json** — the project's ID card: its name, the libraries it needs
  (`dependencies`), and its command shortcuts (`scripts`).
- **node_modules/** — the folder where npm puts downloaded libraries. Huge, never
  edited by hand, never committed to git. Deleted it by accident? `npm install`
  rebuilds it.
- **Vite** — this project's build tool + dev server (Angular analogy: Angular CLI).
  Runs the app locally with instant reload, and packages it for production.
- **Dev server** — the local web server (`npm run dev`) that serves your app at
  `http://localhost:5173` while you develop.
- **localhost:5173** — "this machine, port 5173". Only you can see it; it's not on the
  internet.
- **HMR (Hot Module Replacement)** — when you save a file, the dev server injects the
  change into the running page without a reload. Your app's state survives the edit.
- **Build / bundle** — `npm run build` converts your source into plain, compressed
  JS/CSS files (in `dist/`) that any web server can host.
- **Chunk / code splitting** — the build cuts the app into pieces ("chunks") so the
  browser downloads a page's code only when you visit it. See `lazy()` in
  `src/concepts/registry.jsx`.
- **SPA (single-page application)** — an app that loads one HTML page and then redraws
  itself with JavaScript as you navigate. No full page reloads. This app (and most
  Angular apps) are SPAs.

## Core React words

- **Component** — a JavaScript function that returns UI. The building block of React.
  `function Button() { return <button>Hi</button>; }`. Angular analogy: a component
  class + template, in one function.
- **JSX** — the HTML-looking syntax inside JavaScript files (`<div className="card">`).
  Not real HTML — it compiles to function calls that build objects. `{curly braces}`
  drop you back into JavaScript.
- **Props** — the inputs a parent passes to a child component, like function
  arguments: `<Card title="Hello" />`. Read-only — a child never changes its own
  props. Angular analogy: `@Input()`.
- **State** — data a component owns and can change, declared with `useState`. When
  state changes (via the setter), React re-renders the component. Ordinary variables
  don't survive a re-render; state does.
- **Render / re-render** — React calling your component function to ask "what should
  the screen look like now?". Re-renders happen when state or props change. Renders
  are cheap; don't fear them.
- **Hook** — any function starting with `use` (`useState`, `useEffect`, …) that gives
  a component a capability (memory, side effects, context…). Only callable at the top
  level of a component or another hook.
- **Event handler** — the function you attach to `onClick`, `onChange`, etc. "When the
  user does X, run this." Angular analogy: `(click)="..."`.
- **Controlled input** — a form field whose value lives in React state (`value={q}`
  + `onChange`). React is the single source of truth for what's in the box.
- **Key** — the `key={item.id}` prop on list items. Gives each item a stable identity
  so React can tell items apart across re-renders. Never use the array index for
  dynamic lists.
- **Children** — whatever you nest inside a component's tags:
  `<Card><p>Hi</p></Card>` — the `<p>` arrives as `props.children`. Angular analogy:
  `<ng-content>`.
- **Conditional rendering** — showing UI only sometimes: `{isOpen && <Modal />}` or
  `{loading ? <Spinner /> : <List />}`. Angular analogy: `*ngIf`.

## Words from the later concepts

- **Side effect / `useEffect`** — anything a component does besides computing UI:
  fetching data, timers, subscriptions, touching the browser directly. `useEffect`
  runs *after* render; its **cleanup** function undoes the effect.
- **Dependency array** — `useEffect`'s second argument (`[a, b]`): "re-run this effect
  only when these values change". `[]` = run once after the first render.
- **Stale closure** — a classic bug: a function "remembers" old state from the render
  it was created in. Concept 03's broken "+3" button demonstrates it.
- **StrictMode** — dev-only wrapper (see `src/main.jsx`) that runs renders and effects
  twice on purpose to expose bugs. The reason your `console.log` prints twice.
- **Ref / `useRef`** — a small box (`ref.current`) that survives re-renders but does
  NOT trigger them when changed. Also the way to grab a real DOM element. Angular
  analogy: `@ViewChild`.
- **Context** — a way to pass data deep down the tree without threading it through
  every level's props ("prop drilling"). A transport, not a state manager.
- **Reducer / `useReducer`** — state managed by a pure function
  `(state, action) → newState`. You `dispatch({ type: 'added' })` instead of calling
  setters. The mental model behind Redux. Angular analogy: NgRx reducers.
- **Memoization** — "remember the previous answer; skip the work if inputs didn't
  change". `memo` (skip re-rendering a component), `useMemo` (skip recomputing a
  value), `useCallback` (keep the same function reference between renders).
- **Derived state** — a value you can compute from existing state/props (like a
  filtered list). Compute it during render — do NOT store it in its own state.
- **Custom hook** — your own `useSomething()` function combining built-in hooks, so
  logic can be reused across components. See `src/concepts/11-custom-hooks/`.
- **Lifting state up** — moving state to the closest shared parent when two components
  need the same data; it flows back down as props.
- **Lazy loading / `lazy()` + `Suspense`** — download a component's code only on first
  use; `<Suspense fallback={…}>` shows a placeholder while it downloads.
- **Error boundary** — a component that catches render-time crashes in its children
  and shows fallback UI instead of a blank page. The one thing still requiring a class
  component.
- **Portal** — renders a component's HTML somewhere else in the document (e.g., modals
  at `<body>` level) while it stays a normal child in the React tree.

## Router & Redux words

- **Route** — "URL pattern → component" (`/20-members/:id` → `MemberDetail`).
- **`useParams`** — hook that reads the variable parts of the URL (the `:id`).
- **`<Link>` / `<NavLink>`** — navigation without a page reload. Angular analogy:
  `routerLink` (NavLink ≈ `routerLinkActive` built in).
- **Redux store** — one global object holding app-wide state, living outside all
  components. This project's store: `src/concepts/14-redux-toolkit/store.js`.
- **Slice** — Redux Toolkit's unit: one feature's piece of the store (its state + the
  reducers that change it), e.g. `walletSlice.js`.
- **Action / dispatch** — an action is a plain "something happened" object; `dispatch`
  sends it to the store, a reducer computes the new state.
- **Selector / `useSelector`** — how a component reads a piece of the store — and
  subscribes: the component re-renders when that piece changes.

## Testing words

- **Vitest** — the test runner (`npm test`). Vite-native equivalent of Jest/Karma.
- **React Testing Library (RTL)** — renders components into a fake DOM and interacts
  the way a user would: find by role/text, type, click, assert what's visible.
  Philosophy: test behavior, not implementation details.
- **`getByRole` / `getByText` / `getByTestId`** — queries for finding elements, in
  order of preference (roles are what assistive tech sees; test IDs are last resort).
- **jsdom** — the fake in-memory browser tests run in. No real window opens.

## Words you'll hear in interviews (deeper docs cover these)

- **Virtual DOM** — React's in-memory description of the UI. On re-render, React
  compares (diffs) new vs old descriptions and touches only the changed real DOM bits.
- **Reconciliation** — that diffing process. Keys exist to make it accurate for lists.
  Deep dive: `RENDERING_AND_RECONCILIATION.md`.
- **Fiber** — React's internal engine that can pause/resume rendering work (enables
  the concurrent features in concept 18).
- **Hydration** — attaching React to server-rendered HTML. Only relevant with SSR
  frameworks like Next.js — not used in this repo.
- **SSR / CSR** — server-side vs client-side rendering: where the HTML gets produced.
  This app is CSR; see `ECOSYSTEM_AND_BEYOND.md` for the trade-offs.
