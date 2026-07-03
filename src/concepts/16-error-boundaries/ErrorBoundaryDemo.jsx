/**
 * CONCEPT 16 — ERROR BOUNDARIES & CLASS COMPONENTS
 * Two interview topics in one, because error boundaries are the ONE thing
 * that still REQUIRES a class component (no hook equivalent yet).
 */
import { Component, useState } from 'react';

/**
 * A CLASS COMPONENT — know the anatomy even if you'll rarely write one:
 * state in this.state, updates via this.setState (merges, unlike useState),
 * lifecycle methods instead of effects, render() returns JSX.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // Called during render when a DESCENDANT throws → return new state
  // to show the fallback UI. Must be pure (no side effects here).
  static getDerivedStateFromError(error) {
    return { error };
  }

  // Called after the error is committed → side effects OK.
  // This is where you'd send the error to Sentry/Datadog.
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] caught:', error.message, info.componentStack);
  }

  handleRetry = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
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
    return this.props.children;
  }
}

/** A component that can throw DURING RENDER (what boundaries catch). */
function BuggyPointsWidget() {
  const [points, setPoints] = useState(100);
  if (points > 300) {
    // Thrown during render → caught by the nearest boundary above.
    throw new Error(`Points exploded at ${points}! (thrown during render)`);
  }
  return (
    <div className="card">
      <h3>BuggyPointsWidget — crashes above 300</h3>
      <p>Points: {points}</p>
      <button onClick={() => setPoints((p) => p + 150)}>Earn 150 (3rd click throws)</button>
    </div>
  );
}

function HandlerErrorWidget() {
  const [caught, setCaught] = useState(null);
  return (
    <div className="card">
      <h3>Event-handler errors are NOT caught by boundaries</h3>
      <button
        onClick={() => {
          try {
            // Errors in handlers happen outside rendering — boundaries never
            // see them. Plain try/catch is the right tool here.
            throw new Error('boom from onClick');
          } catch (e) {
            setCaught(e.message);
          }
        }}
      >
        Throw in onClick (handled locally)
      </button>
      {caught && <p className="success">try/catch caught: “{caught}”</p>}
    </div>
  );
}

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
