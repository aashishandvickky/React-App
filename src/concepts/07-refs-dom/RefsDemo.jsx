/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 07 · Refs & the DOM (RefsDemo.jsx)

   WHAT YOU SEE IN THE BROWSER
   Four cards: an input that focuses itself on load (with Select/Measure
   buttons), a live render counter, a points score that shows the change
   since the last render, and a parent button that focuses a child's input.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① DomRefDemo — holds a ref to a real DOM <input> to focus, select,
      and measure it (≈ @ViewChild/ElementRef).
   ② RenderCounter — a ref as a plain mutable box: counts renders
      WITHOUT causing new renders (state would loop forever here).
   ③ PreviousValueDemo — the "usePrevious" trick: an effect stashes the
      value after each render so you can diff old vs new.
   ④ FancyInput — a small child component that receives `ref` as a
      normal prop (React 19 style; ≤18 needed forwardRef).
   ⑤ ForwardRefDemo — the parent that holds a ref to FancyInput's input
      and focuses it with a button.
   ⑥ RefsDemo — the page component that stacks the four cards.

   INGREDIENTS USED HERE (what & why)
   • useRef    — a mutable box ({ current }) that SURVIVES re-renders and
     whose mutation does NOT trigger a re-render. Two jobs in this file:
     holding DOM nodes (①④⑤) and holding plain values (②③).
   • useState  — the text input and the points score; changing these is
     what actually re-renders (contrast with refs).
   • useEffect — the safe place to TOUCH refs: DOM refs are only filled
     in AFTER render (① focus-on-mount, ③ stash-previous-value).

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// useRef is the star here; useState provides the contrast (it DOES re-render); useEffect is
// the safe moment to touch refs after render.
import { useEffect, useRef, useState } from 'react';

// ─── ① DomRefDemo — a ref to a real DOM node: focus, select, measure ───
function DomRefDemo() {
  const inputRef = useRef(null); // ≈ @ViewChild('input')

  // DOM refs are populated AFTER render — so touch them in effects/handlers,
  // never during render.
  useEffect(() => {
    inputRef.current.focus(); // ≈ ngAfterViewInit focus
  }, []); // [] → run once, right after the first render (the node exists by then)

  return (
    <div className="card">
      <h3>DOM ref — focus, measure, scroll</h3>
      {/* ref={inputRef} → after mount, inputRef.current IS this real DOM <input>. */}
      <input ref={inputRef} placeholder="auto-focused on mount" />
      {/* Event handlers may read refs freely — by click time the node definitely exists. */}
      <button onClick={() => inputRef.current.select()}>Select text</button>
      {/* getBoundingClientRect() is a plain browser API for size/position — a ref hands you
          the real node, so anything the DOM can do is available. Template literal in alert. */}
      <button
        className="secondary"
        onClick={() => alert(`width: ${inputRef.current.getBoundingClientRect().width}px`)}
      >
        Measure
      </button>
    </div>
  );
}

// ─── ② RenderCounter — a ref as a mutable box (no re-render on change) ───
function RenderCounter() {
  const [text, setText] = useState('');
  // INTERVIEW FAVORITE: count renders WITHOUT causing renders.
  // useState here would loop forever; a plain variable resets each render.
  const renders = useRef(0); // the box survives re-renders; a plain `let` would reset to 0
  // Mutate .current directly — refs have no setter. Interview: this does NOT re-render;
  // the number on screen only updates because setText re-renders for its own reason.
  renders.current += 1;

  return (
    <div className="card">
      <h3>Mutable-value ref — render counter</h3>
      {/* Controlled input: value={state} + onChange writing e.target.value back to state.
          Every keystroke = one re-render — exactly what the counter counts. */}
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type to re-render" />
      <p>
        This component has rendered <strong>{renders.current}</strong> time(s).
      </p>
      <p className="muted">
        state → in the UI, changing it re-renders · ref → not in the UI, changing it doesn't.
      </p>
    </div>
  );
}

// ─── ③ PreviousValueDemo — remember last render's value in a ref ───
function PreviousValueDemo() {
  const [points, setPoints] = useState(1000);
  const prev = useRef(undefined); // a value box (not a DOM ref) — remembers across renders

  // After every commit, stash the current value; during render, prev.current
  // still holds the one from the PREVIOUS render. (This is how the old
  // usePrevious() custom hook works.)
  useEffect(() => {
    prev.current = points;
  }, [points]);

  // During render, prev.current still holds LAST render's points — the effect hasn't run yet.
  const diff = prev.current === undefined ? 0 : points - prev.current;

  return (
    <div className="card">
      <h3>Previous value via ref</h3>
      <p>
        Points: <strong>{points}</strong>{' '}
        {/* && hides the delta on the very first render; ternaries pick color and the "+". */}
        {diff !== 0 && (
          <span className={diff > 0 ? 'success' : 'error'}>
            ({diff > 0 ? '+' : ''}{diff} since last render)
          </span>
        )}
      </p>
      {/* Updater form setPoints(p => …): compute the new value from the current one. */}
      <button onClick={() => setPoints((p) => p + 250)}>Earn 250</button>
      <button className="secondary" onClick={() => setPoints((p) => p - 100)}>Burn 100</button>
    </div>
  );
}

// ─── ④ FancyInput — a child component that accepts a ref ───
// Ref to a CUSTOM component: since React 19, ref is a normal prop.
// (Before 19 you needed React.forwardRef — still worth knowing for interviews.)
// The parameter { ref, label } destructures the props object right in the signature.
function FancyInput({ ref, label }) {
  return (
    <p>
      <label>{label}</label>
      <input ref={ref} placeholder="child input, parent holds the ref" />
    </p>
  );
}

// ─── ⑤ ForwardRefDemo — the parent focuses the child's input ───
function ForwardRefDemo() {
  const childInputRef = useRef(null); // will end up pointing at the CHILD's <input>
  return (
    <div className="card">
      <h3>Refs to custom components</h3>
      {/* Pass the ref like any other prop; FancyInput attaches it to its <input> (see ④). */}
      <FancyInput ref={childInputRef} label="Child component's input" />
      <button onClick={() => childInputRef.current.focus()}>Focus child from parent</button>
      <p className="muted">
        React ≤18 needed <code>forwardRef(…)</code> for this; React 19 passes
        <code> ref</code> as a plain prop. <code>useImperativeHandle</code> can expose a
        limited API (e.g. only <code>focus()</code>) instead of the raw node.
      </p>
    </div>
  );
}

// ─── ⑥ RefsDemo — the page component that stacks the four cards ───
export default function RefsDemo() {
  return (
    <>
      <h2>07 · Refs & the DOM</h2>
      <DomRefDemo />
      <RenderCounter />
      <PreviousValueDemo />
      <ForwardRefDemo />
    </>
  );
}
