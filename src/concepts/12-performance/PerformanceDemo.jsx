/**
 * CONCEPT 12 — PERFORMANCE PATTERNS
 * Beyond memoization (concept 10): code splitting, list virtualization,
 * and state colocation. These are the "how would you optimize a slow
 * React app?" answers.
 */
import { Suspense, lazy, useMemo, useState } from 'react';

// ---------- 1) Code splitting with lazy/Suspense --------------------------
// This chart component is in its own chunk; it downloads only when rendered.
// (Every sidebar page in this app is ALSO lazy — see registry.jsx.)
const HeavyChart = lazy(() => import('./HeavyChart.jsx'));

function CodeSplittingDemo() {
  const [show, setShow] = useState(false);
  return (
    <div className="card">
      <h3>1 · Code splitting — lazy + Suspense</h3>
      <p className="muted">
        Open DevTools → Network, then click. A separate JS chunk loads on demand.
      </p>
      <button onClick={() => setShow(true)}>Load chart component</button>
      {show && (
        <Suspense fallback={<p className="muted">Downloading chunk…</p>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

// ---------- 2) Windowing / virtualization (hand-rolled mini version) -----
// Real apps use react-window / @tanstack/react-virtual — but interviewers
// love asking HOW it works: render only the rows inside the viewport.
function VirtualListDemo() {
  const ROW_HEIGHT = 28;
  const VIEWPORT = 280;
  const TOTAL = 10000;

  const [scrollTop, setScrollTop] = useState(0);
  const rows = useMemo(
    () => Array.from({ length: TOTAL }, (_, i) => `Transaction #${i + 1} — ${(i * 7) % 500} pts`),
    []
  );

  // The whole trick: from scroll position, compute the visible slice…
  const start = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleCount = Math.ceil(VIEWPORT / ROW_HEIGHT) + 2; // +overscan
  const visible = rows.slice(start, start + visibleCount);

  return (
    <div className="card">
      <h3>2 · Virtualization — 10,000 rows, ~12 DOM nodes</h3>
      <div
        style={{ height: VIEWPORT, overflowY: 'auto', border: '1px solid var(--border)' }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        {/* Spacer div gives the scrollbar the full height… */}
        <div style={{ height: TOTAL * ROW_HEIGHT, position: 'relative' }}>
          {/* …and we absolutely position only the visible rows inside it. */}
          {visible.map((text, i) => (
            <div
              key={start + i}
              style={{ position: 'absolute', top: (start + i) * ROW_HEIGHT, height: ROW_HEIGHT }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
      <p className="muted">Production: react-window or @tanstack/react-virtual.</p>
    </div>
  );
}

// ---------- 3) State colocation ------------------------------------------
function StateColocationDemo() {
  return (
    <div className="card">
      <h3>3 · State colocation — the cheapest optimization</h3>
      <pre>{`Move state DOWN to the smallest component that needs it.
If a search input's state lives in the page component, every
keystroke re-renders the whole page. Move it into <SearchBox> and
only <SearchBox> re-renders.

Corollary: lift state up only as far as necessary, and pass
expensive subtrees as {children} — children props from a parent
that didn't re-render are reused as-is.`}</pre>
    </div>
  );
}

export default function PerformanceDemo() {
  return (
    <>
      <h2>12 · Performance Patterns</h2>
      <CodeSplittingDemo />
      <VirtualListDemo />
      <StateColocationDemo />
      <div className="card">
        <h3>The interview checklist for "app is slow, what do you do?"</h3>
        <pre>{`1. MEASURE — React DevTools Profiler; find what re-renders and why
2. Colocate state / split components
3. memo + useMemo/useCallback on measured hot paths (concept 10)
4. Virtualize long lists
5. Code-split routes & heavy widgets (lazy/Suspense)
6. Debounce expensive inputs; useTransition/useDeferredValue (concept 18)
7. Production build, bundle analysis, image/CDN concerns`}</pre>
      </div>
    </>
  );
}
