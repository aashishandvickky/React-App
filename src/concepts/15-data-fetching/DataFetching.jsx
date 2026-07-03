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
   • AbortController — browser API to cancel an in-flight fetch; its
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
import { useEffect, useState } from 'react';

// ─── ① slowFetch — a fetch() with random delay ───
// Simulated variable network latency so races are reproducible.
function slowFetch(url, signal) {
  const delay = 300 + Math.random() * 1200;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => fetch(url, { signal }).then(resolve, reject), delay);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('aborted', 'AbortError'));
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
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [servedBy, setServedBy] = useState('');
  const [fixEnabled, setFixEnabled] = useState(false);

  useEffect(() => {
    if (!term) {
      setResults([]);
      setServedBy('');
      return;
    }
    const controller = new AbortController();
    // Only pass the signal when the fix is ON, so you can observe the bug.
    const signal = fixEnabled ? controller.signal : undefined;

    slowFetch('/data/search-index.json', signal)
      .then((res) => res.json())
      .then((index) => {
        const key = Object.keys(index).find((k) => term.toLowerCase().startsWith(k)) ?? null;
        setResults(key ? index[key] : []);
        setServedBy(term); // which request actually painted this UI?
      })
      .catch(() => {});

    return () => controller.abort(); // no-op for the buggy variant
  }, [term, fixEnabled]);

  const stale = servedBy && servedBy !== term;

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

  const load = async (parallel) => {
    setData(null);
    const t0 = performance.now();
    let posts, index;
    if (parallel) {
      // ✅ Independent requests → fire together.
      [posts, index] = await Promise.all([
        fetch('/data/posts.json').then((r) => r.json()),
        fetch('/data/search-index.json').then((r) => r.json()),
      ]);
    } else {
      // ❌ Sequential await = waterfall; total = sum of latencies.
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
