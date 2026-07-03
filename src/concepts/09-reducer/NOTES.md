# 09 · useReducer

## Shape
```js
const [state, dispatch] = useReducer(reducer, initialArg, initFn?);
function reducer(state, action) { return newState; }
dispatch({ type: 'added', text: '…' });
```

## Why choose it over useState
- Several transitions on one piece of state (`added` / `toggled` / `deleted`) — one pure
  function instead of logic sprinkled through handlers.
- Next state depends on previous state in nontrivial ways.
- Testability: reducers are plain functions — `expect(reducer(s, a)).toEqual(...)`.
- `dispatch` has a **stable identity** across renders → safe to pass deep, never a
  useCallback dependency problem.
- Pairs with context for "mini-Redux": `<StateContext.Provider>` + `<DispatchContext.Provider>`.

## Reducer rules (same as Redux/NgRx)
- Pure: same (state, action) → same result.
- No mutation — return new objects (spread, map, filter).
- No side effects, no randomness/time inside the reducer (generate ids in the dispatcher).

## Angular analogy
Component-local NgRx: actions = dispatched objects, reducer = reducer, but no
effects/selectors layer — those needs push you to Redux Toolkit (concept 14).

## Interview questions
- **When useReducer over useState?** (list above — say "related transitions" and "testable pure fn").
- **Must reducers be pure? Why?** React may replay renders (StrictMode double-invokes
  reducers in dev!) and relies on reference equality.
- **How do useReducer + context replace Redux for small apps?** Provider owns
  `useReducer`, exposes state & dispatch via two contexts.
- **What's the third argument of useReducer?** Lazy init: `useReducer(r, arg, init)` computes
  initial state once — like lazy `useState(() => …)`.
