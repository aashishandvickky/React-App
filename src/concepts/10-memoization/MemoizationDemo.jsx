/**
 * CONCEPT 10 — MEMOIZATION: React.memo, useMemo, useCallback
 * Golden rule first: React is fast; re-renders are usually fine.
 * Memoize when (a) a computation is expensive, or (b) you need a STABLE
 * REFERENCE so a memoized child / effect deps don't fire needlessly.
 */
import { memo, useCallback, useMemo, useState } from 'react';
import products from '../../data/products.json';

// Artificially slow function so the effect of useMemo is visible.
function expensiveTotal(items) {
  const t0 = performance.now();
  while (performance.now() - t0 < 120) {
    /* burn ~120ms to simulate heavy work */
  }
  return items.reduce((sum, p) => sum + p.price, 0);
}

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
