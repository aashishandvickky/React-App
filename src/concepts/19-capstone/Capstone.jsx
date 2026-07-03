/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 19 · ★ Capstone: Rewards Store (Capstone.jsx)

   WHAT YOU SEE IN THE BROWSER
   A tiny but complete rewards store: a points balance (persists across
   page reloads), a search box + category dropdown, a filterable product
   table with "Add" buttons, a cart with a running total and a Redeem
   button, and a list of exercises to extend the app yourself.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   This ONE file composes almost every earlier concept. The pieces:
   ① CartContext + cartReducer — the cart's "mini-Redux": all cart
      changes (added / removed / emptied) go through one pure reducer
      function. Taught in concept 09 (useReducer) + 08 (Context).
   ② CartProvider — holds the cart with useReducer, computes the
      derived total, and shares { lines, totalPoints, dispatch } with
      every descendant via context. Taught in concept 08.
   ③ useCart — a tiny custom hook that reads the context and throws a
      helpful error if used outside the provider. Concepts 08 + 11.
   ④ SearchControls (widget 1) — controlled search input + category
      dropdown; the state lives in the parent (lifted up) because the
      grid needs it too. Taught in concept 05 (forms) + 03 (state).
   ⑤ ProductGrid (widget 2) — debounces the search term (custom hook,
      concept 11), then derives the visible rows with useMemo (concepts
      02 + 10). Renders a keyed table (concept 04); "Add" dispatches to ①.
   ⑥ CartPanel (widget 3) — reads the cart via ③, computes canAfford
      (derived state), removes lines, and redeems. Concept 04's
      conditional rendering: empty-cart message vs the list.
   ⑦ Capstone — the page (default export). Owns search/category state,
      keeps the balance in localStorage via a custom hook (concept 11),
      and wraps everything in <CartProvider> so all three widgets share
      one cart. Ends with the on-page exercises card.

   INGREDIENTS USED HERE (what & why)
   • useReducer — cart state machine; like a single NgRx reducer.
   • createContext / useContext — share the cart app-wide without prop
     drilling; like providing a service and injecting it.
   • useMemo — (a) stabilizes the context value in ②, (b) caches the
     filtered product list in ⑤.
   • useState — search text, category, and (via hooks) balance.
   • useDebouncedValue — custom hook from concept 11; waits 300ms of
     typing silence before filtering.
   • useLocalStorage — custom hook from concept 11; makes the balance
     survive a page reload.
   • products.json — build-time stub data import (no server).

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   Suggested reading order (bottom-up, like the data flows):
   reducer ① → provider ② → hook ③ → widgets ④⑤⑥ → page ⑦.
   ═══════════════════════════════════════════════════════════════════════ */
import { createContext, useContext, useMemo, useReducer, useState } from 'react';
import products from '../../data/products.json';
import { useDebouncedValue } from '../11-custom-hooks/useDebouncedValue.js';
import { useLocalStorage } from '../11-custom-hooks/useLocalStorage.js';

// ---------- Cart state: reducer + context (mini-Redux, concept 08+09) ----
// ─── ① CartContext + cartReducer — every cart change goes through here ───
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

// ─── ② CartProvider — owns the cart state, shares it via context ───
function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  // Derived values computed once here, shared via context.
  const totalPoints = lines.reduce((sum, l) => sum + l.points * l.qty, 0);
  const value = useMemo(() => ({ lines, totalPoints, dispatch }), [lines, totalPoints]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── ③ useCart — custom hook to read the cart context safely ───
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

// ---------- Widgets --------------------------------------------------------
// ─── ④ SearchControls — controlled search input + category dropdown ───
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

// ─── ⑤ ProductGrid — debounced, memoized filtering + keyed table rows ───
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

// ─── ⑥ CartPanel — reads the cart via useCart, redeems against balance ───
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
// ─── ⑦ Capstone — the page: composes ④⑤⑥ inside the CartProvider ② ───
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

      {/* ─── ④ on screen: the search box + category dropdown ─── */}
      <SearchControls search={search} onSearch={setSearch} category={category} onCategory={setCategory} />

      {/* ─── ⑤ on screen: the product table ─── */}
      <div className="card">
        <h3>Catalog</h3>
        <ProductGrid search={search} category={category} />
      </div>

      {/* ─── ⑥ on screen: the cart ─── */}
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
