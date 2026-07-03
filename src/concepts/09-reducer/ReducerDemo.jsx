/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 09 · useReducer (ReducerDemo.jsx)

   WHAT YOU SEE IN THE BROWSER
   A working todo list (add, check off, delete, clear done) plus a cheat
   card comparing useState and useReducer. Every click on the todo list
   dispatches an action — watch the "remaining" count update.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① todosReducer — a PURE function (state, action) → newState. All the
      update logic lives here: added / toggled / deleted / cleared_done.
   ② ReducerDemo — the component: wires useReducer to the reducer, plus
      handleAdd which reads the form and dispatches an 'added' action.
   ③ The todo-list card — the form and the <ul>; each checkbox / ✕
      button dispatches its own action instead of setting state directly.
   ④ The cheat card — when to pick useState vs useReducer.

   INGREDIENTS USED HERE (what & why)
   • useReducer — useState's big sibling for COMPLEX state: many related
     transitions, next state depending on previous. Same pattern as
     Redux/NgRx but local to one component — the stepping stone to
     concept 14 (Redux Toolkit).
   • dispatch   — sends an action OBJECT describing "what happened";
     the reducer decides how state changes. Its identity never changes.
   • JSON stub data — initialTodos imported from src/data/todos.json
     (this app has no backend by design).

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
import { useReducer } from 'react'; // the only React API this file needs
// Vite imports JSON directly — at build time this becomes a plain JS array of todo objects.
import initialTodos from '../../data/todos.json';

// ─── ① todosReducer — all update logic in one pure function ───
// The REDUCER: (state, action) -> newState. MUST be pure:
// no mutation, no side effects, no Date.now()/random inside.
// All update logic lives here — testable without rendering anything.
function todosReducer(state, action) {
  // switch on the action's type string — one case per kind of "thing that happened".
  switch (action.type) {
    case 'added':
      // Spread [...state] copies the array, then one new todo object is appended — never .push()!
      return [...state, { id: action.id, text: action.text, done: false }];
    case 'toggled':
      // .map builds a NEW array; the ternary copies ({ ...t }) the matching todo with `done`
      // flipped, and passes every other todo through unchanged.
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'deleted':
      // .filter keeps every todo EXCEPT the matching id — deletion without mutation.
      return state.filter((t) => t.id !== action.id);
    case 'cleared_done':
      // Same trick: keep only the todos that aren't done yet.
      return state.filter((t) => !t.done);
    default:
      // Unknown actions are a bug — fail loudly.
      // Template literal: backticks + ${…} interpolation (JS's String.format).
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// ─── ② ReducerDemo — wire useReducer + the add handler ───
export default function ReducerDemo() {
  // dispatch sends an action OBJECT describing "what happened";
  // the reducer decides how state changes. Compare with useState where
  // the event handler itself computes the next state.
  // Signature: useReducer(reducerFn, initialState) → [state, dispatch], destructured here.
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  // Submit handler, written as an arrow function stored in a const (the usual React style).
  const handleAdd = (e) => {
    e.preventDefault(); // stop the browser's full-page form POST
    const input = e.target.elements.newTodo; // uncontrolled, read on submit
    // .trim() strips whitespace; an empty string is falsy → ignore blank submits.
    if (!input.value.trim()) return;
    // Interview: Date.now() inside the reducer would break its purity — so the impure bit
    // (minting an id) happens HERE in the handler and travels inside the action object.
    dispatch({ type: 'added', id: Date.now(), text: input.value.trim() });
    input.value = ''; // clear the box by hand — it's uncontrolled, React isn't tracking it
  };

  // Derived data: recomputed from `todos` on every render — never stored as extra state.
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <>
      <h2>09 · useReducer</h2>

      {/* ─── ③ The todo-list card — every change is a dispatched action ─── */}
      <div className="card">
        <h3>Todo list — every change is a dispatched action</h3>
        <form onSubmit={handleAdd}>
          <input name="newTodo" placeholder="what to learn next?" />
          <button type="submit">Add</button>
          {/* type="button" stops this one from submitting the form; its click dispatches an
              action with no payload — the reducer only needs the type string. */}
          <button
            type="button"
            className="secondary"
            onClick={() => dispatch({ type: 'cleared_done' })}
          >
            Clear done
          </button>
        </form>

        <ul>
          {/* List rendering (concept 04): key={t.id} gives each row a stable identity. */}
          {todos.map((t) => (
            <li key={t.id}>
              <label style={{ display: 'inline' }}>
                {/* Controlled checkbox: checked comes from state (t.done); onChange dispatches
                    'toggled' with this todo's id — the reducer flips it, React re-renders. */}
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

      {/* ─── ④ The cheat card — useState vs useReducer ─── */}
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
