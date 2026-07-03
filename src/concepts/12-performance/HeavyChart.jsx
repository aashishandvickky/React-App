/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — HeavyChart.jsx
   A pretend-"heavy" component: a tiny CSS bar chart built from the
   stub product data, no chart library involved.
   Used by: PerformanceDemo.jsx (loaded on button click).
   Why it exists: to be code-split — imported via lazy(() =>
   import('./HeavyChart.jsx')), so Vite puts it in a separate JS chunk.
   How: the chunk downloads only the first time the component renders.
   ───────────────────────────────────────────────────────────────────── */
import products from '../../data/products.json';

export default function HeavyChart() {
  const max = Math.max(...products.map((p) => p.points));
  return (
    <div>
      <p className="success">✔ This component arrived in its own JS chunk.</p>
      {/* A tiny CSS bar chart from the stub data — no chart lib needed. */}
      {products.slice(0, 8).map((p) => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 3 }}>
          <span style={{ width: 170 }} className="muted">{p.name}</span>
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
