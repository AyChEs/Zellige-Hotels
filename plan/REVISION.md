# Revisión final · Zellige Hotels

Sesión 09, 2026-10-19. Revisión en cinco ejes (corrección, legibilidad, arquitectura, seguridad, rendimiento) de todo lo que cambia entre `main` y `plan/mejoras` con las sesiones 01 a 08. Gravedad: **bloqueante**, **importante**, **menor**. Estado: arreglado en esta rama, o aviso.

## Comprobaciones explícitas

| Comprobación | Resultado |
|---|---|
| Lo que afirma el portafolio sigue siendo cierto | Sí. Spring Boot 3.4 / Java 21, React 19 + TypeScript, Tailwind 4, TanStack Query; cuatro perfiles con reglas en el backend (sin cambios en `SecurityConfig` ni en los controladores); rotación de refresh tokens con revocación de familia (`AuthService` intacto, prueba `AuthFlowIntegrationTest` en verde); `EXCLUDE USING gist` intacto (`V1` sin tocar); Testcontainers (31 pruebas en CI); CI en cada push; demo pública. |
| Naranja y tokens viejos: `grep -rnE "(glaze\|teal\|gold\|terra)-[0-9]\|#c19540\|#06282b\|#a4552f" frontend/src` | Vacío. |
| Cambios en `auth/`, `api/client.ts`, `ProtectedRoute.tsx`, `backend/**/auth/` | Solo `ProtectedRoute.tsx`: dos clases de color del indicador de carga (sesión 02). Sin cambios de lógica. |
| Identificadores de modelos de IA en commits (`git log main..plan/mejoras --format=%B \| grep -iE "claude\|opus\|gpt\|glm\|deepseek\|co-authored"`) | Vacío. Autor de todos los commits: Ayman Charoui. |
| Textos visibles nuevos en `es` y `en` | Sí: las dos traducciones tienen exactamente las mismas claves y todas las `t('…')` literales del código existen en ambas (comprobado con un script). |
| Rayas largas y exclamaciones en textos visibles | Ninguna en `es.json`, `en.json` ni en cadenas de los componentes. |

## Hallazgos

| # | Eje | Gravedad | Dónde | Hallazgo | Arreglo |
|---|---|---|---|---|---|
| R1 | Rendimiento | importante | `pages/public/LandingPage.tsx` | `motion` (≈120 kB) solo para un fundido de 300 ms del texto de la portada. El chunk de la portada pesaba 125 kB. | Fundido con CSS (`.aparecer`, solo con `prefers-reduced-motion: no-preference`) y fuera la dependencia `motion`. Chunk de la portada: 125 kB → 4 kB. Arreglado. |
| R2 | Corrección / a11y | importante | `hooks/useRouteFocus.ts`, `styles/theme.css` | Al mover el foco al `<h1>` tras navegar, Chrome pintaba el anillo de foco alrededor de todo el titular. | `h1[tabindex='-1']:focus` y `main[tabindex='-1']:focus` sin contorno: reciben el foco solo por código. Arreglado. |
| R3 | SEO | menor | `public/` | Sin `robots.txt`: la SPA devolvía `index.html` y Lighthouse bajaba a 92. | `public/robots.txt`. Arreglado. |
| R4 | Documentación | menor | `README.md`, `docs/DESIGN.md` | El README decía «28 tests» y no mencionaba la prueba de accesibilidad; `DESIGN.md` describía clases CSS ya borradas. | 31 pruebas del backend, Vitest y `npm run test:a11y`; sección Components de `DESIGN.md` con los componentes nuevos. Arreglado. |
| R5 | Corrección | menor | `pages/admin/CalendarPage.tsx` | El hotel inicial del calendario es el id 1 fijo (venía así de `main`). Si ese hotel se borrara, el calendario saldría vacío. | No se cambia en la revisión (fuera de alcance, no ocurre con los datos actuales). Anotado. |
| R6 | Arquitectura | menor | `api/hooks/useBookings.ts` | `useInvoiceableBookings` hace tres peticiones (una por estado) porque la API no filtra por varios estados ni por «sin factura». | Se mantiene; mejorarlo exige un parámetro nuevo en el backend. Anotado. |
| R7 | Seguridad | sin hallazgos | todo el diff | Sin `dangerouslySetInnerHTML`, sin secretos, enlaces externos con `rel="noreferrer"`, los clientes de demo no tienen cuenta ni contraseña y las reservas de demo no envían correos. | Nada que arreglar. |
| R8 | Verificación | aviso | `plan/capturas/` | Las capturas de las sesiones 01 a 09 se hicieron con la API simulada y fotos sustitutas (el entorno no llega a Render ni a Unsplash). La estructura, los colores y los textos son los reales; las fotos no. | Aviso en `plan/AVISOS.md`: rehacer las capturas de la portada y la ficha contra la demo real tras desplegar. |

No queda ningún bloqueante abierto.

## Verificación de la rama

- `npm run lint` 0 errores, `npm test -- --run` 24 pruebas, `npm run build` en verde, `npm run test:a11y` 36 comprobaciones (18 pantallas × 390 y 1440 px) sin violaciones `serious` ni `critical` y sin desplazamiento horizontal.
- CI del PR con `backend` (31 pruebas), `frontend` y `a11y`.
- Capturas finales en `plan/capturas/final/` (mismas pantallas que `plan/capturas/antes/`, con panel y cuenta también a 390 px).
