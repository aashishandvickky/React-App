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
// Named import of the useState hook — { } picks one export out of the module (destructuring).
import { useState } from 'react';
// Vite imports JSON directly — `members` is a plain JS array, baked in at build time.
import members from '../../data/members.json';

// ─── ① MemberBadge — a child receiving plain props (like @Input) ───
// Props arrive as ONE object; destructuring it in the signature is the normal React style.
// `tier = 'Base'` is a JS default value — used when the parent doesn't pass that prop.
function MemberBadge({ name, tier = 'Base', points }) {
  return (
    // className = CSS class (JSX name for the reserved word `class`). style={{ … }}:
    // outer { } = JSX expression, inner { } = a JS object; bare numbers mean pixels.
    <span className="badge" style={{ marginRight: 8 }}>
      {/* { } interpolates each prop; toLocaleString() adds thousands separators. */}
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
      {/* .map turns each tier string into a <button>; (t) => (…) is an arrow function.
          Each button's props:
          key       — required inside .map so React can track items (concept 04)
          className — a ternary: cond ? ifTrue : ifFalse. Selected gets the default look.
          onClick   — pass a FUNCTION. () => onSelect(t) runs on click;
                      onClick={onSelect(t)} would call it during render. Interview classic. */}
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
// This is React's basic tool for nesting content — it replaces Angular's content projection.
function Panel({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {/* Whatever the parent nested inside <Panel>…</Panel> renders right here. */}
      {children}
    </div>
  );
}

// ─── ④ The parent — owns the state, derives the visible members ───
export default function ComponentsProps() {
  // useState('Gold') returns a PAIR [currentValue, setterFn], grabbed with array
  // destructuring; 'Gold' is the initial value. Calling setSelectedTier(...) schedules a
  // re-render (React updates the screen a moment later, not instantly).
  // Interview: the setter is async/batched (updates are grouped) — `selectedTier`
  // keeps its old value until the next render runs this function again.
  const [selectedTier, setSelectedTier] = useState('Gold');

  // Derived data — computed during render, NOT stored in state.
  // (Storing derivable data in state is a common interview red flag.)
  const visible = members.filter((m) => m.tier === selectedTier); // keep only that tier

  return (
    <>
      <h2>02 · Components & Props</h2>

      {/* ─── ⑤ A card: data down, events up ─── */}
      {/* Using our own component as a tag. title="…" is a string prop (like @Input). */}
      <Panel title="Data down, events up">
        <p className="muted">
          Parent owns the state; TierPicker "emits" via the onSelect callback
          prop; MemberBadge just receives data. One-way flow — no [(ngModel)]
          between components.
        </p>
        {/* Props going down (like @Input bindings):
            tiers    — an inline array literal (non-string prop values need { })
            selected — the current state value (data down)
            onSelect — the setter passed as a callback; the child calls it (events up) */}
        <TierPicker
          tiers={['Base', 'Silver', 'Gold', 'Platinum']}
          selected={selectedTier}
          onSelect={setSelectedTier} // passing the state setter directly is fine
        />
        {/* Conditional rendering: a ternary inside { } replaces *ngIf/else.
            Each badge gets a stable key plus three data props. */}
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
