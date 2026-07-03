/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 06 · useEffect & Lifecycle (Effects.jsx)

   WHAT YOU SEE IN THE BROWSER
   Four cards: two counter buttons with a log showing which effects fire,
   a live clock you can mount/unmount, a short list of posts fetched from
   a JSON file, and a cheat card on when NOT to use an effect.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① DependencyDemo — two counters + a log proving WHEN each of three
      effects re-runs (no array / empty [] / [a]).
   ② Clock — starts a 1-second timer and cleans it up on unmount.
   ③ CleanupDemo — a button that mounts/unmounts the Clock so you can
      watch the cleanup actually happen.
   ④ FetchDemo — the classic "fetch data on mount" pattern, with
      AbortController to cancel a request mid-flight.
   ⑤ Effects — the page component that stacks the demos in order.
   ⑥ A cheat card: cases where an effect is the WRONG tool.

   INGREDIENTS USED HERE (what & why)
   • useEffect — run code AFTER render to sync with OUTSIDE systems
     (timers, fetch, the document). The hook people misuse most: it is
     NOT "lifecycle methods", though deps let you emulate ngOnInit ([])
     and ngOnChanges ([a]).
   • useState  — the counters, the log lines, the clock time, the posts,
     and the loading/error status.
   • Cleanup functions — the `return () => …` inside an effect
     ≈ ngOnDestroy, but it also runs before every re-run of that effect.
   • useRef — one tiny guard flag in ①: the no-array effect writes state,
     so it must skip the one extra render ("echo") its own write causes, or
     it loops forever ("Maximum update depth exceeded"). Refs → concept 07.

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// useEffect: run code AFTER render to talk to the outside world; useState: the values on screen.
// useRef: a mutable box that survives renders — used as a loop-guard flag in ① (full story: concept 07).
import { useEffect, useRef, useState } from 'react';

// ─── ① DependencyDemo — dependency array = when the effect re-runs ───
function DependencyDemo() {
  const [a, setA] = useState(0); // two independent counters…
  const [b, setB] = useState(0); // …so you can see which effect cares about which state
  const [log, setLog] = useState([]); // the lines printed in the <pre> below
  // Helper: append a line, immutably (= build a NEW array, never edit the old one).
  // The functional update gets the current array (l); .slice(-6) copies its last 6
  // entries; the spread ... puts them into a NEW array together with msg.
  const push = (msg) => setLog((l) => [...l.slice(-6), msg]);

  // Guard for the no-array effect below. Careful: that effect SETS state (a log
  // line), setting state causes a render, and a render re-runs the effect… →
  // infinite loop, React's "Maximum update depth exceeded". Classic interview trap!
  // The fix is a ref flag BECAUSE changing a ref does not itself re-render: the
  // effect can mark "the next render is just my own echo — don't log that one".
  const skipEcho = useRef(false);

  // No array: after EVERY render. Rarely what you want — and if it also sets
  // state (like this logger), it MUST bail out somewhere or it loops forever.
  useEffect(() => {
    if (skipEcho.current) { skipEcho.current = false; return; } // echo render → don't log it
    skipEcho.current = true; // the push below causes one more render; skip logging that one
    push('effect: every render');
  });

  // []: after the FIRST render only (≈ ngOnInit).
  // (In dev StrictMode it runs twice on purpose — see NOTES.md.)
  useEffect(() => {
    push('effect: mount only []');
  }, []);

  // [a]: after renders where `a` changed (≈ ngOnChanges for one input).
  useEffect(() => {
    push(`effect: a changed → ${a}`);
  }, [a]);

  return (
    <div className="card">
      <h3>Dependency array</h3>
      {/* Click → setState → re-render → THEN the effects whose deps changed run again. */}
      <button onClick={() => setA(a + 1)}>a = {a}</button>
      <button onClick={() => setB(b + 1)} className="secondary">b = {b} (watch which effects fire)</button>
      {/* .join('\n') glues the log lines with newlines; <pre> preserves them. */}
      <pre>{log.join('\n')}</pre>
    </div>
  );
}

// ─── ② Clock — timer with cleanup (≈ ngOnDestroy, but per effect-run) ───
function Clock() {
  // Lazy initializer: useState(() => …) runs the fn ONCE on mount, not on every render.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Browser timer: every 1000 ms, put a fresh Date into state → the clock re-renders.
    const id = setInterval(() => setNow(new Date()), 1000);
    // The RETURNED function is the cleanup. It runs before the next run of
    // this effect AND on unmount. Forget it → leaked interval, setState on
    // an unmounted component, duplicate subscriptions.
    return () => clearInterval(id);
  }, []); // subscribe once, clean up on unmount

  return <p>⏰ {now.toLocaleTimeString()}</p>;
}

// ─── ③ CleanupDemo — the button that mounts/unmounts the Clock ───
function CleanupDemo() {
  const [mounted, setMounted] = useState(true); // is <Clock /> currently in the tree?
  return (
    <div className="card">
      <h3>Cleanup — mount/unmount the clock</h3>
      {/* Functional update (m => !m): toggle safely off the current value. */}
      <button onClick={() => setMounted((m) => !m)}>
        {mounted ? 'Unmount clock' : 'Mount clock'}
      </button>
      {/* Conditional render: unmounting triggers the cleanup. */}
      {mounted && <Clock />}
    </div>
  );
}

// ─── ④ FetchDemo — fetching with an effect (the canonical pattern) ───
function FetchDemo() {
  const [posts, setPosts] = useState([]); // the fetched rows; starts empty
  const [status, setStatus] = useState('loading'); // loading | error | ready

  useEffect(() => {
    // AbortController cancels the request if the component unmounts (or deps change)
    // while the request is still running ("mid-flight"). That prevents race conditions
    // (a SLOW old response arriving late and overwriting newer data) and state-after-unmount.
    const controller = new AbortController();

    // The effect callback itself must NOT be async (it must return the
    // cleanup, not a Promise) — so define an async fn inside and call it.
    async function load() {
      try {
        // await pauses until the response arrives; the signal ties the request to our controller.
        const res = await fetch('/data/posts.json', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch does NOT throw on 404/500
        setPosts(await res.json()); // parse the JSON body, store it → re-render
        setStatus('ready');
      } catch (err) {
        // Our own abort() lands here too — ignore it; only real failures flip to error.
        if (err.name !== 'AbortError') setStatus('error');
      }
    }
    load(); // start it; no await ("fire-and-forget") — the setState calls above report the result

    return () => controller.abort(); // cleanup: cancel the request if we unmount mid-flight
  }, []); // fetch once on mount

  // Early returns = a third conditional-render pattern: exactly ONE branch renders per status.
  if (status === 'loading') return <div className="card">Loading posts…</div>;
  if (status === 'error') return <div className="card error">Failed to load.</div>;
  return (
    <div className="card">
      <h3>Fetch-on-mount (from /public/data/posts.json — no DB)</h3>
      <ul>
        {/* .slice(0, 3) copies the first 3 posts; .map renders them; key={p.id} from the data. */}
        {posts.slice(0, 3).map((p) => (
          <li key={p.id}><strong>{p.title}</strong> — {p.body}</li>
        ))}
      </ul>
      <p className="muted">Fuller fetching patterns (races, params) → concept 15.</p>
    </div>
  );
}

// ─── ⑤ Effects — the page component that stacks the demos in order ───
export default function Effects() {
  return (
    <>
      <h2>06 · useEffect & Lifecycle</h2>
      <DependencyDemo />
      <CleanupDemo />
      <FetchDemo />
      {/* ─── ⑥ Cheat card — cases where an effect is the WRONG tool ─── */}
      <div className="card">
        <h3>When NOT to use an effect (huge interview signal)</h3>
        <pre>{`// ❌ deriving state in an effect — extra render, sync bugs
useEffect(() => setFullName(first + ' ' + last), [first, last]);
// ✅ just compute it in render
const fullName = first + ' ' + last;

// ❌ reacting to a button click with state+effect chains
// ✅ put the logic in the event handler itself`}</pre>
      </div>
    </>
  );
}
