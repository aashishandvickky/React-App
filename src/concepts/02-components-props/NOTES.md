# 02 · Components & Props

> 🧭 **New here?** Best order: ① play with this concept's page in the running app,
> ② read the `.jsx` file in this folder (start with its 📖 Beginner's Map at the top),
> ③ then come back here — this file is the theory + interview layer. Confusing words →
> [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md) · exercises → [`docs/EXERCISES.md`](../../../docs/EXERCISES.md)

## Mental model
A React component is **a function that takes props and returns elements**. It re-runs
(re-renders) whenever its state changes or its parent re-renders. There is no change
detection scanning templates — the function simply executes again and React diffs the output.

## Angular → React
| Angular | React |
|---|---|
| `@Input() name` | `props.name` (read-only) |
| `@Output() pick = new EventEmitter()` | callback prop: `onPick={fn}` |
| `<ng-content>` | `props.children` |
| named `<ng-content select>` | multiple props holding JSX: `header={<X/>}` |
| Component class + template | one function returning JSX |
| DI service to share logic | custom hooks (concept 11) |

## Rules
- **Props are read-only.** Mutating them breaks the whole model (pure renders).
- **One-way data flow**: data flows down via props, changes flow up via callbacks.
- **Lifting state up**: when siblings need the same data, the state moves to the common parent.
- Component names must be **Capitalized** — `<div>` is a DOM tag, `<Panel>` looks up a variable.
- Don't store **derivable** data in state — compute it in render (`filter`, `map`).

## Interview questions
- **Functional vs class components?** Functions + hooks are the standard since React 16.8.
  Classes remain for legacy code and error boundaries (concept 16).
- **How do you pass data child → parent?** A callback prop; the child invokes it.
- **What is `children`?** A regular prop containing nested JSX — the composition primitive.
- **What are pure components?** Components whose output depends only on props/state and that
  render without side effects. `React.memo` (concept 10) skips re-rendering when props are equal.
- **Composition vs inheritance?** React strongly favors composition — you virtually never
  extend a component class.
