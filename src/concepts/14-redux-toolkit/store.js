/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — store.js
   THE Redux store — one per app, created once, provided app-wide in
   main.jsx via <Provider store={store}>.
   Used by: every useSelector/useDispatch in the app (ReduxDemo.jsx,
   the capstone). Why it exists: one central place that holds and
   combines all slice state. How: configureStore plugs each slice
   reducer into a branch of the state tree and auto-wires Redux
   DevTools + default middleware (thunk, dev-time immutability checks).
   ───────────────────────────────────────────────────────────────────── */
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice.js';
import catalogReducer from './catalogSlice.js';

export const store = configureStore({
  reducer: {
    // State shape: { wallet: {...}, catalog: {...} }
    // Each slice owns and manages its branch.
    wallet: walletReducer,
    catalog: catalogReducer,
  },
});
