/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 14 · Redux Toolkit (ReduxDemo.jsx)

   Files in this folder tell the whole story:
     store.js        — configureStore (provided in main.jsx)
     walletSlice.js  — createSlice: state + reducers + actions + selectors
     catalogSlice.js — createAsyncThunk: async lifecycle
     this file       — components consuming it via useSelector/useDispatch

   WHAT YOU SEE IN THE BROWSER
   A points wallet with Earn / Redeem / Reset buttons, a history list
   that appears once you click, and a "Fetch catalog" button that shows
   the loading → success/failure lifecycle of an async thunk.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① WalletPanel — reads the balance with useSelector(selectPoints) and
      dispatches the sync actions earned / redeemed / reset from
      walletSlice.js
   ② HistoryPanel — a SEPARATE useSelector subscription (selectHistory);
      proves each component re-renders only when ITS slice of state
      changes
   ③ CatalogPanel — dispatches the fetchCatalog async thunk from
      catalogSlice.js and renders its status: loading / failed /
      succeeded
   ④ ReduxDemo — the page component: assembles ①–③ and ends with the
      one-way-data-loop card (the interview answer)

   INGREDIENTS USED HERE (what & why)
   • useSelector — subscribe a component to one piece of store state;
     re-renders only when that value changes (①, ②, ③)
   • useDispatch — get the dispatch function to send actions to the
     store (①, ③)
   • slice actions (earned, redeemed, reset) — auto-generated action
     creators from walletSlice.js; dispatching them runs the reducers
   • selectors (selectPoints, selectHistory, selectCatalog) — small
     functions that know the state shape so components don't have to
   • fetchCatalog (async thunk) — one dispatch that emits pending /
     fulfilled / rejected actions around a fetch (③)
   • conditional rendering + .map/key — show error / list per status
     (②, ③)

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// react-redux = the React bindings: useSelector reads store state, useDispatch sends actions.
import { useDispatch, useSelector } from 'react-redux';
// Action creators + selectors come from the slice files — components never hard-code state shape.
import { earned, redeemed, reset, selectPoints, selectHistory } from './walletSlice.js';
import { fetchCatalog, selectCatalog } from './catalogSlice.js';

// ─── ① Wallet panel — sync actions (earned / redeemed / reset) ───
function WalletPanel() {
  // useSelector SUBSCRIBES this component to the store: it re-renders ONLY
  // when the selected value changes (reference/strict equality) — this
  // fine-grained subscription is Redux's perf edge over raw context.
  const points = useSelector(selectPoints);
  const dispatch = useDispatch(); // the store's dispatch function ≈ NgRx Store.dispatch

  return (
    <div className="card">
      <h3>Wallet slice — sync actions</h3>
      <p>
        Balance: <strong>{points.toLocaleString()} pts</strong>
      </p>
      {/* earned(500) only BUILDS the action object; dispatch() actually sends it to the store. */}
      <button onClick={() => dispatch(earned(500))}>Earn 500</button>
      <button onClick={() => dispatch(redeemed(800))}>Redeem 800</button>
      <button className="secondary" onClick={() => dispatch(reset())}>Reset</button>
      <p className="muted">
        dispatch(earned(500)) → {'{'} type: 'wallet/earned', payload: 500 {'}'} → reducer → new
        state → subscribed components re-render.
      </p>
    </div>
  );
}

// ─── ② History panel — an independent store subscription ───
// Separate component to show independent subscription: WalletPanel does NOT
// re-render when only history changes elsewhere (and vice versa).
function HistoryPanel() {
  const history = useSelector(selectHistory);
  if (history.length === 0) return null; // returning null = render nothing at all
  return (
    <div className="card">
      <h3>History (separate subscription)</h3>
      <ul>
        {/* key={i} (index) is OK here: rows are stateless text, and the list only ever
            appends or fully clears (Reset unmounts ALL rows together, so none can inherit
            a wrong neighbor's state). Reordering/removing SOME rows, or rows with their
            own state, would make index keys a bug (see concept 04). */}
        {history.map((h, i) => (
          <li key={i} className={h.type === 'earn' ? 'success' : 'error'}>
            {h.type} {h.amount} pts
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── ③ Catalog panel — async thunk lifecycle ───
function CatalogPanel() {
  // Object destructuring of the whole catalog slice. Because selectCatalog returns the slice
  // object, this component re-renders whenever ANY catalog field changes.
  const { items, status, error } = useSelector(selectCatalog);
  const dispatch = useDispatch();

  return (
    <div className="card">
      <h3>Async thunk — pending / fulfilled / rejected</h3>
      {/* ONE dispatch kicks off the whole pending→fulfilled/rejected lifecycle. disabled
          while loading blocks double-fetches; the label is a ternary on status. */}
      <button onClick={() => dispatch(fetchCatalog())} disabled={status === 'loading'}>
        {status === 'loading' ? 'Loading…' : 'Fetch catalog'}
      </button>
      {/* Render by status — && shows a branch only while its condition is true. */}
      {status === 'failed' && <p className="error">{error}</p>}
      {status === 'succeeded' && (
        <ul>
          {items.slice(0, 4).map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── ④ The page — assembles ①–③ plus the data-loop card ───
export default function ReduxDemo() {
  return (
    <>
      <h2>14 · Redux Toolkit</h2>
      <WalletPanel />
      <HistoryPanel />
      <CatalogPanel />
      {/* ─── ④ The one-way data loop (interview answer) ─── */}
      <div className="card">
        <h3>The one-way data loop (say this out loud in interviews)</h3>
        <pre>{`UI event → dispatch(action) → middleware (thunks) → reducers
   → new immutable state → useSelector subscribers re-render → UI

NgRx mapping: Store→store · Actions→actions · Reducers→reducers
Selectors→selectors · Effects→thunks/RTK-listener · facade→custom hook`}</pre>
      </div>
    </>
  );
}
