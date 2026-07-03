import { useState } from 'react';

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
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue; // corrupt JSON / storage blocked → fall back
    }
  });

  // Wrapper setter that mirrors useState's API (accepts value OR updater fn)
  // and persists on every change.
  const setStoredValue = (next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      try {
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
