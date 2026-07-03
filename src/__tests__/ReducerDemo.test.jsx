/**
 * TESTING A FULL USER FLOW — form input + list updates.
 * Shows the query priority ladder: getByRole > getByLabelText >
 * getByPlaceholderText > getByText > getByTestId (last resort).
 */
// Destructured named imports from React Testing Library (RTL):
// render() mounts the component into jsdom; screen queries the result
// (Angular: TestBed.createComponent + fixture.debugElement queries).
import { render, screen } from '@testing-library/react';
// Default import — the realistic user-interaction simulator (typing, clicking...).
import userEvent from '@testing-library/user-event';
// The component under test — a DEFAULT export, so no braces here.
import ReducerDemo from '../concepts/09-reducer/ReducerDemo.jsx';

// describe/it are Vitest globals, same structure as Jasmine.
// `async () => {...}` is an async arrow function — lets us `await` user actions inside.
describe('ReducerDemo todo list (concept 09)', () => {
  it('adds a todo through the form', async () => {
    // Mount the whole component — reducer, form, list. No mocking of internals.
    // Interview: test behavior, not implementation (we never touch the reducer directly).
    render(<ReducerDemo />);
    // setup() returns a "user" object; its methods return Promises, hence the awaits.
    const user = userEvent.setup();

    // user.type fires a full keystroke sequence into the input (keydown, input, keyup...).
    // getByPlaceholderText finds the input by its placeholder — mid-ladder query, used
    // here because this input has no <label>. `await` waits for typing + re-renders.
    await user.type(screen.getByPlaceholderText('what to learn next?'), 'Learn testing');
    // getByRole('button', { name }) — accessibility-first query; finds the submit button
    // exactly as a screen-reader user would.
    await user.click(screen.getByRole('button', { name: 'Add' }));

    // The new item is rendered; queryBy* returns null instead of throwing —
    // use it for "does NOT exist" assertions.
    // getByText (used here) THROWS if missing, which gives a helpful failure message.
    // toBeInTheDocument is a jest-dom matcher: "this element exists in the DOM".
    expect(screen.getByText('Learn testing')).toBeInTheDocument();
  });

  it('toggling a todo strikes it through and updates the remaining count', async () => {
    // Each `it` re-mounts fresh — no shared state leaks between tests.
    render(<ReducerDemo />);
    const user = userEvent.setup();

    // Seed data (todos.json) has 3 not-done items.
    // getByText with a REGEX (/3 remaining/) matches partial text anywhere in an element.
    expect(screen.getByText(/3 remaining/)).toBeInTheDocument();

    // A checkbox's accessible "name" comes from its label text — so we can target
    // ONE specific todo's checkbox by its label, just like a user reading the list.
    await user.click(screen.getByRole('checkbox', { name: /Master useEffect cleanup/i }));

    // Asserting on derived UI output (the count), not on reducer state — behavior, not internals.
    expect(screen.getByText(/2 remaining/)).toBeInTheDocument();
  });

  it('clear done removes completed todos', async () => {
    render(<ReducerDemo />);
    const user = userEvent.setup();

    // Click dispatches the reducer's "clear done" action under the hood — we only
    // interact through the UI, never call dispatch() ourselves.
    await user.click(screen.getByRole('button', { name: 'Clear done' }));

    // Seed data has 2 done items; they should be gone now.
    // queryByText returns null when absent (getBy* would throw), so it pairs with
    // .not.toBeInTheDocument() — `.not` negates any matcher, like Jasmine's .not.
    expect(screen.queryByText('Read JSX basics notes')).not.toBeInTheDocument();
    // And the not-done item survives — proves we removed only completed todos.
    expect(screen.getByText('Master useEffect cleanup')).toBeInTheDocument();
  });
});
