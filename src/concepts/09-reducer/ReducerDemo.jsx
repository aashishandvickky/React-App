/**
 * CONCEPT 09 — useReducer
 * useState's big sibling for COMPLEX state: multiple sub-values, transitions
 * that depend on each other, or many update kinds. Same pattern as Redux /
 * NgRx, but local to one component. Also the stepping stone to Redux (concept 14).
 */
import { useReducer } from 'react';
import initialTodos from '../../data/todos.json';

// The REDUCER: (state, action) -> newState. MUST be pure:
// no mutation, no side effects, no Date.now()/random inside.
// All update logic lives here — testable without rendering anything.
function todosReducer(state, action) {
  switch (action.type) {
    case 'added':
      return [...state, { id: action.id, text: action.text, done: false }];
    case 'toggled':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'deleted':
      return state.filter((t) => t.id !== action.id);
    case 'cleared_done':
      return state.filter((t) => !t.done);
    default:
      // Unknown actions are a bug — fail loudly.
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function ReducerDemo() {
  // dispatch sends an action OBJECT describing "what happened";
  // the reducer decides how state changes. Compare with useState where
  // the event handler itself computes the next state.
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  const handleAdd = (e) => {
    e.preventDefault();
    const input = e.target.elements.newTodo; // uncontrolled, read on submit
    if (!input.value.trim()) return;
    dispatch({ type: 'added', id: Date.now(), text: input.value.trim() });
    input.value = '';
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <>
      <h2>09 · useReducer</h2>

      <div className="card">
        <h3>Todo list — every change is a dispatched action</h3>
        <form onSubmit={handleAdd}>
          <input name="newTodo" placeholder="what to learn next?" />
          <button type="submit">Add</button>
          <button
            type="button"
            className="secondary"
            onClick={() => dispatch({ type: 'cleared_done' })}
          >
            Clear done
          </button>
        </form>

        <ul>
          {todos.map((t) => (
            <li key={t.id}>
              <label style={{ display: 'inline' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => dispatch({ type: 'toggled', id: t.id })}
                />{' '}
                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
              </label>{' '}
              <button className="secondary" onClick={() => dispatch({ type: 'deleted', id: t.id })}>
                ✕
              </button>
            </li>
          ))}
        </ul>
        <p className="muted">{remaining} remaining (derived in render — not stored!)</p>
      </div>

      <div className="card">
        <h3>useState vs useReducer</h3>
        <pre>{`useState   → independent simple values (an input, a toggle)
useReducer → * next state depends on previous in several ways
             * many related transitions (added/toggled/deleted…)
             * you want the logic OUT of the component (pure fn → unit test)
             * stable dispatch identity (never changes — great for deps/memo)

Bonus: dispatch never changes between renders, so passing it deep
avoids the useCallback dance entirely.`}</pre>
      </div>
    </>
  );
}
