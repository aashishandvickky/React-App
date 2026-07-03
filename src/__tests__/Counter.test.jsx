/**
 * TESTING 101 — React Testing Library (RTL) + Vitest.
 *
 * RTL philosophy: test what the USER sees and does, not implementation
 * details (no reaching into state, no "shallow rendering" — rendering a
 * component without its children — no component internals). If a refactor
 * keeps behavior identical, tests should pass.
 *
 * Angular analogy: TestBed + fixture, but you query by role/text like a
 * user would, and fire real-ish events with user-event.
 */
// `{ render, screen }` is DESTRUCTURING: pull two named exports out of the package object.
// @testing-library/react is RTL — the Angular-world equivalent of TestBed + fixture helpers.
// render() mounts a component; screen is a global handle to query the rendered DOM
// (like fixture.debugElement, but you query the whole document the way a user would).
import { render, screen } from '@testing-library/react';
// Default export (no braces). user-event simulates realistic user interactions —
// closer to a real browser than Angular's dispatchEvent/triggerEventHandler.
import userEvent from '@testing-library/user-event';
// The component under test — a named export, hence the braces.
import { Counter } from '../concepts/03-state-events/StateAndEvents.jsx';

// describe/it are Vitest globals (enabled in config) — same shape as Jasmine's describe/it.
// `() => { ... }` is an ARROW FUNCTION: shorthand for function () { ... }.
describe('Counter (concept 03)', () => {
  // `async` because user-event returns Promises we must await (see below).
  it('increments by one on click', async () => {
    // ARRANGE: render into a jsdom document (jsdom = a fake browser DOM running in Node).
    // <Counter /> is JSX — no TestBed module setup needed; just render it.
    render(<Counter />);
    // user-event simulates full event sequences (pointer, focus, keyboard).
    // setup() returns a "user" whose methods (click, type, ...) all return Promises.
    const user = userEvent.setup();

    // Query by accessible ROLE + NAME — the preferred RTL query.
    // getByRole finds the <button> by its accessible role and label. Why roles first?
    // Accessibility-first philosophy: if a screen reader can find it, so can your test.
    // Interview: prefer getByRole over getByText/getByTestId.
    // `await` pauses until the click (and the React re-render it triggers) finishes —
    // user-event wraps updates in act() for you, like fixture.detectChanges() built in.
    await user.click(screen.getByRole('button', { name: '+1' }));

    // ASSERT on what the user sees.
    // expect(...) is the assertion, same idea as Jasmine's expect.
    // getByTestId is the LAST-RESORT query (a data-testid hook) — fine for plain text spans.
    // toHaveTextContent is a jest-dom matcher (assertion helper): checks the rendered text.
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('demonstrates the stale-closure trap: broken +3 only adds 1', async () => {
    // Fresh render per test — Testing Library auto-unmounts after each `it` (afterEach
    // cleanup), so every test starts with an empty document. (jsdom itself persists per file.)
    render(<Counter />);
    const user = userEvent.setup();

    // All three setCount(count + 1) calls read the same snapshot → +1 total.
    // `name: /broken/i` is a REGEX match (i = case-insensitive) — handy for partial labels.
    // Interview: state updates are BATCHED (grouped into one re-render); the handler's
    // `count` is a stale CLOSURE value — the function remembers the variables from the
    // render that created it, so it still sees the old count.
    await user.click(screen.getByRole('button', { name: /broken/i }));
    // The test PROVES the bug: the display shows 1, not 3.
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('functional updates make +3 actually add 3', async () => {
    render(<Counter />);
    const user = userEvent.setup();

    // This button uses setCount(c => c + 1) three times — each updater gets the
    // LATEST value, so +3 works. Interview: functional updates fix stale closures.
    await user.click(screen.getByRole('button', { name: /functional updates/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });
});
