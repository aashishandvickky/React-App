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
  const [data, setData] = useState(null); // the parsed JSON once it arrives
  const [error, setError] = useState(null); // an error message string, or null
  const [loading, setLoading] = useState(true); // true until a response or an error lands

  useEffect(() => {
    // AbortController = a cancel handle: pass its .signal to fetch, call .abort() to cancel.
    const controller = new AbortController();
    // Reset for the NEW url (this effect re-runs whenever url changes).
    setLoading(true);
    setError(null);

    // fetch returns a Promise; each .then runs when the previous async step finishes.
    fetch(url, { signal: controller.signal })
      .then((res) => {
        // Gotcha: fetch does NOT reject on HTTP errors (404/500) — check res.ok ourselves.
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json(); // parsing the body is async too — it feeds the next .then
      })
      .then((json) => {
        // Success: store the data and stop the spinner (React batches these two updates).
        setData(json);
        setLoading(false);
      })
      // .catch handles BOTH network failures and the throw above.
      .catch((err) => {
        // Aborts are expected (unmount / url changed mid-flight) — not errors.
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    // Abort the in-flight request when url changes or component unmounts.
    // This is what prevents the classic "old response overwrites new" race.
    // Interview: "how do you cancel a fetch on unmount?" — exactly this cleanup.
    return () => controller.abort();
  }, [url]); // dep: re-run the whole dance whenever the url argument changes

  // Object property SHORTHAND: { data } means { data: data }. Callers destructure this.
  return { data, error, loading };
}
