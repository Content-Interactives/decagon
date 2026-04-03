# Decagon

React + Vite geometry view of a regular decagon: vertices, interior angles, and symmetry toggles as implemented in `Decagon.jsx`.

**Live site:** [https://content-interactives.github.io/decagon](https://content-interactives.github.io/decagon)

Curriculum alignment and placement: [Standards.md](Standards.md).

---

## Stack

| Layer | Notes |
|--------|--------|
| Build | Vite 6, `@vitejs/plugin-react` |
| UI | React 19 |
| Styling | Tailwind 3 |
| Icons | lucide-react |
| Deploy | `gh-pages -d dist`; `predeploy` runs `vite build` |

---

## Layout

```
vite.config.js          # base: '/decagon/'
src/
  main.jsx → App.jsx → components/Decagon.jsx
  components/ui/
```

---

## `vite.config.js`

`base: '/decagon/'` must match the GitHub Pages repository path.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run deploy` | Build and push `dist/` to `gh-pages` |

---

## Embedding

Polygon SVG/canvas size lives in `Decagon.jsx`; match iframe to that viewport.
