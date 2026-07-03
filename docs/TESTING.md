# Testing React — the interview essentials

Runnable examples live in `src/__tests__/` (run `npm test`). Stack: **Vitest**
(Jest-compatible, Vite-native) + **React Testing Library** + **user-event** + jsdom.

## The philosophy (say this first)
> "The more your tests resemble the way your software is used, the more confidence
> they can give you." — Testing Library's guiding principle.

Test **behavior through the UI**, not implementation (no state inspection, no shallow
rendering, no "was this method called" for internals). Refactors that preserve behavior
shouldn't break tests. This replaced Enzyme, which encouraged implementation testing.

## Query priority ladder (asked directly in interviews)
1. `getByRole('button', { name: 'Save' })` — accessible name; best.
2. `getByLabelText` — form fields.
3. `getByPlaceholderText`, `getByText`, `getByDisplayValue`
4. `getByTestId` — last resort.

Variants: `getBy*` (throws if missing) · `queryBy*` (null if missing — for asserting
absence) · `findBy*` (async — waits, for things that appear after fetch/effects).

## Async testing
- `await screen.findByText('loaded')` — waits for appearance (retry until timeout).
- `waitFor(() => expect(...))` — waits for arbitrary assertions.
- `user-event` methods are async — always `await user.click(...)`.
- Mock the network at the fetch boundary; the standard tool is **MSW** (Mock Service
  Worker) — intercepts requests so components run real fetch code. Know the name.

## What is `act()`?
Ensures all updates (state, effects) are processed before assertions. RTL's `render`,
`user-event`, and `waitFor` already wrap in act — an "not wrapped in act" warning
usually means an update happened AFTER the test finished (missing await / unfinished async).

## Hooks
`renderHook(() => useMyHook(args))` from RTL; change inputs with `rerender`, wrap
time/state manipulation in `act`. Timer hooks → `vi.useFakeTimers()` +
`vi.advanceTimersByTime(ms)`.

## Angular → React testing map
| Angular | React |
|---|---|
| TestBed.configureTestingModule | just `render(<Comp prop={x}/>)` |
| fixture.detectChanges() | not needed — RTL flushes via act |
| DebugElement queries by CSS | queries by role/text (user-visible) |
| HttpTestingController | MSW / mocking fetch |
| Karma+Jasmine | Vitest/Jest + RTL |

## Interview questions
- RTL vs Enzyme philosophy? getBy vs queryBy vs findBy?
- How do you test async data loading? (findBy + MSW).
- How do you test a custom hook? (renderHook).
- What causes act() warnings? How do you test a debounced input? (fake timers).
