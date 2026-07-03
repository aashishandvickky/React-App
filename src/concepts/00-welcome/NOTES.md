# 00 · Start Here

This page is the in-app version of `docs/START_HERE.md` — onboarding for the lab
itself, not a React concept. There is deliberately nothing to learn in its code
except one thing:

**It's the simplest possible component.** No state, no hooks, no props — just a
function returning JSX. Every other page in this app is this same idea plus one
new ingredient at a time. If you can read `Welcome.jsx`, you can already read 30%
of React code in the wild.

## The one interview-adjacent note

This page still demonstrates two things worth noticing:

- `<Link to="/01-jsx-basics">` navigates without a page reload (concept 13 explains
  how). Angular analogy: `routerLink`.
- The page is lazy-loaded like all others — check the Network tab: its JS chunk
  (`Welcome-*.js`) only downloads when you visit `/00-welcome`.

## Where to go next

Concept 01, and keep `docs/START_HERE.md` / `docs/EXERCISES.md` open as your
study companions.
