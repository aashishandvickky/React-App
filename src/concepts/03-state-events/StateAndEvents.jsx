/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 03 · State & Events (StateAndEvents.jsx)

   WHAT YOU SEE IN THE BROWSER
   A page with 3 cards: a counter with broken vs fixed "+3" buttons, a JSON
   profile you update without mutating it, and a live log of input/click events.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① Counter         — number state; proves updates are batched and each
      render "sees" its own snapshot of state (exported so tests can use it)
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
import { useState } from 'react';

// ─── ① Counter — batched updates & per-render snapshots ───
// Exported separately so Counter.test.jsx can test it in isolation.
export function Counter() {
  // useState returns [currentValue, setterFunction].
  // Calling the setter SCHEDULES a re-render; it does NOT mutate `count`.
  const [count, setCount] = useState(0);

  const brokenAddThree = () => {
    // ❌ CLASSIC INTERVIEW TRAP: all three read the SAME `count` from this
    // render's closure. If count is 0, this is setCount(1) three times → 1.
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
    <div className="card">
      <h3>Counter — updates are batched & closures are per-render</h3>
      <p>
        Count: <strong data-testid="count">{count}</strong>
      </p>
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
  // State can be any value. RULE: never MUTATE it — always create a new
  // object/array. React compares by reference (Object.is) to decide to re-render.
  const [profile, setProfile] = useState({ name: 'Ashish', points: 100, tags: ['angular'] });

  const earnPoints = () =>
    // Spread the old object, override one field — like a tiny immutable update.
    setProfile((p) => ({ ...p, points: p.points + 50 }));

  const addTag = () =>
    // Arrays too: concat/spread/filter/map — never push/splice on state.
    setProfile((p) => ({ ...p, tags: [...p.tags, `react-${p.tags.length}`] }));

  return (
    <div className="card">
      <h3>Object/array state — immutability</h3>
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
  const [log, setLog] = useState([]);
  const push = (msg) => setLog((l) => [...l.slice(-4), msg]);

  return (
    <div className="card">
      <h3>Events — camelCase props, SyntheticEvent</h3>
      {/* (click)="fn($event)" → onClick={fn}. You pass the FUNCTION, you
          don't call it: onClick={fn()} would run during render. */}
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
      <pre>{log.join('\n') || '(interact above)'}</pre>
    </div>
  );
}

// ─── ④ The page component — stacks the three cards ───
export default function StateAndEvents() {
  return (
    <>
      <h2>03 · State & Events</h2>
      <Counter />
      <ObjectStateDemo />
      <EventsDemo />
    </>
  );
}
