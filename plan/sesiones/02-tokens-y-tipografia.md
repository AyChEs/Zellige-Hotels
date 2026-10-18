# 02 · Tokens de diseño y tipografía autoalojada

Modelo: GLM 5.3 (opencode go), razonamiento high
Rama: `mejora/02-tokens`, desde `plan/mejoras`. Nunca `main`.
Depende de: 01 fusionada.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/frontend-ui-engineering/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/incremental-implementation/SKILL.md`

## Contexto

Lee `plan/REGLAS.md`, `plan/DISENO.md` (paleta, tipografía, radios, foco) y la sección «Colores a sustituir» de `plan/AUDITORIA.md`. Los tokens viven en `frontend/src/styles/theme.css` (Tailwind 4, bloque `@theme`). Hoy se llaman `glaze-*`, `teal-*`, `gold-*` y `terra-*` y se usan en casi todos los archivos de `frontend/src`. Esta sesión cambia los valores y los nombres **sin rediseñar componentes** (eso es la 03): al terminar, la app debe verse igual de estructura, con la paleta nueva.

## Tareas

1. Instala las fuentes: `cd frontend && npm i @fontsource/marcellus @fontsource-variable/source-sans-3`. En `src/main.tsx`, antes de `./styles/theme.css`, importa `@fontsource/marcellus/400.css` y `@fontsource-variable/source-sans-3/wght.css`. En `index.html` borra los tres `<link>` de Google Fonts (dos `preconnect` y la hoja).
2. Sustituye el bloque `@theme` de `theme.css` por este (valores exactos de `plan/DISENO.md`):
   ```css
   @theme {
     --color-cal-50: #FAF8F4;  --color-cal-100: #F1EDE6;  --color-cal-200: #E3DDD3;  --color-cal-400: #8E877C;
     --color-tinta-900: #1C211F;  --color-tinta-600: #555C58;
     --color-fez-50: #E4F0EA;  --color-fez-700: #1E5B46;  --color-fez-800: #17483A;
     --color-granate-50: #F6E7E9;  --color-granate-700: #8B2E3C;
     --color-noche-900: #18231F;  --color-noche-800: #2A3B34;  --color-noche-ink: #EDEAE3;  --color-noche-muted: #A9B5AF;
     --color-error-50: #FCEBEA;  --color-error-700: #B3261E;  --color-error-ink: #8F1D17;
     --color-aviso-50: #FBF0D2;  --color-aviso-ink: #6B4E00;
     --color-info-50: #E6EEF6;  --color-info-ink: #1F4B73;

     --font-display: 'Marcellus', ui-serif, Georgia, serif;
     --font-sans: 'Source Sans 3 Variable', ui-sans-serif, system-ui, sans-serif;

     --text-xs: 0.8125rem;  --text-xs--line-height: 1.4;
     --text-sm: 0.875rem;   --text-sm--line-height: 1.45;
     --text-base: 1rem;     --text-base--line-height: 1.55;
     --text-lg: 1.1875rem;  --text-lg--line-height: 1.4;
     --text-xl: 1.4375rem;  --text-xl--line-height: 1.3;
     --text-2xl: 1.75rem;   --text-2xl--line-height: 1.2;
     --text-4xl: 2.5rem;    --text-4xl--line-height: 1.1;
     --text-6xl: 3.5rem;    --text-6xl--line-height: 1.05;

     --radius-control: 6px;  --radius-card: 10px;  --radius-pill: 999px;
     --shadow-card: 0 1px 2px rgb(28 33 31 / .06), 0 4px 12px rgb(28 33 31 / .05);
   }
   ```
3. En `theme.css`, base: `html { @apply bg-cal-50 text-tinta-900 antialiased; }`. Añade:
   ```css
   :focus-visible { outline: 2px solid var(--color-fez-700); outline-offset: 2px; }
   .sobre-noche :focus-visible { outline-color: var(--color-noche-ink); }
   .cifras { font-variant-numeric: tabular-nums; }
   ```
4. Sustituye el motivo. Borra `.bg-arabesque`, `.bg-arabesque-light` y `.divider-arabesque` y crea:
   ```css
   .reticula { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%231E5B46' stroke-opacity='.06'%3E%3Cpath d='M24 0 48 24 24 48 0 24Z'/%3E%3C/g%3E%3Cpath d='M24 21l3 3-3 3-3-3z' fill='%231E5B46' fill-opacity='.08'/%3E%3C/svg%3E"); background-size: 48px 48px; }
   .reticula-noche { background-color: var(--color-noche-900); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23EDEAE3' stroke-opacity='.07'%3E%3Cpath d='M24 0 48 24 24 48 0 24Z'/%3E%3C/g%3E%3C/svg%3E"); background-size: 48px 48px; }
   .separador { display: flex; align-items: center; gap: .75rem; color: var(--color-granate-700); }
   .separador::before, .separador::after { content: ''; height: 1px; flex: 1; background: var(--color-cal-200); }
   ```
   Cambia en todo `src/` `bg-arabesque-light` → `reticula`, `bg-arabesque` → `reticula-noche sobre-noche`, `divider-arabesque` → `separador`. El carácter `◆` dentro de los separadores se queda.
5. Sustituye los tokens viejos en **todos** los `.tsx` y `.css` de `frontend/src` con esta tabla. Decide por el prefijo de la clase (`bg-`, `text-`, `border-`, `ring-`, `outline-`, `fill-`, `stroke-`, `placeholder:`, `hover:`…) y conserva modificadores de opacidad (`/60`) solo si siguen teniendo sentido:

   | Viejo | `bg-*` | `text-*` | `border-*`, `ring-*`, `outline-*` |
   |---|---|---|---|
   | `glaze-50` | `cal-50` | `noche-ink` (si está sobre fondo oscuro) | `cal-200` |
   | `glaze-100` | `cal-100` | `noche-ink` / `noche-muted` (si lleva opacidad) | `cal-200` |
   | `glaze-200` | `cal-200` | `tinta-600` | `cal-200` |
   | `teal-950` | `noche-900` | `tinta-900` | `tinta-900` |
   | `teal-900` | `noche-800` | `tinta-900` | `tinta-900` |
   | `teal-800` | `fez-700` | `tinta-600` | `cal-400` |
   | `teal-700` | `fez-800` | `fez-700` | `fez-700` |
   | `teal-600`, `teal-500` | `fez-700` | `fez-700` | `fez-700` |
   | `teal-100`, `teal-50` | `fez-50` | `fez-700` | `fez-50` |
   | `gold-*` en botones (`bg-gold-500`) | `fez-700` + `text-white` | — | — |
   | `gold-*` en badges (`bg-gold-100 text-gold-600`) | `aviso-50` | `aviso-ink` | — |
   | `gold-*` en el resto (ornamento, enlaces, filete, texto sobre oscuro) | `granate-700` | `granate-700` (sobre claro) o `noche-ink` (sobre oscuro) | `granate-700` |
   | `terra-600` | `error-700` | `error-ink` | `error-700` |
   | `terra-100` | `error-50` | `error-ink` | `error-50` |

   Cambia también `rounded-(--radius-tile)` → `rounded-(--radius-control)` en botones y campos y `rounded-(--radius-card)` en `.card-tile*`, modal y avisos; y `shadow-sm`/`shadow-lg` de tarjetas y modal → `shadow-(--shadow-card)`.
6. En las clases `.btn-*` y `.field-*` de `theme.css`: quita los `focus-visible:outline-*` y `focus:ring-*` propios (ya hay foco global), quita `uppercase` y `tracking-wide` de `.field-label` y súbela a `text-sm font-semibold text-tinta-900`. `.field-input` pasa a `text-base` con borde `cal-400`. `.btn-gold` se convierte en un alias de `.btn-primary` (mismo contenido) para no romper usos; la sesión 03 lo elimina.
7. Recharts en `pages/admin/DashboardPage.tsx`: cambia los colores hexadecimales de series, rejilla y ejes por `#1E5B46` (serie principal), `#8B2E3C` (segunda serie), `#E3DDD3` (rejilla) y `#555C58` (ejes).
8. Comprueba que no queda nada viejo: `grep -rnE "(glaze|teal|gold|terra)-[0-9]|arabesque|radius-tile|fonts.googleapis" frontend/src frontend/index.html` debe salir vacío.
9. Actualiza `docs/DESIGN.md`: sustituye las secciones Theme, Palette y Typography por un resumen de `plan/DISENO.md` (en inglés, como el resto del archivo) y enlaza a `plan/DISENO.md`.

## No hacer

- No crees componentes nuevos ni cambies la estructura de las páginas (sesión 03 y siguientes).
- No cambies textos ni traducciones.
- No toques el backend.

## Criterios de aceptación

- El `grep` de la tarea 8 sale vacío.
- `npm run build` en verde y el CSS generado no contiene `#06282b` ni `#c19540` (`grep -c 06282b dist/assets/*.css` → 0).
- Capturas 390/1440 de `/`, `/hotels/1`, `/login`, `/admin` y `/admin/bookings` en `plan/capturas/02/`, sin violaciones `serious` ni `critical` de `color-contrast`.

## Verificación

Ver `plan/REGLAS.md` (lint, tests, build, CI y capturas con axe) más el `grep` de la tarea 8.

## Cierre

Commit «Cambia la paleta, la tipografía y el motivo según DISENO.md» (puedes dividirlo en varios), push, PR hacia `plan/mejoras` con capturas antes (`plan/capturas/antes/`) y después, fusión si está en verde y marca 02 como hecha.
