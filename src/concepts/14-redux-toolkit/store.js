/**
 * THE STORE — one per app, created once, provided in main.jsx via
 * <Provider store={store}>. configureStore wires the Redux DevTools
 * extension and default middleware (incl. thunk + immutability checks
 * in dev) automatically.
 */
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
