/**
 * CONCEPT 07 — REFS & THE DOM
 * useRef = a mutable box ({ current }) that SURVIVES re-renders and whose
 * mutation does NOT trigger a re-render. Two jobs:
 *   1. Holding DOM nodes (like @ViewChild/ElementRef)
 *   2. Holding any mutable value outside the render cycle (timer ids, prev values)
 */
import { useEffect, useRef, useState } from 'react';

function DomRefDemo() {
  const inputRef = useRef(null); // ≈ @ViewChild('input')

  // DOM refs are populated AFTER render — so touch them in effects/handlers,
  // never during render.
  useEffect(() => {
    inputRef.current.focus(); // ≈ ngAfterViewInit focus
  }, []);

  return (
    <div className="card">
      <h3>DOM ref — focus, measure, scroll</h3>
      <input ref={inputRef} placeholder="auto-focused on mount" />
      <button onClick={() => inputRef.current.select()}>Select text</button>
      <button
        className="secondary"
        onClick={() => alert(`width: ${inputRef.current.getBoundingClientRect().width}px`)}
      >
        Measure
      </button>
    </div>
  );
}

function RenderCounter() {
  const [text, setText] = useState('');
  // INTERVIEW FAVORITE: count renders WITHOUT causing renders.
  // useState here would loop forever; a plain variable resets each render.
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div className="card">
      <h3>Mutable-value ref — render counter</h3>
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

function PreviousValueDemo() {
  const [points, setPoints] = useState(1000);
  const prev = useRef(undefined);

  // After every commit, stash the current value; during render, prev.current
  // still holds the one from the PREVIOUS render. (This is how the old
  // usePrevious() custom hook works.)
  useEffect(() => {
    prev.current = points;
  }, [points]);

  const diff = prev.current === undefined ? 0 : points - prev.current;

  return (
    <div className="card">
      <h3>Previous value via ref</h3>
      <p>
        Points: <strong>{points}</strong>{' '}
        {diff !== 0 && (
          <span className={diff > 0 ? 'success' : 'error'}>
            ({diff > 0 ? '+' : ''}{diff} since last render)
          </span>
        )}
      </p>
      <button onClick={() => setPoints((p) => p + 250)}>Earn 250</button>
      <button className="secondary" onClick={() => setPoints((p) => p - 100)}>Burn 100</button>
    </div>
  );
}

// Ref to a CUSTOM component: since React 19, ref is a normal prop.
// (Before 19 you needed React.forwardRef — still worth knowing for interviews.)
function FancyInput({ ref, label }) {
  return (
    <p>
      <label>{label}</label>
      <input ref={ref} placeholder="child input, parent holds the ref" />
    </p>
  );
}

function ForwardRefDemo() {
  const childInputRef = useRef(null);
  return (
    <div className="card">
      <h3>Refs to custom components</h3>
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
