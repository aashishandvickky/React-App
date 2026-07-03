/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — HeavyChart.jsx
   A pretend-"heavy" component: a tiny CSS bar chart built from the
   stub product data, no chart library involved.
   Used by: PerformanceDemo.jsx (loaded on button click).
   Why it exists: to be code-split — imported via lazy(() =>
   import('./HeavyChart.jsx')), so Vite puts it in a separate JS chunk.
   How: the chunk downloads only the first time the component renders.
   ───────────────────────────────────────────────────────────────────── */
// Build-time JSON import: Vite bundles this stub data INTO the chunk — no network request.
import products from '../../data/products.json';

export default function HeavyChart() {
  // .map((p) => p.points) — an arrow function pulling every points value into a new array;
  // the ... spread passes those values to Math.max as separate arguments → the biggest one.
  // max is used below to scale each bar relative to the longest.
  const max = Math.max(...products.map((p) => p.points));
  return (
    <div>
      <p className="success">✔ This component arrived in its own JS chunk.</p>
      {/* A tiny CSS bar chart from the stub data — no chart lib needed. */}
      {/* slice(0, 8) = first 8 products; .map turns each into one row of JSX. Each row gets
          key={p.id} so React can track it, and style={{…}} — an inline-style OBJECT
          (outer braces = JS expression, inner braces = object literal) laying out the row. */}
      {products.slice(0, 8).map((p) => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 3 }}>
          <span style={{ width: 170 }} className="muted">{p.name}</span>
          {/* The bar itself: width is a template literal — this product's points as a
              percentage of max (scaled so the longest bar spans 60% of the row). */}
          <div
            style={{
              width: `${(p.points / max) * 60}%`,
              background: 'var(--accent)',
              height: 12,
              borderRadius: 4,
            }}
          />
          <span className="muted">{p.points}</span>
        </div>
      ))}
    </div>
  );
}
