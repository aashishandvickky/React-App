/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 12 · Performance Patterns (PerformanceDemo.jsx)

   Beyond memoization (concept 10): code splitting, list virtualization,
   and state colocation. These are the "how would you optimize a slow
   React app?" answers.

   WHAT YOU SEE IN THE BROWSER
   Three cards: a button that downloads and shows a chart on demand, a
   scrollable list that claims 10,000 rows, and a text explanation of
   state colocation. A final card lists the interview checklist.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① Code splitting — HeavyChart.jsx (sibling file) is imported with
      lazy(), so it lives in its own JS chunk; CodeSplittingDemo renders
      it inside <Suspense> only after you click the button
   ② VirtualListDemo — a hand-rolled "windowed" list: 10,000 rows exist
      in an array, but only the ~12 rows inside the scroll viewport are
      actually put in the DOM (computed from the scroll position)
   ③ StateColocationDemo — no interactivity, just a card of text about
      keeping state in the smallest component that needs it
   ④ PerformanceDemo — the page component: assembles ①–③ and ends
      with the "app is slow, what do you do?" interview checklist card

   INGREDIENTS USED HERE (what & why)
   • lazy — tells the bundler "put HeavyChart in a separate file,
     download it the first time it renders" (① )
   • Suspense — shows a fallback ("Downloading chunk…") while that
     lazy chunk is still on the network (①)
   • useState — the show/hide flag in ① and the scroll position in ②
   • useMemo — builds the 10,000-row array once instead of on every
     render (②)
   • event handlers (onClick, onScroll) — flip the flag in ①, record
     scrollTop in ②
   • list rendering (.map + key) — draws the visible slice of rows in ②

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// Named imports from React: lazy + Suspense for code splitting, useState/useMemo for the demos.
import { Suspense, lazy, useMemo, useState } from 'react';

// ─── ① Code splitting with lazy + Suspense ───
// This chart component is in its own chunk; it downloads only when rendered.
// (Every sidebar page in this app is ALSO lazy — see registry.jsx.)
// import(...) is a DYNAMIC import — a function call returning a Promise of the module.
// lazy() wraps that Promise-maker into a component React can download on first render.
// Angular: loadComponent(() => import(...)) in a route config is the same idea.
const HeavyChart = lazy(() => import('./HeavyChart.jsx'));

function CodeSplittingDemo() {
  // Array destructuring: useState returns [value, setter]. false = chart not mounted yet.
  const [show, setShow] = useState(false);
  return (
    <div className="card">
      <h3>1 · Code splitting — lazy + Suspense</h3>
      <p className="muted">
        Open DevTools → Network, then click. A separate JS chunk loads on demand.
      </p>
      {/* onClick arrow function: flips show to true → re-render mounts the lazy chart below. */}
      <button onClick={() => setShow(true)}>Load chart component</button>
      {/* && rendering: nothing until show is true. HeavyChart's FIRST mount triggers the
          chunk download; Suspense shows the fallback until the code arrives. */}
      {show && (
        <Suspense fallback={<p className="muted">Downloading chunk…</p>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

// ─── ② Windowing / virtualization (hand-rolled mini version) ───
// Real apps use react-window / @tanstack/react-virtual — but interviewers
// love asking HOW it works: render only the rows inside the viewport.
function VirtualListDemo() {
  const ROW_HEIGHT = 28; // px per row — a fixed height keeps the math trivial
  const VIEWPORT = 280;  // px height of the scroll box
  const TOTAL = 10000;   // rows in the data array (NOT in the DOM)

  // Current scroll offset in px; each update recomputes which slice of rows is visible.
  const [scrollTop, setScrollTop] = useState(0);
  // useMemo + [] deps: build the 10,000 strings ONCE, not again on every scroll re-render.
  // Array.from({ length: N }, fn) calls fn(_, i) per index; `_` = ignored first argument.
  // `Transaction #${i + 1}` is a template literal — ${} interpolates values into the string.
  const rows = useMemo(
    () => Array.from({ length: TOTAL }, (_, i) => `Transaction #${i + 1} — ${(i * 7) % 500} pts`),
    []
  );

  // The whole trick: from scroll position, compute the visible slice…
  const start = Math.floor(scrollTop / ROW_HEIGHT); // index of the first row in view
  const visibleCount = Math.ceil(VIEWPORT / ROW_HEIGHT) + 2; // +overscan
  const visible = rows.slice(start, start + visibleCount); // ~12 rows — the only ones rendered

  return (
    <div className="card">
      <h3>2 · Virtualization — 10,000 rows, ~12 DOM nodes</h3>
      {/* The scroll viewport. onScroll fires as you scroll; e.currentTarget is this div, and
          its scrollTop (px scrolled) goes into state → re-render with a new visible slice. */}
      <div
        style={{ height: VIEWPORT, overflowY: 'auto', border: '1px solid var(--border)' }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        {/* Spacer div gives the scrollbar the full height… */}
        <div style={{ height: TOTAL * ROW_HEIGHT, position: 'relative' }}>
          {/* …and we absolutely position only the visible rows inside it. */}
          {/* key = start + i, the ABSOLUTE row index — stable per data row, unlike plain i. */}
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

// ─── ③ State colocation — the cheapest optimization ───
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

// ─── ④ The page — assembles ①–③ plus the interview checklist ───
export default function PerformanceDemo() {
  return (
    <>
      <h2>12 · Performance Patterns</h2>
      <CodeSplittingDemo />
      <VirtualListDemo />
      <StateColocationDemo />
      {/* ─── ④ Interview checklist card ─── */}
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
