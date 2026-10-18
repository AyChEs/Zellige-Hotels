# 05 · Panel de gestión por rol

Modelo: GLM 5.3 Flash (opencode go), razonamiento high
Rama: `mejora/05-panel`, desde `plan/mejoras`. Nunca `main`.
Depende de: 03 fusionada. Puede ir en paralelo con 04.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/frontend-ui-engineering/SKILL.md`

## Contexto

Lee `plan/REGLAS.md` y `plan/DISENO.md`. El panel está en `frontend/src/pages/admin/` (10 páginas) dentro de `components/layout/AdminShell.tsx`. Qué ve cada rol (no se cambia, lo decide el backend y `AdminShell` filtra el menú):

| Página | ADMIN | MANAGER | RECEPTIONIST |
|---|---|---|---|
| Panel (`DashboardPage`) | sí | sí | no |
| Reservas, Calendario, Facturas, Clientes, Tareas | sí | sí | sí |
| Habitaciones, Empleados | sí | sí | no |
| Hoteles, Categorías | sí | no | no |

El trabajo es de aspecto y consistencia: migrar todas las páginas a los componentes de la sesión 03 (`Button`, `Field`/`Input`/`Select`/`Textarea`, `Card`, `Modal`, `DataTable`, `StatusBadge`, `Toast`, `EmptyState`, `ErrorNote`).

## Tareas

1. En cada página de `pages/admin/` sustituye:
   - `className="btn-primary|btn-ghost|btn-danger|btn-gold"` → `<Button variant="primary|secondary|danger|primary">`;
   - `field-label` + `field-input` + `field-error` → `<Field label error><Input|Select|Textarea/></Field>`;
   - `card-tile` → `<Card>`;
   - cada `DataTable` recibe `caption` traducido (clave `admin.<página>.caption`).
2. Cada guardado, borrado, check-in, check-out, emisión y cobro de factura avisa con `toast.success` (texto traducido) y cada error con `toast.error(problemMessage(error))`. Los borrados piden confirmación con `Modal` («¿Borrar {nombre}?», `danger` + `secondary`), nunca con `window.confirm`. Busca `confirm(` en `pages/` y sustitúyelos todos.
3. `PageHeader.tsx`: título `text-xl font-semibold text-tinta-900`, subtítulo `text-sm text-tinta-600`, acciones a la derecha que pasan debajo en 390 px.
4. `DashboardPage.tsx`:
   - El KPI «Ocupación hoy» ocupa 2 columnas en 1440 px y muestra una barra de progreso (`role="meter"` con `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100` y etiqueta).
   - Los demás KPI: cifra `text-2xl font-semibold cifras`, etiqueta `text-sm text-tinta-600` sin mayúsculas.
   - Cada gráfica de Recharts va en un `<figure>` con `<figcaption>` y debajo una tabla `sr-only` con los mismos datos, para lectores de pantalla.
   - Colores ya cambiados en la sesión 02; comprueba que el tooltip usa fondo blanco, borde `cal-200` y texto `tinta-900`.
5. `CalendarPage.tsx`: cada celda ocupada tiene texto (código de reserva o nombre abreviado) y `title`, no solo color. Las cabeceras de día son `<th scope="col">` y las de habitación `<th scope="row">`.
6. `TasksPage.tsx` (tablero): cada columna es una `<section aria-labelledby>`; cambiar el estado de una tarjeta se hace con un `Select` o botones, no solo arrastrando.
7. Cuando ninguna página use ya `.btn-*`, `.field-*`, `.card-tile*` ni `.badge`, bórralas de `theme.css`: `grep -rnE "btn-(primary|ghost|danger|gold)|field-(label|input|error)|card-tile|\"badge" frontend/src/pages frontend/src/components` debe salir vacío (si la sesión 04 aún no se ha fusionado, deja las clases y anótalo en el PR; las borra la 06).
8. Traducciones nuevas siempre en `es.json` y `en.json`.

## No hacer

- No cambies qué rol ve qué: ni `AdminShell` (filtro de `roles`) ni `ProtectedRoute`.
- No cambies llamadas a la API ni `queryKey` (eso es la 07).
- No ejecutes acciones de escritura contra la API pública para probar: usa capturas sin pulsar «Guardar» y pruebas con dobles.

## Criterios de aceptación

- `grep -rn "confirm(" frontend/src/pages` vacío.
- axe sin `serious`/`critical` en las 10 páginas del panel como admin a 390 y 1440 px, y en `/admin/bookings` como recepción.
- Capturas de las 10 páginas a 1440 px y de 3 a 390 px en `plan/capturas/05/`.

## Verificación

Ver `plan/REGLAS.md`.

## Cierre

Commit(s), push, PR hacia `plan/mejoras` con capturas antes/después de panel, reservas, calendario y tareas; fusión si está en verde; marca 05 como hecha.
