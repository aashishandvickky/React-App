/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — App.jsx
   The app's shell: the sidebar on the left (one link per concept, built
   from the list in concepts/registry.jsx) and the content area on the
   right, where the router swaps in whichever concept page matches the
   current URL. Angular-wise: AppComponent's template + <router-outlet>.
   Full plain-language tour of how these files connect:
   docs/HOW_THE_APP_WORKS.md
   ───────────────────────────────────────────────────────────────────── */
// { Suspense } is a NAMED import (curly braces pick one export out of the module).
// Suspense shows a placeholder while a lazy "chunk" (separately downloaded JS file) loads.
import { Suspense } from 'react';
// Router building blocks: Routes/Route declare the route table (Angular's Routes[] array),
// NavLink is a link that knows when it is active (routerLink + routerLinkActive in one),
// Navigate performs a redirect when rendered (like redirectTo in a route config).
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
// CONCEPTS: array of { path, title, Component } from the registry — drives sidebar AND routes.
import { CONCEPTS } from './concepts/registry.jsx';

/**
 * APP SHELL — sidebar navigation + a routed content area.
 *
 * Angular analogy: AppComponent template with <router-outlet>.
 * <Routes>/<Route> replace the Routes[] array; routes are declared in JSX.
 *
 * Every concept page is lazy-loaded (see registry.jsx), so this file also
 * demonstrates route-based CODE SPLITTING (each page's JS is a separate file,
 * downloaded on demand) with <Suspense> as the fallback UI.
 */
// A React component is just a function that returns JSX. `export default` lets
// main.jsx import it as `import App from './App.jsx'` (no curly braces needed).
export default function App() {
  // JSX note: className sets the HTML "class" attribute — "class" is a reserved word in JS.
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>⚛️ React Interview Lab</h1>
        <p className="muted">
          Each page = one concept. Read the code + NOTES.md side by side.
        </p>
        <nav>
          {/* NavLink adds the "active" class automatically — like routerLinkActive. */}
          {/* .map() turns each registry entry into a <NavLink> — React's *ngFor.
              (c) => (...) is an arrow function: takes one concept, returns JSX. */}
          {CONCEPTS.map((c) => (
            // KEY: a stable identity per list item, so React can efficiently match old
            // and new items on re-render (that matching is called "reconciliation").
            // Interview: keys must be stable + unique among siblings; using the array
            // index as key breaks state when items reorder. "to" = target URL (routerLink).
            <NavLink key={c.path} to={c.path}>
              {/* Curly braces embed a JS expression in JSX — here the link's label text. */}
              {c.title}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        {/* Suspense shows a fallback while a lazy chunk downloads.
            The fallback prop takes any JSX — here a small "loading" message. */}
        <Suspense fallback={<p className="muted">Loading chunk…</p>}>
          {/* Routes picks the ONE <Route> whose path best matches the URL — <router-outlet>. */}
          <Routes>
            {/* "/" redirects to the first concept. `replace` swaps the history entry,
                so the Back button doesn't bounce you to "/". Like redirectTo + pathMatch. */}
            <Route path="/" element={<Navigate to={CONCEPTS[0].path} replace />} />
            {CONCEPTS.map((c) => (
              // "path/*" lets a concept define its own nested routes (see 13-router).
              // `${c.path}/*` is a template literal: backticks + ${} build the string.
              // element takes JSX; <c.Component /> renders that entry's lazy component.
              <Route key={c.path} path={`${c.path}/*`} element={<c.Component />} />
            ))}
            {/* path="*" is the catch-all when nothing matched — Angular's '**' wildcard. */}
            <Route path="*" element={<h2>404 — no route matched</h2>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
