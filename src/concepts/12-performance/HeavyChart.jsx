/**
 * A pretend-heavy component. It only exists to be code-split:
 * imported via lazy(() => import('./HeavyChart.jsx')), so Vite puts it
 * in a separate chunk that downloads on first render.
 */
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
