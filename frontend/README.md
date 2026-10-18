# Zellige Hotels — frontend

React 19 + TypeScript + Vite, styled with Tailwind 4. See the [repo root README](../README.md)
for how to run the whole stack and what's in it.

```bash
npm install
npm run dev      # http://localhost:5173, proxies /api to the backend
npm test -- --run
npm run build
```

Lint is [oxlint](https://oxc.rs) (`npm run lint`); rules live in `.oxlintrc.json`.

## Probar sin backend local

```bash
VITE_PROXY_TARGET=https://zellige-hotels.onrender.com npm run dev
```

Solo para navegar. No crees ni borres datos: es la base de datos de la demo.
