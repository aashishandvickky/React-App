/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 04 · Conditionals & Lists (ConditionalAndLists.jsx)

   WHAT YOU SEE IN THE BROWSER
   A page with 2 cards: status buttons that swap between a spinner, an
   error, and a todo list; and an interactive demo where index keys make
   your typed text stick to the wrong row.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① ConditionalPatterns — three *ngIf-style ways to show/hide UI
      (ternary, &&, and a guarded block for the multi-branch case)
   ② KeysDemo — a list of rows with inputs; toggle between index keys
      (buggy) and stable id keys to SEE why keys matter
   ③ The page component — just stacks the two cards above

   INGREDIENTS USED HERE (what & why)
   • useState        — remembers the chosen status, the rows, the checkbox
   • ternary ? :     — render one thing OR another (*ngIf with else)
   • && operator     — render something or nothing (beware the "0" trap)
   • .map() + key    — render a list (*ngFor); key tells React which old
                       row matches which new row when the list changes
   • uncontrolled input — the DOM holds the text, which exposes the key bug

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one card on screen. Read NOTES.md in this folder
   for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// Named import of the useState hook — per-component state (≈ a field on an Angular component).
import { useState } from 'react';
// Stubbed data: Vite imports JSON as a plain JS array at build time — no HTTP request here.
import todos from '../../data/todos.json';

// ─── ① ConditionalPatterns — three *ngIf-style show/hide patterns ───
function ConditionalPatterns() {
  // Array destructuring: useState returns [currentValue, setterFn]. Calling the setter re-renders.
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  // Derived value via a ternary (cond ? a : b) — recomputed each render, no extra state needed.
  const items = status === 'ready' ? todos : [];

  return (
    <div className="card">
      <h3>Conditional patterns (*ngIf equivalents)</h3>
      {/* .map() = *ngFor: one <button> per status string. key={s} tells React which button is
          which across renders (the strings are unique and stable, so they make fine keys).
          onClick gets an ARROW FN so setStatus(s) runs on click, not during render; the
          className ternary un-greys the active button. */}
      {['loading', 'error', 'ready'].map((s) => (
        <button key={s} className={s === status ? '' : 'secondary'} onClick={() => setStatus(s)}>
          {s}
        </button>
      ))}

      {/* Pattern 1: ternary — if/else */}
      {status === 'loading' ? <p className="muted">Spinner…</p> : null}

      {/* Pattern 2: && — render or nothing.
          TRAP: {count && <X/>} renders "0" when count is 0. Guard with a boolean. */}
      {status === 'error' && <p className="error">Something went wrong.</p>}

      {/* Pattern 3: early-return / lookup map for multi-branch (ngSwitch) */}
      {status === 'ready' && (
        <ul>
          {/* key={t.id} — a stable id from the data. Interview: React matches list items by
              key during reconciliation (its diff of the old vs new UI tree); index keys
              break on reorder (proof in the next card). The ternary picks the emoji per row. */}
          {items.map((t) => (
            <li key={t.id}>{t.done ? '✅' : '⬜️'} {t.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── ② KeysDemo — interactive proof that index keys break ───
/**
 * WHY INDEX KEYS BREAK — an interactive proof.
 * Each row has an UNCONTROLLED input (DOM holds the text). Keys tell React
 * which old row matches which new row. With index keys, prepending a row
 * makes React think row 0 is still row 0 — so your typed text stays with
 * the POSITION, not the item it belonged to.
 */
function KeysDemo() {
  // Two starter rows. Each object carries a stable `id` — the raw material for good keys.
  const [rows, setRows] = useState([
    { id: 1, label: 'Row A' },
    { id: 2, label: 'Row B' },
  ]);
  // Checkbox state: true = demo the buggy index keys, false = use the stable id keys.
  const [useIndexKeys, setUseIndexKeys] = useState(true);

  // Arrow fn + functional update: setRows gets the CURRENT array (r) and must return a NEW one.
  // `[newRow, ...r]` — the spread `...r` copies the old rows into the new array, after newRow.
  // "Immutable" = never edit the old array (no push!) — React only notices a NEW array.
  // Date.now() = a cheap unique id; the template literal `Row ${…}` builds "Row C", "Row D", …
  const prepend = () =>
    setRows((r) => [{ id: Date.now(), label: `Row ${String.fromCharCode(65 + r.length)}` }, ...r]);

  return (
    <div className="card">
      <h3>The key prop — try to break it</h3>
      <ol>
        <li>Type something in the first input below.</li>
        <li>Click "Prepend row" and watch your text stick to the WRONG row.</li>
        <li>Switch to stable id keys and repeat — text follows its row. ✅</li>
      </ol>
      <label>
        {/* Controlled checkbox: checked={state} + onChange reading e.target.checked (a boolean —
            checkboxes use .checked, not .value). ≈ [(ngModel)] two-way binding, done by hand.
            The {' '} after the input is just an explicit space between inline elements. */}
        <input
          type="checkbox"
          checked={useIndexKeys}
          onChange={(e) => setUseIndexKeys(e.target.checked)}
        />{' '}
        use index as key (buggy)
      </label>
      <button onClick={prepend}>Prepend row</button>

      {/* The experiment: the key flips between array POSITION (index) and the row's id.
          Interview: React matches old↔new children BY KEY; index keys lie when you add or
          remove at the front. style={{…}} = inline styles as a JS object (outer {} = JSX,
          inner {} = the object). */}
      {rows.map((row, index) => (
        <div key={useIndexKeys ? index : row.id} style={{ margin: 4 }}>
          <span className="badge">{row.label}</span>{' '}
          {/* Uncontrolled input (no value prop): the DOM node keeps the text — so when React
              reuses the wrong node under an index key, your text visibly sticks to the slot. */}
          <input placeholder={`notes for ${row.label}`} />
        </div>
      ))}
      <p className="muted">
        Rule: keys must be <strong>stable, unique among siblings</strong>, and
        come from your data (ids) — not from array position.
      </p>
    </div>
  );
}

// ─── ③ The page component — stacks the two cards ───
export default function ConditionalAndLists() {
  // <>…</> is a Fragment: groups children without adding a DOM element (≈ ng-container).
  return (
    <>
      <h2>04 · Conditionals & Lists</h2>
      <ConditionalPatterns />
      <KeysDemo />
    </>
  );
}
