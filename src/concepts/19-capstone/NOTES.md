# 19 · ★ Capstone — Rewards Store

A small but realistic feature that composes almost every previous concept. Use it two ways:
1. **Read it** top to bottom and identify each concept (they're labeled in comments).
2. **Extend it** with the exercises at the bottom of the page — that's where learning sticks.

## Architecture decisions worth studying (interview: "walk me through a feature you built")
- **Where state lives** (state colocation):
  - `search`/`category` → page level, because controls AND grid need them (lifted up).
  - cart → context + reducer, because distant components (grid rows, cart panel) mutate it.
  - `balance` → `useLocalStorage`, because it should survive reloads.
  - filtered product list → **nowhere**: derived via `useMemo`, never stored.
- **Data flows down, events flow up**: `SearchControls` doesn't filter anything — it just
  reports changes; `CartPanel` doesn't own the balance — it calls `onCheckout`.
- **The provider pattern**: `CartProvider` owns reducer state and exposes `{lines, totalPoints,
  dispatch}` through a memoized context value + a guarded `useCart()` hook.
- **Business rules in the right place**: "can't redeem more than balance" is derived at
  render (`canAfford`), quantity-merge logic lives in the pure reducer.

## If this were production
- Cart/server sync → TanStack Query mutations + optimistic updates.
- The cart context → Zustand or Redux Toolkit once more features share it.
- Form-heavy checkout → React Hook Form + Zod.
- Types → TypeScript (see docs/TYPESCRIPT_WITH_REACT.md).
