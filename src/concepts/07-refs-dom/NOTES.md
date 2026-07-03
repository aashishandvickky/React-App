# 07 · Refs & the DOM

## `useRef` in one line
A stable mutable box `{ current: … }` that lives across renders; writing to it does
**not** re-render. Two use cases: DOM handles, and "instance variables" for function
components (timer ids, previous values, flags).

## state vs ref — the decision
| | `useState` | `useRef` |
|---|---|---|
| Shown in the UI? | yes | no |
| Change triggers render? | yes | no |
| Read during render? | yes | avoid (except .current set in past commits) |

If the value affects what's rendered → state. If it's bookkeeping → ref.

## Angular mapping
- `@ViewChild(...) ElementRef` → `const r = useRef(null)` + `<input ref={r}>`
- `ngAfterViewInit` DOM access → access `ref.current` inside `useEffect`
- Direct DOM through Renderer2 → just use the node, but only for things React
  can't express (focus, measure, scroll, media playback, canvas, 3rd-party widgets).

## Rules
- Don't read/write refs **during render** (except lazy-init patterns) — render must stay pure.
- DOM refs are `null` until after the first commit.
- Refs to custom components: React 19 → `ref` is a normal prop; React ≤18 → wrap the child in
  `React.forwardRef((props, ref) => …)`. Interviewers still ask forwardRef.
- `useImperativeHandle(ref, () => ({ focus() {...} }))` exposes a curated API instead of the raw DOM.

## Interview questions
- **useRef vs useState?** (table above).
- **How do you focus an input on mount?** ref + `useEffect(() => ref.current.focus(), [])`.
- **What is forwardRef / why did React 19 remove the need?** ref used to be a reserved,
  non-forwarded prop; 19 passes it through like any prop.
- **How to get the previous value of a prop/state?** ref updated in an effect (`usePrevious`).
