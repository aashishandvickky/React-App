# 08 · Context API

## The problem it solves
**Prop drilling** — threading a prop through 5 components that only pass it along.
Context lets any descendant read a value from the nearest matching Provider above it.

## Angular analogy
A service provided at a component level: visible to that subtree, and a child-level
provider **shadows** the parent one (nearest wins) — same as Angular's hierarchical injector.
Difference: context carries a *value*, not a class instance with behavior; the behavior
lives in the provider component's hooks.

## The 3-step pattern (memorize)
1. `const XContext = createContext(defaultValue)`
2. `<XContext.Provider value={...}>` — a wrapper component owning state via useState/useReducer
3. `useContext(XContext)` — wrapped in a custom hook (`useX`) that throws without a provider

## Performance model (the senior-level question)
- A consumer re-renders whenever the provider's `value` changes **by reference** (`Object.is`).
- `value={{ a, b }}` inline = new object every provider render = all consumers re-render.
  Fix with `useMemo`.
- `React.memo` on a consumer does NOT block context updates — context bypasses props.
- Mitigations: memoize value · split contexts by change-frequency (e.g. `StateContext`
  + `DispatchContext`) · push state down so the provider re-renders less.

## Context vs Redux (guaranteed question)
Context is a **transport** (dependency injection for values). Redux adds: one store,
reducers/actions discipline, devtools time-travel, middleware, and **selector-based
subscriptions** (components re-render only when their selected slice changes — context
re-renders every consumer). Small/medium app or low-frequency data (theme, auth, locale)
→ context. Large shared, fast-changing state → Redux Toolkit / Zustand / Jotai.

## Interview questions
- What problem does context solve? When would you NOT use it?
- Why memoize the provider value?
- How do consumers decide to re-render? (reference change, nearest provider).
- Context vs Redux? (above).
