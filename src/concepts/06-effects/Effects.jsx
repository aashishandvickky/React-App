/**
 * CONCEPT 06 — useEffect & LIFECYCLE
 * The hook people misuse most. Effects synchronize your component with
 * OUTSIDE systems (network, timers, subscriptions, the document).
 * They are NOT "lifecycle methods" — though deps let you emulate them.
 */
import { useEffect, useState } from 'react';

// ---------- Dependency array = when the effect re-runs ------------------
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

// ---------- Cleanup (≈ ngOnDestroy, but per effect-run) ------------------
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

// ---------- Fetching with an effect (the canonical pattern) --------------
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

export default function Effects() {
  return (
    <>
      <h2>06 · useEffect & Lifecycle</h2>
      <DependencyDemo />
      <CleanupDemo />
      <FetchDemo />
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
