# 18 · Concurrent Features (React 18+)

## The big idea
The concurrent renderer can **pause, resume, and abandon** renders. Updates get
priorities: urgent (typing, clicks — must feel instant) vs non-urgent *transitions*
(filtering a big list, switching tabs). New urgent input **interrupts** an in-progress
transition render; React never shows a half-rendered tree.

Enabled by `createRoot()` (React 18's new root API — the reason it exists).

## The two hooks
| | `useTransition` | `useDeferredValue` |
|---|---|---|
| You control the setState? | yes — wrap it | no — you just receive a value/prop |
| API | `const [isPending, startTransition] = useTransition()` | `const deferred = useDeferredValue(value)` |
| Pattern | two states: urgent echo + deferred heavy state | render heavy UI from the lagging copy |
| Pending UI | `isPending` flag | compare `value !== deferred` |

## vs debouncing (classic follow-up)
- **Debounce**: waits N ms of silence before doing the work at all — adds latency.
- **Transition**: starts immediately but at low priority and interruptible — no fixed delay,
  and CPU-bound rendering stays off the urgent path. They compose (debounce network,
  transition rendering).

## Related React 18/19 concurrent APIs (name-drop ready)
- `Suspense` for data (libraries/RSC throw promises; Suspense shows fallbacks).
- Streaming SSR + selective hydration (Suspense boundaries hydrate independently).
- React 19: `use()` (read promises/context in render), Actions (`useActionState`,
  `useOptimistic`), Server Components (see docs/ECOSYSTEM_AND_BEYOND.md).

## Interview questions
- What is concurrent rendering? (interruptible rendering + priorities, consistent commits).
- useTransition vs useDeferredValue? (own the update vs receive the value).
- Transition vs debounce/throttle? (above).
- What made concurrency possible? (Fiber architecture — render phase split into
  interruptible units of work; see docs/RENDERING_AND_RECONCILIATION.md).
