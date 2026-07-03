/**
 * CONCEPT 14 — REDUX TOOLKIT (RTK)
 * Files in this folder tell the whole story:
 *   store.js        — configureStore (provided in main.jsx)
 *   walletSlice.js  — createSlice: state + reducers + actions + selectors
 *   catalogSlice.js — createAsyncThunk: async lifecycle
 *   this file       — components consuming it via useSelector/useDispatch
 */
import { useDispatch, useSelector } from 'react-redux';
import { earned, redeemed, reset, selectPoints, selectHistory } from './walletSlice.js';
import { fetchCatalog, selectCatalog } from './catalogSlice.js';

function WalletPanel() {
  // useSelector SUBSCRIBES this component to the store: it re-renders ONLY
  // when the selected value changes (reference/strict equality) — this
  // fine-grained subscription is Redux's perf edge over raw context.
  const points = useSelector(selectPoints);
  const dispatch = useDispatch();

  return (
    <div className="card">
      <h3>Wallet slice — sync actions</h3>
      <p>
        Balance: <strong>{points.toLocaleString()} pts</strong>
      </p>
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

// Separate component to show independent subscription: WalletPanel does NOT
// re-render when only history changes elsewhere (and vice versa).
function HistoryPanel() {
  const history = useSelector(selectHistory);
  if (history.length === 0) return null;
  return (
    <div className="card">
      <h3>History (separate subscription)</h3>
      <ul>
        {history.map((h, i) => (
          <li key={i} className={h.type === 'earn' ? 'success' : 'error'}>
            {h.type} {h.amount} pts
          </li>
        ))}
      </ul>
    </div>
  );
}

function CatalogPanel() {
  const { items, status, error } = useSelector(selectCatalog);
  const dispatch = useDispatch();

  return (
    <div className="card">
      <h3>Async thunk — pending / fulfilled / rejected</h3>
      <button onClick={() => dispatch(fetchCatalog())} disabled={status === 'loading'}>
        {status === 'loading' ? 'Loading…' : 'Fetch catalog'}
      </button>
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

export default function ReduxDemo() {
  return (
    <>
      <h2>14 · Redux Toolkit</h2>
      <WalletPanel />
      <HistoryPanel />
      <CatalogPanel />
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
