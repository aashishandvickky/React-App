# Rendering, Reconciliation & Fiber — the senior-round doc

This is the "how does React actually work?" material that separates senior candidates.

## The render pipeline

```
trigger (setState / parent render / context change)
   → RENDER PHASE:  call components, build new element tree, diff vs old   [interruptible]
   → COMMIT PHASE:  apply DOM mutations, run layout effects                [synchronous]
   → paint, then passive effects (useEffect) run
```

Key consequences:
- The render phase may run **without committing** (interrupted, StrictMode replays) —
  render must be pure.
- "Re-render" ≠ "DOM update". Components re-run constantly; the DOM changes only where
  the diff differs.

## Reconciliation (the diffing rules — memorize all three)

Comparing full trees is O(n³); React gets O(n) with heuristics:

1. **Different element type → tear down.** `<div>` → `<span>`, or `<CompA>` → `<CompB>`:
   the whole subtree unmounts (state destroyed) and rebuilds.
2. **Same type → update in place.** Same DOM tag: mutate changed attributes only.
   Same component: keep instance/state, update props, re-render.
3. **Lists → match by key.** Without keys, position-based matching; with keys, React
   pairs old/new children by key so reorders move nodes instead of rebuilding them.
   (Why index keys break — concept 04's interactive demo.)

Corollaries worth saying in interviews:
- Changing `key` on purpose = forced remount (reset a form: `<Form key={userId}/>`).
- Defining a component **inside** another component's body creates a new type every
  render → subtree remounts every render (classic bug!). Always define at module level.

## Virtual DOM, honestly

An in-memory element tree (plus the fiber tree tracking state/effects). The value is not
raw speed — it's the **declarative model**: you write `UI = f(state)`, React computes
minimal mutations. Interview nuance: newer frameworks (Svelte, Solid, Angular signals)
skip the diff via compiled/fine-grained reactivity; React 19's compiler narrows the gap
by auto-memoizing.

## Fiber (name-drop with substance)

Fiber (React 16) rewrote the reconciler: each element gets a **fiber node**, rendering is
split into small **units of work** that can be paused/resumed/aborted, with two trees —
`current` (committed) and `workInProgress` (being built), swapped at commit
(double buffering). This is the machinery that enables:
- **Priorities**: urgent input vs transitions (concept 18)
- **Time slicing**: long renders don't block the main thread
- **Suspense**: a subtree can "wait" while siblings proceed

## Batching

React 18+: all setState calls in one tick — event handlers, promises, timeouts — coalesce
into one render (`flushSync` escapes it, rarely needed). Before 18, only event handlers batched.

## StrictMode replays (dev only)

Double-invokes: component bodies, initializers, reducers (purity check); and runs
mount→cleanup→mount for effects (cleanup check). Production: single execution.

## Interview questions this doc answers

- Walk me through what happens when you call setState.
- How does reconciliation decide what to update? (3 rules)
- What exactly does a key do? Why does changing it remount?
- Why must render be pure? Why is defining components inside components bad?
- What is Fiber and what did it unlock? Render vs commit phase?
- What is automatic batching? What does flushSync do?
