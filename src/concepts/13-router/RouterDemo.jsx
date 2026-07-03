/**
 * CONCEPT 13 — REACT ROUTER (v6)
 * This page mounts at /13-router/* (see App.jsx), so it can define its own
 * NESTED routes — a router-within-a-page, like Angular child routes.
 * Covers: nested routes + <Outlet>, useParams, useNavigate, useSearchParams.
 */
import {
  Routes, Route, Link, NavLink, Outlet,
  useParams, useNavigate, useSearchParams,
} from 'react-router-dom';
import members from '../../data/members.json';

// ---------- Layout route: shared chrome + <Outlet> for children ----------
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

// ---------- Index route: list + query params ------------------------------
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

// ---------- Detail route: path params + programmatic navigation ----------
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

export default function RouterDemo() {
  return (
    <>
      <h2>13 · React Router</h2>

      {/* Local tab nav. NavLink gets an "active" class automatically. */}
      <nav style={{ marginBottom: 8 }}>
        <NavLink to="." end className="badge" style={{ marginRight: 8 }}>Intro</NavLink>
        <NavLink to="members" className="badge">Members (nested routes)</NavLink>
      </nav>

      {/* NESTED route table — these paths hang under /13-router/ */}
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
