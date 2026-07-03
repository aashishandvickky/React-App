/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — useLocalStorage.js
   A reusable custom hook: works exactly like useState (same [value,
   setter] pair) but the value also survives page reloads.
   Used by: CustomHooksDemo.jsx (nickname box).
   Why it exists: persisting a bit of state is a chore worth writing
   once. How: reads localStorage once on mount (lazy initializer) and
   a wrapped setter writes every new value back as JSON.
   ───────────────────────────────────────────────────────────────────── */
import { useState } from 'react'; // custom hooks are built FROM the built-in ones

/**
 * useLocalStorage — useState that survives page reloads.
 *
 * A CUSTOM HOOK is just a function that (a) starts with "use" and
 * (b) calls other hooks. It shares LOGIC, not state: every component
 * calling it gets its own independent state. (Angular analogy: the
 * reusable-service role, minus the singleton-ness.)
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initializer: read localStorage ONCE on mount, not every render.
  const [value, setValue] = useState(() => {
    // try/catch: localStorage can throw (private mode, quota) and JSON.parse throws on garbage.
    try {
      const stored = window.localStorage.getItem(key); // a string, or null if the key is absent
      // Ternary: found something → parse the JSON string back into a value; else the default.
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue; // corrupt JSON / storage blocked → fall back
    }
  });

  // Wrapper setter that mirrors useState's API (accepts value OR updater fn)
  // and persists on every change.
  const setStoredValue = (next) => {
    // Functional form of setValue: we need `prev` in hand to resolve updater functions.
    setValue((prev) => {
      // `next` may be a plain value OR an updater fn (like setCount(c => c + 1)); typeof tells.
      const resolved = typeof next === 'function' ? next(prev) : next;
      try {
        // localStorage stores only strings — JSON.stringify serializes any value first.
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* storage full/blocked — state still works in-memory */
      }
      return resolved;
    });
  };

  // Return the same tuple shape as useState — familiar API, drop-in swap.
  return [value, setStoredValue];
}
