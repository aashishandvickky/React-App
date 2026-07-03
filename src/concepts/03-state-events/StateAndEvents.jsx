/**
 * CONCEPT 03 — STATE & EVENTS (useState)
 * The single most important hook. Read NOTES.md for the batching/async story.
 */
import { useState } from 'react';

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
