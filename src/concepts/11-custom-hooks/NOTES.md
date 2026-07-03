# 11 · Custom Hooks

## What they are
A function whose name starts with `use` and that calls other hooks. That's it — no API,
no registration. The naming convention matters: it tells the linter (and readers) that the
Rules of Hooks apply inside.

## What they replace
| Old React / Angular | Now |
|---|---|
| Higher-Order Components (HOC) | custom hook |
| Render props | custom hook |
| Angular injectable service (logic reuse) | custom hook |
| Angular singleton service (shared state) | custom hook **+ context** or a store |

## The crucial rule
**Hooks share logic, not state.** Each call site gets its own state instances.
`useCart()` in two components = two carts, unless the hook reads from context/store.

## Design guidelines
- Return the smallest useful API: a tuple (`[value, setValue]`, useState-like) or an object
  (`{ data, error, loading }`).
- Accept reactive inputs as arguments and list them in internal effect deps (`useFetch(url)`).
- Encapsulate the cleanup (`clearTimeout`, `abort()`) inside the hook — callers shouldn't care.
- Compose freely: hooks calling hooks calling hooks is normal.

## Classic hooks interviewers ask you to write on the spot
`useDebouncedValue` · `useLocalStorage` · `usePrevious` · `useFetch` · `useToggle` ·
`useWindowSize` (resize listener + cleanup) · `useOnClickOutside`.
Practice writing these blind — all three in this folder are the canonical answers.

## Interview questions
- **What makes a function a custom hook?** `use` prefix + calls hooks; rules of hooks apply.
- **Do two components using the same hook share state?** No — logic reuse, not state reuse.
- **Hooks vs HOCs/render props?** No wrapper-hell, explicit data flow, composable, typed easily.
- **Write a debounce hook.** (see useDebouncedValue.js — state + effect + cleanup timer).
