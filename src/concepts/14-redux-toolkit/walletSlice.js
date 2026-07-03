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
    earned(state, action) {
      state.points += action.payload;
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
export const { earned, redeemed, reset } = walletSlice.actions;

// SELECTORS — keep state-shape knowledge here, not in components.
export const selectPoints = (state) => state.wallet.points;
export const selectHistory = (state) => state.wallet.history;

export default walletSlice.reducer;
