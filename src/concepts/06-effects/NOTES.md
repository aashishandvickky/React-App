# 06 · useEffect & Lifecycle

> 🧭 **New here?** Best order: ① play with this concept's page in the running app,
> ② read the `.jsx` file in this folder (start with its 📖 Beginner's Map at the top),
> ③ then come back here — this file is the theory + interview layer. Confusing words →
> [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md) · exercises → [`docs/EXERCISES.md`](../../../docs/EXERCISES.md)

## What an effect is
Code that synchronizes the component with an **external system** (network, timers,
subscriptions, `document`, non-React widgets). It runs **after** React commits to the DOM.

## Lifecycle mapping (approximate — think "sync", not "lifecycle")
| Angular | React |
|---|---|
| `ngOnInit` | `useEffect(fn, [])` |
| `ngOnChanges` (specific input) | `useEffect(fn, [thatProp])` |
| `ngOnDestroy` | the **cleanup function** returned by the effect |
| `ngAfterViewInit` (DOM measuring) | `useLayoutEffect` (fires before paint, synchronously) |

## Cleanup timing (frequently mis-answered)
Cleanup runs (1) **before every re-run** of that effect, and (2) on unmount.
So an effect with `[query]` deps does: cleanup(old query) → effect(new query) each change.

## StrictMode double-fire
In dev, React mounts → unmounts → remounts each component, so `[]` effects run twice.
It's a deliberate stress test proving your cleanup is correct. Production runs once.
**Never** "fix" it with `useRef(didRun)` hacks — write a proper cleanup.

## Stale closure — the classic bug
```js
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000); // count frozen at 0!
  return () => clearInterval(id);
}, []);            // ❌ lies about deps
```
Fixes: functional update `setCount(c => c+1)`, or add `count` to deps (interval resets each change).
Rule: the dep array must list **every reactive value** the effect reads. Don't silence the
lint rule — restructure the code.

## Async effects
The callback can't be `async` (it must return a cleanup, not a Promise). Define an inner
async function; use `AbortController` in cleanup to cancel in-flight requests.

## When NOT to use an effect
- Deriving data from props/state → compute in render (or `useMemo`).
- Responding to a user event → do it in the handler.
- "useEffect to call a function on mount that sets state from props" → usually just render logic.

## Interview questions
- Dependency-array variants and when each runs.
- When does cleanup run? (before re-run + unmount).
- Why do effects run twice in dev? (StrictMode remount test).
- `useEffect` vs `useLayoutEffect`? Layout runs synchronously before paint — use for
  measuring/positioning DOM to avoid flicker; default to `useEffect`.
- What's a stale closure and how do you fix it?
