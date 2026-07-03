# Angular → React: the translation dictionary

You know Angular well — this maps every Angular concept to its React equivalent, with the
mental-model differences that actually matter.

## The philosophical difference (understand this first)

**Angular is a framework** — DI, router, forms, HTTP, RxJS, i18n, one blessed way.
**React is a library** for rendering UI — everything else is ecosystem choices.

**Change detection vs re-render:** Angular keeps your template and class instance alive and
scans for changes (Zone.js/signals). React **re-runs your entire component function** and
diffs the output. There is no persistent instance with fields you mutate — each render is a
fresh closure over that render's props/state. Most React bugs (stale closures, broken memo)
come from not internalizing this.

**Mutation vs immutability:** In Angular you mutate class fields. In React you NEVER mutate
state — you produce new values, because change detection *is* reference comparison.

## Template syntax

| Angular | React |
|---|---|
| `{{ value }}` | `{value}` |
| `[prop]="x"` | `prop={x}` |
| `(click)="fn($event)"` | `onClick={(e) => fn(e)}` |
| `[(ngModel)]="x"` | `value={x} onChange={e => setX(e.target.value)}` (explicit) |
| `*ngIf="c"` | `{c && <X/>}` / ternary |
| `*ngIf="c; else tpl"` | `{c ? <X/> : <Y/>}` |
| `*ngFor="let i of xs; trackBy"` | `{xs.map(i => <X key={i.id}/>)}` |
| `*ngSwitch` | object lookup / early returns |
| `[class.on]="c"` | `` className={c ? 'on' : ''} `` |
| `[style.px]` | `style={{ width: px }}` |
| pipes `x \| currency` | plain functions / `Intl` / `useMemo` |
| `<ng-content>` | `{children}` |
| `<ng-container>` | `<>…</>` |
| `<ng-template>` | JSX in variables / render props |
| `#ref` template var | `useRef` + `ref={r}` |

## Component model

| Angular | React |
|---|---|
| `@Component` class + template | one function returning JSX |
| `@Input()` | props (read-only) |
| `@Output() + EventEmitter` | callback props |
| `ngOnInit` | `useEffect(fn, [])` |
| `ngOnChanges` | `useEffect(fn, [prop])` (or compute in render) |
| `ngOnDestroy` | effect **cleanup** function |
| `ngAfterViewInit` | `useLayoutEffect` / ref access in effect |
| `OnPush` strategy | `React.memo` |
| `@ViewChild` | `useRef` |
| directives | components / custom hooks / plain props |
| structural directives | components taking children/render props |

## Services, DI, and state

| Angular | React |
|---|---|
| injectable service (logic) | custom hook |
| singleton service (shared state) | context + hook, or store (Redux/Zustand) |
| hierarchical injectors | nested context providers (nearest wins) |
| NgRx | Redux Toolkit (see concept 14 — near 1:1) |
| NgRx Effects | thunks / RTK listener middleware |
| signals (`signal`, `computed`) | `useState` + derived values in render / `useMemo` |

## RxJS → React

React has no built-in reactive streams. The replacements:

| RxJS usage | React way |
|---|---|
| `HttpClient` + observables | `fetch` + async/await in effects; TanStack Query for real apps |
| `debounceTime` on input | debounce hook (concept 11) |
| `combineLatest` for view models | just compute in render — every render sees latest everything |
| `switchMap` (cancel previous) | AbortController in effect cleanup (concept 15) |
| `shareReplay` caching | TanStack Query / SWR cache |
| `Subject` for cross-component events | lift state up / context / store |
| `takeUntil(destroy$)` | effect cleanup |

The biggest relief: most `combineLatest`/`map` view-model plumbing simply disappears —
render code always sees the latest state, and derived data is plain expressions.

## Router / Forms / Testing / Tooling

Covered in depth in: concept 13 NOTES (router), concept 05 NOTES (forms),
docs/TESTING.md, and the build tooling comments in `vite.config.js`.

## Habits to unlearn

1. Mutating fields (`this.items.push(x)`) → always new references.
2. Waiting for lifecycle hooks to compute view state → derive in render.
3. Reaching for a service/subject to share state → lift state up first, context second.
4. Two-way binding → controlled components make the flow explicit.
5. `fdescribe`-era instance testing → test behavior via the rendered UI.
6. Expecting the framework to pick libraries → in React, choosing (router, forms,
   state, fetching) is part of the job — see docs/ECOSYSTEM_AND_BEYOND.md.
