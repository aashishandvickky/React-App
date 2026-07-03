/**
 * CONCEPT 04 — CONDITIONAL RENDERING & LISTS (keys!)
 * *ngIf → ternary / &&      *ngFor → array.map() + key
 */
import { useState } from 'react';
import todos from '../../data/todos.json';

function ConditionalPatterns() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const items = status === 'ready' ? todos : [];

  return (
    <div className="card">
      <h3>Conditional patterns (*ngIf equivalents)</h3>
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
          {items.map((t) => (
            <li key={t.id}>{t.done ? '✅' : '⬜️'} {t.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * WHY INDEX KEYS BREAK — an interactive proof.
 * Each row has an UNCONTROLLED input (DOM holds the text). Keys tell React
 * which old row matches which new row. With index keys, prepending a row
 * makes React think row 0 is still row 0 — so your typed text stays with
 * the POSITION, not the item it belonged to.
 */
function KeysDemo() {
  const [rows, setRows] = useState([
    { id: 1, label: 'Row A' },
    { id: 2, label: 'Row B' },
  ]);
  const [useIndexKeys, setUseIndexKeys] = useState(true);

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
        <input
          type="checkbox"
          checked={useIndexKeys}
          onChange={(e) => setUseIndexKeys(e.target.checked)}
        />{' '}
        use index as key (buggy)
      </label>
      <button onClick={prepend}>Prepend row</button>

      {rows.map((row, index) => (
        <div key={useIndexKeys ? index : row.id} style={{ margin: 4 }}>
          <span className="badge">{row.label}</span>{' '}
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

export default function ConditionalAndLists() {
  return (
    <>
      <h2>04 · Conditionals & Lists</h2>
      <ConditionalPatterns />
      <KeysDemo />
    </>
  );
}
