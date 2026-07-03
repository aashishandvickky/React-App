/**
 * TESTING A FULL USER FLOW — form input + list updates.
 * Shows the query priority ladder: getByRole > getByLabelText >
 * getByPlaceholderText > getByText > getByTestId (last resort).
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReducerDemo from '../concepts/09-reducer/ReducerDemo.jsx';

describe('ReducerDemo todo list (concept 09)', () => {
  it('adds a todo through the form', async () => {
    render(<ReducerDemo />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('what to learn next?'), 'Learn testing');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    // The new item is rendered; queryBy* returns null instead of throwing —
    // use it for "does NOT exist" assertions.
    expect(screen.getByText('Learn testing')).toBeInTheDocument();
  });

  it('toggling a todo strikes it through and updates the remaining count', async () => {
    render(<ReducerDemo />);
    const user = userEvent.setup();

    // Seed data (todos.json) has 3 not-done items.
    expect(screen.getByText(/3 remaining/)).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /Master useEffect cleanup/i }));

    expect(screen.getByText(/2 remaining/)).toBeInTheDocument();
  });

  it('clear done removes completed todos', async () => {
    render(<ReducerDemo />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Clear done' }));

    // Seed data has 2 done items; they should be gone now.
    expect(screen.queryByText('Read JSX basics notes')).not.toBeInTheDocument();
    expect(screen.getByText('Master useEffect cleanup')).toBeInTheDocument();
  });
});
