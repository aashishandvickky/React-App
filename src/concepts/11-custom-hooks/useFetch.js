/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — useFetch.js
   A reusable custom hook: give it a URL, it returns { data, error,
   loading } and keeps them up to date, refetching when the URL changes.
   Used by: CustomHooksDemo.jsx (posts list).
   Why it exists: every component that fetches needs the same three
   states — write that dance once. How: an effect runs fetch with an
   AbortController and cancels the stale request on url change/unmount.
   ───────────────────────────────────────────────────────────────────── */
import { useEffect, useState } from 'react';

/**
 * useFetch — the "wrap async data in a hook" pattern every team hand-rolls
 * before adopting TanStack Query. Encapsulates: loading/error/data states,
 * refetch-on-url-change, aborting stale requests.
 */
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    // Reset for the NEW url (this effect re-runs whenever url changes).
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        // Aborts are expected (unmount / url changed mid-flight) — not errors.
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    // Abort the in-flight request when url changes or component unmounts.
    // This is what prevents the classic "old response overwrites new" race.
    return () => controller.abort();
  }, [url]);

  return { data, error, loading };
}
