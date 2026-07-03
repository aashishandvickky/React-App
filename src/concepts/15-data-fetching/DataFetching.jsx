/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 15 · Data Fetching (DataFetching.jsx)

   WHAT YOU SEE IN THE BROWSER
   Two interactive cards: a search box that demonstrates the classic
   "stale response" race condition (with a checkbox to turn the fix on),
   and two buttons that load data sequentially vs in parallel and show
   the timing difference. A final card lists the real-world tools.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① slowFetch — a helper that adds random delay to fetch(), so the
      race condition is easy to reproduce on purpose.
   ② RaceConditionDemo — the search card. Typing fires one request per
      keystroke; with random latency an OLD request can finish LAST and
      overwrite the correct results. The checkbox enables the fix:
      AbortController cancels the stale request in the effect cleanup.
   ③ ParallelDemo — the waterfall-vs-parallel card. Two independent
      requests: `await` one after the other (slow) vs Promise.all (fast).
   ④ DataFetching — the page component. Stacks ② and ③ plus a card on
      what production apps actually use (TanStack Query / SWR / RTK Query).

   INGREDIENTS USED HERE (what & why)
   • useState — holds the search term, results, and timing numbers.
   • useEffect — runs the fetch when `term` changes; its CLEANUP function
     aborts the previous request (this is the whole race-condition fix).
   • AbortController — browser API to cancel an in-flight fetch (one
     that started but hasn't finished yet); its
     `signal` is passed into fetch(). (Angular: like unsubscribing /
     switchMap cancelling the previous HTTP request.)
   • Promise.all — fires independent requests together instead of one
     after another.
   • fetch of static JSON — /public/data/*.json acts as a fake API;
     there is no real server in this project.

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md

   All data comes from static JSON in /public/data — no server, no DB.
   Covers: the race condition every senior interview asks about, and
   dependent (waterfall vs parallel) requests.
   ═══════════════════════════════════════════════════════════════════════ */
// Only two hooks needed — data fetching here is plain browser fetch() + useEffect
// (no HttpClient service; the React part is just WHEN to run and how to clean up).
import { useEffect, useState } from 'react';

// ─── ① slowFetch — a fetch() with random delay ───
// Fakes a variable network delay (latency), so the race is easy to reproduce on purpose.
function slowFetch(url, signal) {
  const delay = 300 + Math.random() * 1200; // 300–1500ms, different for every request
  // Hand-built Promise: WE decide when it settles. resolve/reject are its two exit doors.
  return new Promise((resolve, reject) => {
    // After the delay, run the real fetch; .then(resolve, reject) forwards its outcome.
    const t = setTimeout(() => fetch(url, { signal }).then(resolve, reject), delay);
    // ?. (optional chaining): skip this line entirely when signal is undefined (fix OFF).
    signal?.addEventListener('abort', () => {
      clearTimeout(t); // cancel the pending timer…
      reject(new DOMException('aborted', 'AbortError')); // …and fail like a real aborted fetch
    });
  });
}

// ─── ② RaceConditionDemo — the search card with the stale-response bug ───
/**
 * THE RACE CONDITION.
 * Type "use" quickly: requests for "u", "us", "use" all fly. With random
 * latency, "us" may resolve LAST and overwrite the correct "use" results.
 * Toggle the fix to see AbortController cancel stale requests.
 */
function RaceConditionDemo() {
  const [term, setTerm] = useState('');           // what the user has typed
  const [results, setResults] = useState([]);     // the list shown below the input
  const [servedBy, setServedBy] = useState('');   // which request's response painted the UI
  const [fixEnabled, setFixEnabled] = useState(false); // checkbox: abort stale requests?

  // Runs after render whenever term or fixEnabled changed (the deps array at the bottom).
  useEffect(() => {
    // Empty input: clear the UI and bail — no request, so no cleanup needed for this run.
    if (!term) {
      setResults([]);
      setServedBy('');
      return;
    }
    // One fresh controller per request; controller.abort() cancels any fetch using its signal.
    const controller = new AbortController();
    // Only pass the signal when the fix is ON, so you can observe the bug.
    const signal = fixEnabled ? controller.signal : undefined;

    // .then chaining instead of async/await — an effect callback can't be async itself:
    // React expects it to return a cleanup function, and async would return a Promise.
    // (No res.ok check here: static dev files can't 404; see catalogSlice.js for that pattern.)
    slowFetch('/data/search-index.json', signal)
      .then((res) => res.json()) // parse the JSON body — returns another Promise
      .then((index) => {
        // Fake search: find an index key the term starts with; ?? null when nothing matches.
        const key = Object.keys(index).find((k) => term.toLowerCase().startsWith(k)) ?? null;
        setResults(key ? index[key] : []);
        setServedBy(term); // which request actually painted this UI?
      })
      .catch(() => {}); // swallow the AbortError thrown by cancelled requests

    // CLEANUP runs before the effect re-runs (next keystroke) and on unmount — aborting the
    // now-stale request. Interview: this is React's switchMap-style cancellation.
    return () => controller.abort(); // no-op for the buggy variant
  }, [term, fixEnabled]);

  const stale = servedBy && servedBy !== term; // truthy when an OLD response painted the UI

  return (
    <div className="card">
      <h3>The classic race condition</h3>
      <label>
        <input type="checkbox" checked={fixEnabled} onChange={(e) => setFixEnabled(e.target.checked)} />{' '}
        Fix ON (abort stale requests in cleanup)
      </label>
      <p>
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder='type "use" fast' />
      </p>
      {servedBy && (
        <p className={stale ? 'error' : 'success'}>
          Results below were produced by the request for “{servedBy}”
          {stale ? ` — but you typed “${term}”. STALE! ❌` : ' — matches input ✅'}
        </p>
      )}
      <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>
      <p className="muted">
        Alternative fix: a boolean flag (<code>let active = true</code>) flipped in cleanup —
        ignores the response instead of cancelling the request.
      </p>
    </div>
  );
}

// ─── ③ ParallelDemo — waterfall vs Promise.all ───
/** Waterfall vs parallel — Promise.all */
function ParallelDemo() {
  const [data, setData] = useState(null);
  const [ms, setMs] = useState(null);

  // async arrow function — allows await inside; both buttons call it with a flag.
  const load = async (parallel) => {
    setData(null); // clear old results so the timing readout is honest
    const t0 = performance.now(); // high-resolution timestamp (ms) to measure elapsed time
    let posts, index; // declared up front so both branches below can assign them
    if (parallel) {
      // ✅ Independent requests → fire together. Promise.all resolves to an ARRAY of results;
      // array destructuring assigns [result0, result1] into the two variables.
      [posts, index] = await Promise.all([
        fetch('/data/posts.json').then((r) => r.json()),
        fetch('/data/search-index.json').then((r) => r.json()),
      ]);
    } else {
      // ❌ Sequential await = a "waterfall": request 2 waits for request 1; total = both delays added.
      posts = await fetch('/data/posts.json').then((r) => r.json());
      index = await fetch('/data/search-index.json').then((r) => r.json());
    }
    setMs(Math.round(performance.now() - t0));
    setData({ posts: posts.length, indexKeys: Object.keys(index).length });
  };

  return (
    <div className="card">
      <h3>Waterfall vs parallel</h3>
      <button onClick={() => load(false)} className="secondary">Load sequentially</button>
      <button onClick={() => load(true)}>Load with Promise.all</button>
      {data && (
        <p className="success">
          {data.posts} posts + {data.indexKeys} index keys in ~{ms}ms
        </p>
      )}
    </div>
  );
}

// ─── ④ DataFetching — the page: stacks the demos + "real tools" card ───
export default function DataFetching() {
  return (
    <>
      <h2>15 · Data Fetching</h2>
      <RaceConditionDemo />
      <ParallelDemo />
      <div className="card">
        <h3>What production apps actually use</h3>
        <pre>{`Hand-rolled useEffect fetching (this page) teaches the mechanics, but
interviews expect you to name the real tools and WHY:

TanStack Query / SWR / RTK Query solve, out of the box:
  caching & request dedup      background revalidation
  race handling                retries & exponential backoff
  pagination/infinite scroll   optimistic updates + rollback
  "server state" lives outside components entirely

Rule of thumb: server state → TanStack Query; client/UI state →
useState/useReducer/Zustand/Redux. Don't mirror API data into Redux
by hand anymore.`}</pre>
      </div>
    </>
  );
}
