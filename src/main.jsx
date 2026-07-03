/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — main.jsx
   The app's ignition key: runs once when the page loads, finds the empty
   <div id="root"> in index.html, and renders the whole app into it.
   The wrappers around <App /> give every component access to Redux
   (Provider) and URL routing (BrowserRouter).
   Full plain-language tour of how these files connect:
   docs/HOW_THE_APP_WORKS.md
   ───────────────────────────────────────────────────────────────────── */
import React from 'react'; // default import — needed for the <React.StrictMode> tag below
import { createRoot } from 'react-dom/client'; // { } = named import; React 18 bootstrap API
import { BrowserRouter } from 'react-router-dom'; // router provider — clean History-API URLs
import { Provider } from 'react-redux'; // hands the Redux store to every component below it
import App from './App.jsx'; // the root component (sidebar shell + routes)
import { store } from './concepts/14-redux-toolkit/store.js'; // the app's single Redux store
import './index.css'; // side-effect import: no value, just tells Vite to bundle these styles

/**
 * ENTRY POINT — Angular analogy: main.ts + bootstrapApplication().
 *
 * createRoot() is the React 18+ API that enables concurrent rendering.
 * (Interview: the old ReactDOM.render() is legacy and runs in "sync mode".)
 *
 * <React.StrictMode> is a DEV-ONLY helper: it double-invokes renders and
 * effects (mount -> unmount -> mount) to surface impure renders and missing
 * effect cleanups. It does nothing in production builds.
 * If you see effects firing twice in dev — this is why, not a bug.
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider = Redux store via context (like providing a root service). */}
    <Provider store={store}>
      {/* BrowserRouter = RouterModule.forRoot(); uses the History API. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
