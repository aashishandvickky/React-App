/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 10 · Memoization (MemoizationDemo.jsx)

   WHAT YOU SEE IN THE BROWSER
   A product table with category buttons, an "unrelated state" toggle, a
   memoized expensive total, and a cheat card. Click the toggle and watch
   the rows' "rendered @" timestamps NOT change — that's memo working.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① expensiveTotal — a helper that deliberately burns ~120ms so you can
      FEEL when it re-runs (and when useMemo skips it).
   ② ProductRow — a table row wrapped in React.memo: it skips
      re-rendering when its props are shallow-equal (≈ OnPush).
   ③ MemoizationDemo — the page component: three pieces of state, a
      useMemo'd filter + total, and a useCallback'd buy handler.
   ④ The interactive card — category buttons, the unrelated toggle, and
      the table of memoized rows.
   ⑤ The cheat card — the dependency chain that makes memo work, and
      why one inline prop ruins it.

   INGREDIENTS USED HERE (what & why)
   • React.memo  — wraps ProductRow so rows only re-render when their
     own props change, not when the parent re-renders.
   • useMemo     — caches the filtered list and the 120ms total so
     toggling unrelated state doesn't redo the heavy work.
   • useCallback — keeps handleBuy the SAME function object across
     renders; without it, memo(ProductRow) would see a "new" prop and
     re-render anyway.
   • useState    — category, the unrelated dark toggle, and bought ids.
   Golden rule: React is fast; re-renders are usually fine. Memoize for
   (a) expensive computation or (b) a stable reference. Measure first.

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
import { memo, useCallback, useMemo, useState } from 'react';
import products from '../../data/products.json';

// ─── ① expensiveTotal — artificially slow so useMemo's effect is visible ───
function expensiveTotal(items) {
  const t0 = performance.now();
  while (performance.now() - t0 < 120) {
    /* burn ~120ms to simulate heavy work */
  }
  return items.reduce((sum, p) => sum + p.price, 0);
}

// ─── ② ProductRow — a row wrapped in React.memo ───
// React.memo: skips re-rendering when props are SHALLOW-EQUAL to last time.
// ≈ OnPush change detection. Works only if props keep stable references!
const ProductRow = memo(function ProductRow({ product, onBuy }) {
  return (
    <tr>
      <td>{product.name}</td>
      <td>${product.price}</td>
      <td>
        <button onClick={() => onBuy(product.id)}>Buy</button>
      </td>
      {/* Re-render indicator: random suffix changes ONLY when this row renders. */}
      <td className="muted">rendered @ {new Date().toLocaleTimeString()}</td>
    </tr>
  );
});

// ─── ③ MemoizationDemo — state + useMemo + useCallback wiring ───
export default function MemoizationDemo() {
  const [category, setCategory] = useState('Electronics');
  const [dark, setDark] = useState(true); // unrelated state to force re-renders
  const [bought, setBought] = useState([]);

  // useMemo: recompute ONLY when deps change. Toggling `dark` re-renders this
  // component but skips the 120ms burn — compare by removing useMemo.
  const filtered = useMemo(
    () => products.filter((p) => p.category === category),
    [category]
  );
  const total = useMemo(() => expensiveTotal(filtered), [filtered]);

  // useCallback: stable FUNCTION reference. Without it, a new onBuy is created
  // every render, so memo(ProductRow) sees "new prop" and re-renders anyway.
  // useCallback(fn, deps) === useMemo(() => fn, deps).
  const handleBuy = useCallback((id) => {
    setBought((b) => [...b, id]); // functional update → no `bought` dep needed
  }, []);

  return (
    <>
      <h2>10 · Memoization</h2>

      {/* ─── ④ The interactive card — buttons, toggle, memoized rows ─── */}
      <div className="card">
        <h3>Try it: the unrelated toggle should NOT re-render rows</h3>
        {['Electronics', 'Home', 'Fitness'].map((c) => (
          <button key={c} className={c === category ? '' : 'secondary'} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
        <button className="secondary" onClick={() => setDark((d) => !d)}>
          Unrelated state: {dark ? '🌙' : '☀️'} (watch the "rendered @" column not change)
        </button>

        <table style={{ marginTop: 8 }}>
          <tbody>
            {filtered.map((p) => (
              <ProductRow key={p.id} product={p} onBuy={handleBuy} />
            ))}
          </tbody>
        </table>
        <p>
          Category total (expensive calc, memoized): <strong>${total.toFixed(2)}</strong>
        </p>
        <p className="muted">Bought ids: {bought.join(', ') || '(none)'}</p>
      </div>

      {/* ─── ⑤ The cheat card — what makes memo actually work ─── */}
      <div className="card">
        <h3>The dependency chain that makes memo work</h3>
        <pre>{`memo(Child) only helps if EVERY prop is reference-stable:
  objects/arrays  → useMemo
  functions       → useCallback
  primitives      → already fine (compared by value)

One inline prop ruins it:
  <ProductRow onBuy={(id) => buy(id)} />   // ❌ new fn each render → memo useless

And DON'T memoize everything: each memo/useMemo costs memory + a
comparison on every render. Measure first (React DevTools Profiler).`}</pre>
      </div>
    </>
  );
}
