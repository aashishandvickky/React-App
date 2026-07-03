# 13 · React Router

> 🧭 **New here?** Best order: ① play with this concept's page in the running app,
> ② read the `.jsx` file in this folder (start with its 📖 Beginner's Map at the top),
> ③ then come back here — this file is the theory + interview layer. Confusing words →
> [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md) · exercises → [`docs/EXERCISES.md`](../../../docs/EXERCISES.md)

## Angular Router → React Router v6 cheat sheet
| Angular | React Router |
|---|---|
| `Routes[]` config array | `<Routes>/<Route>` in JSX (or `createBrowserRouter` object form) |
| `routerLink` | `<Link to>` / `<NavLink>` (adds `active` class) |
| `<router-outlet>` | `<Outlet/>` |
| `ActivatedRoute.params` | `useParams()` |
| `queryParams` | `useSearchParams()` (read **and** write) |
| `Router.navigate()` | `useNavigate()` |
| lazy `loadChildren` | `lazy()` per route element (see registry.jsx) |
| `CanActivate` guard | wrapper component (below) or data-router loaders |
| resolvers | v6.4+ `loader` functions (data routers) |

## Route guard — the pattern interviewers want
```jsx
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
// <Route path="admin" element={<RequireAuth><Admin/></RequireAuth>}/>
```

## Concepts to be able to explain
- **Nested/layout routes**: a parent route renders shared chrome + `<Outlet/>`;
  children render into it. `index` marks the default child.
- **Dynamic segments**: `path=":memberId"` → `useParams().memberId`. Always handle the
  not-found case — params are user input.
- **Search params as state**: filters/pagination belong in the URL so views are
  shareable/bookmarkable (`useSearchParams`).
- **`navigate(-1)`** = back; `replace: true` avoids history entries (like Angular's
  `replaceUrl`).
- **BrowserRouter vs HashRouter**: History API vs `#/` URLs; BrowserRouter needs the
  server to serve index.html for all paths (SPA fallback).
- **v6.4+ data routers**: `createBrowserRouter` + `loader`/`action` per route move
  fetching out of components (closer to Angular resolvers). Framework mode of v7 builds
  on the same idea.

## Interview questions
- How is client-side routing different from server routing? (History API, no page load).
- How do you protect a route? (guard wrapper above).
- How do you read/update query params? Why keep filter state in the URL?
- What renders when a child route matches? (`<Outlet/>` chain).
