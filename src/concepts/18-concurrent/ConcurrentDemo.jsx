/**
 * CONCEPT 18 — CONCURRENT FEATURES (React 18+)
 * useTransition & useDeferredValue: mark heavy updates as NON-URGENT so
 * urgent updates (typing!) stay instant. React renders the slow part in
 * the background and can abandon it if new input arrives.
 */
import { useDeferredValue, useMemo, useState, useTransition } from 'react';

// A deliberately heavy list: each row burns a little CPU while rendering.
function SlowList({ query }) {
  const items = useMemo(() => {
    const out = [];
    for (let i = 0; i < 250; i++) {
      const t0 = performance.now();
      while (performance.now() - t0 < 1) { /* ~1ms per row = ~250ms total */ }
      out.push(`${query || '∅'} — result ${i + 1}`);
    }
    return out;
  }, [query]);

  return (
    <ul style={{ maxHeight: 150, overflowY: 'auto' }}>
      {items.map((it) => <li key={it}>{it}</li>)}
    </ul>
  );
}

/** WITHOUT concurrency: one state drives input + heavy list → typing janks. */
function JankyDemo() {
  const [text, setText] = useState('');
  return (
    <div className="card">
      <h3>❌ Blocking — type fast, feel the lag</h3>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="every keystroke renders 250 slow rows" />
      <SlowList query={text} />
    </div>
  );
}

/** useTransition: split ONE event into urgent + non-urgent state updates. */
function TransitionDemo() {
  const [text, setText] = useState('');       // urgent: the input echo
  const [query, setQuery] = useState('');     // non-urgent: drives the slow list
  const [isPending, startTransition] = useTransition();

  return (
    <div className="card">
      <h3>✅ useTransition — input stays instant</h3>
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value); // urgent — applied immediately
          startTransition(() => {
            // non-urgent — rendered in background, interruptible by new input
            setQuery(e.target.value);
          });
        }}
        placeholder="type fast — no jank"
      />
      {isPending && <span className="badge">rendering…</span>}
      <SlowList query={query} />
    </div>
  );
}

/** useDeferredValue: same idea when you only RECEIVE a value (e.g. a prop). */
function DeferredDemo() {
  const [text, setText] = useState('');
  // deferredText "lags behind" text while React is busy; the list renders
  // with the old value first, then catches up in a background render.
  const deferredText = useDeferredValue(text);
  const stale = text !== deferredText;

  return (
    <div className="card">
      <h3>✅ useDeferredValue — defer a received value</h3>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type fast" />
      {stale && <span className="badge">list is catching up…</span>}
      <div style={{ opacity: stale ? 0.5 : 1 }}>
        <SlowList query={deferredText} />
      </div>
    </div>
  );
}

export default function ConcurrentDemo() {
  return (
    <>
      <h2>18 · Concurrent Features</h2>
      <JankyDemo />
      <TransitionDemo />
      <DeferredDemo />
      <div className="card">
        <h3>Mental model</h3>
        <pre>{`React 18's concurrent renderer can PAUSE, RESUME, or THROW AWAY a
render. Urgent updates (typing, clicks) interrupt non-urgent ones
(transitions). Nothing is shown half-done — React always commits a
consistent tree.

useTransition    → you own the setState; wrap it: startTransition(() => setX(...))
useDeferredValue → you only receive the value; defer your copy of it
Both need createRoot (React 18+). Debounce delays work; transitions
just deprioritize it — work starts immediately but stays interruptible.`}</pre>
      </div>
    </>
  );
}
