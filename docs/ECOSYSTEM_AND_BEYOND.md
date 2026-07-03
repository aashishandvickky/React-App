# Ecosystem & Beyond — what else interviews expect you to know

This repo teaches core React. Interviews also probe the landscape. Per topic: what it is,
when to use it, and the one-liner that shows you get it.

## Frameworks: Next.js (and friends)

**Next.js** = the dominant React framework: file-based routing, SSR/SSG/ISR, API routes,
Server Components, image/font optimization. The React team itself points app builders to
frameworks. Alternatives: **Remix/React Router v7 framework mode** (web-fundamentals,
loaders/actions), **Astro** (content sites, islands), **Expo/React Native** (mobile).

One-liner: "Vite SPA for internal tools/dashboards; Next.js when SEO, streaming SSR, or
server components matter."

### 📝 Planned exercise: rebuild the capstone in Next.js

Deliberately NOT done in this repo — this codebase stays a plain Vite SPA so the React
fundamentals stay front and center. Once concepts 01–19 feel comfortable, rebuild the
capstone Rewards Store (concept 19) as a separate sibling project:

```bash
npx create-next-app@latest rewards-store-next   # App Router, JS, no Tailwind
```

Port the capstone feature over and note what changes — that diff IS the lesson:

1. **Routing**: React Router routes (concept 13) → `app/` folder structure; `<Link>`,
   `useParams` → Next equivalents; the router config file disappears.
2. **Server vs client**: everything here is a Client Component. Start with server
   components by default and add `"use client"` only where hooks/interactivity live —
   the boundary decision is the core Next.js skill.
3. **Data fetching**: the `useEffect` + AbortController pattern (concept 15) → `async`
   server components / `fetch` with built-in caching; keep one client-side fetch to
   compare.
4. **Redux**: the store must be created per-request and provided in a client component —
   notice how much of the capstone state can just live on the server instead.
5. **Lazy loading**: per-route code-splitting comes for free instead of `React.lazy`.

Interview payoff: "I built the same feature as a Vite SPA and as a Next.js app" +
concretely naming what moved to the server. Compare the rendering-strategies table below
before and after.

### Rendering strategies
| | HTML produced | When |
|---|---|---|
| CSR (this repo) | in the browser | dashboards, internal apps |
| SSR | per request | dynamic + SEO |
| SSG | at build | marketing, docs, blogs |
| ISR | build + revalidate | mostly-static at scale |

**Hydration**: React attaching listeners/state to server HTML. Hydration mismatch =
server/client rendered differently (e.g. `Date.now()`) — a favorite interview bug.

### React Server Components (RSC)
Run **only on the server**: zero JS shipped, can touch DBs directly, `async` components
with `await`. Client components opt in via `'use client'` (needed for state/effects/
events). Not the same as SSR: SSR renders client components to HTML *and* hydrates them;
RSC components never hydrate. Server Actions (`'use server'`) = RPC mutations from forms.

## Server state: TanStack Query (React Query)

The biggest architectural shift of the last few years: **server cache ≠ app state**.
`useQuery({ queryKey, queryFn })` gives caching, dedup, background refetch,
stale-while-revalidate, retries, pagination, optimistic updates. Kills most Redux
boilerplate. SWR is the lighter alternative; RTK Query if you're already in Redux.

## Client state spectrum (know where each fits)

`useState` → `useReducer` → context (+reducer) → **Zustand** (tiny external store,
hooks-first) → **Jotai** (atoms) → **Redux Toolkit** (big teams, devtools, discipline).
Interview answer: "server state to TanStack Query first; what remains is usually small
enough for useState/context/Zustand."

## Styling (have an opinion)

- **CSS Modules** (`x.module.css`) — scoped like Angular's ViewEncapsulation; zero runtime.
- **Tailwind CSS** — utility classes; the current default in many teams.
- **styled-components/Emotion** — CSS-in-JS, waning (runtime cost, RSC-unfriendly).
- Component libs: **shadcn/ui** (copy-in components on Radix + Tailwind), **MUI**, Mantine,
  Chakra; headless: **Radix UI**, Headless UI (≈ Angular CDK).

## Forms & validation
**React Hook Form** (uncontrolled, performant, `register`/`handleSubmit`) + **Zod**
(schema → inferred TS types). The React answer to Angular Reactive Forms.

## Tooling
- **Vite** (this repo) — dev server + build; CRA is dead.
- **ESLint** with `eslint-plugin-react-hooks` — the exhaustive-deps rule is load-bearing.
- **React DevTools** — component tree + Profiler ("why did this render?").
- Monorepos: Turborepo/Nx (you know Nx from Angular).

## Architecture patterns worth naming
- **Container/presentational** (legacy but asked): logic components vs pure UI.
- **Compound components**: `<Tabs><Tabs.List/><Tabs.Panel/></Tabs>` sharing context.
- **Feature-folder structure** over type-folders (like Angular feature modules).
- **Colocation**: tests, styles, hooks live next to the component using them.

## Accessibility & misc rapid-fire
- Semantic HTML first; ARIA when needed; focus management in modals (concept 17).
- `dangerouslySetInnerHTML` + sanitization (XSS).
- Lists need stable keys (concept 04) — yes, it comes up this often.
- Error tracking: Sentry via error boundaries (concept 16).
- i18n: react-i18next / FormatJS.

## A 30-second "tell me about the React ecosystem" answer
"Core React handles rendering; for an app I'd pick Vite or Next.js depending on SSR needs,
React Router or the framework's router, TanStack Query for server data, something small
like Zustand — or RTK on bigger teams — for client state, React Hook Form + Zod for forms,
Tailwind or CSS Modules for styling, and Vitest + Testing Library + MSW for tests."
