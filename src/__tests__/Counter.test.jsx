/**
 * TESTING 101 — React Testing Library (RTL) + Vitest.
 *
 * RTL philosophy: test what the USER sees and does, not implementation
 * details (no reaching into state, no shallow rendering, no component
 * internals). If a refactor keeps behavior identical, tests should pass.
 *
 * Angular analogy: TestBed + fixture, but you query by role/text like a
 * user would, and fire real-ish events with user-event.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../concepts/03-state-events/StateAndEvents.jsx';

describe('Counter (concept 03)', () => {
  it('increments by one on click', async () => {
    // ARRANGE: render into a jsdom document.
    render(<Counter />);
    // user-event simulates full event sequences (pointer, focus, keyboard).
    const user = userEvent.setup();

    // Query by accessible ROLE + NAME — the preferred RTL query.
    await user.click(screen.getByRole('button', { name: '+1' }));

    // ASSERT on what the user sees.
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('demonstrates the stale-closure trap: broken +3 only adds 1', async () => {
    render(<Counter />);
    const user = userEvent.setup();

    // All three setCount(count + 1) calls read the same snapshot → +1 total.
    await user.click(screen.getByRole('button', { name: /broken/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('functional updates make +3 actually add 3', async () => {
    render(<Counter />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /functional updates/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });
});
