# Auditoría del frontend · Zellige Hotels

Sesión 01, 2026-10-19. Línea base antes de tocar el diseño. Capturas y `report.json` en `plan/capturas/01/`.

**Cómo se midió.** Desde el entorno de esta sesión no hay salida de red hacia Render ni hacia Unsplash (el proxy los rechaza). Por eso las capturas y axe se hicieron con `npm run build && vite preview` y la **API simulada** de `plan/herramientas/api-simulada.mjs` (mismos hoteles, habitaciones y cuentas que `V2__reference_data.sql`, más reservas, facturas y tareas con fechas relativas a hoy). Las fotos son sustitutos en SVG. Lighthouse se pasó contra `vite preview` con `plan/herramientas/servidor-simulado.mjs` en el puerto 8080. La herramienta `capturas.mjs` acepta ahora `SIMULAR=1` y `CAPT_DIR`; sin esas variables se comporta como antes.

## Urgente

Nada rompe la demo hoy (la sesión 00 ya corrigió el 404 y la etiqueta sin traducir). Lo más visible para un reclutador es accesibilidad, no un fallo: el cajón móvil sigue siendo enfocable cerrado y no se cierra con Esc (ver Accesibilidad, A3 y A4).

## Resumen

Violaciones `serious` o `critical` de axe (WCAG 2.2 A/AA) por pantalla. Ninguna pantalla tiene desplazamiento horizontal.

| Pantalla | Ruta | 390 px | 1440 px | Scroll horizontal |
|---|---|---|---|---|
| Portada | `/` | 1 | 1 | no |
| Hoteles | `/hotels` | 2 | 1 | no |
| Ficha | `/hotels/1` | 2 | 1 | no |
| Login | `/login` | 3 | 2 | no |
| Registro | `/register` | 3 | 2 | no |
| Mis reservas | `/account` | 3 | 2 | no |
| Mis facturas | `/account/invoices` | 3 | 2 | no |
| Perfil | `/account/profile` | 2 | 1 | no |
| Panel | `/admin` | 1 | 0 | no |
| Reservas | `/admin/bookings` | 1 (8 nodos) | 1 (7 nodos) | no |
| Calendario | `/admin/calendar` | 3 | 1 | no |
| Facturas | `/admin/invoices` | 1 (6 nodos) | 1 (5 nodos) | no |
| Clientes | `/admin/clients` | 1 (4 nodos) | 1 (3 nodos) | no |
| Tareas | `/admin/tasks` | 1 (4 nodos) | 1 (3 nodos) | no |
| Hoteles (panel) | `/admin/hotels` | 1 | 0 | no |
| Habitaciones | `/admin/rooms` | 1 (3 nodos) | 1 (2 nodos) | no |
| Categorías | `/admin/categories` | 0 | 0 | no |
| Empleados | `/admin/employees` | 1 (2 nodos) | 1 | no |

Lighthouse (build de producción, API simulada, fotos de Unsplash bloqueadas):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Portada, escritorio | 99 | 96 | 96 | 92 |
| Portada, móvil | 82 | 92 | 96 | 92 |
| Ficha, escritorio | 96 | 96 | 96 | 92 |
| Ficha, móvil | 84 | 91 | 96 | 92 |

Informes completos: `plan/capturas/01/lh-{portada,ficha}-{escritorio,movil}.json`. En móvil pesa sobre todo el bundle principal (`index-*.js`, 498 kB, 157 kB gzip) y `LandingPage` (126 kB por `motion`).

## Accesibilidad

### Detectado por axe

| # | Regla | Pantallas | Elemento | Arreglo propuesto | Sesión |
|---|---|---|---|---|---|
| A1 | `link-in-text-block` | todas las públicas y la cuenta, 390 y 1440 | enlace «AyChEs» del pie, `components/layout/PublicShell.tsx:147` | subrayar el enlace (no distinguirlo solo por color); el pie pasa a claro con la nueva paleta | 03 |
| A2 | `color-contrast` | login, registro (390 y 1440) | enlace `text-gold-600` sobre blanco, `pages/LoginPage.tsx:90` y `pages/RegisterPage.tsx:99` | `text-fez-700` (7,5:1) con subrayado | 02 |
| A3 | `aria-hidden-focus` | todas las públicas a 390 | cajón móvil `<aside aria-hidden>` con enlaces y botones enfocables, `components/layout/PublicShell.tsx:87-91` | `inert` cuando está cerrado | 03 |
| A4 | `aria-hidden-focus` | panel y calendario a 390 | cajón móvil del panel, `components/layout/AdminShell.tsx:85-90` | `inert` cuando está cerrado | 03 |
| A5 | `color-contrast` | reservas, facturas, clientes, tareas, habitaciones, empleados, cuenta | etiquetas `bg-gold-100 text-gold-600` y `bg-terra-100 text-terra-600`, `components/ui/StatusBadge.tsx:5-21` y la clase `.badge` | mapa de estados de `DISENO.md` (`aviso-50/aviso-ink`, `error-50/error-ink`…) | 02 (colores) y 03 (componente) |
| A6 | `color-contrast` | tablas a 390 | indicación «desliza» `text-[10px] text-teal-800/70`, `components/ui/DataTable.tsx:50` | `text-xs text-tinta-600` y mostrarla solo si la tabla desborda | 03 |
| A7 | `color-contrast` | calendario | día de hoy `text-gold-600`, `pages/admin/CalendarPage.tsx:125` | `text-granate-700` o `fez-700` | 02 |
| A8 | `scrollable-region-focusable` | calendario a 390 | contenedor con scroll horizontal sin foco, `pages/admin/CalendarPage.tsx:114` | `tabIndex={0}` + `role="region"` + `aria-label` en el contenedor | 05 |
| A9 | `color-contrast` | tareas | botón `.btn-danger` pequeño en las tarjetas, `pages/admin/TasksPage.tsx` (tablero) | `Button variant="danger"` con `error-700` (6,5:1) | 05 |

### Revisado a mano

| # | Qué | Dónde | Hallazgo | Sesión |
|---|---|---|---|---|
| A10 | Menú móvil con teclado | `PublicShell.tsx:65-137` | Con el menú **cerrado**, Tab entra en el botón de cerrar y en los enlaces del cajón (comprobado con Playwright). Esc **no** lo cierra; el foco no vuelve al botón de menú. | 03 |
| A11 | Cajón del panel | `AdminShell.tsx:75-92` | Mismo problema que A10. Los iconos son caracteres geométricos (`▦ ◫ ▤…`, líneas 16-25) con `aria-hidden`: no molestan al lector, pero se ven pobres. | 03 |
| A12 | Foco en modales | `components/ui/Modal.tsx:17-22` | `<dialog>` nativo: atrapa el foco y cierra con Esc. Falta `aria-labelledby` (el `<h2>` de la línea 36 no está enlazado) y no se devuelve el foco explícitamente al cerrar (Chrome lo hace, no está garantizado). Botón de cerrar con «✕» de texto (línea 42). | 03 |
| A13 | Errores de formulario | `LoginPage.tsx:60,74`, `RegisterPage.tsx:64`, `ProfilePage.tsx:77,84` | Los errores de campo (`.field-error`) no están enlazados con `aria-describedby` ni marcan `aria-invalid`; no se anuncian. El error del servidor sí tiene `role="alert"` (`LoginPage.tsx:78`, `RegisterPage.tsx:87`). Al enviar con errores el foco no va al primer campo con error. | 03 (login, registro), 04 (perfil), 06 (resto) |
| A14 | Etiquetas de estado | `StatusBadge.tsx` | Siempre llevan texto: bien. Solo falla el contraste (A5). | 03 |
| A15 | Etiquetas de campo | `theme.css` (`.field-label`) | En mayúsculas forzadas y 12 px; `DISENO.md` pide 14 px sin mayúsculas. | 02 |
| A16 | Encabezados | `HotelsPage.tsx`, `LandingPage.tsx:61` | Un `<h1>` por pantalla en las revisadas. En el panel el `<h1>` viene de `PageHeader.tsx:11`. | 06 (revisión completa) |
| A17 | Idioma del documento | `index.html:2` | `<html lang="es">` fijo; si i18next detecta inglés, el `lang` no cambia. | 06 |
| A18 | Cambio de ruta | `App.tsx` | Al navegar no cambia `document.title` ni se mueve el foco. | 06 |
| A19 | Filtros sin etiqueta visible | `pages/public/HotelsPage.tsx:28-43` | Los dos buscadores usan `placeholder` + `aria-label`; no hay etiqueta visible. | 04 |
| A20 | Movimiento | `LandingPage.tsx:4,16` | `motion` respeta `useReducedMotion()`. Hay entrada en cascada (`rise(0)`, `rise(0.16)`…), que `DISENO.md` prohíbe. | 04 |

## Inventario de componentes

Número de archivos `.tsx` de `frontend/src` que usan cada clase o componente (`grep -rlw`; `theme.css` no cuenta).

| Clase o componente | Archivos | Comentario |
|---|---|---|
| `.btn-primary` | 12 | sustituir por `<Button>` |
| `.btn-ghost` | 11 | `<Button variant="secondary">` |
| `.btn-danger` | 8 | `<Button variant="danger">` |
| `.btn-gold` | 11 | `<Button>` (primario) |
| `.field-label` | 13 | `<Field>` |
| `.field-input` | 15 | `<Input>`, `<Select>`, `<Textarea>` |
| `.field-error` | 11 | `<Field error>` |
| `.card-tile` | 14 | `<Card>` |
| `.badge` | 6 | `<StatusBadge>` |
| `.skeleton` | 4 | se mantiene, con `cal-100` |
| `.bg-arabesque` (oscuro) | 3 | `.reticula-noche` |
| `.bg-arabesque-light` | 3 | `.reticula` |
| `.divider-arabesque` | 6 | `.separador` |
| `ui/Feedback` | 16 | `ErrorNote`, `EmptyState`, `ListSkeleton` |
| `ui/PageHeader` | 10 | todas las páginas del panel |
| `ui/Modal` | 8 | formularios del panel |
| `ui/DataTable` | 6 | listados del panel |
| `ui/StatusBadge` | 6 | |
| `hooks/useCrud` | 5 páginas (10 usos) | categorías, clientes, empleados, hoteles, habitaciones |

Escritos a mano donde debería haber un componente:
- Botones de la cabecera pública y del cajón (`PublicShell.tsx:41-58, 120-133`) y del panel (`AdminShell.tsx:62-67, 100-109`).
- Formulario de búsqueda de la portada (`LandingPage.tsx:71-100`) y de la ficha (`HotelDetailPage.tsx`, formulario de estancia): etiquetas, campos y botón a mano.
- Tarjetas de hotel repetidas en `LandingPage.tsx:125-150` y `HotelsPage.tsx:58-90` con marcado distinto para lo mismo.
- Avisos de error del servidor en login y registro (`LoginPage.tsx:78`, `RegisterPage.tsx:87`) en vez de `ErrorNote`.
- Paginación con flechas de texto (`DataTable.tsx:102,109`).

## Colores a sustituir

`grep -rnoE "(glaze|teal|gold|terra)-[0-9]+" frontend/src`: **405 apariciones en 29 archivos**.

| Token | Apariciones | Token | Apariciones |
|---|---|---|---|
| `teal-800` | 105 | `gold-600` | 14 |
| `teal-900` | 49 | `terra-600` | 14 |
| `teal-950` | 36 | `gold-400` | 11 |
| `glaze-200` | 30 | `terra-100` | 10 |
| `glaze-50` | 27 | `teal-600` | 10 |
| `glaze-100` | 27 | `teal-100` | 8 |
| `gold-500` | 22 | `gold-100` | 8 |
| `gold-300` | 19 | `teal-500`, `teal-50` | 5 cada uno |
| | | `teal-700` | 4 |
| | | `gold-200` | 1 |

Más `radius-tile` en casi todos los botones y campos, y las fuentes de Google Fonts en `index.html`.

## Datos y llamadas

Todas las `queryKey` (literal, archivo:línea):

| Clave | Dónde |
|---|---|
| `['hotels','all']` | `admin/BookingsPage.tsx:30`, `admin/CalendarPage.tsx:34`, `admin/RoomsAdminPage.tsx:23`, `admin/TasksPage.tsx:24`, `admin/EmployeesPage.tsx:30` (**cinco** páginas) |
| `['hotels','admin',page]` | `admin/HotelsAdminPage.tsx:19` |
| `['hotels','list',search,city]` | `public/HotelsPage.tsx:14` |
| `['hotels','landing']` | `public/LandingPage.tsx:22` |
| `['hotel',hotelId]` | `public/HotelDetailPage.tsx:42` (singular, fuera de la familia `hotels`) |
| `['available',hotelId,checkIn,checkOut,guests]` | `admin/BookingsPage.tsx:32` |
| `['availability',hotelId,checkIn,checkOut,guests]` | `public/HotelDetailPage.tsx:47` (**mismo dato, otra clave**) |
| `['clients','picker',search]` | `admin/BookingsPage.tsx:37` |
| `['clients',page,search]` | `admin/ClientsPage.tsx:24` |
| `['bookings',page,status]` | `admin/BookingsPage.tsx:174` |
| `['bookings','cal',hotelId,start]` | `admin/CalendarPage.tsx:40` |
| `['bookings','invoiceable']` | `admin/InvoicesPage.tsx:24` |
| `['rooms','cal',hotelId]` | `admin/CalendarPage.tsx:36` |
| `['rooms','byHotel',hotelId]` | `admin/TasksPage.tsx:26` |
| `['rooms','admin',page,hotelFilter]` | `admin/RoomsAdminPage.tsx:25` |
| `['employees','byHotel',hotelId]` | `admin/TasksPage.tsx:31` |
| `['employees',page]` | `admin/EmployeesPage.tsx:32` |
| `['invoices',page,status]` | `admin/InvoicesPage.tsx:145` |
| `['tasks','board']` | `admin/TasksPage.tsx:190` |
| `['categories']` | `admin/CategoriesPage.tsx:16`, `admin/HotelsAdminPage.tsx:22` |
| `['dashboard','summary' / 'revenue' / 'occupancy']` | `admin/DashboardPage.tsx:53,58,63` |
| `['me','bookings' / 'profile' / 'invoices']` | `account/MyBookingsPage.tsx:15`, `account/ProfilePage.tsx:28`, `account/MyInvoicesPage.tsx:84` |
| `[queryKey]` dinámica | `hooks/useCrud.ts:12` |

Inconsistencias:
- Paginación mezclada en la clave sin objeto de parámetros (`['bookings',page,status]` frente a `['clients',page,search]`): una invalidación parcial no puede distinguir lista de detalle.
- `available` frente a `availability`: crear una reserva desde el panel (`BookingsPage.tsx:48`) no invalida la disponibilidad pública, y al revés (`HotelDetailPage.tsx:57`).
- `['hotel',id]` no se invalida al editar un hotel en el panel (`useCrud('hotels')` invalida `['hotels']`).

Invalidaciones demasiado amplias o incompletas:
- `BookingsPage.tsx:181-182`: cualquier cambio de estado invalida **todo** `['bookings']` (también el calendario y las facturables) y **todo** `['dashboard']`.
- `InvoicesPage.tsx:40-41`: emitir factura invalida todo `['bookings']`.
- `hooks/useCrud.ts:12`: invalida la familia entera del recurso.
- Check-in y check-out no invalidan la disponibilidad ni las tareas de limpieza que crea el backend.

Peticiones al cargar cada pantalla (Playwright, `page.on('request')`, sin contar `/api/auth`): ninguna pantalla repite una petición en la misma carga (StrictMode no duplica gracias a la caché). Panel 3, reservas 3, calendario 3, facturas 4 (tres búsquedas de reservas por estado, `InvoicesPage.tsx:27-29`, en lugar de una), tareas 2, ficha 2. El coste real es entre pantallas: la lista de hoteles se pide con la misma clave en cinco páginas con `staleTime` de 30 s, así que se repite al moverse por el panel.

## Deuda del frontend

- **Archivos de más de 200 líneas:** `admin/BookingsPage.tsx` (298), `public/HotelDetailPage.tsx` (291), `admin/TasksPage.tsx` (256), `admin/InvoicesPage.tsx` (233), `admin/DashboardPage.tsx` (216). Las traducciones (`es.json` 504, `en.json` 505) no cuentan.
- **Lógica de negocio en componentes:** `roomTotal` en `public/HotelDetailPage.tsx:13` (precio por régimen y huéspedes); fechas por defecto y noches calculadas en la propia página; `todayIso` y `plusDaysIso` repetidos en panel y calendario.
- **Textos sin traducir:** no se encontraron cadenas visibles escritas a mano en `pages` ni `components` tras la sesión 00, salvo los caracteres «←», «→» de la paginación (`DataTable.tsx:102,109`) y «✕» del modal (`Modal.tsx:42`), que son decorativos pero se leen.
- **`motion`:** solo en `LandingPage.tsx`; respeta `useReducedMotion()` (línea 16) pero anima en cascada (`rise(0)`, `rise(0.16)`…). Pesa 126 kB en el chunk de la portada.
- **Imágenes:** ninguna `<img>` tiene `width`/`height` (`LandingPage.tsx:49,131`, `HotelsPage.tsx:66`, `HotelDetailPage.tsx:79,223`), lo que provoca saltos de maquetación. Las de listas sí tienen `loading="lazy"`.
- **Foto de Unsplash de fondo en la portada:** `LandingPage.tsx:10-11` (`HERO_IMG`), con capa oscura encima. `DISENO.md` la quita.
- **Fuentes de Google** en `index.html` (petición a tercero y salto de fuente).
- **Sin límite de errores:** una excepción en una página deja la app en blanco.
- **Ruta comodín** redirige a `/` en silencio (`App.tsx:80`): una URL mal escrita no avisa.

## Propuesta por sesión

| Sesión | Hallazgos |
|---|---|
| 02 Tokens y tipografía | Colores a sustituir (405), A2, A5 (colores), A7, A15, fuentes de Google, `radius-tile`, motivo de estrella |
| 03 Componentes base | A1, A3, A4, A6, A10, A11, A12, A13 (login y registro), A14, botones y campos a mano de las capas, paginación |
| 04 Flujo de reserva | `roomTotal`, `HERO_IMG`, A19, A20, A13 (perfil), tarjetas de hotel duplicadas, imágenes sin dimensiones, ficha de 291 líneas |
| 05 Panel por rol | A8, A9, `window.confirm` (6 usos), páginas de más de 200 líneas del panel, tres búsquedas en facturas (solo aspecto; la llamada es de 07) |
| 06 Accesibilidad | A13 (resto de formularios), A16, A17, A18, prueba automática de axe |
| 07 Arquitectura | Toda la sección «Datos y llamadas», `useCrud`, límite de errores, ruta 404, `motion` y peso del bundle principal |

Sin sesión asignada: la nota de SEO (92) se debe solo a `robots-txt`: no hay `public/robots.txt` y la SPA devuelve `index.html` en esa ruta. Es un archivo de dos líneas; lo puede añadir la 09. La de buenas prácticas (96) baja por los errores de consola de las fotos bloqueadas en este entorno, no por el código.
