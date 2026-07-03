/**
 * CONCEPT 11 — CUSTOM HOOKS
 * The primary code-reuse mechanism in React (replaces Angular services,
 * mixins, HOCs, render-props). Read the three hooks in this folder first:
 * useLocalStorage.js · useDebouncedValue.js · useFetch.js
 */
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { useDebouncedValue } from './useDebouncedValue.js';
import { useFetch } from './useFetch.js';

function LocalStorageDemo() {
  // Drop-in replacement for useState — same tuple, but persisted.
  const [nickname, setNickname] = useLocalStorage('lab:nickname', '');
  return (
    <div className="card">
      <h3>useLocalStorage — reload the page, the value survives</h3>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="your nickname"
      />
      <p className="muted">Stored under localStorage["lab:nickname"].</p>
    </div>
  );
}

function DebounceDemo() {
  const [query, setQuery] = useState('');
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

function FetchDemo() {
  const { data: posts, error, loading } = useFetch('/data/posts.json');
  return (
    <div className="card">
      <h3>useFetch — loading/error/data + abort, packaged once</h3>
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

export default function CustomHooksDemo() {
  return (
    <>
      <h2>11 · Custom Hooks</h2>
      <LocalStorageDemo />
      <DebounceDemo />
      <FetchDemo />
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
