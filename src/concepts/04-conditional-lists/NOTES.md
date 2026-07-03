# 04 · Conditional Rendering & Lists

## Angular → React
| Angular | React |
|---|---|
| `*ngIf="cond"` | `{cond && <X/>}` or `{cond ? <X/> : <Y/>}` |
| `*ngIf else` | ternary |
| `*ngSwitch` | object lookup map or early returns |
| `*ngFor="let x of xs; trackBy: fn"` | `xs.map(x => <Row key={x.id}/>)` |
| `trackBy` | **`key`** — but mandatory-in-practice, not optional |

## Keys — the #1 list interview topic
During reconciliation React matches children of a node between renders **by key**
(falling back to position). The key answers: *"is this the same item as before?"*

- Same key → React **updates** the existing instance (state/DOM preserved).
- New key → old instance is **unmounted** (state destroyed), new one mounted.

### Why `key={index}` is a bug
When the list is reordered/prepended/filtered, positions shift but indexes don't move
with the items. React then pairs old item state (input values, animations, memo) with
the **wrong item**. Index keys are only acceptable for static, never-reordered lists.

### Bonus trick
Changing a component's `key` on purpose **forcibly remounts it** — a common way to
reset a form: `<Form key={userId}/>` gives a fresh form per user.

## Gotchas
- `{0 && <X/>}` renders `0`. Use explicit booleans: `{items.length > 0 && <X/>}`.
- Keys must be unique **among siblings** only — not globally.
- Keys are NOT passed to the component as a prop (`props.key` is undefined).

## Interview questions
- **What are keys and why does React need them?** (identity for reconciliation).
- **Why is index-as-key an anti-pattern?** (state sticks to position, not item).
- **How do you force a component to reset?** Change its `key`.
