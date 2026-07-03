/**
 * TESTING CUSTOM HOOKS — renderHook + fake timers.
 *
 * Hooks can't be called outside a component, so RTL's renderHook mounts a
 * tiny test component for you. Timer-based logic uses vi.useFakeTimers()
 * so tests are instant and deterministic.
 *
 * act(...) wraps anything that triggers state updates, so React flushes
 * renders before you assert.
 */
import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from '../concepts/11-custom-hooks/useDebouncedValue.js';

describe('useDebouncedValue (concept 11)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('only updates after the delay of silence', () => {
    // initialProps lets us change the hook's input across renders.
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    rerender({ value: 'abc' }); // rapid changes — timer keeps resetting

    // Before 300ms of quiet: still the ORIGINAL value.
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('a');

    // 300ms after the LAST change: the newest value lands (intermediate
    // 'ab' was skipped — that's the debounce).
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('abc');
  });
});
