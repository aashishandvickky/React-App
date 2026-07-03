# React Interview Questions — with crisp answers

Organized by topic; each maps to a concept folder where you can SEE the answer running.
Practice saying answers out loud in 30–60 seconds.

---

## Fundamentals (concepts 01–04)

**1. What is React?**
A library for building UIs from composable components. Declarative: you describe the UI
for a given state; React figures out the DOM updates via reconciliation.

**2. What is JSX and what does it compile to?**
Syntax sugar compiling to `jsx()`/`createElement()` calls that return **element objects**
(`{type, props, key}`). Elements are descriptions, not DOM nodes.

**3. Element vs component vs instance?**
Component = the function/class (blueprint). Element = the object returned by rendering it.
Instances/fiber nodes are managed internally by React.

**4. What is the virtual DOM? Is it fast?**
An in-memory tree of elements. React diffs the previous and next trees and applies minimal
DOM mutations. It's not "faster than manual DOM" — it's fast *enough* while letting you
write declarative code. (Deep dive: docs/RENDERING_AND_RECONCILIATION.md.)

**5. Why are keys needed? Why not array index?**
Keys give list items identity across renders so React can match/move them instead of
destroying and recreating. Index keys break on reorder/insert: state (inputs, memo,
animations) sticks to the position, not the item. Demo: concept 04.

**6. What are fragments?**
`<>…</>` groups children without a wrapper DOM node. Keyed form: `<Fragment key={…}>`.

**7. Why must components be pure?**
React may re-run renders at any time (StrictMode, concurrency). Rendering must not mutate
anything outside itself — side effects belong in effects/handlers.

---

## State & rendering (concepts 03, 10)

**8. Why is setState "asynchronous"? What is batching?**
Setters schedule a re-render; React batches all updates in a tick into one render pass
(React 18: also in promises/timeouts). Reading state right after setting returns the old
snapshot — each render's variables are a closure over that render's values.

**9. `setCount(count+1)` three times only adds 1 — why?**
All three read the same snapshot. Fix: functional updates `setCount(c => c+1)`. Demo: concept 03.

**10. Why immutability?**
React detects changes by reference (`Object.is`). Mutation keeps the reference → skipped
re-renders, broken memo/deps, and no time-travel debugging.

**11. When does a component re-render?**
(1) its state changed, (2) its parent re-rendered, (3) its context value changed,
(4) its store subscription fired. Note: parent re-render re-renders children **even with
unchanged props** — unless `React.memo`.

**12. React.memo vs useMemo vs useCallback?**
memo = skip child render when props shallow-equal. useMemo = cache a computed **value**.
useCallback = cache a **function** (≡ `useMemo(() => fn, deps)`). They work together:
memo children need reference-stable props. Demo: concept 10.

**13. When is memoization harmful?**
Cheap components/values — comparison + memory overhead with no win. Measure first
(DevTools Profiler). React 19's compiler auto-memoizes, making manual use rarer.

---

## Hooks (concepts 03, 06, 07, 09, 11)

**14. Rules of Hooks — and WHY?**
Top level only, React functions only. React matches hook state to hook **call order**;
a conditional hook shifts order and corrupts state pairing.

**15. useEffect dependency array variants?**
None → every render. `[]` → mount only. `[a, b]` → when a or b changes. Cleanup runs
before each re-run and on unmount.

**16. Why do effects run twice in development?**
StrictMode intentionally mounts→unmounts→remounts to prove cleanups are correct.
Production runs once. Don't hack around it — fix the cleanup.

**17. What is a stale closure?**
An effect/callback capturing old state because deps were omitted. Fix: correct deps,
functional updates, or refs. Demo: concept 06 NOTES.

**18. useEffect vs useLayoutEffect?**
useEffect runs async after paint; useLayoutEffect runs synchronously before paint —
for DOM measurement/positioning to avoid flicker. Default to useEffect.

**19. useState vs useRef?**
State: in the UI, triggers re-render. Ref: mutable `{current}` surviving renders without
re-rendering — DOM handles, timers, previous values. Demo: concept 07.

**20. useState vs useReducer?**
Reducer when transitions are many/related or logic should be a testable pure function;
dispatch identity is stable. Demo: concept 09.

**21. What makes a custom hook a hook?**
`use` prefix + calls other hooks. Shares **logic, not state** — each call site gets its
own state. Demo: concept 11.

**22. How would you implement useDebounce / usePrevious?**
Debounce: state + effect with setTimeout + cleanup clearTimeout (concept 11 source).
Previous: ref written in an effect after commit (concept 07).

---

## Component patterns (concepts 02, 08, 16, 17)

**23. How do components communicate?**
Parent→child: props. Child→parent: callback props. Distant: lift state up, context, or a store.

**24. What is lifting state up?**
Moving shared state to the closest common ancestor; siblings get value + callbacks.

**25. What is prop drilling and how do you fix it?**
Passing props through layers that don't use them. Fix: composition (pass components as
children), context, or a store. Demo: concept 08.

**26. Context performance pitfalls?**
Every consumer re-renders when `value` changes by reference — memoize the value, split
contexts by update frequency. `memo` does NOT protect consumers from context changes.

**27. Context vs Redux?**
Context = value transport (DI-ish); Redux adds store discipline, middleware, devtools, and
**selector-granularity subscriptions**. Low-frequency global data → context; large
fast-changing shared state → RTK/Zustand. Concept 14 NOTES.

**28. What are error boundaries? What don't they catch?**
Class components catching **descendant render/lifecycle errors** → fallback UI.
NOT caught: event handlers, async code, SSR, the boundary itself. Only class feature
without a hook equivalent. Demo: concept 16.

**29. What are portals? Do events/context work through them?**
Render children into another DOM node while staying in the React tree. Context works;
events bubble through the **React** tree. Use: modals/tooltips. Demo: concept 17.

**30. HOC vs render props vs hooks?**
Legacy reuse patterns (wrapper hell, indirection) → custom hooks replaced both.
Still recognize them: `withRouter(Comp)`, `<Mouse render={m => …}/>`.

**31. Controlled vs uncontrolled components?**
Who owns the value: React state (value+onChange) vs the DOM (defaultValue+ref).
Controlled = live validation/single source of truth. Files are always uncontrolled. Concept 05.

---

## Router & fetching (concepts 13, 15)

**32. How do you protect a route?**
Wrapper component checking auth → `<Navigate to="/login" state={{from}}/>`. Concept 13 NOTES.

**33. Explain a fetch race condition and two fixes.**
Overlapping requests resolve out of order; stale response wins. Fix: AbortController in
effect cleanup, or an `active` flag; libraries key by query. Live demo: concept 15.

**34. Why can't the useEffect callback be async?**
It must return a cleanup function; async functions return promises.

**35. Server state vs client state?**
Server state is a cache of remote data (stale, refetchable, shared) → TanStack Query/
RTK Query own caching, dedup, retries, optimistic updates. Client state → useState/stores.

**36. What is an optimistic update?**
Apply the expected result to the UI immediately, roll back if the request fails.

---

## Redux (concept 14)

**37. Explain the Redux data flow.**
dispatch(action) → middleware → reducers (pure, immutable) → new state → subscribed
selectors re-render components.

**38. Why can you "mutate" in createSlice reducers?**
Immer wraps reducers, records draft mutations, emits immutable updates.

**39. Where does async logic live in Redux?**
Never reducers. Thunks (createAsyncThunk pending/fulfilled/rejected), or RTK Query for
server data.

**40. useSelector performance rule?**
Select the minimal value; inline object-returning selectors re-render on every dispatch.

---

## Performance & concurrent (concepts 10, 12, 18)

**41. "The app is slow." Walk through your approach.**
Profile first (React DevTools Profiler — what rendered, why). Then: colocate state, memo
hot paths, virtualize lists, code-split routes, transitions for heavy updates, production
build/bundle checks. Concept 12.

**42. How does list virtualization work?**
Full-height spacer for the scrollbar; render only `scrollTop/rowHeight` slice, absolutely
positioned. 10k rows → ~15 nodes. Hand-rolled demo: concept 12.

**43. How does code splitting work in React?**
Dynamic `import()` → bundler chunk; `lazy()` + `<Suspense fallback>` at route boundaries.

**44. useTransition vs useDeferredValue vs debounce?**
Transitions mark updates non-urgent & interruptible (no fixed delay); deferred value is
the receive-side variant; debounce delays the work itself. Demo: concept 18.

**45. What is Fiber?**
React's internal architecture: rendering split into interruptible units of work, enabling
priorities and concurrency. docs/RENDERING_AND_RECONCILIATION.md.

---

## React 18/19 & ecosystem (docs/ECOSYSTEM_AND_BEYOND.md)

**46. What did React 18 introduce?**
createRoot, automatic batching everywhere, concurrent rendering, useTransition/
useDeferredValue/useId, streaming SSR + selective hydration.

**47. What's new in React 19?**
`use()` (read promises/context in render), Actions (useActionState, useOptimistic,
form actions), ref as a normal prop (no forwardRef), the React Compiler (auto-memoization),
stable Server Components support.

**48. What are React Server Components (RSC)?**
Components that run only on the server — zero client JS, direct data access; interleaved
with client components (`'use client'`). Different from SSR (which hydrates everything).

**49. SSR vs CSR vs SSG vs hydration?**
CSR: empty div + JS renders. SSR: HTML on request, then hydration attaches listeners.
SSG: HTML at build time. Hydration: React adopting server HTML. Next.js does all of these.

**50. What is StrictMode?**
Dev-only checks: double renders/effect-remounts to surface impurity and missing cleanups.

**51. What is the SyntheticEvent system?**
Cross-browser event wrapper; React delegates events at the root rather than per node.

**52. What is `useId` for?** Stable unique ids consistent across server/client HTML
(form label/input pairs) — not for list keys.

---

## Coding challenges to practice (build them in this repo!)

1. Counter with functional updates (done — concept 03; now add undo).
2. Debounced search over `products.json` (capstone has it — rebuild blind).
3. Todo list with useReducer (concept 09 — add edit-in-place).
4. Fetch + loading/error/abort (concept 15 — rebuild blind).
5. Modal with portal + Escape + backdrop (concept 17).
6. Custom hooks: useLocalStorage, usePrevious, useToggle, useWindowSize.
7. Virtualized 10k list (concept 12 — rebuild blind).
8. Tabs / accordion (compound components with context).
9. Star rating (controlled component, hover state).
10. Stopwatch with useRef for the interval id (start/stop/lap).
