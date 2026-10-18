# 07 · Arquitectura del frontend

Modelo: GLM 5.3 (opencode go), razonamiento high
Rama: `mejora/07-arquitectura`, desde `plan/mejoras`. Nunca `main`.
Depende de: 06 fusionada.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/frontend-ui-engineering/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/performance-optimization/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/incremental-implementation/SKILL.md`

## Contexto

Lee `plan/REGLAS.md` y la sección «Datos y llamadas» y «Deuda del frontend» de `plan/AUDITORIA.md`. Hoy cada página llama a `useQuery`/`useMutation` directamente con `queryKey` escritas a mano (65 llamadas). `['hotels','all']` está repetida en cuatro páginas del panel, hay dos nombres para la misma disponibilidad (`['available', …]` y `['availability', …]`), las invalidaciones son amplias y no hay límite de errores: si una página lanza una excepción, la app entera queda en blanco. Las rutas ya son perezosas (`App.tsx`), salvo login y registro.

El README del proyecto dice: «TanStack Query cambió mi forma de pensar el estado del frontend». Esta sesión tiene que hacer que el código lo demuestre.

## Tareas

1. **Claves centralizadas**: crea `src/api/queryKeys.ts` con una fábrica por recurso, por ejemplo:
   ```ts
   export const qk = {
     hotels: { all: ['hotels'] as const, list: (p: object) => ['hotels', 'list', p] as const, detail: (id: number) => ['hotels', id] as const, options: ['hotels', 'options'] as const },
     availability: (hotelId: number, checkIn: string, checkOut: string, guests: number) => ['availability', hotelId, checkIn, checkOut, guests] as const,
     bookings: { all: ['bookings'] as const, list: (p: object) => ['bookings', 'list', p] as const, calendar: (hotelId: number, start: string) => ['bookings', 'calendar', hotelId, start] as const },
     me: { bookings: ['me', 'bookings'] as const, invoices: ['me', 'invoices'] as const, profile: ['me', 'profile'] as const },
     // …invoices, clients, rooms, employees, tasks, categories, dashboard
   }
   ```
   Sustituye todas las `queryKey: [...]` literales del proyecto. `grep -rn "queryKey: \[" src` debe salir vacío.
2. **Hooks por recurso** en `src/api/hooks/` (`useHotels.ts`, `useBookings.ts`, `useInvoices.ts`, `useClients.ts`, `useRooms.ts`, `useEmployees.ts`, `useTasks.ts`, `useCategories.ts`, `useDashboard.ts`, `useMe.ts`): cada uno expone las consultas y mutaciones de su recurso con su `onSuccess` de invalidación **precisa** (por ejemplo, check-in invalida `qk.bookings.all`, `qk.dashboard` y la disponibilidad; no todo). `hooks/useCrud.ts` se reemplaza por estos y se borra.
   - `useHotelOptions()` (la lista de hoteles para los `Select` del panel) con `staleTime: 10 * 60_000`: se pide una vez y la comparten Reservas, Calendario, Habitaciones, Empleados y Tareas.
3. **Estados de TanStack Query bien usados**:
   - Listas paginadas con `placeholderData: keepPreviousData` para que la tabla no parpadee al cambiar de página.
   - Distinguir `isPending` (primera carga, esqueleto) de `isFetching` (recarga, un indicador discreto en la cabecera de la tabla con `aria-live="polite"` «Actualizando…»).
   - Mutaciones: botones con `loading={m.isPending}`; nunca dos envíos seguidos.
   - `QueryClient` en `main.tsx`: `retry` solo para errores de red o 5xx, nunca para 4xx (función `retry: (n, e) => n < 2 && esReintentable(e)`).
4. **Límites de error**: crea `components/ErrorBoundary.tsx` (clase con `getDerivedStateFromError`) con una pantalla de error amable (`Card`, título, botón «Volver a intentarlo» que resetea el límite y `QueryErrorResetBoundary`). Envuelve el `<Outlet />` de `PublicShell`, `AdminShell` y `AccountShell`, de modo que un fallo en una página no tumba la navegación.
5. **Ruta 404**: sustituye `<Route path="*" element={<Navigate to="/" />}>` por una página `pages/NotFoundPage.tsx` (título, texto corto, enlace a la portada) dentro de `PublicShell`.
6. **Carga**: haz perezosas también `LoginPage` y `RegisterPage`; precarga el chunk de la ficha del hotel al pasar el ratón o enfocar una tarjeta de hotel (`onPointerEnter`/`onFocus` → `import('./pages/public/HotelDetailPage')`). Comprueba con `npx vite build` que Recharts solo va en el chunk del panel (`DashboardPage`), no en el principal; anota los tamaños de los chunks antes y después en el PR.
7. **Pruebas** (Vitest + Testing Library, con `QueryClientProvider` de prueba y dobles de `api/endpoints`):
   - `useHotelOptions` usado por dos componentes montados a la vez hace **una** sola llamada.
   - Tras el check-in de una reserva, se invalida `qk.dashboard` y no `qk.hotels`.
   - `ErrorBoundary` muestra la pantalla de error cuando el hijo lanza y vuelve a pintarlo tras «Volver a intentarlo».
8. Actualiza la sección Architecture del README con `api/queryKeys.ts`, `api/hooks/` y `ErrorBoundary`, en inglés y en el mismo tono.

## No hacer

- No cambies `api/client.ts` (refresco de token single-flight) ni `auth/`: es la parte de autenticación que cuenta el portafolio. Si crees que tiene un fallo, deja un aviso.
- No cambies el aspecto visual.
- No añadas librerías de estado (Redux, Zustand…).

## Criterios de aceptación

- `grep -rn "queryKey: \[" frontend/src` vacío y `hooks/useCrud.ts` borrado.
- Al abrir `/admin/bookings`, la pestaña de red muestra una sola petición de hoteles (compruébalo con Playwright `page.on('request')` y cuenta).
- Las tres pruebas nuevas pasan y `npm run test:a11y` sigue en verde.

## Verificación

Ver `plan/REGLAS.md` más `npm run test:a11y`.

## Cierre

Commit(s), push, PR hacia `plan/mejoras` con la tabla de chunks antes/después y el recuento de peticiones; fusión si está en verde; marca 07 como hecha.
