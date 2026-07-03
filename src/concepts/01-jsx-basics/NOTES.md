# 01 · JSX Basics

> 🧭 **New here?** Best order: ① play with this concept's page in the running app,
> ② read the `.jsx` file in this folder (start with its 📖 Beginner's Map at the top),
> ③ then come back here — this file is the theory + interview layer. Confusing words →
> [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md) · exercises → [`docs/EXERCISES.md`](../../../docs/EXERCISES.md)

## What JSX is
JSX is a syntax extension that compiles to plain function calls producing **React elements** —
lightweight JS objects like `{ type: 'h2', props: {...}, key: null }`. An element is a
*description* of UI, not a DOM node. React compares element trees between renders
(**reconciliation**) and patches only what changed in the real DOM.

## Angular → React mapping
| Angular | React (JSX) |
|---|---|
| `{{ expr }}` | `{ expr }` |
| `[class]`, `class` | `className` |
| `[style.color]="c"` | `style={{ color: c }}` (object, camelCase) |
| `<ng-container>` | `<>…</>` (Fragment) |
| Template syntax compiled by Angular compiler | JSX compiled by Babel/esbuild to `jsx()` calls |

## Rules that trip people up
1. One root node per return — use a Fragment `<>…</>` if needed.
2. `{ }` accepts **expressions only** — no `if`/`for` statements (use ternaries / `map`).
3. `class` → `className`, `for` → `htmlFor` (they're JS reserved words).
4. `false`, `null`, `undefined` render **nothing**; but `0` **does render** — classic bug:
   `{items.length && <List/>}` renders `0` when empty. Use `{items.length > 0 && ...}`.
5. JSX escapes values by default → XSS-safe. The escape hatch is deliberately named
   `dangerouslySetInnerHTML`.

## Interview questions
- **What does JSX compile to?** `jsx()` / `React.createElement()` calls returning element objects.
- **Element vs Component vs Instance?** Component = function/class (blueprint). Element = the
  object a render returns. React manages instances/fiber nodes internally — you never `new` them.
- **Why can't you use an `if` inside `{}`?** `{}` takes expressions; statements have no value.
  Use `cond ? a : b`, `cond && a`, or compute above the `return`.
- **Is JSX required?** No — it's sugar for `createElement`, but universally used.
