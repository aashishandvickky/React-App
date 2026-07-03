# 12 · Performance Patterns

> 🧭 **New here?** Best order: ① play with this concept's page in the running app,
> ② read the `.jsx` file in this folder (start with its 📖 Beginner's Map at the top),
> ③ then come back here — this file is the theory + interview layer. Confusing words →
> [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md) · exercises → [`docs/EXERCISES.md`](../../../docs/EXERCISES.md)

## The toolbox (beyond memoization — see concept 10)

### 1. Code splitting — `lazy` + `Suspense`
```js
const Page = lazy(() => import('./Page.jsx'));   // separate chunk
<Suspense fallback={<Spinner/>}><Page/></Suspense>
```
- Split at **route boundaries** first (biggest win), then heavy widgets (charts, editors).
- `lazy` needs a **default export** and a Suspense boundary above it.
- Angular analogy: `loadComponent` / `loadChildren`.

### 2. Virtualization (windowing)
Render only the rows visible in the viewport: a full-height spacer div provides the
scrollbar; visible rows are absolutely positioned by `scrollTop / rowHeight`.
10,000 items → ~15 DOM nodes. Libraries: **react-window**, **@tanstack/react-virtual**.

### 3. State colocation
Keep state in the smallest component that needs it. State high in the tree = wide
re-render blast radius. Also: subtrees passed as `children` from a non-re-rendering
parent are **reused without re-rendering** — a free optimization.

### 4. Concurrent features
`useTransition` / `useDeferredValue` keep typing responsive while big updates render
in the background → concept 18.

## Measuring (say this FIRST in interviews)
- **React DevTools Profiler**: which components rendered, how long, and *why*
  ("why did this render?" — props/state/parent).
- Chrome Performance tab, Lighthouse, bundle analyzers (`vite-bundle-visualizer`).
- Never optimize without a measurement; memoization has costs (concept 10).

## Interview questions
- "The app is slow — walk me through your approach." (Measure → colocate → memo →
  virtualize → code-split → concurrent.)
- How does list virtualization work under the hood? (spacer + positioned slice).
- Why must lazy components sit under Suspense? (render suspends while the chunk loads;
  Suspense provides the fallback UI).
- What gets its own chunk? (dynamic `import()` boundaries — Vite/webpack split there).
