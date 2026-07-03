/**
 * CONCEPT 02 — COMPONENTS & PROPS
 * Props = @Input(). Callback props = @Output(). children = <ng-content>.
 * Key law: PROPS ARE READ-ONLY (one-way data flow, top → down).
 */
import { useState } from 'react';
import members from '../../data/members.json';

// ---------- Child 1: plain props (like @Input) -------------------------
// Props arrive as ONE object; destructuring in the signature is idiomatic.
// Default values use JS default-parameter syntax.
function MemberBadge({ name, tier = 'Base', points }) {
  return (
    <span className="badge" style={{ marginRight: 8 }}>
      {name} · {tier} · {points.toLocaleString()} pts
    </span>
  );
}

// ---------- Child 2: callback prop (like @Output + EventEmitter) -------
// React has no EventEmitter. The parent passes a FUNCTION down;
// the child calls it to "emit". Data down, events up.
function TierPicker({ tiers, selected, onSelect }) {
  return (
    <div>
      {tiers.map((t) => (
        <button
          key={t}
          className={t === selected ? '' : 'secondary'}
          onClick={() => onSelect(t)} // "emitting" = calling the prop
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ---------- Child 3: children prop (like <ng-content>) -----------------
// Whatever you nest between <Panel>…</Panel> arrives as props.children.
// This is the composition primitive that replaces content projection.
function Panel({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// ---------- Parent ------------------------------------------------------
export default function ComponentsProps() {
  const [selectedTier, setSelectedTier] = useState('Gold');

  // Derived data — computed during render, NOT stored in state.
  // (Storing derivable data in state is a common interview red flag.)
  const visible = members.filter((m) => m.tier === selectedTier);

  return (
    <>
      <h2>02 · Components & Props</h2>

      <Panel title="Data down, events up">
        <p className="muted">
          Parent owns the state; TierPicker "emits" via the onSelect callback
          prop; MemberBadge just receives data. One-way flow — no [(ngModel)]
          between components.
        </p>
        <TierPicker
          tiers={['Base', 'Silver', 'Gold', 'Platinum']}
          selected={selectedTier}
          onSelect={setSelectedTier} // passing the state setter directly is fine
        />
        <p>
          {visible.length === 0
            ? 'No members in this tier.'
            : visible.map((m) => (
                <MemberBadge key={m.id} name={m.name} tier={m.tier} points={m.points} />
              ))}
        </p>
      </Panel>

      <Panel title="children = content projection">
        <p>
          This paragraph was passed INTO Panel via <code>props.children</code>,
          exactly like projecting into <code>&lt;ng-content&gt;</code>.
        </p>
      </Panel>

      <Panel title="Props are immutable">
        <pre>{`function Bad({ points }) {
  points = points + 100;   // ❌ never mutate/reassign props
}
// State the child owns? -> useState in the child.
// Parent's data must change? -> parent passes a callback prop.`}</pre>
      </Panel>
    </>
  );
}
