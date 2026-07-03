# 🏋️ Exercises — small hands-on tasks for every concept

Reading makes it familiar; **typing makes it stick**. After studying each concept,
do its exercises directly in that concept's file. When done experimenting, reset
with `git checkout -- src/` (or commit the ones you're proud of on a branch).

Rules of the game:
- No copy-paste. Type everything.
- Stuck > 15 minutes? The concept's own demo code contains the pattern you need —
  find it, understand it, then write yours without looking.
- Something broke? Good. `docs/DEBUGGING.md`.

Difficulty: 🟢 quick · 🟡 requires thought · 🔴 combines ideas.

---

## 01 · JSX Basics (`src/concepts/01-jsx-basics/`)
1. 🟢 Add a new card that renders an object about YOU (name, city, favorite food) —
   fields only; then try `{yourObject}` directly and read the error it produces.
2. 🟢 Show `Today is <weekday>` computed with plain JS (`new Date().toLocaleDateString`
   with `{ weekday: 'long' }`).
3. 🟡 Make the banner text green when `2 + 2 === 4` using a ternary in `className`.

## 02 · Components & Props (`02-components-props/`)
1. 🟢 Add a new prop (e.g. `subtitle`) to one child component: pass it from the parent,
   render it in the child.
2. 🟡 Create a `<Badge color="gold">` component from scratch and use it twice with
   different props.
3. 🟡 Add a second callback prop (e.g. `onReset`) — child button click → parent state
   change. Say out loud which direction data flowed and which direction the event flowed.

## 03 · State & Events (`03-state-events/`)
1. 🟢 Add a `−1` and a `Reset` button to the Counter.
2. 🟡 Add a "+5 (one click)" button using functional updates. First predict what the
   naive `setCount(count + 5)` five times would do; then verify.
3. 🟡 In ObjectStateDemo, add an `age` field and a button that increments it — without
   mutating the object.

## 04 · Conditionals & Lists (`04-conditional-lists/`)
1. 🟢 Add a "hide completed" checkbox above a list — filter with `&&` or ternary.
2. 🟡 In the index-keys demo, predict on paper what will go wrong before you click;
   then click and check yourself.
3. 🔴 Render "No items" when a list is empty — handle it with an early ternary, not `&&`
   (then try `list.length && …` and see the sneaky `0` it renders).

## 05 · Forms (`05-forms/`)
1. 🟢 Add a `phone` field to the controlled form, wired like the others.
2. 🟡 Disable the submit button until all fields are valid (derive it — no new state).
3. 🟡 Add a character counter under one input (`{value.length}/50`) that turns red
   past 40. Notice: zero extra state needed.

## 06 · useEffect (`06-effects/`)
1. 🟢 Add an effect that sets `document.title` to the current count; watch the browser
   tab. Cleanup: restore the old title on unmount.
2. 🟡 Give the Clock a speed selector (500ms / 1000ms / 2000ms) — the interval must
   restart when speed changes. What goes in the dependency array?
3. 🔴 Add a `console.log` in an effect body and its cleanup, then narrate the exact
   sequence you see in the console on mount (StrictMode!) and on unmount.

## 07 · Refs & the DOM (`07-refs-dom/`)
1. 🟢 Add a "Clear & focus" button: empties the input and focuses it, via the ref.
2. 🟡 Add a `console.log` that counts renders using a ref — confirm updating the ref
   does NOT cause a render (compare with state).
3. 🟡 Measure and display a paragraph's height with `ref.current.offsetHeight`.

## 08 · Context (`08-context/`)
1. 🟢 Add a third value to the theme context (e.g. `fontSize`) and consume it somewhere deep.
2. 🟡 Add a new deeply nested component that uses `useTheme()` — count how many
   components you did NOT have to touch to get the data there.
3. 🔴 Remove the provider temporarily and see the guarded hook's error message fire.
   Why is that error better than a silent `undefined`?

## 09 · useReducer (`09-reducer/`)
1. 🟢 Add a `'cleared_all'` action (empty the list) with a button.
2. 🟡 Add an `'edited'` action: double-click a todo → prompt() a new text → dispatch.
3. 🟡 Put a `console.log(action)` at the top of the reducer and use the app — you've
   built a poor-man's Redux DevTools. Every state change is now visible and named.

## 10 · Memoization (`10-memoization/`)
1. 🟢 With React DevTools "highlight updates" ON, toggle the unrelated state and watch
   which rows flash. Now delete the `memo()` wrapper and watch again. Put it back.
2. 🟡 Remove `useCallback` (keep `memo`) and explain from the flashes why `memo` stopped
   working. The chain matters: memo dies without stable props.
3. 🔴 Wrap something pointless in `useMemo` (e.g. `a + b`), then argue why it's a net
   loss. "When would you NOT memoize?" is a real interview question.

## 11 · Custom Hooks (`11-custom-hooks/`)
1. 🟡 Write `useToggle(initial)` → `[value, toggle]` and use it for a show/hide section.
2. 🟡 Use `useLocalStorage` to persist the search text across page reloads.
3. 🔴 Write `useWindowWidth()` (resize listener + cleanup) and display the live width.
   You've combined concepts 03 + 06 into a reusable tool — that's the whole idea.

## 12 · Performance (`12-performance/`)
1. 🟢 Increase the virtualized list to 100,000 rows. Still smooth? Understand why
   (count the actual DOM nodes in the Elements tab).
2. 🟡 Record a Profiler session while typing; find the slowest component in the flame
   chart.

## 13 · React Router (`13-router/`)
1. 🟢 Add a new nested tab/route to the demo with any content.
2. 🟡 Navigate to a URL that doesn't exist (edit the address bar) — trace in code why
   you land where you land.
3. 🔴 Add a `?sort=` query param read with `useSearchParams`, and preserve it when
   switching tabs.

## 14 · Redux Toolkit (`14-redux-toolkit/`)
1. 🟢 Add a `reset` reducer to the wallet slice + a button that dispatches it.
2. 🟡 Add a selector for "can afford the most expensive product" used in two different
   components — one store fact, many subscribers.
3. 🔴 Add `console.log` in one panel's function body, then dispatch actions that only
   touch the OTHER slice. Does the panel re-render? Why not? (Selector subscriptions.)

## 15 · Data Fetching (`15-data-fetching/`)
1. 🟢 Break the URL (`/data/postsX.json`) and make the error state show a Retry button
   that actually retries.
2. 🟡 Add a visible "(request #N)" counter so you can watch the race-condition demo's
   out-of-order responses with your own eyes.
3. 🔴 Rebuild the fetch with the folder's `useFetch` hook from concept 11 — feel the
   boilerplate disappear.

## 16 · Error Boundaries (`16-error-boundaries/`)
1. 🟢 Make the fallback UI show the error message it caught.
2. 🟡 Add a "Try again" button in the fallback that resets the boundary's state.
3. 🟡 Throw inside a button's `onClick` instead of during render — why doesn't the
   boundary catch it? (Boundaries catch render errors, not event-handler errors.)

## 17 · Portals (`17-portals/`)
1. 🟢 Close the modal when clicking the dark backdrop (but not the modal itself —
   that's what `stopPropagation` is for).
2. 🟡 Add a second, different modal — extract a reusable `<Modal>` component.

## 18 · Concurrent (`18-concurrent/`)
1. 🟢 Remove `useTransition` (call the setter directly), feel the jank while typing,
   put it back. The keyboard lag IS the lesson.
2. 🟡 Show a subtle spinner using the `isPending` flag while the big list renders.

## 19 · Capstone (`19-capstone/`)
Do the exercises on the capstone page itself — they're the graduation project.
Then the final boss: **`docs/BUILD_A_FEATURE.md`** — a complete new page, built by you.

---

## Done with all of it?

- Convert one concept to TypeScript (`docs/TYPESCRIPT_WITH_REACT.md`).
- Rebuild the capstone in Next.js (`docs/ECOSYSTEM_AND_BEYOND.md`, planned exercise).
- Start mock interviews: `docs/INTERVIEW_QUESTIONS.md`, out loud, no peeking.
