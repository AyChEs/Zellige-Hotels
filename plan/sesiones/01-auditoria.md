# 01 · Auditoría (solo informe)

Modelo: GLM 5.3 Flash (opencode go)
Rama: `mejora/01-auditoria`, desde `plan/mejoras`. Nunca `main`.
Depende de: 00 fusionada.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/frontend-ui-engineering/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/performance-optimization/SKILL.md`

## Contexto

Lee `plan/REGLAS.md` y `plan/DISENO.md`. Esta sesión **no cambia código de la aplicación**. Produce un informe que usan las sesiones 02 a 07 y una línea base de capturas y axe contra la que comparar.

Frontend en `frontend/src`: rutas en `App.tsx` (16 rutas, perezosas), capas en `components/layout/`, componentes en `components/ui/`, páginas en `pages/{public,account,admin}`, llamadas en `api/`, estilos en `styles/theme.css`.

## Tareas

1. Arranca el frontend contra la API pública: `cd frontend && npm ci && VITE_PROXY_TARGET=https://zellige-hotels.onrender.com npm run dev`. Espera a que `curl -s localhost:5173/api/health` responda (hasta 60 s).
2. Con `plan/herramientas/capturas.mjs` (ver `plan/REGLAS.md`) captura y pasa axe a 390 y 1440 px en estas rutas, usando `SPA=1` y la base `http://localhost:5173`:
   - sin sesión: `/`, `/hotels`, `/hotels/1`, `/login`, `/register`;
   - cliente (`client@hotel-erp.dev`): `/account`, `/account/invoices`, `/account/profile`;
   - admin (`admin@hotel-erp.dev`): `/admin`, `/admin/bookings`, `/admin/calendar`, `/admin/invoices`, `/admin/clients`, `/admin/tasks`, `/admin/hotels`, `/admin/rooms`, `/admin/categories`, `/admin/employees`.
   Guarda todo en `plan/capturas/01/` (incluido `report.json`).
3. Lighthouse de la portada y de `/hotels/1` en móvil y escritorio:
   `npx -y lighthouse@12 http://localhost:5173/ --preset=desktop --output=json --output-path=plan/capturas/01/lh-portada-escritorio.json --chrome-flags="--headless=new"` (y sin `--preset` para móvil). Haz antes `npm run build && npx vite preview --port 5173` para medir el build, no el modo dev.
4. Escribe `plan/AUDITORIA.md` con estas secciones, cada hallazgo con archivo y línea:
   - **Resumen**: tabla pantalla × (violaciones serias/críticas a 390, a 1440, desplazamiento horizontal) y las cuatro notas de Lighthouse.
   - **Accesibilidad**: cada violación de axe con regla, pantalla, elemento y arreglo propuesto. Añade a mano lo que axe no ve: navegación con teclado por la barra lateral y el menú móvil (¿se puede abrir, recorrer y cerrar con Esc?), foco al abrir y cerrar modales, si los errores de formulario se anuncian (`role="alert"` o `aria-live`), si las etiquetas de estado tienen texto.
   - **Inventario de componentes**: para cada clase de `theme.css` (`.btn-*`, `.field-*`, `.card-*`, `.badge`, `.skeleton`, `.bg-arabesque*`, `.divider-arabesque`) y cada componente de `components/ui/`, en cuántos archivos se usa (`grep -rl`). Lista los botones, campos y tarjetas escritos a mano en páginas que deberían usar un componente.
   - **Colores a sustituir**: `grep -rnoE "(glaze|teal|gold|terra)-[0-9]+" frontend/src | sort | uniq -c | sort -rn` resumido por token, para que la sesión 02 sepa el volumen.
   - **Datos y llamadas**: cada `queryKey` (lista completa con archivo), las claves duplicadas o inconsistentes (por ejemplo `['hotels','all']` en cuatro páginas; `['available', …]` en `admin/BookingsPage.tsx` frente a `['availability', …]` en `public/HotelDetailPage.tsx`), invalidaciones demasiado amplias y llamadas repetidas al cargar una pantalla (mira la pestaña de red con Playwright: `page.on('request')`).
   - **Deuda del frontend**: archivos de más de 200 líneas, lógica de negocio en componentes (por ejemplo `roomTotal` en `HotelDetailPage.tsx`), textos sin traducir (`grep -rn "\"[A-ZÁÉÍÓÚ][a-záéíóú]\+ " pages components` y revisión a mano), uso de `motion` y si respeta `useReducedMotion`, imágenes sin `width`/`height` o sin `loading="lazy"`, foto de Unsplash de la portada (`LandingPage.tsx:10`).
   - **Propuesta por sesión**: qué hallazgos resuelve cada sesión 02 a 07. Si alguno no encaja en ninguna, dilo.
5. No arregles nada. Si ves algo urgente que rompe la demo, añádelo arriba del informe en «Urgente» y créalo como tarea en la sesión que corresponda editando su archivo en `plan/sesiones/` (sección «Tareas», al final, con el prefijo «Añadido por 01:»).

## No hacer

- No cambies nada fuera de `plan/`.
- No hagas acciones de escritura contra la API pública (ni reservar, ni cancelar, ni guardar perfiles).

## Criterios de aceptación

- `plan/AUDITORIA.md` existe con las siete secciones y cada hallazgo tiene ruta y línea.
- `plan/capturas/01/` tiene 36 capturas (18 rutas × 2 anchos) y `report.json`.
- `git diff --stat plan/mejoras` solo muestra archivos bajo `plan/`.

## Verificación

```bash
git diff --name-only origin/plan/mejoras | grep -v '^plan/' && echo "ERROR: hay cambios fuera de plan/" || echo ok
```

## Cierre

Commit «Añade la auditoría del frontend», push, PR hacia `plan/mejoras` con el resumen del informe (tabla de la sección Resumen), fusión y marca 01 como hecha en `plan/PLAN.md`.
