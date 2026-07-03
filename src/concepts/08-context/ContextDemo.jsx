/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 08 · Context API (ContextDemo.jsx)

   WHAT YOU SEE IN THE BROWSER
   Three cards: a theme-toggle button that lives three components deep
   (yet no props were passed down), a second button locked to light theme
   by a nested provider, and a text card about consumer re-renders.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① ThemeContext — createContext(): the "channel" components tune into.
   ② ThemeProvider — a wrapper component that OWNS the theme state and
      broadcasts { theme, toggle } to everything under it.
   ③ useTheme — a custom hook wrapping useContext, with a guard that
      throws if there is no provider above.
   ④ Toolbar → Section → ThemedButton — a deep tree where the middle
      layers pass NO props, yet the button reads the theme.
   ⑤ NestedProvidersDemo — a second, inner provider forcing light theme;
      consumers always read the NEAREST provider above them.
   ⑥ ContextDemo — the page: wraps everything in ThemeProvider and lays
      out the three cards.

   INGREDIENTS USED HERE (what & why)
   • createContext — makes the context object itself (≈ an injection
     token). Default value only applies when no provider exists.
   • useContext   — reads the nearest provider's value (via useTheme ③).
   • useState     — the actual theme state, kept INSIDE the provider ②;
     context only transports it (context is not a state manager itself).
   • useMemo      — keeps the provider's value object reference-stable so
     consumers don't re-render on every provider render.
   Angular analogy: a DI-provided service visible to one subtree — this
   whole file solves PROP DRILLING (passing a prop down through layers
   that don't use it, only forward it).

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// Named imports — the four React APIs this file uses (see INGREDIENTS above for each one's job).
import { createContext, useContext, useMemo, useState } from 'react';

// ─── ① ThemeContext — create the context ───
// 1) CREATE — usually in its own module so any component can import it.
//    The default value is used only when there's NO provider above (rare/tests).
const ThemeContext = createContext(null); // null = "no provider above" — the guard in ③ checks it

// ─── ② ThemeProvider — own the state, broadcast it downward ───
// 2) PROVIDE — a wrapper component owning the state + exposing an API.
//    This "provider component" pattern is the usual React way to build a mini state manager.
// { children } destructures the children prop — whatever JSX gets nested inside <ThemeProvider>.
// Angular analogy: <ng-content>. The provider adds no UI of its own, it just wraps.
function ThemeProvider({ children }) {
  // Array destructuring: useState returns [currentValue, setterFn]. Theme starts as 'dark'.
  const [theme, setTheme] = useState('dark');
  // Arrow fn; setTheme gets an UPDATER — `t` is the current theme, the ternary returns the next.
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // ⚠️ PERF: value={{ theme, toggle }} inline creates a NEW object every
  // render → every consumer re-renders every time. useMemo keeps the reference
  // stable (hands back the SAME object) until `theme` actually changes.
  // Interview: consumers compare `value` by REFERENCE (same object in memory?) —
  // any new object counts as "changed".
  // Syntax note: () => ({ … }) — the extra parens make the arrow RETURN an object literal.
  const value = useMemo(() => ({ theme, toggle }), [theme]);

  // .Provider is built into every context object; whatever `value` holds is what consumers read.
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── ③ useTheme — read the context via a guarded custom hook ───
// 3) CONSUME — via a custom hook that also guards against a missing provider.
//    Every serious codebase wraps useContext like this.
function useTheme() {
  // useContext reads the value of the NEAREST matching provider above this component.
  const ctx = useContext(ThemeContext);
  // No provider → ctx is the default (null) → fail fast with a clear message, instead of a
  // confusing "cannot read property of null" somewhere downstream.
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

// ─── ④ Toolbar → Section → ThemedButton — deep tree, zero props drilled ───
function Toolbar() {
  // Note: Toolbar gets NO theme props — yet ThemedButton below can read it.
  return (
    <div>
      <p className="muted">Toolbar → Section → ThemedButton (no props drilled)</p>
      <Section />
    </div>
  );
}
function Section() {
  return <ThemedButton />;
}
function ThemedButton() {
  const { theme, toggle } = useTheme(); // reads the NEAREST provider above
  // Ternary picks an inline-style OBJECT per theme (React inline styles are JS objects).
  const styles =
    theme === 'dark'
      ? { background: '#0b1220', color: '#e2e8f0' }
      : { background: '#f8fafc', color: '#0f172a' };
  // The button's style spreads (...styles) the theme colors, then adds a border on top.
  // onClick={toggle} calls a function living up in ThemeProvider — no props were drilled.
  return (
    <button style={{ ...styles, border: '1px solid var(--border)' }} onClick={toggle}>
      Current theme: {theme} — click to toggle
    </button>
  );
}

// ─── ⑤ NestedProvidersDemo — nested providers override outer ones ───
function NestedProvidersDemo() {
  // A <ThemeContext.Provider> can appear anywhere in JSX. Consumers under THIS one read its
  // value ('light'), shadowing the outer ThemeProvider — like a child injector in Angular DI.
  // toggle is a no-op arrow fn (() => {}), so the inner button can't actually switch themes.
  return (
    <ThemeContext.Provider value={{ theme: 'light', toggle: () => {} }}>
      <p className="muted">
        This subtree sits under a SECOND provider forcing light theme —
        consumers read the <strong>nearest</strong> provider: <ThemedButton />
      </p>
    </ThemeContext.Provider>
  );
}

// ─── ⑥ ContextDemo — the page, wrapped in ThemeProvider ───
export default function ContextDemo() {
  return (
    <ThemeProvider>
      <h2>08 · Context API</h2>
      <div className="card">
        <h3>Provider → deep consumer</h3>
        <Toolbar />
      </div>
      <div className="card">
        <h3>Nearest provider wins</h3>
        <NestedProvidersDemo />
      </div>
      <div className="card">
        <h3>When context re-renders consumers</h3>
        <p className="muted">
          Every consumer re-renders when the provider's <code>value</code> changes by
          reference — even components between provider and consumer that use no context
          are unaffected. Hence: memoize the value, split fast-changing and slow-changing
          data into separate contexts, and don't put your whole app state in one context.
        </p>
      </div>
    </ThemeProvider>
  );
}
