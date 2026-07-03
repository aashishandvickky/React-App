# TypeScript with React

You already know TS from Angular — this repo uses plain JSX to keep the React concepts
front and center, but real jobs are React+TS. Here's the entire delta, since the language
is the same.

## Typing components & props

```tsx
type BadgeProps = {
  name: string;
  tier?: 'Base' | 'Silver' | 'Gold' | 'Platinum';  // union > enum in React-land
  onSelect: (id: string) => void;                   // callback prop (@Output)
  children?: React.ReactNode;                       // anything renderable
};

function MemberBadge({ name, tier = 'Base', onSelect, children }: BadgeProps) { … }
```
- `React.FC<Props>` is unnecessary/discouraged — just type the props parameter.
- `ReactNode` = anything renderable; `ReactElement` = a JSX element specifically.
- Extending native elements: `type Props = React.ComponentProps<'button'> & { loading?: boolean }`.

## Typing hooks

```tsx
const [user, setUser] = useState<User | null>(null);  // explicit when it can't infer
const [count, setCount] = useState(0);                // inferred: number

const inputRef = useRef<HTMLInputElement>(null);      // DOM ref — null! like @ViewChild
const timerId = useRef<number | undefined>(undefined); // mutable value ref

// useReducer — a discriminated union of actions gives exhaustive switches:
type Action =
  | { type: 'added'; text: string }
  | { type: 'toggled'; id: number }
  | { type: 'deleted'; id: number };
function reducer(state: Todo[], action: Action): Todo[] { … }

// Context — nullable + guarded hook (same pattern as concept 08):
const CartContext = createContext<CartValue | null>(null);
function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart outside provider');
  return ctx;  // narrowed to CartValue
}
```

## Typing events (the part everyone googles)

```tsx
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setX(e.target.value);
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
const onClick  = (e: React.MouseEvent<HTMLButtonElement>) => …;
const onKey    = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && …;
```
Tip: write the handler inline first, hover for the inferred type, then extract.

## Generic components

```tsx
type ListProps<T> = { items: T[]; renderItem: (item: T) => React.ReactNode };
function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((i, idx) => <li key={idx}>{renderItem(i)}</li>)}</ul>;
}
// usage infers T:  <List items={members} renderItem={(m) => m.name} />
```

## Redux Toolkit + TS
`configureStore` infers the state: `type RootState = ReturnType<typeof store.getState>`,
`type AppDispatch = typeof store.dispatch`, then pre-typed hooks
(`useAppSelector`, `useAppDispatch`) — the documented pattern.

## Converting this repo to TS (a great exercise)
1. `npm i -D typescript @types/react @types/react-dom`, add `tsconfig.json`
   (Vite template: `npm create vite@latest x -- --template react-ts` and copy it).
2. Rename `.jsx` → `.tsx` one concept at a time; fix errors as they surface.
3. Type the JSON imports: `const products: Product[] = productsJson;`.

## Interview questions
- ReactNode vs ReactElement? Why avoid React.FC? How do you type children?
- How do you type useRef for a DOM node vs a mutable value?
- Discriminated unions for reducer actions — why? (exhaustiveness).
- How do you type a generic list component? An event handler?
