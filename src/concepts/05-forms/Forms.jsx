/* ═══════════════════════════════════════════════════════════════════════
   📖 BEGINNER'S MAP — 05 · Forms (Forms.jsx)

   WHAT YOU SEE IN THE BROWSER
   Two forms — a controlled enrollment form with live validation and a live
   JSON view of its state, and an uncontrolled name form read via a ref —
   plus a card naming the form libraries real projects use.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
   ① ControlledForm   — React state holds every field's value; validation
      is recomputed each render (no FormGroup, no ngModel — just JS)
   ② UncontrolledForm — the DOM holds the value; a ref reads it on submit
   ③ The page component — stacks both forms…
   ④ …and a card: the libraries interviews expect you to name

   INGREDIENTS USED HERE (what & why)
   • useState          — the form values live in React state (controlled)
   • controlled input  — value={state} + onChange={handler}; the input
                         shows whatever state holds — state is the truth
   • derived validation— errors computed from state every render, not stored
   • useRef            — a handle to a real DOM node; read .current.value
                         on demand (uncontrolled — the DOM is the truth)
   • e.preventDefault()— stops the browser's full-page form submit

   HOW TO READ THIS FILE
   Open the page in the browser next to this file. Each numbered marker
   below (①, ②, …) matches one form/card on screen. Read NOTES.md in this
   folder for the theory. Confused by a word? → docs/GLOSSARY.md
   ═══════════════════════════════════════════════════════════════════════ */
// useState → controlled form values live in React; useRef → a DOM handle for the uncontrolled one.
import { useRef, useState } from 'react';

// ─── ① ControlledForm — state-driven, the default choice ───
function ControlledForm() {
  // One state object for the whole form (or one useState per field — both fine).
  const [form, setForm] = useState({ name: '', email: '', tier: 'Base', agree: false });
  const [submitted, setSubmitted] = useState(null); // last valid submission, or null (= hidden)

  // Generic change handler using the input's name attribute.
  // Checkboxes use e.target.checked, everything else e.target.value.
  const handleChange = (e) => {
    // Object destructuring: pull four fields off the DOM input that fired the event (e.target).
    const { name, value, type, checked } = e.target;
    // Functional update + spread: `...f` copies the previous form's fields, then we overwrite ONE.
    // [name] is a computed key — the input's name attribute decides which field to update.
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Validation = derived data. Computed every render, no FormGroup needed.
  const errors = {}; // a plain object, rebuilt from scratch on every render
  if (!form.name.trim()) errors.name = 'Name is required'; // .trim() → all-spaces fails too
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Valid email required'; // regex .test()
  if (!form.agree) errors.agree = 'You must accept the terms';
  const isValid = Object.keys(errors).length === 0; // valid simply means: no error keys added above

  // Fires on submit — Enter in a field or clicking the submit button both land here.
  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser's full-page POST
    if (isValid) setSubmitted(form); // freeze a copy of the current state as "submitted"
  };

  // onSubmit lives on the <form>, not onClick on the button — that way Enter works too.
  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Controlled form — React state is the single source of truth</h3>

      <label>Name</label>
      {/* value + onChange = "controlled": the DOM shows whatever state holds.
          value without onChange = read-only input (React warns). */}
      <input name="name" value={form.name} onChange={handleChange} />
      {/* && short-circuit: when the left side is false, React renders nothing at all.
          So each error line shows only while that error exists (*ngIf). Same for email. */}
      {errors.name && <span className="error"> {errors.name}</span>}

      <label>Email</label>
      <input name="email" value={form.email} onChange={handleChange} />
      {errors.email && <span className="error"> {errors.email}</span>}

      <label>Tier</label>
      {/* <select> is controlled the same way — value= on the <select> itself, options built
          with .map. key={t} is fine: the strings are unique and the list never reorders. */}
      <select name="tier" value={form.tier} onChange={handleChange}>
        {['Base', 'Silver', 'Gold', 'Platinum'].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <label>
        {/* Checkboxes are controlled via checked= (a boolean), not value=. The shared handler
            branches on type === 'checkbox'. {' '} is just an explicit space. */}
        <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />{' '}
        I accept the terms {errors.agree && <span className="error">{errors.agree}</span>}
      </label>

      <p>
        {/* Derived validity drives the UI directly — no form.valid observable needed. */}
        <button type="submit" disabled={!isValid}>Enroll</button>
      </p>

      <p className="muted">Live state (this is why controlled wins — instant access):</p>
      {/* JSON.stringify(value, null, 2) pretty-prints the state — a live debug view that
          updates on every keystroke, because every keystroke re-renders. */}
      <pre>{JSON.stringify(form, null, 2)}</pre>
      {submitted && <p className="success">Submitted: {submitted.name} → {submitted.tier}</p>}
    </form>
  );
}

// ─── ② UncontrolledForm — DOM-driven, read via a ref ───
function UncontrolledForm() {
  // The DOM owns the value; we read it on demand via a ref.
  // Use for: file inputs (always uncontrolled), quick one-shot forms,
  // integrating non-React libraries.
  const nameRef = useRef(null); // a box { current: null } — React fills it with the <input> node
  const [greeting, setGreeting] = useState(''); // '' is falsy → the success line starts hidden

  const handleSubmit = (e) => {
    e.preventDefault(); // same trick as above: keep the browser from reloading the page
    // Read the DOM on demand: .current is the real <input>, .value its text right now.
    // Template literal builds the string; || falls back when the field is empty.
    // Interview: controlled vs uncontrolled — typing here causes ZERO React re-renders.
    setGreeting(`Hello, ${nameRef.current.value || 'stranger'}!`);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Uncontrolled form — DOM is the source of truth</h3>
      <label>Name (React does not re-render while you type here)</label>
      {/* ref={nameRef} → after mount, nameRef.current IS this DOM node. defaultValue sets the
          initial text once; React never tracks the typing afterwards. */}
      <input ref={nameRef} defaultValue="Ashish" /> {/* defaultValue, not value */}
      <button type="submit">Read via ref</button>
      {greeting && <p className="success">{greeting}</p>}
    </form>
  );
}

// ─── ③ The page component — stacks both forms ───
export default function Forms() {
  return (
    <>
      <h2>05 · Forms</h2>
      <ControlledForm />
      <UncontrolledForm />
      {/* ─── ④ A card: what real projects use instead of hand-rolled forms ─── */}
      <div className="card">
        <h3>Real projects</h3>
        <p className="muted">
          Hand-rolled controlled forms get verbose at scale. Interviews expect you to
          name <strong>React Hook Form</strong> (uncontrolled + refs → fast) and{' '}
          <strong>Formik</strong> (controlled), usually with <strong>Zod/Yup</strong> schemas —
          the ecosystem's answer to Angular Reactive Forms.
        </p>
      </div>
    </>
  );
}
