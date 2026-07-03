# 14 · Redux Toolkit (RTK)

Coming from NgRx you already know 90% of this — NgRx *is* Redux with RxJS effects.

## Core loop
`dispatch(action)` → middleware → reducers produce **new immutable state** →
subscribed components (`useSelector`) re-render if their selected value changed.

## RTK API you must know
- `configureStore({ reducer: {...} })` — store + DevTools + default middleware (thunk,
  dev-mode immutability & serializability checks).
- `createSlice({ name, initialState, reducers })` — generates action creators & types.
  Reducers may "mutate" thanks to **Immer** (it records drafts and emits immutable
  updates). Interview: *why is mutation OK here and nowhere else?* — Immer.
- `createAsyncThunk(type, asyncFn)` — dispatches `pending/fulfilled/rejected`; handled in
  `extraReducers`. NgRx analogy: Effects.
- `useSelector(selectorFn)` — subscription; re-renders only when the selected value changes.
  Select the **smallest** value you need; selecting whole objects created inline
  (`state => ({...})`) re-renders every dispatch.
- `useDispatch()` — stable dispatch function.
- `createSelector` (reselect) — memoized derived selectors for expensive computation.
- **RTK Query** — RTK's built-in data-fetching/caching layer (generated hooks like
  `useGetPostsQuery`) — the Redux-world answer to TanStack Query. Know the name.

## When Redux vs alternatives (guaranteed question)
- **Context + useReducer**: fine for small apps / low-frequency global data.
- **Redux**: much shared, frequently-updated client state; team discipline; devtools
  time-travel; middleware.
- **Zustand/Jotai**: lighter external stores, hooks-first, far less ceremony — very popular now.
- **TanStack Query**: SERVER state (caching, revalidation) — often removes most "global
  state" need entirely. Distinguish **server state vs client state** in your answer.

## NgRx → RTK dictionary
| NgRx | RTK |
|---|---|
| `createAction`/`createReducer` | `createSlice` (both generated) |
| Effects (RxJS) | `createAsyncThunk` / RTK listener middleware |
| Selectors + `store.select` | selector fns + `useSelector` |
| Facade services | custom hooks wrapping selectors/dispatch |
| `@ngrx/entity` | `createEntityAdapter` |

## Interview questions
- Explain the Redux data flow. Why immutable reducers? (pure + reference-equality
  subscriptions + time-travel).
- How does RTK let you "mutate"? (Immer drafts).
- useSelector vs useContext performance? (selector-level vs provider-level granularity).
- Where does async go? (never in reducers — thunks/middleware).
- What is RTK Query / TanStack Query and when would you skip Redux entirely?
