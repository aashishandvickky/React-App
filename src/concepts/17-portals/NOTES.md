# 17 · Portals & Modals

> 🧭 **New here?** Best order: ① play with this concept's page in the running app,
> ② read the `.jsx` file in this folder (start with its 📖 Beginner's Map at the top),
> ③ then come back here — this file is the theory + interview layer. Confusing words →
> [`docs/GLOSSARY.md`](../../../docs/GLOSSARY.md) · exercises → [`docs/EXERCISES.md`](../../../docs/EXERCISES.md)

## What a portal is
`createPortal(children, domNode)` renders `children` into any DOM node (usually
`document.body`) while the component stays **in place in the React tree**.

## Why you need it
Modals/tooltips/dropdowns rendered inline get trapped by ancestor CSS:
`overflow: hidden`, `z-index` stacking contexts, `transform` (which creates a new
containing block for `position: fixed`!). Portalling to `body` escapes all of that.

## The two-trees insight (the interview answer)
- **DOM tree**: the portal's markup lives under `document.body`.
- **React tree**: the portal is still a child of the component that rendered it, so:
  - **Context** flows into the portal normally.
  - **Synthetic events bubble through the React tree** — a click inside the modal
    bubbles to the React parent that rendered it, even though the DOM ancestor is `body`.

## Production modal checklist (accessibility)
- Focus moves into the dialog on open; **focus trap** while open; focus restored on close.
- `role="dialog"` + `aria-modal="true"` + labelled title.
- Escape closes; backdrop click closes (with `stopPropagation` inside).
- Body scroll lock.
- Or use the native `<dialog>` element / Radix UI / Headless UI instead of hand-rolling.

Angular analogy: CDK Overlay.

## Interview questions
- What problem do portals solve? (CSS containment traps).
- Does context work through a portal? (yes — same React tree).
- Where do events from inside a portal bubble to? (React parent, not DOM parent).
- What makes a modal accessible? (checklist above).
