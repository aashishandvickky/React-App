# 15 · Data Fetching

> 🧭 **New here?** Best order: ① play with this concept's page in the running app,
> ② read the `.jsx` file in this folder (start with its 📖 Beginner's Map at the top),
> ③ then come back here — this file is the theory + interview layer. Confusing words →
> [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md) · exercises → [`docs/EXERCISES.md`](../../../docs/EXERCISES.md)

## The canonical useEffect fetch (memorize the shape)
```js
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(setData)
    .catch(e => { if (e.name !== 'AbortError') setError(e); });
  return () => controller.abort();
}, [url]);
```
Three states always: `loading / error / data`. Model them explicitly
(a `status` string beats two booleans — `isLoading && isError` can't happen).

## The race condition (senior-level staple)
Fast input changes fire overlapping requests; responses return **out of order**; a stale
response overwrites the fresh one. Fixes:
1. **AbortController** in effect cleanup (cancels the network call too) — preferred.
2. `let active = true; return () => { active = false; }` — ignore stale responses.
3. Debounce the input (reduces, doesn't eliminate, races) — combine with 1.
4. Use a library that handles it (TanStack Query keys requests by query key).

## Waterfalls
`await a; await b;` for independent data = serial latency. Use `Promise.all`.
Component-level fetching creates *render waterfalls* too (parent fetches → renders child →
child fetches). Router loaders / RSC / hoisting fetches fix this.

## Server state ≠ client state (the modern answer)
API data is a **cache of the server**, not app state: it can be stale, refetched,
shared across screens. TanStack Query / SWR / RTK Query own that cache: dedup, background
refetch, retries, optimistic updates. Angular analogy: what you did with RxJS
`shareReplay` + interceptors + services, as a specialized library.

## Interview questions
- Fetch on mount — where and why there? (effect = external system sync).
- Explain and fix a fetch race condition. (abort/flag above).
- Why can't the effect callback be async? (must return cleanup, not a Promise).
- REST error handling: `fetch` does NOT reject on 4xx/5xx — check `res.ok`.
- What does TanStack Query give you over useEffect fetching?
- Optimistic update: apply UI change immediately, roll back on failure.
