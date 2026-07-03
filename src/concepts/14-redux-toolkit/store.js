/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — store.js
   THE Redux store — one per app, created once, provided app-wide in
   main.jsx via <Provider store={store}>.
   Used by: every useSelector/useDispatch in the app (ReduxDemo.jsx,
   the capstone). Why it exists: one central place that holds and
   combines all slice state (a slice = one feature's piece of state).
   How: configureStore plugs each slice reducer into a branch of the
   state tree and auto-wires Redux DevTools + default middleware
   (middleware = code that runs between dispatch and the reducers;
   the defaults enable thunks, i.e. async actions, plus dev-time
   immutability checks).
   ───────────────────────────────────────────────────────────────────── */
// configureStore is RTK's store factory. Interview: it replaces legacy createStore and
// sets up DevTools + sensible default middleware for free.
import { configureStore } from '@reduxjs/toolkit';
// Each slice file default-exports its reducer function, so we choose the import names here.
import walletReducer from './walletSlice.js';
import catalogReducer from './catalogSlice.js';

// ONE store per app (NgRx: StoreModule.forRoot). Named export — main.jsx wraps the app in
// <Provider store={store}> so every component can reach it via hooks.
export const store = configureStore({
  reducer: {
    // State shape: { wallet: {...}, catalog: {...} }
    // Each slice owns and manages its branch.
    wallet: walletReducer,
    catalog: catalogReducer,
  },
});
