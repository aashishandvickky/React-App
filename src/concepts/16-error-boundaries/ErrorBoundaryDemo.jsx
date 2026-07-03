/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 16 · Error Boundaries & Class Components

   WHAT YOU SEE IN THE BROWSER
   A points widget that deliberately crashes on the 3rd click — but the
   crash stays inside its card (fallback UI + "Try again" button) while
   the rest of the page keeps working. A second button throws inside an
   onClick to prove boundaries do NOT catch handler errors.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① ErrorBoundary — a CLASS component (the one place classes are still
      required). Catches render errors from its children and shows a
      fallback UI with a retry button instead of a blank page.
   ② BuggyPointsWidget — a normal function component that throws DURING
      RENDER once points pass 300. This is the kind of error ① catches.
   ③ HandlerErrorWidget — throws inside an onClick handler; boundaries
      never see that, so plain try/catch handles it locally.
   ④ ErrorBoundaryDemo — the page. Wraps ② in ①, shows ③ unwrapped,
      and ends with a caught / not-caught cheat-sheet card.

   INGREDIENTS USED HERE (what & why)
   • class Component — error boundaries have NO hook equivalent, so this
     is the one class component in the whole app. Anatomy: this.state,
     this.setState (merges!), and a render() method that returns JSX.
   • static getDerivedStateFromError — called when a child throws during
     render; returns new state that switches on the fallback UI.
   • componentDidCatch — called after the error commits; the place to
     log to Sentry/Datadog (side effects allowed here).
   • useState — powers the two small function-component widgets.
   • try/catch — the correct tool for event-handler errors (③).
     (Angular analogy: a scoped, declarative ErrorHandler for one
     subtree instead of one global handler.)

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md

   Two interview topics in one, because error boundaries are the ONE thing
   that still REQUIRES a class component (no hook equivalent yet).
   ═══════════════════════════════════════════════════════════════════════ */
// Named imports in braces (like `import { Component } from '@angular/core'`):
// Component = the base class a CLASS component must extend; useState = the state hook
// for the two small function components further down.
import { Component, useState } from 'react';

// ─── ① ErrorBoundary — the class component that catches render crashes ───
/**
 * A CLASS COMPONENT — know the anatomy even if you'll rarely write one:
 * state in this.state, updates via this.setState (merges, unlike useState),
 * lifecycle methods instead of effects, render() returns JSX.
 */
// `extends Component` plugs the class into React's lifecycle machinery — required here
// because getDerivedStateFromError/componentDidCatch only exist on classes.
class ErrorBoundary extends Component {
  // Runs once when React creates the instance. `props` = the attributes passed in JSX
  // (all your @Input()s bundled into one object).
  constructor(props) {
    super(props); // must call the parent constructor before `this` can be used
    this.state = { error: null }; // class state is ONE plain object on the instance
  }

  // Called during render when a DESCENDANT throws → return new state
  // to show the fallback UI. Must be pure (no side effects here).
  // `static` = defined on the class itself, not the instance — so no `this` in here.
  static getDerivedStateFromError(error) {
    return { error }; // shorthand for { error: error }; React merges it into this.state
  }

  // Called after the error is committed → side effects OK.
  // This is where you'd send the error to Sentry/Datadog.
  componentDidCatch(error, info) {
    // info.componentStack lists the component chain that was rendering when it threw.
    console.error('[ErrorBoundary] caught:', error.message, info.componentStack);
  }

  // Class field + arrow function: assigning an arrow keeps `this` bound to the instance,
  // so no `.bind(this)` in the constructor (a classic class-component gotcha).
  // Note: this.setState MERGES the object into state; useState setters REPLACE the value.
  handleRetry = () => this.setState({ error: null });

  // render() is the class equivalent of a function component's body: read state, return JSX.
  render() {
    if (this.state.error) { // an error was captured → show fallback UI instead of children
      return (
        <div className="card" style={{ borderColor: 'var(--bad)' }}>
          <h3 className="error">⚠ Something went wrong in this section</h3>
          <p className="muted">{String(this.state.error.message)}</p>
          {/* Retry = clear the error and re-render the children. */}
          <button onClick={this.handleRetry}>Try again</button>
        </div>
      );
    }
    // No error → render children normally (transparent wrapper).
    // this.props.children = whatever JSX was nested between the boundary's tags (≈ ng-content).
    return this.props.children;
  }
}

// ─── ② BuggyPointsWidget — throws during render (boundaries catch this) ───
/** A component that can throw DURING RENDER (what boundaries catch). */
function BuggyPointsWidget() {
  const [points, setPoints] = useState(100); // array destructuring: [value, setter], starts at 100
  if (points > 300) {
    // Thrown during render → caught by the nearest boundary above.
    // Template literal: backticks + ${…} embed a value in the string (same as in TypeScript).
    throw new Error(`Points exploded at ${points}! (thrown during render)`);
  }
  return (
    <div className="card">
      <h3>BuggyPointsWidget — crashes above 300</h3>
      <p>Points: {points}</p>
      {/* Updater form: setPoints(p => p + 150) computes the next value from the previous. */}
      <button onClick={() => setPoints((p) => p + 150)}>Earn 150 (3rd click throws)</button>
    </div>
  );
}

// ─── ③ HandlerErrorWidget — onClick errors need try/catch, not boundaries ───
function HandlerErrorWidget() {
  const [caught, setCaught] = useState(null); // the caught error message (null = nothing yet)
  return (
    <div className="card">
      <h3>Event-handler errors are NOT caught by boundaries</h3>
      <button
        onClick={() => {
          try {
            // Errors in handlers happen outside rendering — boundaries never
            // see them. Plain try/catch is the right tool here.
            // Interview: same for async errors (setTimeout, promises) — invisible to boundaries.
            throw new Error('boom from onClick');
          } catch (e) {
            setCaught(e.message);
          }
        }}
      >
        Throw in onClick (handled locally)
      </button>
      {/* && rendering: null is falsy → nothing; once set, the message shows (≈ *ngIf). */}
      {caught && <p className="success">try/catch caught: “{caught}”</p>}
    </div>
  );
}

// ─── ④ ErrorBoundaryDemo — the page: boundary-wrapped widget + cheat sheet ───
export default function ErrorBoundaryDemo() {
  return (
    <>
      <h2>16 · Error Boundaries & Class Components</h2>
      <p className="muted">
        The widget below is wrapped in a boundary — its crash stays contained;
        the rest of the page (and the sidebar) keeps working.
      </p>
      {/* Scope boundaries to failure domains: per widget/route, not one global. */}
      <ErrorBoundary>
        <BuggyPointsWidget />
      </ErrorBoundary>
      <HandlerErrorWidget />
      <div className="card">
        <h3>What boundaries do / don't catch</h3>
        <pre>{`CAUGHT:   render errors · lifecycle errors · constructor errors
          — of any DESCENDANT (not the boundary itself)
NOT:      event handlers (try/catch) · async/setTimeout/promises ·
          SSR errors · errors thrown in the boundary component

Hooks: getDerivedStateFromError/componentDidCatch have NO hook
equivalent → classes required. Production shortcut: the
react-error-boundary package (+ its useErrorBoundary hook).`}</pre>
      </div>
    </>
  );
}
