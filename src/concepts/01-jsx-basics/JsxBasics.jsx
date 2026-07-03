/**
 * CONCEPT 01 — JSX BASICS
 * Read NOTES.md in this folder for the theory + interview questions.
 */

// JSX is NOT HTML. It compiles to function calls: <h2 id="x">hi</h2>
// becomes jsx('h2', { id: 'x', children: 'hi' }). Because it's just
// JavaScript expressions, you can assign it to variables, return it,
// pass it around — that's what makes composition possible.
export default function JsxBasics() {
  // Plain JS above the return — runs on EVERY render.
  const student = { name: 'Ashish', background: 'Angular', years: 8 };
  const skills = ['Java', 'Angular', 'Spring', 'React (learning)'];
  const now = new Date().toLocaleTimeString();

  // JSX stored in a variable — perfectly normal.
  const banner = <p className="success">JSX is just JavaScript expressions.</p>;

  return (
    // A component must return ONE root node. <>…</> is a Fragment:
    // it groups children WITHOUT adding an extra DOM element.
    // Angular analogy: <ng-container>.
    <>
      <h2>01 · JSX Basics</h2>
      {banner}

      <div className="card">
        <h3>Interpolation: {'{ }'} instead of {'{{ }}'}</h3>
        {/* Anything inside { } is a JS EXPRESSION (no statements/if/for). */}
        <p>
          Hello <strong>{student.name}</strong>, coming from{' '}
          {student.background} with {student.years}+ years experience.
        </p>
        <p>Rendered at: {now} (re-render the page to see it change)</p>
        <p>2 + 2 = {2 + 2} · uppercase: {student.background.toUpperCase()}</p>
      </div>

      <div className="card">
        <h3>Attribute differences vs HTML</h3>
        {/* className (not class), htmlFor (not for), camelCase events. */}
        <label htmlFor="demo">JSX uses htmlFor + className:</label>
        <input id="demo" placeholder="camelCase props" />
        {/* style takes an OBJECT with camelCase CSS keys, not a string. */}
        <p style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
          style is an object: {"style={{ color: 'red' }}"}
        </p>
      </div>

      <div className="card">
        <h3>Lists preview (details in concept 04)</h3>
        <ul>
          {/* No *ngFor — you .map() data to JSX. Each child needs a key. */}
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>What JSX compiles to</h3>
        <pre>{`// You write:
const el = <h2 className="title">Hi</h2>;

// Babel/Vite compiles it to (React 17+ automatic runtime):
import { jsx } from 'react/jsx-runtime';
const el = jsx('h2', { className: 'title', children: 'Hi' });

// 'el' is a plain object (a React ELEMENT — a description, not a DOM node):
{ type: 'h2', props: { className: 'title', children: 'Hi' }, key: null }`}</pre>
        <p className="muted">
          Elements are cheap immutable descriptions. React diffs these trees
          (reconciliation) and applies minimal DOM updates.
        </p>
      </div>
    </>
  );
}
