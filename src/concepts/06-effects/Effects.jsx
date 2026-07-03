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

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
import { useEffect, useState } from 'react';

// ─── ① DependencyDemo — dependency array = when the effect re-runs ───
function DependencyDemo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [log, setLog] = useState([]);
  const push = (msg) => setLog((l) => [...l.slice(-6), msg]);

  // No array: after EVERY render. Rarely what you want.
  useEffect(() => {
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
      <button onClick={() => setA(a + 1)}>a = {a}</button>
      <button onClick={() => setB(b + 1)} className="secondary">b = {b} (watch which effects fire)</button>
      <pre>{log.join('\n')}</pre>
    </div>
  );
}

// ─── ② Clock — timer with cleanup (≈ ngOnDestroy, but per effect-run) ───
function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
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
  const [mounted, setMounted] = useState(true);
  return (
    <div className="card">
      <h3>Cleanup — mount/unmount the clock</h3>
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
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | ready

  useEffect(() => {
    // AbortController cancels the request if the component unmounts (or deps
    // change) mid-flight — prevents race conditions and state-after-unmount.
    const controller = new AbortController();

    // The effect callback itself must NOT be async (it must return the
    // cleanup, not a Promise) — so define an async fn inside and call it.
    async function load() {
      try {
        const res = await fetch('/data/posts.json', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setPosts(await res.json());
        setStatus('ready');
      } catch (err) {
        if (err.name !== 'AbortError') setStatus('error');
      }
    }
    load();

    return () => controller.abort();
  }, []); // fetch once on mount

  if (status === 'loading') return <div className="card">Loading posts…</div>;
  if (status === 'error') return <div className="card error">Failed to load.</div>;
  return (
    <div className="card">
      <h3>Fetch-on-mount (from /public/data/posts.json — no DB)</h3>
      <ul>
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
