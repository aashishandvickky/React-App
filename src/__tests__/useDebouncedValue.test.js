/**
 * TESTING CUSTOM HOOKS — renderHook + fake timers.
 *
 * Hooks can't be called outside a component, so RTL's renderHook mounts a
 * tiny test component for you. Timer-based logic uses vi.useFakeTimers()
 * so tests are instant and deterministic (same result every run).
 *
 * act(...) wraps anything that triggers state updates, so React finishes
 * ("flushes") the resulting re-renders before you assert.
 */
// Destructured named imports from React Testing Library:
// renderHook — mounts a hook inside a hidden test component (there's no UI to render);
// act — flushes React state updates before we assert (Angular: think fixture.detectChanges).
import { act, renderHook } from '@testing-library/react';
// The custom hook under test — a named export, hence the braces.
import { useDebouncedValue } from '../concepts/11-custom-hooks/useDebouncedValue.js';

// describe/it/beforeEach are Vitest globals — same lifecycle hooks as Jasmine.
describe('useDebouncedValue (concept 11)', () => {
  // `vi` is Vitest's utility object (like `jasmine`/`jest`). Fake timers replace
  // setTimeout etc. so WE control time — Angular analogy: fakeAsync + tick.
  // `() => vi.useFakeTimers()` — arrow function with no braces returns the expression.
  beforeEach(() => vi.useFakeTimers());
  // Always restore real timers so later tests in THIS file aren't affected.
  // (Vitest runs each test FILE in its own isolated environment, so leaks stay within a file.)
  afterEach(() => vi.useRealTimers());

  it('returns the initial value immediately', () => {
    // Destructure `result` from renderHook's return. renderHook calls our hook with
    // these args and captures whatever it returns.
    // `() => useDebouncedValue('hello', 300)` — the wrapper renderHook runs on each render.
    const { result } = renderHook(() => useDebouncedValue('hello', 300));
    // result.current always holds the hook's LATEST return value — it updates on
    // every re-render (not a frozen copy taken at mount).
    // toBe = strict equality (===), like Jasmine's toBe. No delay on first render.
    expect(result.current).toBe('hello');
  });

  it('only updates after the delay of silence', () => {
    // initialProps lets us change the hook's input across renders.
    // Destructure BOTH result and rerender. `({ value }) => ...` destructures the
    // props object right in the arrow function's parameter list.
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } }
    );

    // rerender(newProps) re-renders the hidden test component with new props —
    // simulates a parent passing a changed value (like updating an @Input in Angular).
    rerender({ value: 'ab' });
    rerender({ value: 'abc' }); // rapid changes — timer keeps resetting

    // Before 300ms of quiet: still the ORIGINAL value.
    // advanceTimersByTime(299) fast-forwards fake time — Vitest's version of
    // Angular's fakeAsync tick(299).
    // Wrapped in act() because firing the timer would trigger a React state update.
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('a');

    // 300ms after the LAST change: the newest value lands (intermediate
    // 'ab' was skipped — that's the debounce).
    // Interview: debounce waits for quiet; throttle fires at a steady rate.
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('abc');
  });
});
