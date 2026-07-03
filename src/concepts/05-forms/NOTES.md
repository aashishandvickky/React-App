# 05 · Forms

## Controlled vs uncontrolled — the interview staple
| | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state | The DOM |
| Wiring | `value` + `onChange` | `defaultValue` + `ref` |
| Re-renders | every keystroke | none while typing |
| Validation | live, trivial | on submit |
| Angular analogy | Reactive Forms (ish) | template ref `#name` + reading `.value` |

Default to **controlled**: instant validation, conditional UI, formatting, single source
of truth. Reach for uncontrolled for file inputs (`<input type="file">` is always
uncontrolled), perf-sensitive giant forms, or wrapping non-React widgets.

## Gotchas
- `value` without `onChange` → read-only field + React warning. If you want an initial
  value only, use `defaultValue`.
- Checkboxes/radios use `checked` / `defaultChecked`, not `value`.
- `e.preventDefault()` in `onSubmit` or the browser does a full-page form POST.
- One generic handler via `name` attribute + computed property `[name]: value` scales nicely.

## No FormGroup? Correct.
React ships no form abstraction. Plain state + derived `errors` object covers small forms.
For real apps: **React Hook Form** (most popular), **Formik**, plus **Zod/Yup** for schema
validation. Know these names for interviews.

## Interview questions
- **Controlled vs uncontrolled input?** (table above — say "source of truth").
- **Why does typing lag in a huge controlled form and how do you fix it?**
  Every keystroke re-renders the form component; fix by splitting field components,
  uncontrolled inputs (RHF), or debouncing derived work.
- **How do you handle file uploads?** Uncontrolled + `ref.current.files`.
