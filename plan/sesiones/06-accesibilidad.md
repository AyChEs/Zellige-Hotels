# 06 · Accesibilidad

Modelo: GLM 5.3 (opencode go), razonamiento high
Rama: `mejora/06-accesibilidad`, desde `plan/mejoras`. Nunca `main`.
Depende de: 04 y 05 fusionadas.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/frontend-ui-engineering/SKILL.md` (sección de accesibilidad)
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/browser-testing-with-devtools/SKILL.md`

## Contexto

Lee `plan/REGLAS.md`, `plan/DISENO.md` («Foco y estados») y la sección «Accesibilidad» de `plan/AUDITORIA.md`. Las sesiones 03 a 05 ya han hecho la mayor parte. Esta sesión cierra lo que queda para WCAG 2.2 AA en **todas** las pantallas y lo deja protegido con una prueba automática.

## Tareas

1. Repasa uno a uno los hallazgos de «Accesibilidad» de `plan/AUDITORIA.md`. Marca en el PR cuáles quedaron resueltos por 03-05 y resuelve aquí los que no.
2. Estructura común:
   - Enlace «Saltar al contenido» como primer elemento de `PublicShell` y `AdminShell`, visible al recibir foco, que lleva a `<main id="contenido" tabIndex={-1}>`.
   - Un solo `<h1>` por pantalla; los títulos siguen orden sin saltos (h1 → h2 → h3).
   - Al cambiar de ruta, el foco va al `<h1>` de la nueva pantalla y el título del documento cambia (`document.title = "<Pantalla> · Zellige Hotels"`). Hazlo con un hook `useRouteFocus()` en `src/hooks/` usado por las tres capas.
   - `<html lang>` sigue al idioma activo de i18next (`i18n.on('languageChanged', l => document.documentElement.lang = l)`).
3. Formularios (login, registro, perfil, búsqueda, todos los modales del panel):
   - Todo control tiene etiqueta visible enlazada.
   - Los errores de validación se anuncian: al enviar con errores, el foco va al primer campo con error.
   - `autocomplete` correcto en nombre, apellidos, correo, teléfono, contraseña nueva/actual.
   - Campos obligatorios con `required` o `aria-required` y un «(obligatorio)» en la etiqueta, no solo un asterisco.
4. Objetivos táctiles de 24 × 24 px como mínimo en todo (criterio 2.5.8) y 44 px en los controles principales a 390 px: comprueba paginación, iconos de cerrar, selector de idioma y botones de tabla.
5. `prefers-reduced-motion`: revisa `motion` (`grep -rn "from 'motion" src`), el giro del botón `loading`, las transiciones de cajones y toasts. Con la preferencia activa, nada se desplaza.
6. Contraste de elementos no textuales (1.4.11): bordes de campos, foco, barra de ocupación, series de las gráficas frente al fondo blanco.
7. Añade la prueba automática `frontend/e2e/a11y.spec.ts` con `@playwright/test` y `@axe-core/playwright` (devDependencies) y un script `"test:a11y": "playwright test"` con `playwright.config.ts` que arranca `npm run preview` y **simula la API con `page.route('**/api/**', …)`** usando respuestas JSON fijas en `frontend/e2e/fixtures/` (hoteles, habitaciones, reservas, panel). Así no depende de Render. Recorre las 18 rutas de la auditoría a 390 y 1440 px y falla con cualquier violación `serious` o `critical`. Para las rutas con sesión, simula `/api/auth/refresh` y `/api/auth/me` con el usuario del rol correspondiente (mira `auth/AuthContext.tsx` y `api/client.ts` para las rutas exactas).
8. Añade el job `a11y` al CI (`.github/workflows/ci.yml`) después de `frontend`: `npm ci`, `npx playwright install --with-deps chromium`, `npm run build`, `npm run test:a11y`.

## No hacer

- No cambies colores fuera de los tokens de `plan/DISENO.md`. Si un contraste no llega con esos tokens, deja un aviso en `plan/AVISOS.md`.
- No toques el backend.

## Criterios de aceptación

- `npm run test:a11y` en verde en local y en CI.
- Navegación completa con teclado por: portada → ficha → resumen de reserva (sin confirmar), login, y en el panel de reservas abrir y cerrar un modal. Grábalo como lista de pasos en el PR.

## Verificación

Ver `plan/REGLAS.md` más `npm run test:a11y`. Capturas en `plan/capturas/06/` del foco visible en 5 elementos distintos.

## Cierre

Commit(s), push, PR hacia `plan/mejoras`; fusión si está en verde; marca 06 como hecha.
