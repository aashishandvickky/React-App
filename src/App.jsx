/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — App.jsx
   The app's shell: the sidebar on the left (one link per concept, built
   from the list in concepts/registry.jsx) and the content area on the
   right, where the router swaps in whichever concept page matches the
   current URL. Angular-wise: AppComponent's template + <router-outlet>.
   Full plain-language tour of how these files connect:
   docs/HOW_THE_APP_WORKS.md
   ───────────────────────────────────────────────────────────────────── */
import { Suspense } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { CONCEPTS } from './concepts/registry.jsx';

/**
 * APP SHELL — sidebar navigation + a routed content area.
 *
 * Angular analogy: AppComponent template with <router-outlet>.
 * <Routes>/<Route> replace the Routes[] array; routes are declared in JSX.
 *
 * Every concept page is lazy-loaded (see registry.jsx), so this file also
 * demonstrates route-based CODE SPLITTING with <Suspense> as the fallback UI.
 */
export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>⚛️ React Interview Lab</h1>
        <p className="muted">
          Each page = one concept. Read the code + NOTES.md side by side.
        </p>
        <nav>
          {/* NavLink adds the "active" class automatically — like routerLinkActive. */}
          {CONCEPTS.map((c) => (
            // KEY: stable identity for list items so React can reconcile efficiently.
            <NavLink key={c.path} to={c.path}>
              {c.title}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        {/* Suspense shows a fallback while a lazy chunk downloads. */}
        <Suspense fallback={<p className="muted">Loading chunk…</p>}>
          <Routes>
            <Route path="/" element={<Navigate to={CONCEPTS[0].path} replace />} />
            {CONCEPTS.map((c) => (
              // "path/*" lets a concept define its own nested routes (see 13-router).
              <Route key={c.path} path={`${c.path}/*`} element={<c.Component />} />
            ))}
            <Route path="*" element={<h2>404 — no route matched</h2>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
