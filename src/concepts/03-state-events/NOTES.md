# 03 · State & Events (`useState`)

## Mental model — this is THE thing to internalize coming from Angular
In Angular you mutate a class field and change detection finds it.
In React **you never mutate**: you call a setter, React re-runs your component function,
and the new return value is diffed against the old one. Each render is a **snapshot** —
its variables (including `count`) are frozen in that render's closure.

## The rules
1. `setState` **schedules** a re-render; it doesn't change the variable in the current run.
   Reading `count` right after `setCount(count+1)` gives the OLD value — by design.
2. **Batching**: React 18+ batches all setState calls in one tick (events, promises,
   timeouts) into a single re-render.
3. **Functional updates** `setCount(c => c+1)` when the next value depends on the previous —
   fixes the "+3 adds 1" trap.
4. **Immutability**: React decides "did state change?" with `Object.is` (reference check).
   Mutating an object keeps the reference → no re-render, and breaks `memo`/deps everywhere.
5. **Lazy initialization**: `useState(() => expensiveInit())` runs the initializer once,
   not on every render.

## Rules of Hooks (asked in EVERY interview)
- Call hooks only at the **top level** — never inside `if`/loops/nested functions.
- Only from React functions (components / custom hooks).
- **Why?** React identifies hooks by **call order**. A conditional hook shifts the order
  and state gets matched to the wrong hook.

## Events
- camelCase props: `onClick`, `onChange`, `onKeyDown`; pass a function reference.
- `SyntheticEvent` wraps native events for cross-browser consistency; React attaches one
  delegated listener at the root, not one per element.
- `onChange` on inputs fires per keystroke (like Angular's `input` event, not DOM `change`).

## Interview questions
- **Why is setState "asynchronous"?** Updates are batched and applied before the next
  render — reading state right after setting it returns the old snapshot.
- **Why functional updates?** Multiple updates in one tick each need the latest value.
- **Why immutability?** O(1) reference comparison drives re-render, memoization, and deps.
- **What are the Rules of Hooks and why do they exist?** (call-order answer above).
