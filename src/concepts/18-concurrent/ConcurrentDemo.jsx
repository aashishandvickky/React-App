/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 18 · Concurrent Features (ConcurrentDemo.jsx)

   WHAT YOU SEE IN THE BROWSER
   Three search boxes, each feeding the SAME deliberately slow 250-row
   list. Type fast in each one: the first box lags (janky), the other
   two stay instant because the heavy list re-renders in the background.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① SlowList — the shared "villain": burns ~1ms of CPU per row
      (~250ms per render) so the jank is impossible to miss.
   ② JankyDemo — the ❌ card. One piece of state drives BOTH the input
      and the slow list, so every keystroke pays the full 250ms.
   ③ TransitionDemo — the ✅ useTransition card. The same keystroke
      does TWO updates: an urgent one (the input echo) and a
      non-urgent one wrapped in startTransition (the slow list).
   ④ DeferredDemo — the ✅ useDeferredValue card. Same idea when you
      only RECEIVE a value: the list gets a "lagging" copy of the text
      that catches up in a background render.
   ⑤ ConcurrentDemo — the page: stacks ②③④ + a mental-model card.

   INGREDIENTS USED HERE (what & why)
   • useState — the input text in every demo (plus the separate `query`
     state in ③ that drives the slow list).
   • useTransition — returns [isPending, startTransition]; updates
     wrapped in startTransition are low priority: React renders them in
     the background and ABANDONS the render if you type again.
   • useDeferredValue — hands you a delayed copy of a value; the slow
     list renders with the old copy first, then catches up.
   • useMemo — inside ①, caches the built rows so the list only re-does
     its expensive work when `query` actually changes.
     (Angular has no direct analogy — closest is debouncing a
     valueChanges stream, but transitions START work immediately and
     merely keep it interruptible.)

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md

   Big idea (React 18+): mark heavy updates as NON-URGENT so urgent
   updates (typing!) stay instant. React renders the slow part in the
   background and can abandon it if new input arrives.
   ═══════════════════════════════════════════════════════════════════════ */
// The two concurrent hooks (useDeferredValue, useTransition) plus useMemo (cache the
// heavy row-building) and useState (input text) — all named exports of 'react'.
import { useDeferredValue, useMemo, useState, useTransition } from 'react';

// ─── ① SlowList — deliberately heavy list (~250ms per render) ───
// Each row burns a little CPU while rendering.
function SlowList({ query }) { // destructured prop: the search text the rows echo back
  // useMemo: only rebuild the 250 rows when `query` changes (deps array at the end).
  const items = useMemo(() => {
    const out = [];
    for (let i = 0; i < 250; i++) {
      const t0 = performance.now(); // high-precision timestamp (ms)
      // Busy-wait: loop doing nothing until 1ms has passed — fakes expensive per-row work.
      while (performance.now() - t0 < 1) { /* ~1ms per row = ~250ms total */ }
      // Template literal (backticks + ${…}); `query || '∅'` falls back to ∅ when empty.
      out.push(`${query || '∅'} — result ${i + 1}`);
    }
    return out;
  }, [query]);

  return (
    <ul style={{ maxHeight: 150, overflowY: 'auto' }}>
      {/* One <li> per row; each string is unique, so it doubles as the key. */}
      {items.map((it) => <li key={it}>{it}</li>)}
    </ul>
  );
}

// ─── ② JankyDemo — the blocking version (feel the lag) ───
/** WITHOUT concurrency: one state drives input + heavy list → typing lags ("jank"). */
function JankyDemo() {
  const [text, setText] = useState(''); // ONE state feeds both input and list — the problem
  return (
    <div className="card">
      <h3>❌ Blocking — type fast, feel the lag</h3>
      {/* Controlled input (concept 05): every keystroke re-renders the 250 slow rows FIRST,
          so the typed letter can't appear until the ~250ms render finishes. */}
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="every keystroke renders 250 slow rows" />
      <SlowList query={text} />
    </div>
  );
}

// ─── ③ TransitionDemo — useTransition keeps typing instant ───
/** useTransition: split ONE event into urgent + non-urgent state updates. */
function TransitionDemo() {
  const [text, setText] = useState('');       // urgent: the input echo
  const [query, setQuery] = useState('');     // non-urgent: drives the slow list
  // useTransition returns a pair: isPending (true while the background render is running)
  // and startTransition (wrap the LOW-priority setState calls inside it).
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
            // Interview: transitions are interruptible — a new keystroke ABANDONS the
            // half-done list render, so slow work never blocks typing.
            setQuery(e.target.value);
          });
        }}
        placeholder="type fast — no jank"
      />
      {/* isPending: show feedback while the deprioritized list renders behind the scenes. */}
      {isPending && <span className="badge">rendering…</span>}
      <SlowList query={query} />
    </div>
  );
}

// ─── ④ DeferredDemo — useDeferredValue for values you only receive ───
/** useDeferredValue: same idea when you only RECEIVE a value (e.g. a prop). */
function DeferredDemo() {
  const [text, setText] = useState('');
  // deferredText "lags behind" text while React is busy; the list renders
  // with the old value first, then catches up in a background render.
  const deferredText = useDeferredValue(text);
  const stale = text !== deferredText; // true while the list still shows the OLD value

  return (
    <div className="card">
      <h3>✅ useDeferredValue — defer a received value</h3>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type fast" />
      {stale && <span className="badge">list is catching up…</span>}
      {/* Ternary (cond ? a : b): dim the list while it's showing stale results. */}
      <div style={{ opacity: stale ? 0.5 : 1 }}>
        <SlowList query={deferredText} />
      </div>
    </div>
  );
}

// ─── ⑤ ConcurrentDemo — the page: all three demos + mental model ───
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
