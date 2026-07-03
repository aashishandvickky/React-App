/**
 * CONCEPT 15 — DATA FETCHING PATTERNS
 * All data comes from static JSON in /public/data — no server, no DB.
 * Covers: the race condition every senior interview asks about, and
 * dependent (waterfall vs parallel) requests.
 */
import { useEffect, useState } from 'react';

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
