/* ─────────────────────────────────────────────────────────────────────
   📖 WHAT THIS FILE IS — catalogSlice.js
   The ASYNC half of the Redux demo: a slice whose data comes from a
   fetch, driven by a createAsyncThunk (fetchCatalog).
   Used by: store.js (registers the reducer) and ReduxDemo.jsx
   (CatalogPanel dispatches fetchCatalog and reads selectCatalog).
   Why it exists: to show how Redux tracks loading/succeeded/failed.
   How: the thunk auto-dispatches pending/fulfilled/rejected actions
   and extraReducers maps each one onto status/items/error state.
   ───────────────────────────────────────────────────────────────────── */

/**
 * ASYNC REDUX — createAsyncThunk.
 * A thunk dispatches pending/fulfilled/rejected actions around an async
 * call; extraReducers maps those to loading/error/data state.
 * (Angular/NgRx analogy: an @Effect listening for an action, calling a
 * service, dispatching success/failure — minus RxJS.)
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetches the stubbed catalog from /public/data (no DB — works anywhere).
export const fetchCatalog = createAsyncThunk('catalog/fetch', async () => {
  // Small artificial delay so the 'loading' state is visible in the UI.
  await new Promise((r) => setTimeout(r, 600));
  const res = await fetch('/data/posts.json');
  if (!res.ok) throw new Error(`HTTP ${res.status}`); // → rejected action
  return res.json(); // → fulfilled action payload
});

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  // Handle actions defined OUTSIDE this slice (the thunk lifecycle).
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectCatalog = (state) => state.catalog;
export default catalogSlice.reducer;
