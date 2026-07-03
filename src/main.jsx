import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './concepts/14-redux-toolkit/store.js';
import './index.css';

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
