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
// Args: an action-type prefix + an async arrow function (the "payload creator").
// Interview: dispatching it emits 'catalog/fetch/pending' immediately, then
// .../fulfilled or .../rejected when the promise below settles.
export const fetchCatalog = createAsyncThunk('catalog/fetch', async () => {
  // Small artificial delay so the 'loading' state is visible in the UI.
  await new Promise((r) => setTimeout(r, 600)); // promisified sleep: resolves after 600ms
  // await pauses this function until the response arrives (HttpClient+subscribe ≈ await fetch).
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
  reducers: {}, // no sync actions — all changes come from the thunk lifecycle below
  // Handle actions defined OUTSIDE this slice (the thunk lifecycle).
  extraReducers: (builder) => {
    builder
      // Dispatched the instant the thunk starts → flip the UI to 'loading'.
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // action.payload = whatever the payload creator returned (the parsed JSON array).
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      // The thrown Error is serialized onto action.error — we keep only its message.
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Returns the whole slice object. Safe: Immer creates a NEW reference only when something
// in the slice actually changed, so useSelector's === comparison still works.
export const selectCatalog = (state) => state.catalog;
export default catalogSlice.reducer; // store.js mounts this at state.catalog
