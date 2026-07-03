/**
 * CONCEPT 19 — ★ CAPSTONE: Rewards Store
 * Everything combined into one small, realistic feature:
 *   useReducer + Context (cart)   · custom hooks (debounce, localStorage)
 *   useMemo (filtering)           · controlled inputs (search/filter)
 *   derived state                 · list keys · conditional rendering
 * Read bottom-up: reducer → provider → widgets → page.
 */
import { createContext, useContext, useMemo, useReducer, useState } from 'react';
import products from '../../data/products.json';
import { useDebouncedValue } from '../11-custom-hooks/useDebouncedValue.js';
import { useLocalStorage } from '../11-custom-hooks/useLocalStorage.js';

// ---------- Cart state: reducer + context (mini-Redux, concept 08+09) ----
const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'added': {
      const existing = state.find((line) => line.id === action.product.id);
      return existing
        ? state.map((line) =>
            line.id === action.product.id ? { ...line, qty: line.qty + 1 } : line
          )
        : [...state, { ...action.product, qty: 1 }];
    }
    case 'removed':
      return state.filter((line) => line.id !== action.id);
    case 'emptied':
      return [];
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}

function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  // Derived values computed once here, shared via context.
  const totalPoints = lines.reduce((sum, l) => sum + l.points * l.qty, 0);
  const value = useMemo(() => ({ lines, totalPoints, dispatch }), [lines, totalPoints]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

// ---------- Widgets --------------------------------------------------------
function SearchControls({ search, onSearch, category, onCategory }) {
  // Controlled inputs (concept 05); state lives in the parent (lifted up)
  // because ProductGrid needs it too.
  return (
    <div className="card">
      <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search rewards…" />
      <select value={category} onChange={(e) => onCategory(e.target.value)}>
        {['All', 'Electronics', 'Home', 'Fitness'].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}

function ProductGrid({ search, category }) {
  const { dispatch } = useCart();
  // Debounced so filtering doesn't run on every keystroke (concept 11).
  const debouncedSearch = useDebouncedValue(search, 300);

  // Derived, memoized filtering (concepts 02 + 10) — never stored in state.
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [debouncedSearch, category]
  );

  if (visible.length === 0) return <p className="muted">No rewards match.</p>;

  return (
    <table>
      <thead>
        <tr><th>Reward</th><th>Category</th><th>Points</th><th /></tr>
      </thead>
      <tbody>
        {visible.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td><span className="badge">{p.category}</span></td>
            <td>{p.points.toLocaleString()}</td>
            <td><button onClick={() => dispatch({ type: 'added', product: p })}>Add</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CartPanel({ balance, onCheckout }) {
  const { lines, totalPoints, dispatch } = useCart();
  const canAfford = totalPoints <= balance;

  if (lines.length === 0) return <p className="muted">Cart is empty — add some rewards.</p>;
  return (
    <>
      <ul>
        {lines.map((l) => (
          <li key={l.id}>
            {l.name} × {l.qty} = {(l.points * l.qty).toLocaleString()} pts{' '}
            <button className="secondary" onClick={() => dispatch({ type: 'removed', id: l.id })}>✕</button>
          </li>
        ))}
      </ul>
      <p>
        Total: <strong>{totalPoints.toLocaleString()} pts</strong>{' '}
        {!canAfford && <span className="error">— insufficient balance!</span>}
      </p>
      <button disabled={!canAfford} onClick={() => { onCheckout(totalPoints); dispatch({ type: 'emptied' }); }}>
        Redeem
      </button>
    </>
  );
}

// ---------- Page ------------------------------------------------------------
export default function Capstone() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  // Balance persists across reloads (custom hook, concept 11).
  const [balance, setBalance] = useLocalStorage('lab:balance', 5000);

  return (
    <CartProvider>
      <h2>19 · ★ Capstone — Rewards Store</h2>
      <p>
        Balance: <strong className="success">{balance.toLocaleString()} pts</strong>{' '}
        <button className="secondary" onClick={() => setBalance((b) => b + 1000)}>+1000 (persisted)</button>
      </p>

      <SearchControls search={search} onSearch={setSearch} category={category} onCategory={setCategory} />

      <div className="card">
        <h3>Catalog</h3>
        <ProductGrid search={search} category={category} />
      </div>

      <div className="card">
        <h3>Cart (context + reducer)</h3>
        <CartPanel balance={balance} onCheckout={(spent) => setBalance((b) => b - spent)} />
      </div>

      <div className="card">
        <h3>Exercises — extend this yourself</h3>
        <pre>{`1. Persist the cart with useLocalStorage (swap useReducer's init).
2. Add a checkout confirmation modal using a portal (concept 17).
3. Move the cart from context+reducer into the Redux store (concept 14).
4. Add /19-capstone/product/:id detail routes (concept 13).
5. Wrap ProductGrid in an error boundary and make a row throw (concept 16).
6. Write a test: add-to-cart updates the total (see __tests__ examples).`}</pre>
      </div>
    </CartProvider>
  );
}
