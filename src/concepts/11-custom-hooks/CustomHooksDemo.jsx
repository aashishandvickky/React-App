/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 11 · Custom Hooks (CustomHooksDemo.jsx)

   Custom hooks are React's primary code-reuse mechanism (they replace
   Angular services, mixins, HOCs, render-props). Read the three hooks in
   this folder first: useLocalStorage.js · useDebouncedValue.js · useFetch.js

   WHAT YOU SEE IN THE BROWSER
   Three small cards: a nickname box that survives page reloads, a search
   box that shows a "live" vs "debounced" value as you type, and a list
   of posts loaded from a fake API. Plus a closing "key insight" card.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① LocalStorageDemo — an input wired to useLocalStorage.js; the value
      persists in the browser's localStorage across reloads
   ② DebounceDemo — an input wired to useDebouncedValue.js; the debounced
      copy only updates 500ms after you stop typing
   ③ FetchDemo — useFetch.js loads /data/posts.json and hands back
      loading / error / data, which the JSX renders conditionally
   ④ CustomHooksDemo — the page component: assembles ①–③ and ends with
      a card explaining that hooks share LOGIC, not STATE

   INGREDIENTS USED HERE (what & why)
   • useState — plain local state for the search box text in ②
   • useLocalStorage (this folder) — useState that also writes to
     localStorage, so ①'s nickname survives a reload
   • useDebouncedValue (this folder) — delays a fast-changing value;
     RxJS debounceTime as a hook, used in ②
   • useFetch (this folder) — packages fetch + loading/error/data +
     abort into one call, used in ③
   • conditional rendering (&&) — show "Loading…" / error / list in ③
     depending on which state the fetch is in
   • list rendering (.map + key) — turns the posts array into <li>s in ③

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
import { useState } from 'react';
// The three custom hooks — named imports from sibling files in this same folder.
import { useLocalStorage } from './useLocalStorage.js';
import { useDebouncedValue } from './useDebouncedValue.js';
import { useFetch } from './useFetch.js';

// ─── ① useLocalStorage demo — nickname that survives reloads ───
function LocalStorageDemo() {
  // Drop-in replacement for useState — same tuple, but persisted.
  const [nickname, setNickname] = useLocalStorage('lab:nickname', '');
  return (
    <div className="card">
      <h3>useLocalStorage — reload the page, the value survives</h3>
      {/* Standard controlled input (concept 05) — but this setter also writes to localStorage. */}
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="your nickname"
      />
      <p className="muted">Stored under localStorage["lab:nickname"].</p>
    </div>
  );
}

// ─── ② useDebouncedValue demo — live vs debounced text ───
function DebounceDemo() {
  const [query, setQuery] = useState(''); // the "live" value — updates on every keystroke
  // The hook returns a lagging copy that only catches up 500ms after typing stops.
  const debouncedQuery = useDebouncedValue(query, 500);
  return (
    <div className="card">
      <h3>useDebouncedValue — RxJS debounceTime, hook edition</h3>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="type fast…" />
      <p>
        live: <code>{query || '∅'}</code> · debounced (500ms):{' '}
        <code className="success">{debouncedQuery || '∅'}</code>
      </p>
    </div>
  );
}

// ─── ③ useFetch demo — loading / error / data from a fake API ───
function FetchDemo() {
  // Destructuring with RENAME: `data: posts` pulls the `data` field out under the local name
  // `posts`. One hook call ≈ HttpClient + async pipe + manual loading/error flags in Angular.
  const { data: posts, error, loading } = useFetch('/data/posts.json');
  return (
    <div className="card">
      <h3>useFetch — loading/error/data + abort, packaged once</h3>
      {/* Conditional rendering: && shows the right side only while the left is truthy — as the
          fetch progresses, exactly one of these three branches is visible. In the list branch,
          .slice(0, 3) copies the first three posts and .map renders each as an <li> (key=id). */}
      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {posts && (
        <ul>
          {posts.slice(0, 3).map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── ④ The page — assembles ①–③ plus the key-insight card ───
export default function CustomHooksDemo() {
  return (
    <>
      <h2>11 · Custom Hooks</h2>
      <LocalStorageDemo />
      <DebounceDemo />
      <FetchDemo />
      {/* ─── ④ Key insight: hooks share LOGIC, not STATE ─── */}
      <div className="card">
        <h3>Key insight: hooks share LOGIC, not STATE</h3>
        <pre>{`Two components calling useLocalStorage('k', …) each run their own
useState — independent instances of the logic (unlike an Angular
singleton service). To SHARE state, combine a custom hook with
context (concept 08) or an external store (concept 14).`}</pre>
      </div>
    </>
  );
}
