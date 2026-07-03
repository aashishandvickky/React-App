/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 02 · Components & Props (ComponentsProps.jsx)

   WHAT YOU SEE IN THE BROWSER
   A page with 3 cards: tier buttons that filter a row of member badges,
   a card explaining content projection, and a code snippet on immutability.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① MemberBadge — a child that only RECEIVES data via props (like @Input)
   ② TierPicker  — a child that "emits" by CALLING a callback prop (@Output)
   ③ Panel       — a child that wraps whatever you nest inside it (children)
   ④ The parent  — owns the selected tier in state, derives the visible list
   ⑤ A card: data down, events up (TierPicker + MemberBadge working together)
   ⑥ A card: children = content projection (like <ng-content>)
   ⑦ A card: props are read-only — what NOT to do

   INGREDIENTS USED HERE (what & why)
   • props          — values a parent passes into a child (like @Input)
   • callback prop  — a function passed down; the child calls it to "emit"
   • children       — the JSX you nest between a component's open/close tags
   • useState       — one value React remembers between renders + its setter
   • derived data   — computed from state during render, never stored again

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one function or card. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
import { useState } from 'react';
import members from '../../data/members.json';

// ─── ① MemberBadge — a child receiving plain props (like @Input) ───
// Props arrive as ONE object; destructuring in the signature is idiomatic.
// Default values use JS default-parameter syntax.
function MemberBadge({ name, tier = 'Base', points }) {
  return (
    <span className="badge" style={{ marginRight: 8 }}>
      {name} · {tier} · {points.toLocaleString()} pts
    </span>
  );
}

// ─── ② TierPicker — a child that "emits" via a callback prop (like @Output) ───
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

// ─── ③ Panel — a child that renders whatever you nest inside it (children) ───
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

// ─── ④ The parent — owns the state, derives the visible members ───
export default function ComponentsProps() {
  const [selectedTier, setSelectedTier] = useState('Gold');

  // Derived data — computed during render, NOT stored in state.
  // (Storing derivable data in state is a common interview red flag.)
  const visible = members.filter((m) => m.tier === selectedTier);

  return (
    <>
      <h2>02 · Components & Props</h2>

      {/* ─── ⑤ A card: data down, events up ─── */}
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

      {/* ─── ⑥ A card: children = content projection ─── */}
      <Panel title="children = content projection">
        <p>
          This paragraph was passed INTO Panel via <code>props.children</code>,
          exactly like projecting into <code>&lt;ng-content&gt;</code>.
        </p>
      </Panel>

      {/* ─── ⑦ A card: props are read-only ─── */}
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
