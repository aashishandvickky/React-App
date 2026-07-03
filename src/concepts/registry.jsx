/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — registry.jsx
   The app's table of contents: one array entry per concept, each with a
   URL path, a sidebar title, and a lazily-loaded component. App.jsx
   loops over this array to build BOTH the sidebar links AND the routes.
   Add a new entry here and a new page appears automatically.
   Full plain-language tour of how these files connect:
   docs/HOW_THE_APP_WORKS.md
   ───────────────────────────────────────────────────────────────────── */
import { lazy } from 'react';

/**
 * CONCEPT REGISTRY — the table of contents of this app.
 *
 * React.lazy(() => import(...)) creates a component whose code is split into
 * its own JS chunk and downloaded only when first rendered.
 * Angular analogy: loadChildren / loadComponent lazy routes.
 *
 * Interview: lazy() only works with DEFAULT exports, and a lazy component
 * must be rendered inside a <Suspense> boundary (see App.jsx).
 */
export const CONCEPTS = [
  { path: '/01-jsx-basics',        title: '01 · JSX Basics',               Component: lazy(() => import('./01-jsx-basics/JsxBasics.jsx')) },
  { path: '/02-components-props',  title: '02 · Components & Props',       Component: lazy(() => import('./02-components-props/ComponentsProps.jsx')) },
  { path: '/03-state-events',      title: '03 · State & Events',           Component: lazy(() => import('./03-state-events/StateAndEvents.jsx')) },
  { path: '/04-conditional-lists', title: '04 · Conditionals & Lists',     Component: lazy(() => import('./04-conditional-lists/ConditionalAndLists.jsx')) },
  { path: '/05-forms',             title: '05 · Forms',                    Component: lazy(() => import('./05-forms/Forms.jsx')) },
  { path: '/06-effects',           title: '06 · useEffect & Lifecycle',    Component: lazy(() => import('./06-effects/Effects.jsx')) },
  { path: '/07-refs-dom',          title: '07 · Refs & the DOM',           Component: lazy(() => import('./07-refs-dom/RefsDemo.jsx')) },
  { path: '/08-context',           title: '08 · Context API',              Component: lazy(() => import('./08-context/ContextDemo.jsx')) },
  { path: '/09-reducer',           title: '09 · useReducer',               Component: lazy(() => import('./09-reducer/ReducerDemo.jsx')) },
  { path: '/10-memoization',       title: '10 · Memoization',              Component: lazy(() => import('./10-memoization/MemoizationDemo.jsx')) },
  { path: '/11-custom-hooks',      title: '11 · Custom Hooks',             Component: lazy(() => import('./11-custom-hooks/CustomHooksDemo.jsx')) },
  { path: '/12-performance',       title: '12 · Performance Patterns',     Component: lazy(() => import('./12-performance/PerformanceDemo.jsx')) },
  { path: '/13-router',            title: '13 · React Router',             Component: lazy(() => import('./13-router/RouterDemo.jsx')) },
  { path: '/14-redux-toolkit',     title: '14 · Redux Toolkit',            Component: lazy(() => import('./14-redux-toolkit/ReduxDemo.jsx')) },
  { path: '/15-data-fetching',     title: '15 · Data Fetching',            Component: lazy(() => import('./15-data-fetching/DataFetching.jsx')) },
  { path: '/16-error-boundaries',  title: '16 · Errors & Class Components', Component: lazy(() => import('./16-error-boundaries/ErrorBoundaryDemo.jsx')) },
  { path: '/17-portals',           title: '17 · Portals & Modals',         Component: lazy(() => import('./17-portals/PortalsDemo.jsx')) },
  { path: '/18-concurrent',        title: '18 · Concurrent Features',      Component: lazy(() => import('./18-concurrent/ConcurrentDemo.jsx')) },
  { path: '/19-capstone',          title: '19 · ★ Capstone: Rewards App',  Component: lazy(() => import('./19-capstone/Capstone.jsx')) },
];
