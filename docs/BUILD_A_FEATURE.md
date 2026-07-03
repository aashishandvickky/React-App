# 🛠️ Build a Feature — your first "real ticket", end to end

Reading code teaches you React. **Writing** a feature teaches you the job. This guide
walks you through adding a complete new page to this app the way a real work ticket
would: branch → build → test → commit. Type the code yourself — don't paste. The typos
you make and fix are the actual learning.

Do this after finishing the concepts (or at least 01–05, 13, and a look at 15).

---

## The ticket

> **MEM-101 — Members directory page**
>
> The Rewards team wants a page to browse loyalty members.
>
> **Acceptance criteria**
> 1. New sidebar entry "20 · ★ Exercise: Members" showing all members from our data.
> 2. Each member shows name, tier, and points.
> 3. A search box filters members by name as you type.
> 4. A dropdown filters by tier (Gold/Silver/Platinum).
> 5. Clicking a member opens a detail view at `/20-members/<id>` with all their info
>    and a way back.
> 6. A test proves the search filter works.

Everything you need already exists in the repo: the data is `src/data/members.json`,
and every technique is covered by a concept you've seen (03 state, 04 lists, 05 forms,
13 router). This ticket is about *composing* them — which is what real work is.

---

## Step 0 — Start like a professional: a branch

```bash
git checkout -b feature/members-page
```

Now you can experiment freely; `main` stays clean. (This is the workflow at every job.)

## Step 1 — Make an empty page appear in the app

Smallest possible slice first — get *something* on screen, then grow it. Real devs
work this way; it means you're never more than one small step from working code.

Create the folder and file `src/concepts/20-members/Members.jsx`:

```jsx
export default function Members() {
  return <h2>Members directory</h2>;
}
```

Then register it — open `src/concepts/registry.jsx` and add one line to the array,
following the pattern of the 19 entries above it:

```jsx
{ path: '/20-members', title: '20 · ★ Exercise: Members', Component: lazy(() => import('./20-members/Members.jsx')) },
```

Save. The sidebar now has entry 20 (thanks to HMR, no restart needed). Click it —
your heading is on screen. **The app has a new page and you wrote it.** Notice you
didn't touch `App.jsx`: the registry drives both sidebar and routes.

## Step 2 — Render the list (concept 04: lists & keys)

Replace the file's contents with a version that imports the data and maps over it:

```jsx
import members from '../../data/members.json';

export default function Members() {
  return (
    <div>
      <h2>Members directory</h2>
      <p className="muted">{members.length} members</p>

      {members.map((m) => (
        // key = stable identity so React can track each card across re-renders
        <div className="card" key={m.id} data-testid="member-card">
          <strong>{m.name}</strong>{' '}
          <span className="badge">{m.tier}</span>
          <p className="muted">{m.points.toLocaleString()} points</p>
        </div>
      ))}
    </div>
  );
}
```

Criteria 1 and 2 ✅. (The `data-testid` is for the test in step 6.)

## Step 3 — Search box (concepts 03 + 05: state + controlled input)

The React pattern to internalize here: **store the raw input in state, compute the
filtered list during render.** The filtered list is *derived data* — it never goes
into state itself.

```jsx
import { useState } from 'react';
import members from '../../data/members.json';

export default function Members() {
  const [query, setQuery] = useState('');

  // Derived on every render — no effect, no extra state. This is idiomatic React.
  const visible = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2>Members directory</h2>

      <input
        type="search"
        placeholder="Search by name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <p className="muted">{visible.length} of {members.length} members</p>

      {visible.map((m) => (
        <div className="card" key={m.id} data-testid="member-card">
          <strong>{m.name}</strong>{' '}
          <span className="badge">{m.tier}</span>
          <p className="muted">{m.points.toLocaleString()} points</p>
        </div>
      ))}
    </div>
  );
}
```

Type in the box — the list narrows on every keystroke. Criterion 3 ✅.

## Step 4 — Tier dropdown (same pattern, second control)

Add a second piece of state and extend the filter. Derive the dropdown's options from
the data itself, so a new tier in the JSON appears automatically:

```jsx
const [tier, setTier] = useState('All');

const tiers = ['All', ...new Set(members.map((m) => m.tier))];

const visible = members.filter(
  (m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) &&
    (tier === 'All' || m.tier === tier)
);
```

And in the JSX, next to the search box:

```jsx
<select value={tier} onChange={(e) => setTier(e.target.value)}>
  {tiers.map((t) => (
    <option key={t}>{t}</option>
  ))}
</select>
```

Both filters now combine. Criterion 4 ✅.

## Step 5 — Detail route (concept 13: nested routes)

`App.jsx` registers every concept as `path/*` — the `/*` means "this page may define
its own sub-routes". So your page can own everything under `/20-members/`. Restructure
the file into three components:

```jsx
import { useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import members from '../../data/members.json';

function MemberList() {
  // …everything from steps 3–4 goes here, with one change:
  // wrap each card's name in a relative link to the detail view:
  //   <Link to={m.id}><strong>{m.name}</strong></Link>
}

function MemberDetail() {
  const { id } = useParams();               // grabs :id from the URL
  const member = members.find((m) => m.id === id);

  if (!member) return <p className="error">No member with id {id}.</p>;

  return (
    <div className="card">
      <h2>{member.name}</h2>
      <p><span className="badge">{member.tier}</span></p>
      <p>{member.points.toLocaleString()} points</p>
      <p className="muted">Member since {member.joined}</p>
      <p className="muted">{member.email}</p>
      <Link to="..">← Back to all members</Link>
    </div>
  );
}

export default function Members() {
  return (
    <Routes>
      <Route index element={<MemberList />} />   {/* /20-members        */}
      <Route path=":id" element={<MemberDetail />} /> {/* /20-members/M-1001 */}
    </Routes>
  );
}
```

Click a name → detail view; note the URL changed and Back works (so does the browser's
back button — it's a real navigation). Criterion 5 ✅.

## Step 6 — Prove it with a test (see docs/TESTING.md)

Create `src/__tests__/Members.test.jsx`. The test imports the same JSON as the
component, so it never hardcodes names and survives data changes:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Members from '../concepts/20-members/Members.jsx';
import members from '../data/members.json';

test('search narrows the member list by name', async () => {
  // The page uses <Link>/<Routes>, so it needs a router around it in tests.
  render(
    <MemoryRouter>
      <Members />
    </MemoryRouter>
  );

  // All members visible at first.
  expect(screen.getAllByTestId('member-card')).toHaveLength(members.length);

  // Type a real member's name into the search box, like a user would.
  const target = members[0];
  await userEvent.type(screen.getByRole('searchbox'), target.name);

  // Only matching members remain.
  const expected = members.filter((m) =>
    m.name.toLowerCase().includes(target.name.toLowerCase())
  );
  expect(screen.getAllByTestId('member-card')).toHaveLength(expected.length);
  expect(screen.getByText(target.name)).toBeInTheDocument();
});
```

```bash
npm test
```

Green? Criterion 6 ✅ — ticket complete.

## Step 7 — Finish like a professional: commit and merge

```bash
git add .
git commit -m "Add members directory page with search, tier filter, detail route + test"
git checkout main
git merge feature/members-page
git push
```

That's the full shape of real frontend work: **ticket → branch → smallest visible
slice → grow it → test → merge.** Every feature you ever ship will feel like this.

---

## Stretch goals (each maps to a concept you've learned)

Pick any, in rough difficulty order:

1. **Sort dropdown** (by points / by join date) — more derived state (03).
2. **Debounce the search** with `useDebouncedValue` from `src/concepts/11-custom-hooks/` (11).
3. **Remember the last search** across page reloads with `useLocalStorage` (11).
4. **Show each member's posts** on the detail page — fetch `/data/posts.json` at
   runtime with loading/error states and filter by `author` (15).
5. **Highlight the top spender** — memoize an expensive-looking computation (10).
6. **Guard against bad data** — wrap the list in the error boundary from 16 and make a
   card throw when a member has no `tier` (16).

If you get stuck: each stretch goal's concept folder contains a working example of
exactly that technique. That's how real devs work too — nobody remembers everything;
they know where to look.
