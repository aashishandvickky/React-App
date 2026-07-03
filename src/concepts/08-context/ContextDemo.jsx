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
   whole file solves PROP DRILLING.

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
import { createContext, useContext, useMemo, useState } from 'react';

// ─── ① ThemeContext — create the context ───
// 1) CREATE — usually in its own module so any component can import it.
//    The default value is used only when there's NO provider above (rare/tests).
const ThemeContext = createContext(null);

// ─── ② ThemeProvider — own the state, broadcast it downward ───
// 2) PROVIDE — a wrapper component owning the state + exposing an API.
//    This "provider component" pattern is the idiomatic mini state manager.
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // ⚠️ PERF: value={{ theme, toggle }} inline creates a NEW object every
  // render → every consumer re-renders every time. useMemo keeps the
  // reference stable until `theme` actually changes.
  const value = useMemo(() => ({ theme, toggle }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── ③ useTheme — read the context via a guarded custom hook ───
// 3) CONSUME — via a custom hook that also guards against a missing provider.
//    Every serious codebase wraps useContext like this.
function useTheme() {
  const ctx = useContext(ThemeContext);
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
  const styles =
    theme === 'dark'
      ? { background: '#0b1220', color: '#e2e8f0' }
      : { background: '#f8fafc', color: '#0f172a' };
  return (
    <button style={{ ...styles, border: '1px solid var(--border)' }} onClick={toggle}>
      Current theme: {theme} — click to toggle
    </button>
  );
}

// ─── ⑤ NestedProvidersDemo — nested providers override outer ones ───
function NestedProvidersDemo() {
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
