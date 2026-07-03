/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 19 · ★ Capstone: Rewards Store (Capstone.jsx)

   WHAT YOU SEE IN THE BROWSER
   A tiny but complete rewards store: a points balance (persists across
   page reloads), a search box + category dropdown, a filterable product
   table with "Add" buttons, a cart with a running total and a Redeem
   button, and a list of exercises to extend the app yourself.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   This ONE file composes (combines small parts into one page) almost
   every earlier concept. The pieces:
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
     drilling (passing props down through every level by hand); like
     providing a service and injecting it.
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
// Everything the page composes: context (concept 08), reducer (09), memo (10), state (03).
import { createContext, useContext, useMemo, useReducer, useState } from 'react';
// Build-time JSON import (Vite bundles it) — the catalog data, no server involved.
import products from '../../data/products.json';
// Custom hooks reused straight from concept 11 (named exports → curly braces).
import { useDebouncedValue } from '../11-custom-hooks/useDebouncedValue.js';
import { useLocalStorage } from '../11-custom-hooks/useLocalStorage.js';

// ---------- Cart state: reducer + context (mini-Redux, concept 08+09) ----
// ─── ① CartContext + cartReducer — every cart change goes through here ───
// createContext(null): the channel widgets subscribe to; null is what a consumer sees
// if it renders OUTSIDE the provider (③ turns that into a helpful error).
const CartContext = createContext(null);

// A pure (state, action) → next-state function, exactly like an NgRx/Redux reducer.
// It never mutates: every branch returns a NEW array.
function cartReducer(state, action) {
  switch (action.type) { // action.type names what happened (past tense, like NgRx events)
    case 'added': {
      // .find with an arrow function: the first cart line matching this product, or undefined.
      const existing = state.find((line) => line.id === action.product.id);
      // Ternary return. Already in the cart → .map builds a new array where only the matched
      // line is replaced by a spread copy ({ ...line }) with qty bumped. Not in the cart →
      // spread the old lines into a new array and append { ...product copy, qty: 1 }.
      return existing
        ? state.map((line) =>
            line.id === action.product.id ? { ...line, qty: line.qty + 1 } : line
          )
        : [...state, { ...action.product, qty: 1 }];
    }
    case 'removed':
      // .filter keeps every line EXCEPT the one with the removed id.
      return state.filter((line) => line.id !== action.id);
    case 'emptied':
      return []; // redeeming clears the whole cart
    default:
      // Template literal (backticks + ${…}). Loud failure beats silently ignoring a typo.
      throw new Error(`Unknown action ${action.type}`);
  }
}

// ─── ② CartProvider — owns the cart state, shares it via context ───
// `children` (destructured prop) = whatever the provider wraps (≈ ng-content).
function CartProvider({ children }) {
  // useReducer (concept 09): returns [current state, dispatch]; [] = start with an empty cart.
  const [lines, dispatch] = useReducer(cartReducer, []);
  // Derived values computed once here, shared via context.
  // .reduce sums points × qty over all lines — derived from `lines`, never stored as state.
  const totalPoints = lines.reduce((sum, l) => sum + l.points * l.qty, 0);
  // useMemo (concept 10) keeps the context object's identity stable across renders, so
  // consumers re-render only when the cart really changes. { lines } = shorthand for lines: lines.
  const value = useMemo(() => ({ lines, totalPoints, dispatch }), [lines, totalPoints]);
  // The Provider (concept 08) makes `value` readable by ANY descendant — no prop drilling.
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── ③ useCart — custom hook to read the cart context safely ───
function useCart() {
  const ctx = useContext(CartContext); // read the nearest provider's value (≈ inject(CartService))
  // Outside the provider, ctx is the createContext default (null) → fail with a clear message.
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

// ---------- Widgets --------------------------------------------------------
// ─── ④ SearchControls — controlled search input + category dropdown ───
// Destructured props: value + callback pairs, the React version of @Input()/@Output() pairs.
function SearchControls({ search, onSearch, category, onCategory }) {
  // Controlled inputs (concept 05: React state supplies each value); the state
  // lives in the parent — "lifted up" — because ProductGrid needs the same values too.
  return (
    <div className="card">
      <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search rewards…" />
      <select value={category} onChange={(e) => onCategory(e.target.value)}>
        {/* Map an inline array to <option>s; each string is unique, so it's also the key. */}
        {['All', 'Electronics', 'Home', 'Fitness'].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}

// ─── ⑤ ProductGrid — debounced, memoized filtering + keyed table rows ───
function ProductGrid({ search, category }) {
  const { dispatch } = useCart(); // object destructuring: this widget only needs dispatch
  // Debounced so filtering doesn't run on every keystroke (concept 11).
  const debouncedSearch = useDebouncedValue(search, 300);

  // Derived = computed on the fly (concept 02); memoized = cached (concept 10).
  // The filtered list is never stored in state — it's recomputed when inputs change.
  // Rule: category matches (or 'All') AND the name contains the search text —
  // both sides lowercased so the match is case-insensitive.
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [debouncedSearch, category]
  );

  // Early return = conditional rendering (concept 04): show an empty state, skip the table.
  if (visible.length === 0) return <p className="muted">No rewards match.</p>;

  return (
    <table>
      <thead>
        <tr><th>Reward</th><th>Category</th><th>Points</th><th /></tr>
      </thead>
      <tbody>
        {/* Keyed rows (concept 04): p.id tells React which <tr> is which across renders.
            toLocaleString formats 12345 as 12,345. The Add button dispatches an action to
            the cart reducer ① — context means no callback props to thread through. */}
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
  const { lines, totalPoints, dispatch } = useCart(); // shared cart from context — no props
  // Derived state: recomputed each render from cart total + balance, never stored.
  const canAfford = totalPoints <= balance;

  if (lines.length === 0) return <p className="muted">Cart is empty — add some rewards.</p>;
  return (
    <>
      <ul>
        {/* Keyed list again; {' '} forces a space JSX would otherwise drop between lines. */}
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
      {/* Redeem does two things: tells the PARENT to subtract points (onCheckout callback —
          the child never touches balance directly) and dispatches 'emptied' to the reducer. */}
      <button disabled={!canAfford} onClick={() => { onCheckout(totalPoints); dispatch({ type: 'emptied' }); }}>
        Redeem
      </button>
    </>
  );
}

// ---------- Page ------------------------------------------------------------
// ─── ⑦ Capstone — the page: composes ④⑤⑥ inside the CartProvider ② ───
export default function Capstone() {
  // Lifted state (concept 03): the page owns search/category because BOTH ④ (edits them)
  // and ⑤ (filters by them) need the same values.
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  // Balance persists across reloads (custom hook, concept 11).
  const [balance, setBalance] = useLocalStorage('lab:balance', 5000);

  // Wrapping the page in <CartProvider> (②) is what lets ④⑤⑥ below share ONE cart.
  return (
    <CartProvider>
      <h2>19 · ★ Capstone — Rewards Store</h2>
      {/* The +1000 button uses the updater form setBalance(b => b + 1000); the custom hook
          also writes the new value to localStorage, so it survives a reload. */}
      <p>
        Balance: <strong className="success">{balance.toLocaleString()} pts</strong>{' '}
        <button className="secondary" onClick={() => setBalance((b) => b + 1000)}>+1000 (persisted)</button>
      </p>

      {/* ─── ④ on screen: the search box + category dropdown ─── */}
      {/* State down (search/category), events up (the set… functions passed as callbacks). */}
      <SearchControls search={search} onSearch={setSearch} category={category} onCategory={setCategory} />

      {/* ─── ⑤ on screen: the product table ─── */}
      <div className="card">
        <h3>Catalog</h3>
        <ProductGrid search={search} category={category} />
      </div>

      {/* ─── ⑥ on screen: the cart ─── */}
      <div className="card">
        <h3>Cart (context + reducer)</h3>
        {/* onCheckout is a callback prop (≈ @Output): the child reports how much was spent;
            the parent — the owner of balance — does the subtracting. */}
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
