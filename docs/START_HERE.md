# 🧭 Start Here — your learning path through this project

This is the "how do I actually use this repo to learn React" guide, written in plain
language. No prior React knowledge assumed.

## The one idea behind this repo

You don't learn React by reading about it. You learn it by **running a real project,
poking at it, breaking it, and fixing it**. This repo is a real, working React project —
the same structure and tools you'd meet at a job — where every page teaches one concept.

There are three layers here, use them in this order:

1. **The running app** — `npm run dev`, open http://localhost:5173, click around.
2. **The code + NOTES.md** — each concept folder has a heavily commented component and a
   NOTES.md with the theory.
3. **The reference docs** (`docs/`) — deeper reading and interview prep, for later.

## How to study ONE concept (the loop)

Repeat this loop for every concept. Budget 30–60 minutes per concept, one or two per day.

1. **Run it.** Open the concept's page in the browser. Click every button. Type in every
   box. Watch what happens.
2. **Read the code.** Open the matching folder in `src/concepts/<nn-name>/` in IntelliJ.
   Read the `.jsx` file top to bottom — the comments are the lesson.
3. **Read the NOTES.md** in the same folder for the theory and the "why".
4. **Break it.** Change something and watch the browser hot-reload. Delete a `key` prop.
   Remove a dependency from a `useEffect` array. Mutate state directly instead of using
   the setter. Seeing things break teaches more than seeing them work.
5. **Rebuild a piece from scratch.** Close the file and re-create the core of the demo
   yourself in the same file (e.g., write your own counter under the existing one). Undo
   with git when done: `git checkout -- src/`.

If a term confuses you at any point → look it up in [`GLOSSARY.md`](GLOSSARY.md).

## The path (suggested 4 weeks, self-paced)

### Week 1 — The core mental model (concepts 01–05)
JSX → Components & Props → State & Events → Conditionals & Lists → Forms.
This is 80% of daily React work. **Do not rush this week.** By the end you should be
able to build a form with a list under it, from scratch, without looking anything up.

### Week 2 — Effects and communication (concepts 06–09)
useEffect → Refs → Context → useReducer.
This is where Angular habits fight you the most (lifecycle thinking vs. "sync with
external systems"). Read `docs/ANGULAR_TO_REACT.md` alongside this week.

### Week 3 — Real-app machinery (concepts 10–15)
Memoization → Custom Hooks → Performance → Router → Redux Toolkit → Data Fetching.
These are the "how real projects are wired" topics. While doing 13–15, also read
[`HOW_THE_APP_WORKS.md`](HOW_THE_APP_WORKS.md) — this repo itself is the example.

### Week 4 — Edge topics + build something (concepts 16–19 + the feature exercise)
Error Boundaries → Portals → Concurrent → **Capstone**.
Then the most important step in the whole repo:
**[`BUILD_A_FEATURE.md`](BUILD_A_FEATURE.md)** — you build a complete new page yourself,
end to end, like a real work ticket. That's the moment it stops being reading and
becomes a skill.

After that: the capstone page lists more exercises, and `docs/INTERVIEW_QUESTIONS.md`
is there when a real interview approaches.

## How to know you're actually learning (checkpoints)

- ✅ After week 1: build a "todo list with an add form" from a blank file, no copying.
- ✅ After week 2: explain to yourself *why* an effect ran twice in dev (StrictMode),
  and what a stale closure is.
- ✅ After week 3: trace what happens from clicking a sidebar link to the page appearing
  (answer is in `HOW_THE_APP_WORKS.md`).
- ✅ After week 4: the `BUILD_A_FEATURE.md` Members page works and its test passes.

## What this repo deliberately does NOT cover (so you don't wonder)

- **Next.js / server rendering** — planned as a separate follow-up project once you're
  done here (see `ECOSYSTEM_AND_BEYOND.md`, "Planned exercise").
- **TypeScript** — deliberate; plain JS keeps React itself in focus. Migration is a
  later exercise (`TYPESCRIPT_WITH_REACT.md`).
- **A real backend** — data is stubbed JSON so the project runs anywhere. Concept 15
  fakes an API by fetching JSON files from `public/data/`.
- **CSS frameworks** — one small global stylesheet (`src/index.css`), because styling
  isn't the lesson here.

## Map of everything

| I want to… | Go to |
|---|---|
| Get the app running | `README.md` (step-by-step section) |
| Know what to study next | this file |
| Understand how the project's files fit together | `docs/HOW_THE_APP_WORKS.md` |
| Look up a confusing word | `docs/GLOSSARY.md` |
| Build something myself, guided | `docs/BUILD_A_FEATURE.md` |
| Translate my Angular knowledge | `docs/ANGULAR_TO_REACT.md` |
| Quick hook syntax reminder | `docs/HOOKS_CHEATSHEET.md` |
| Prepare for interviews | `docs/INTERVIEW_QUESTIONS.md`, `docs/RENDERING_AND_RECONCILIATION.md` |
| Learn testing | `docs/TESTING.md` + `src/__tests__/` |
