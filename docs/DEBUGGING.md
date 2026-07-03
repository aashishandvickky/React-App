# 🐛 Debugging — what to do when it breaks (it will, and that's the plan)

This repo tells you to break things on purpose. This doc is what to do next.
Written for a complete beginner; keep it open during Week 1.

## Where errors appear (check in this order)

1. **The browser page itself** — Vite shows a full-screen red overlay for compile
   errors (typos, bad JSX). The overlay names the file and line. Fix, save, it vanishes.
2. **The browser console** — `Cmd + Option + J` in Chrome (or right-click → Inspect →
   Console). Runtime errors and React warnings land here. **Red = broken, yellow =
   warning** (app still runs, but React is telling you something's off).
3. **The terminal running `npm run dev`** — mostly mirrors the overlay.
4. **Test output** (`npm test`) — failing tests print what they expected vs. got.

## How to read a React error (the 3-step ritual)

1. **Read only the first line.** Everything below is the stack trace — noise for now.
2. **Find the first file in the trace that is YOURS** (something in `src/`). Ignore
   files from `node_modules` — the bug is almost never there.
3. **Ask "what did I change last?"** — `git diff` shows exactly what you've touched
   since the last commit. 90% of the time the bug is in that diff.

Escape hatch when you're truly stuck: `git checkout -- src/` throws away all your
experiments and returns to the last committed, working state.

## Install React DevTools (do this in Week 1)

A free browser extension — search "React Developer Tools" in the Chrome Web Store
(also exists for Firefox/Edge). It adds two tabs to the browser's inspector:

- **⚛️ Components** — the live component tree. Click any component to see its current
  props, state, and hooks. This is the single most useful debugging view in React.
  Angular analogy: Angular DevTools' component explorer.
- **⚛️ Profiler** — records which components re-rendered and why. You'll use it in
  concepts 10 and 12.

Try it now: open concept 03, open the Components tab, click `Counter`, and watch its
state change live as you click +1. Also enable the gear-icon option **"Highlight
updates when components render"** — flashing outlines show every re-render.

## The classic beginner errors (you WILL meet most of these)

| What you see | What it means | The fix |
|---|---|---|
| White/blank page, error in console | Something threw during render | Console first line → your file → usually one of the rows below |
| `Objects are not valid as a React child` | You did `{member}` (a whole object) instead of `{member.name}` | Render a field, not the object; `JSON.stringify(member)` if you want a peek |
| `Cannot read properties of undefined (reading 'x')` | Data isn't there yet (still loading) or a typo (`memebr.name`) | Guard it: `{member?.name}` or `if (!data) return <p>Loading…</p>` |
| Warning: `Each child in a list should have a unique "key"` | A `.map()` in JSX without `key={...}` | Add `key={item.id}` on the outermost mapped element (concept 04) |
| `Too many re-renders` | You *called* a function in render instead of *passing* it: `onClick={doThing()}` | Pass the function: `onClick={doThing}` or `onClick={() => doThing(x)}` |
| `Invalid hook call` / `Rendered more hooks than during the previous render` | A `useX` inside an `if`, loop, or regular function | Hooks go at the top level of the component, same order every render |
| Effect/`console.log` runs twice | Not a bug — StrictMode double-runs things in dev to expose bugs | Expected; see `src/main.jsx` comments and concept 06 |
| Clicked the button but the screen didn't update | You mutated state (`items.push(x)`) instead of using the setter with a copy | `setItems([...items, x])` — React compares references (concept 03) |
| State seems "one step behind" in a handler | Reading state right after setting it — setters schedule, they don't mutate | Use the value you just computed, or a functional update `set(c => c + 1)` |
| `.map is not a function` | The data isn't an array (yet) — often `undefined` before a fetch finishes | Default it: `useState([])`, or guard before mapping |
| Changed a file, browser didn't update | Dev server died or you edited a different copy of the file | Check the terminal; restart `npm run dev`; check the file path |

## `console.log` like a pro (it's not cheating — everyone does it)

- **Top of the component body**: `console.log('MemberList render', { query, visible })`
  — shows every render and the values it "sees". The render count itself is information.
- **Inside a handler**: log what you're about to set — if the log shows the right value
  but the screen is wrong, the bug is in rendering, not the handler.
- **Inside `useEffect`**: log when it runs and in its cleanup — you'll *see* the
  mount → cleanup → re-run cycle from concept 06.
- Label your logs (`'A'`, `'B'`, or emoji) so you can tell them apart, and delete them
  when done.

## When it's not an error, just "wrong"

The page renders but shows the wrong thing:

1. React DevTools → Components → click the component → is its **state/props what you
   expected?**
   - Props wrong → the bug is in the **parent** (it's passing bad data down).
   - State wrong → the bug is in whoever **sets** that state (find the setter calls).
   - Both right → the bug is in the **JSX** that renders them.
2. That one decision — "is the data wrong or is the display wrong?" — cuts every UI
   bug in half. It's also a great interview answer to "how do you debug React?".
