/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — useDebouncedValue.js
   A reusable custom hook: give it a fast-changing value, it returns a
   copy that only updates after the value stops changing for X ms.
   Used by: CustomHooksDemo.jsx (search box) and the capstone (19).
   Why it exists: avoid firing expensive work (searches, filters) on
   every keystroke. How: an effect starts a timer on each change and
   the cleanup cancels the previous one — only the last timer fires.
   ───────────────────────────────────────────────────────────────────── */
import { useEffect, useState } from 'react';

/**
 * useDebouncedValue — returns `value`, but only after it has stopped
 * changing for `delayMs`. The classic search-box hook.
 *
 * Angular/RxJS analogy: valueChanges.pipe(debounceTime(300)).
 * In React the same idea is an effect with a timer + cleanup.
 */
export function useDebouncedValue(value, delayMs = 300) { // = 300 is a default parameter
  // Internal state holding the lagging copy; it starts equal to the live value.
  const [debounced, setDebounced] = useState(value);

  // This effect re-runs on EVERY change of `value` — that's the whole trick: each run
  // cancels the previous timer (cleanup below) and starts a fresh one.
  useEffect(() => {
    // setTimeout schedules the copy for later and returns an id we can cancel with.
    const id = setTimeout(() => setDebounced(value), delayMs);
    // Cleanup runs when `value` changes again BEFORE the timer fires,
    // cancelling the stale timer — that's the debounce.
    // Interview: forget this cleanup and you get a delayed ECHO of every keystroke instead
    // of just the last one — the classic debounce-hook bug.
    return () => clearTimeout(id);
  }, [value, delayMs]); // deps: re-run when the live value (or the delay) changes

  // When the timer finally fires, setDebounced re-renders the calling component.
  return debounced;
}
