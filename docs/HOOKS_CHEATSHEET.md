# Hooks Cheatsheet — every hook on one page

## The ones you use daily

```js
// useState — component state. Setter schedules re-render. (concept 03)
const [x, setX] = useState(initial);          // or useState(() => expensiveInit())
setX(next); setX(prev => next);               // functional form for prev-dependent

// useEffect — sync with external systems, AFTER paint. (concept 06)
useEffect(() => {
  const sub = subscribe(dep);
  return () => sub.unsubscribe();             // cleanup: before re-run + unmount
}, [dep]);                                    // none=every render · []=mount · [d]=on change

// useRef — mutable box, no re-render on write. DOM handles. (concept 07)
const box = useRef(initial);                  // box.current
<input ref={box} />

// useContext — read nearest provider's value. (concept 08)
const theme = useContext(ThemeContext);

// useReducer — (state, action) => state; complex transitions. (concept 09)
const [state, dispatch] = useReducer(reducer, initialArg, initFn?);

// useMemo / useCallback — referential stability + expensive calcs. (concept 10)
const value = useMemo(() => compute(a, b), [a, b]);
const onSave = useCallback((id) => save(id), []);
```

## The occasional ones

```js
// useLayoutEffect — like useEffect but SYNC before paint (DOM measuring)
useLayoutEffect(() => { const h = ref.current.offsetHeight; setH(h); }, []);

// useTransition / useDeferredValue — non-urgent updates (concept 18)
const [isPending, startTransition] = useTransition();
startTransition(() => setHeavyState(v));
const deferred = useDeferredValue(value);

// useId — stable unique ids (SSR-safe); NOT for list keys
const id = useId();  // <label htmlFor={id}> <input id={id}/>

// useImperativeHandle — curate what a ref to your component exposes (concept 07)
useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }));

// useSyncExternalStore — subscribe to non-React stores (how react-redux works)
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);

// useDebugValue — label custom hooks in DevTools
```

## React 19 additions

```js
// use() — read a promise or context IN render (works inside conditionals!)
const data = use(fetchPromise);        // suspends until resolved
const theme = use(ThemeContext);

// Actions — async transitions for forms/mutations
const [state, submitAction, isPending] = useActionState(async (prev, formData) => {
  return await save(formData);
}, initialState);
const [optimistic, addOptimistic] = useOptimistic(items, (cur, newItem) => [...cur, newItem]);
// <form action={submitAction}> — form actions replace manual onSubmit plumbing
```

## Library hooks you should recognize

```js
// react-redux (concept 14)
const points = useSelector(selectPoints);
const dispatch = useDispatch();

// react-router (concept 13)
const { id } = useParams();  const navigate = useNavigate();
const [searchParams, setSearchParams] = useSearchParams();
const location = useLocation();

// TanStack Query (know the shape)
const { data, error, isLoading } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
const mutation = useMutation({ mutationFn: addPost });
```

## Decision table

| I need to… | Hook |
|---|---|
| show a value that changes | `useState` |
| complex/related state transitions | `useReducer` |
| talk to network/timers/DOM/non-React | `useEffect` (+cleanup) |
| measure DOM before paint | `useLayoutEffect` |
| keep a value without re-rendering | `useRef` |
| touch a DOM element | `useRef` + `ref=` |
| read shared/global value | `useContext` |
| expensive computation / stable object | `useMemo` |
| stable function for memo children/deps | `useCallback` |
| keep typing fast during heavy update | `useTransition` / `useDeferredValue` |
| unique element id | `useId` |
| reuse any combination of the above | write a custom hook |
