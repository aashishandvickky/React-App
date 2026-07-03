/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 13 · React Router v6 (RouterDemo.jsx)

   This page mounts at /13-router/* (see App.jsx), so it can define its
   own NESTED routes — a router-within-a-page, like Angular child routes.
   Covers: nested routes + <Outlet>, useParams, useNavigate,
   useSearchParams.

   WHAT YOU SEE IN THE BROWSER
   Two tabs: "Intro" (a cheat-sheet card) and "Members" (a filterable
   member list). Click a member to open a detail view — watch the URL
   change at every step; the tier filter is stored in the URL too.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① MembersLayout — the layout route: shared heading + an <Outlet>
      where whichever child route matches gets rendered
   ② MemberList — the index (default) child: reads/writes the ?tier=
      query param with useSearchParams, filters members.json, and
      renders a <Link> per member
   ③ MemberDetail — the :memberId child: reads the URL param with
      useParams, looks up the member, and navigates back / to the
      capstone with useNavigate
   ④ RouterDemo — the page component: a <NavLink> tab bar plus the
      nested <Routes> table that wires ①–③ to URLs

   INGREDIENTS USED HERE (what & why)
   • <Routes>/<Route> — the route table, written in JSX; nesting a
     <Route> inside another creates parent/child URLs (④)
   • <Outlet> — where a child route renders inside its layout parent;
     Angular's <router-outlet> (①)
   • <Link>/<NavLink> — navigation without a page reload; NavLink also
     gets an "active" class, like routerLinkActive (② and ④)
   • useSearchParams — read AND write the ?tier= query string, so the
     filter survives reload/share (②)
   • useParams — grab :memberId out of the URL (③)
   • useNavigate — programmatic navigation: -1 for back, or a path;
     Angular's Router.navigate (③)
   • members.json (src/data) — the stub data being listed and filtered

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
import {
  Routes, Route, Link, NavLink, Outlet,
  useParams, useNavigate, useSearchParams,
} from 'react-router-dom';
import members from '../../data/members.json';

// ─── ① Layout route: shared chrome + <Outlet> for children ───
function MembersLayout() {
  return (
    <div className="card">
      <h3>Members section (layout route)</h3>
      <p className="muted">
        The list below renders into an <code>&lt;Outlet/&gt;</code> — Angular's{' '}
        <code>&lt;router-outlet&gt;</code> for child routes.
      </p>
      <Outlet /> {/* child routes render here */}
    </div>
  );
}

// ─── ② Index route: list + query params (useSearchParams) ───
function MemberList() {
  // useSearchParams ≈ ActivatedRoute.queryParams, but read/write.
  const [searchParams, setSearchParams] = useSearchParams();
  const tierFilter = searchParams.get('tier') ?? 'all';

  const visible = members.filter((m) => tierFilter === 'all' || m.tier === tierFilter);

  return (
    <>
      <label>Filter by tier (stored in the URL — try reloading):</label>
      <select
        value={tierFilter}
        onChange={(e) => setSearchParams(e.target.value === 'all' ? {} : { tier: e.target.value })}
      >
        {['all', 'Base', 'Silver', 'Gold', 'Platinum'].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <ul>
        {visible.map((m) => (
          <li key={m.id}>
            {/* Relative link → /13-router/members/M-1001 */}
            <Link to={m.id}>{m.name}</Link> — {m.tier}
          </li>
        ))}
      </ul>
    </>
  );
}

// ─── ③ Detail route: path params (useParams) + useNavigate ───
function MemberDetail() {
  const { memberId } = useParams(); // ≈ ActivatedRoute.snapshot.params
  const navigate = useNavigate();   // ≈ Router.navigate
  const member = members.find((m) => m.id === memberId);

  if (!member) return <p className="error">No member {memberId} (bad URL param).</p>;

  return (
    <>
      <h4>{member.name}</h4>
      <p>
        id <code>{member.id}</code> · tier <strong>{member.tier}</strong> ·{' '}
        {member.points.toLocaleString()} pts · joined {member.joined}
      </p>
      {/* -1 = history.back(); or navigate('..') for "up one route level" */}
      <button onClick={() => navigate(-1)}>← Back</button>
      <button className="secondary" onClick={() => navigate('/19-capstone')}>
        Jump to capstone (programmatic)
      </button>
    </>
  );
}

// ─── ④ The page: tab nav + the nested route table ───
export default function RouterDemo() {
  return (
    <>
      <h2>13 · React Router</h2>

      {/* ─── ④a Local tab nav. NavLink gets an "active" class automatically. ─── */}
      <nav style={{ marginBottom: 8 }}>
        <NavLink to="." end className="badge" style={{ marginRight: 8 }}>Intro</NavLink>
        <NavLink to="members" className="badge">Members (nested routes)</NavLink>
      </nav>

      {/* ─── ④b NESTED route table — these paths hang under /13-router/ ─── */}
      <Routes>
        <Route
          index
          element={
            <div className="card">
              <h3>Routing in JSX</h3>
              <pre>{`<Routes>
  <Route path="members" element={<MembersLayout/>}>   // layout route
    <Route index element={<MemberList/>}/>            // default child
    <Route path=":memberId" element={<MemberDetail/>}/> // URL param
  </Route>
</Routes>

Angular → React Router:
  routerLink            → <Link to>, <NavLink> (active styles)
  <router-outlet>       → <Outlet/>
  ActivatedRoute params → useParams()
  queryParams           → useSearchParams()
  Router.navigate       → useNavigate()
  route guards          → wrapper components / loaders (see NOTES.md)`}</pre>
            </div>
          }
        />
        <Route path="members" element={<MembersLayout />}>
          <Route index element={<MemberList />} />
          <Route path=":memberId" element={<MemberDetail />} />
        </Route>
      </Routes>
    </>
  );
}
