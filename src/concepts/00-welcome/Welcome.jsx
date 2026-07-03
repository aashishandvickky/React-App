/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 00 · Start Here (Welcome.jsx)

   WHAT YOU SEE IN THE BROWSER
   The landing page of the lab: what this app is, the 5-step learning loop,
   the 4-week path, and where every doc lives.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① A card: what this app is and how it's meant to be used
   ② A card: the 5-step loop for studying one concept
   ③ A card: the 4-week path through the sidebar
   ④ A card: the map of all docs (they live in the repo, open them in
      IntelliJ or on GitHub)
   ⑤ A card: what to do when something breaks

   INGREDIENTS USED HERE (what & why)
   • JSX + Fragment — this page is deliberately the simplest component in
     the app: no state, no hooks, just markup. Compare it with concept 01.
   • <Link>         — client-side navigation to concept 01 without a reload

   HOW TO READ THIS FILE
   You're reading the code of the page you're looking at — that's the whole
   trick of this repo. Every page works this way: browser on one side, its
   file on the other. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// Named import ({ } picks one export out of the module — JS destructuring syntax).
// Link is React Router's <a>: it swaps the page WITHOUT a full browser reload.
// Angular analogy: routerLink.
import { Link } from 'react-router-dom';

// A React component is just a function that returns JSX. `export default` makes it
// this file's main export; the router renders <Welcome /> when you visit this route.
export default function Welcome() {
  return (
    // <>…</> is a Fragment: a component must return ONE root node, and a Fragment
    // groups children without adding an extra <div> to the DOM. Angular: <ng-container>.
    <>
      <h2>00 · 👋 Start Here</h2>

      {/* ─── ① What this app is ─── */}
      {/* className is JSX for the HTML class attribute (`class` is a reserved word in
          JS). Angular: class="card" / [class]. Same pattern on every card below. */}
      <div className="card">
        <h3>What this is</h3>
        <p>
          A real, working React project where <strong>every sidebar page teaches one
          concept</strong>. The page you see in the browser and the file that draws it
          are meant to be read <em>side by side</em> — the code is heavily commented
          and each folder has a <code>NOTES.md</code> with the theory.
        </p>
        <p className="muted">
          This page's own file: <code>src/concepts/00-welcome/Welcome.jsx</code>.
          Open it — it's the simplest page in the app, and it describes itself.
        </p>
      </div>

      {/* ─── ② The learning loop ─── */}
      <div className="card">
        <h3>How to study ONE concept (repeat this loop)</h3>
        <ol>
          <li><strong>Run it</strong> — click every button on the concept's page.</li>
          <li><strong>Read the code</strong> — open <code>src/concepts/&lt;nn-name&gt;/</code>;
            the 📖 map at the top of the file tells you what's where.</li>
          <li><strong>Read NOTES.md</strong> in the same folder for the theory.</li>
          <li><strong>Break it</strong> — change something, watch the browser react.
            (When it goes wrong: <code>docs/DEBUGGING.md</code>.)</li>
          {/* {' '} inserts an explicit space — JSX drops whitespace around line
              breaks, so without it the text and the <code> tag would touch. */}
          <li><strong>Do the mini-exercises</strong> for that concept from{' '}
            <code>docs/EXERCISES.md</code>, then undo experiments with{' '}
            <code>git checkout -- src/</code>.</li>
        </ol>
      </div>

      {/* ─── ③ The 4-week path ─── */}
      <div className="card">
        <h3>The path (self-paced, ~4 weeks)</h3>
        <ul>
          <li><strong>Week 1 — the core:</strong> 01–05 (JSX, props, state, lists, forms).
            Don't rush this; it's 80% of daily React work.</li>
          <li><strong>Week 2 — effects & communication:</strong> 06–09.</li>
          <li><strong>Week 3 — real-app machinery:</strong> 10–15 (router, Redux, fetching).</li>
          <li><strong>Week 4 — edges + build:</strong> 16–19, then build the Members page
            yourself from <code>docs/BUILD_A_FEATURE.md</code> — the most important step
            in the whole repo.</li>
        </ul>
        <p>
          {/* to= is the route path (like routerLink). Clicking updates the URL and
              swaps the page component — no server round-trip. */}
          <Link to="/01-jsx-basics">Start with 01 · JSX Basics →</Link>
        </p>
      </div>

      {/* ─── ④ Where everything is ─── */}
      <div className="card">
        <h3>The docs (open in IntelliJ, or read on GitHub)</h3>
        <ul>
          <li><code>docs/START_HERE.md</code> — this page, in more detail + checkpoints</li>
          <li><code>docs/HOW_THE_APP_WORKS.md</code> — how this project's files connect</li>
          <li><code>docs/GLOSSARY.md</code> — every confusing word, in plain language</li>
          <li><code>docs/EXERCISES.md</code> — 2–3 small exercises per concept</li>
          <li><code>docs/DEBUGGING.md</code> — when something breaks (it will — good)</li>
          <li><code>docs/BUILD_A_FEATURE.md</code> — your first end-to-end "ticket"</li>
          <li><code>docs/ANGULAR_TO_REACT.md</code> — coming from Angular? your dictionary</li>
          <li className="muted">…and interview prep for later: INTERVIEW_QUESTIONS,
            HOOKS_CHEATSHEET, RENDERING_AND_RECONCILIATION, TESTING</li>
        </ul>
      </div>

      {/* ─── ⑤ When something breaks ─── */}
      <div className="card">
        <h3>When something breaks</h3>
        <p>
          Breaking things is the plan, not a problem. Read the <em>first line</em> of the
          red error (browser or terminal), find the first file in the list that is yours,
          and look there. The full guide — including the 10 classic beginner errors and
          React DevTools — is <code>docs/DEBUGGING.md</code>. Escape hatch back to a
          working state: <code>git checkout -- src/</code>.
        </p>
      </div>
    </>
  );
}
