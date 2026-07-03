/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — walletSlice.js
   The SYNC half of the Redux demo: the points wallet feature — its
   state, its reducers, its auto-generated actions, and its selectors.
   Used by: store.js (registers the reducer) and ReduxDemo.jsx
   (WalletPanel/HistoryPanel dispatch and select from it).
   Why it exists: one self-contained file per feature is the RTK way.
   How: createSlice turns the reducers object into action creators and
   a reducer; Immer (a library RTK bundles) turns the "mutating" code
   into safe immutable updates — new state object, old one untouched.
   ───────────────────────────────────────────────────────────────────── */

/**
 * A SLICE = state + reducers + auto-generated actions for one feature.
 * createSlice kills the old Redux boilerplate (action constants, action
 * creators, switch reducers) — this file IS the whole feature.
 */
import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet', // action type prefix: 'wallet/earned' etc.
  initialState: {
    points: 5000,
    history: [], // { type, amount }
  },
  reducers: {
    // ⚠️ This LOOKS like mutation — it isn't. RTK runs reducers inside
    // Immer, which records these "mutations" and produces a new immutable
    // state. Only inside createSlice/createReducer is this legal!
    // (earned(state, action) {…} is shorthand for earned: function (state, action) {…}.)
    earned(state, action) {
      state.points += action.payload; // payload (the data an action carries) = the value passed to earned(n)
      state.history.push({ type: 'earn', amount: action.payload });
    },
    redeemed(state, action) {
      // Business rule inside the reducer: can't go negative.
      const amount = Math.min(action.payload, state.points);
      state.points -= amount;
      state.history.push({ type: 'redeem', amount });
    },
    reset() {
      // Returning a value REPLACES state (the other Immer style).
      return { points: 5000, history: [] };
    },
  },
});

// createSlice generates matching action creators for free:
// earned(100) → { type: 'wallet/earned', payload: 100 }
// Object destructuring + named exports in one line — components import { earned } etc.
export const { earned, redeemed, reset } = walletSlice.actions;

// SELECTORS (small functions that read one value out of state) — keep the knowledge of
// the state's shape here, not in components.
// Interview: these return a stored primitive/reference, so useSelector's === check skips
// re-renders. A selector that BUILDS a new object/array returns a NEW reference each call,
// so === always says "changed" → the component would re-render on every dispatch.
export const selectPoints = (state) => state.wallet.points;
export const selectHistory = (state) => state.wallet.history;

// The reducer function itself — store.js mounts it at state.wallet.
export default walletSlice.reducer;
