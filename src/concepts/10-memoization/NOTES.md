# 10 · Memoization — `React.memo`, `useMemo`, `useCallback`

## First: the render model
A component re-renders when (1) its state changes, or (2) **its parent re-rendered** —
regardless of whether props changed. Re-rendering is running the function and diffing;
it's cheap. The DOM only changes where the diff differs. Optimize only measured hot spots.

## The three tools
| Tool | Memoizes | Use when |
|---|---|---|
| `React.memo(Comp)` | the component's render | pure child re-rendered often with same props (≈ OnPush) |
| `useMemo(fn, deps)` | a **value** | expensive computation, or referential stability for objects/arrays |
| `useCallback(fn, deps)` | a **function** | stable handler passed to memoized children / used in effect deps |

`useCallback(fn, deps)` ≡ `useMemo(() => fn, deps)`.

## Why they travel together
`memo(Child)` compares props **shallowly** (`Object.is` per prop). Inline `{}`, `[]`,
and arrow functions are new references every render, silently defeating memo. So memoized
children require memoized object/function props — one leak breaks the chain.

## When NOT to memoize
- Cheap components/computations — the comparison + memory cost exceeds the win.
- Props that change every render anyway.
- As a reflex. Measure with **React DevTools Profiler** first.

## React 19 note
The **React Compiler** auto-memoizes components and values at build time, making manual
useMemo/useCallback largely unnecessary in codebases that adopt it. Interviewers love
asking about it — know it exists and what it replaces.

## Interview questions
- Difference between the three (table).
- Why does `React.memo` "not work" sometimes? (unstable references from inline props).
- `useCallback` vs `useMemo`? (function vs value; equivalence identity above).
- When is memoization harmful? What's the Angular OnPush analogy — and the difference?
  (OnPush gates change detection by input reference + events; memo gates re-render by
  shallow prop equality — same reference-discipline idea.)
