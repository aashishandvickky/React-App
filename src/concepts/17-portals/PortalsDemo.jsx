/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 17 · Portals & Modals (PortalsDemo.jsx)

   WHAT YOU SEE IN THE BROWSER
   A short, clipped card (overflow:hidden) with an "Open modal" button.
   Click it: a full-screen modal appears OVER everything — even though
   its JSX lives inside that tiny clipped card. Close it with the
   button, the Escape key, or a click on the dark backdrop.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① Modal — a reusable modal component. Its return value goes through
      createPortal(...), so the DOM lands under document.body instead
      of inside the clipped parent. Also wires an Escape-key listener
      (with cleanup) and stops backdrop clicks from leaking inward.
   ② PortalsDemo — the page. Renders the clipped card that would trap
      a normal modal, the button that opens ①, and closes with a
      "key interview facts" card.

   INGREDIENTS USED HERE (what & why)
   • createPortal (from react-dom) — the star of the show: render JSX
     into a DIFFERENT DOM node (document.body here) while staying in
     the SAME React tree, so context/state/events all still work.
     (Angular analogy: CDK Overlay attaching to document.body.)
   • useState — the `open` boolean that shows/hides the modal.
   • useEffect — adds a document-level keydown listener for Escape and
     removes it in cleanup when the modal unmounts.
   • useRef — holds a reference to the clipped card's DOM node.
   • e.stopPropagation() — clicks inside the dialog must not reach the
     backdrop's onClick (which would close the modal).

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one section on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md

   Use cases for portals: modals, tooltips, dropdowns, toasts — anything
   that must escape parent overflow/z-index/transform traps.
   ═══════════════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ─── ① Modal — reusable dialog rendered through createPortal ───
function Modal({ title, onClose, children }) {
  // Close on Escape — a document-level listener with proper cleanup.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // createPortal(jsx, domNode): the JSX mounts under document.body,
  // NOT under the clipped parent below.
  return createPortal(
    <div
      onClick={onClose} // backdrop click closes
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'grid', placeItems: 'center', zIndex: 1000,
      }}
    >
      {/* stopPropagation so clicks INSIDE the dialog don't hit the backdrop */}
      <div className="card" style={{ minWidth: 320 }} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
        <button onClick={onClose}>Close (or press Esc)</button>
      </div>
    </div>,
    document.body
  );
}

// ─── ② PortalsDemo — the page: clipped parent + open button + facts ───
export default function PortalsDemo() {
  const [open, setOpen] = useState(false);
  const clippedBox = useRef(null);

  return (
    <>
      <h2>17 · Portals & Modals</h2>

      <div
        ref={clippedBox}
        className="card"
        // This parent CLIPS its children — a modal rendered inline here
        // would be cut off. The portal escapes to document.body.
        style={{ overflow: 'hidden', height: 120, position: 'relative' }}
      >
        <h3>A clipped, overflow:hidden parent</h3>
        <button onClick={() => setOpen(true)}>Open modal (via portal)</button>
        {open && (
          <Modal title="Rendered through a portal" onClose={() => setOpen(false)}>
            <p className="muted">
              My JSX lives inside the clipped card in the component tree, but my
              DOM lives under document.body. React context and synthetic events
              still bubble through the REACT tree, not the DOM tree.
            </p>
          </Modal>
        )}
      </div>

      <div className="card">
        <h3>Key interview facts</h3>
        <pre>{`createPortal(children, domNode, key?)

* DOM location changes; REACT tree location doesn't.
* Context works across the portal (same React tree).
* Event bubbling follows the REACT tree — an onClick on the
  clipped card above would fire for clicks inside the modal!
* Real modals also need: focus trap, aria-modal, restoring focus,
  scroll lock (or just use <dialog> / Radix / Headless UI).

Angular analogy: CDK Overlay attaching to document.body.`}</pre>
      </div>
    </>
  );
}
