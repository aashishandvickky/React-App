/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 03 · State & Events (StateAndEvents.jsx)

   WHAT YOU SEE IN THE BROWSER
   A page with 3 cards: a counter with broken vs fixed "+3" buttons, a JSON
   profile you update without mutating it, and a live log of input/click events.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① Counter         — number state; proves updates are batched (grouped into
      one re-render) and each render "sees" its own snapshot (frozen copy) of
      state (exported so tests can use it)
   ② ObjectStateDemo — object/array state; update by COPYING, never mutating
   ③ EventsDemo      — camelCase event props and React's SyntheticEvent
   ④ The page component — just stacks the three cards above

   INGREDIENTS USED HERE (what & why)
   • useState             — a value React remembers between renders + a setter;
                            calling the setter schedules a re-render
   • functional update    — setCount(c => c + 1): reads the LATEST pending
                            value, safe to call several times in a row
   • immutability         — copy with spread {...old}/[...old]; React compares
                            references to decide whether to re-render
   • onClick/onChange/…   — event props are camelCase; you pass a FUNCTION
   • SyntheticEvent       — React's cross-browser wrapper around DOM events

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one card on screen. Read NOTES.md in this folder
   for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// Named import of the useState hook — the only React API this file needs.
import { useState } from 'react';

// ─── ① Counter — batched updates & per-render snapshots ───
// Exported separately so Counter.test.jsx can test it in isolation.
export function Counter() {
  // useState returns [currentValue, setterFunction].
  // Calling the setter SCHEDULES a re-render — React re-runs this function soon;
  // it does NOT change (mutate) `count` in place.
  const [count, setCount] = useState(0);

  // An arrow function stored in a const — the handler for the "broken +3" button.
  const brokenAddThree = () => {
    // ❌ CLASSIC INTERVIEW TRAP: all three read the SAME `count` — this handler is a
    // closure (it remembers the variables from the render that created it).
    // If count is 0, this is setCount(1) three times → 1.
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const fixedAddThree = () => {
    // ✅ Functional update: receives the LATEST pending state. 0 → 3.
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    // className = CSS class (JSX name for the reserved word `class`).
    <div className="card">
      <h3>Counter — updates are batched & closures are per-render</h3>
      {/* {count} interpolates the state; data-testid is a plain DOM attribute the
          test file uses to find this node. */}
      <p>
        Count: <strong data-testid="count">{count}</strong>
      </p>
      {/* onClick takes a FUNCTION. () => setCount(count + 1) is an inline arrow that
          runs on click; onClick={setCount(count + 1)} would fire during render. */}
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={brokenAddThree} className="secondary">
        +3 (broken — adds 1)
      </button>
      <button onClick={fixedAddThree}>+3 (functional updates)</button>
      <button onClick={() => setCount(0)} className="secondary">
        Reset
      </button>
    </div>
  );
}

// ─── ② ObjectStateDemo — object/array state, updated immutably ───
function ObjectStateDemo() {
  // State can be any value. RULE: never MUTATE it (change it in place) — always create
  // a NEW object/array. React only asks "is it the same object?" (Object.is) to decide
  // whether to re-render, so a change made in place can go unnoticed.
  const [profile, setProfile] = useState({ name: 'Ashish', points: 100, tags: ['angular'] });

  const earnPoints = () =>
    // Spread the old object, override one field — like a tiny immutable update.
    // Syntax note: ({ … }) — the parens make the arrow RETURN the object; a bare { }
    // after => would be read as a function body, not an object literal.
    setProfile((p) => ({ ...p, points: p.points + 50 }));

  const addTag = () =>
    // Arrays too: concat/spread/filter/map — never push/splice on state.
    // `react-${…}` is a template literal: backticks + ${ } embed a value in a string.
    setProfile((p) => ({ ...p, tags: [...p.tags, `react-${p.tags.length}`] }));

  return (
    <div className="card">
      <h3>Object/array state — immutability</h3>
      {/* JSON.stringify(…, null, 2) pretty-prints the state so each click is visible. */}
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <button onClick={earnPoints}>Earn 50 pts</button>
      <button onClick={addTag}>Add tag</button>
      <p className="muted">
        ❌ profile.points += 50 — same reference, React may not re-render.
        <br />✅ setProfile(p =&gt; ({'{'}...p, points: p.points + 50{'}'}))
      </p>
    </div>
  );
}

// ─── ③ EventsDemo — camelCase event props & SyntheticEvent ───
function EventsDemo() {
  const [log, setLog] = useState([]); // state starts as an empty array of messages
  // Helper: functional update appends msg; slice(-4) keeps only the last 4 old entries.
  const push = (msg) => setLog((l) => [...l.slice(-4), msg]);

  return (
    <div className="card">
      <h3>Events — camelCase props, SyntheticEvent</h3>
      {/* (click)="fn($event)" → onClick={fn}. You pass the FUNCTION, you
          don't call it: onClick={fn()} would run during render. */}
      {/* onChange fires on EVERY keystroke (unlike the native change event);
          e.target.value is the input's current text.
          onKeyDown uses &&: if the left side is true, run the right side —
          a short-circuit one-liner instead of an if statement. */}
      <input
        placeholder="type here"
        onChange={(e) => push(`change: "${e.target.value}"`)}
        onKeyDown={(e) => e.key === 'Enter' && push('Enter pressed')}
      />
      <button
        onClick={(e) => {
          // e is a SyntheticEvent — a cross-browser wrapper over the native
          // event, with the same API (preventDefault, stopPropagation…).
          push(`click at (${e.clientX}, ${e.clientY})`);
        }}
      >
        Click me
      </button>
      {/* join('\n') builds one string; || shows the fallback while it's empty
          (an empty string is falsy in JS). */}
      <pre>{log.join('\n') || '(interact above)'}</pre>
    </div>
  );
}

// ─── ④ The page component — stacks the three cards ───
export default function StateAndEvents() {
  return (
    // <>…</> Fragment: one root node without adding an extra <div> to the DOM.
    <>
      <h2>03 · State & Events</h2>
      {/* Capitalized tag = our own component (self-closing — no children). Each one
          keeps its OWN state: three independent useState worlds on one page. */}
      <Counter />
      <ObjectStateDemo />
      <EventsDemo />
    </>
  );
}
