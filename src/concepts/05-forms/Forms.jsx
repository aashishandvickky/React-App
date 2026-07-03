/**
 * CONCEPT 05 — FORMS: controlled vs uncontrolled
 * Angular has ReactiveForms/ngModel. React has neither — a controlled input
 * is just: value={state} + onChange={setState}. Validation is plain JS.
 */
import { useRef, useState } from 'react';

// ---------- Controlled form (the default choice) -----------------------
function ControlledForm() {
  // One state object for the whole form (or one useState per field — both fine).
  const [form, setForm] = useState({ name: '', email: '', tier: 'Base', agree: false });
  const [submitted, setSubmitted] = useState(null);

  // Generic change handler using the input's name attribute.
  // Checkboxes use e.target.checked, everything else e.target.value.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Validation = derived data. Computed every render, no FormGroup needed.
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Valid email required';
  if (!form.agree) errors.agree = 'You must accept the terms';
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser's full-page POST
    if (isValid) setSubmitted(form);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Controlled form — React state is the single source of truth</h3>

      <label>Name</label>
      {/* value + onChange = "controlled": the DOM shows whatever state holds.
          value without onChange = read-only input (React warns). */}
      <input name="name" value={form.name} onChange={handleChange} />
      {errors.name && <span className="error"> {errors.name}</span>}

      <label>Email</label>
      <input name="email" value={form.email} onChange={handleChange} />
      {errors.email && <span className="error"> {errors.email}</span>}

      <label>Tier</label>
      <select name="tier" value={form.tier} onChange={handleChange}>
        {['Base', 'Silver', 'Gold', 'Platinum'].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <label>
        <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />{' '}
        I accept the terms {errors.agree && <span className="error">{errors.agree}</span>}
      </label>

      <p>
        <button type="submit" disabled={!isValid}>Enroll</button>
      </p>

      <p className="muted">Live state (this is why controlled wins — instant access):</p>
      <pre>{JSON.stringify(form, null, 2)}</pre>
      {submitted && <p className="success">Submitted: {submitted.name} → {submitted.tier}</p>}
    </form>
  );
}

// ---------- Uncontrolled form (refs) ------------------------------------
function UncontrolledForm() {
  // The DOM owns the value; we read it on demand via a ref.
  // Use for: file inputs (always uncontrolled), quick one-shot forms,
  // integrating non-React libraries.
  const nameRef = useRef(null);
  const [greeting, setGreeting] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setGreeting(`Hello, ${nameRef.current.value || 'stranger'}!`);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Uncontrolled form — DOM is the source of truth</h3>
      <label>Name (React does not re-render while you type here)</label>
      <input ref={nameRef} defaultValue="Ashish" /> {/* defaultValue, not value */}
      <button type="submit">Read via ref</button>
      {greeting && <p className="success">{greeting}</p>}
    </form>
  );
}

export default function Forms() {
  return (
    <>
      <h2>05 · Forms</h2>
      <ControlledForm />
      <UncontrolledForm />
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
