# 16 · Error Boundaries & Class Components

## Error boundaries
A component that catches errors thrown **during rendering** of its descendants and shows
a fallback UI instead of unmounting the whole app (an uncaught render error blanks the
entire React tree!).

Requires a **class** with either/both:
- `static getDerivedStateFromError(error)` → set state to render the fallback (pure).
- `componentDidCatch(error, info)` → side effects: log to Sentry etc.

### Caught vs not caught (memorize)
| Caught | NOT caught |
|---|---|
| render of descendants | event handlers → `try/catch` |
| lifecycle methods | async code / promises / setTimeout |
| constructors | server-side rendering |
| | errors in the boundary itself |

### Placement strategy
Granular boundaries around independent widgets/routes → one crashing widget doesn't kill
the page. A top-level boundary as last resort. Reset by re-setting state (Try again) or by
changing the boundary's `key`. In real apps: the `react-error-boundary` package.

## Class components — the minimum you must know
```jsx
class Timer extends Component {
  state = { seconds: 0 };                        // state = one object
  componentDidMount() { this.id = setInterval(() => 
    this.setState(s => ({ seconds: s.seconds + 1 })), 1000); }  // ≈ useEffect(...,[])
  componentDidUpdate(prevProps) { /* ≈ effect with deps */ }
  componentWillUnmount() { clearInterval(this.id); }            // ≈ cleanup
  render() { return <p>{this.state.seconds}s</p>; }
}
```
- `this.setState` **merges** partial state; useState **replaces**.
- Handlers need binding or arrow-function class fields (`this` pitfalls).
- Lifecycle → hooks mapping: didMount+didUpdate+willUnmount ≈ one `useEffect`.

## Interview questions
- What are error boundaries and what DON'T they catch? (table).
- Why can't hooks implement one? (no hook equivalents for those two lifecycles yet).
- Difference between `getDerivedStateFromError` and `componentDidCatch`?
  (render fallback [pure] vs log side effects).
- Class vs function components; why did React move to hooks?
  (reuse via custom hooks, no `this`, colocated logic instead of lifecycle splitting).
