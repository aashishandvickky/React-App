import { useEffect, useState } from 'react';

/**
 * useDebouncedValue — returns `value`, but only after it has stopped
 * changing for `delayMs`. The classic search-box hook.
 *
 * Angular/RxJS analogy: valueChanges.pipe(debounceTime(300)).
 * In React the same idea is an effect with a timer + cleanup.
 */
export function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    // Cleanup runs when `value` changes again BEFORE the timer fires,
    // cancelling the stale timer — that's the debounce.
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
