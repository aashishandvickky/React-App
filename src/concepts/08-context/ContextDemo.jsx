/**
 * CONCEPT 08 — CONTEXT API
 * Solves PROP DRILLING: passing data through layers of components that don't
 * use it. Angular analogy: a DI-provided service visible to a subtree.
 * Context is a transport for values, NOT a state manager by itself —
 * it's usually paired with useState/useReducer in a provider component.
 */
import { createContext, useContext, useMemo, useState } from 'react';

// 1) CREATE — usually in its own module so any component can import it.
//    The default value is used only when there's NO provider above (rare/tests).
const ThemeContext = createContext(null);

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

// 3) CONSUME — via a custom hook that also guards against a missing provider.
//    Every serious codebase wraps useContext like this.
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

// ---------- Deep tree: no props pass through the middle ------------------
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

// ---------- Nested providers override outer ones --------------------------
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
