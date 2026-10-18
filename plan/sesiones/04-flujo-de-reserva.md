# 04 · Flujo de reserva del cliente

Modelo: GLM 5.3 (opencode go), razonamiento high
Rama: `mejora/04-reserva`, desde `plan/mejoras`. Nunca `main`.
Depende de: 03 fusionada. Puede ir en paralelo con 05.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/frontend-ui-engineering/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/incremental-implementation/SKILL.md`

## Contexto

Lee `plan/REGLAS.md` y `plan/DISENO.md` (sección «Pantallas que cambian más»). El cliente reserva así hoy: portada (`pages/public/LandingPage.tsx`) con fechas y huéspedes → ficha del hotel (`pages/public/HotelDetailPage.tsx`, 291 líneas) con un formulario de búsqueda, un `select` de régimen y una lista de habitaciones con botón «Reservar» que crea la reserva al instante (`meApi.book`) → mensaje con el código. Sin confirmación previa, sin resumen y con la lógica de precio (`roomTotal`) dentro del componente. Listado: `pages/public/HotelsPage.tsx`. Área de cliente: `pages/account/*`.

El backend no cambia. `meApi.book({ roomId, checkInDate, checkOutDate, guests, boardType })` devuelve la reserva con `code`. Si la habitación ya no está libre, el backend responde con un error cuyo mensaje contiene «available» (lo usa `HotelDetailPage.tsx` hoy).

## Tareas

1. Mueve `roomTotal` a `frontend/src/lib/pricing.ts` (exporta `roomTotal(room, board, guests, nights)`) con pruebas en `lib/__tests__/pricing.test.ts`: régimen solo alojamiento, media pensión con 2 huéspedes y 3 noches, y 0 noches → 0. El cálculo del frontend es orientativo; el precio que vale es el del backend (déjalo en un comentario).
2. **Portada** (`LandingPage.tsx`):
   - Quita `HERO_IMG` (Unsplash) y la imagen de fondo. Composición en 1440 px: rejilla de 2 columnas (7/5). Izquierda: kicker «Granada · Marrakech · Barcelona» en `text-sm text-granate-700`, titular `font-display text-6xl text-tinta-900` (2,25 rem en 390 px), subtítulo `text-lg text-tinta-600 max-w-prose`. Derecha: la `imageUrl` del primer hotel de `hotelApi.search({ active: true, size: 3 })` en un `<img>` con `rounded-[999px_999px_10px_10px]`, `aspect-[4/5]`, `object-cover`, `width`/`height` explícitos y `fetchpriority="high"`. Mientras carga, un bloque `bg-cal-100` con la misma forma. Fondo de la sección: `reticula`.
   - En 390 px la imagen va debajo del titular con `aspect-[4/3]`.
   - La tarjeta de búsqueda es `Card variant="brand"` con `DateRangeField`, huéspedes (`Input type="number" min=1 max=10`) y, nuevo, un `Select` de hotel (los 3 hoteles; por defecto el primero). «Buscar» lleva a `/hotels/:id?checkIn&checkOut&guests` del hotel elegido (hoy va siempre al primero).
   - Animaciones con `motion`: solo si `!useReducedMotion()`, y como mucho un fundido de 300 ms del bloque de texto. Nada en cascada.
   - Tarjetas de hoteles: `Card` con imagen 3:2 `loading="lazy"`, nombre en `font-display text-2xl`, ciudad y estrellas en `text-tinta-600`, y `ButtonLink variant="secondary"` «Ver disponibilidad».
3. **Ficha del hotel** (`HotelDetailPage.tsx`): divídela en componentes dentro de `pages/public/hotel-detail/`:
   - `HotelHeader.tsx`: migas (`<nav aria-label>` con `<ol>`), nombre `font-display text-4xl`, ciudad, estrellas como texto («5 estrellas», no solo ★) y dirección. Fondo `cal-50`. La foto del hotel debajo, `aspect-[21/9]` en 1440 y `aspect-[4/3]` en 390, `rounded-(--radius-card)`.
   - `StayForm.tsx`: `DateRangeField` + huéspedes + régimen, botón «Actualizar». Al enviar, actualiza los `searchParams` (como hoy). El régimen también va a la URL (`board=`), para que el enlace sea compartible.
   - `RoomList.tsx` y `RoomCard.tsx`: imagen 3:2, tipo y número, capacidad, planta, descripción, precio por noche y suplemento, total en `text-xl font-semibold cifras`. Botón `Button` «Elegir» (cliente), «Inicia sesión para reservar» (`ButtonLink` a `/login` con `state.from`) o, si es personal, el texto actual `clientOnly`.
   - `BookingSummary.tsx`: **paso de confirmación nuevo**. Al pulsar «Elegir» no se reserva: se abre un `Modal` con el resumen (hotel, habitación, fechas, noches, huéspedes, régimen, total) y dos botones: «Confirmar reserva» (`Button loading={book.isPending}`) y «Volver» (`secondary`). Solo «Confirmar» llama a `meApi.book`.
   - Tras reservar: cierra el modal, `toast.success` con «Reserva {code} creada», y muestra un `Card variant="brand"` arriba de la lista con el código en `cifras text-xl`, el resumen y `ButtonLink` «Ver mis reservas». Invalida `['availability']` y `['me','bookings']`.
   - Si el backend dice que la habitación ya no está libre: cierra el modal, `toast.error` con el texto de `public.hotelDetail.roomTakenHint` y refresca la disponibilidad.
   - Estados: cargando (esqueletos de 3 tarjetas), error (`ErrorNote` con `onRetry={() => availability.refetch()}`), vacío (`EmptyState` con acción «Cambiar fechas» que lleva el foco al primer campo de fecha).
4. **Listado** (`HotelsPage.tsx`): las mismas tarjetas que la portada; filtros con `Field`; el resultado se anuncia con un `aria-live="polite"` «3 hoteles».
5. **Área de cliente** (`pages/account/MyBookingsPage.tsx`, `MyInvoicesPage.tsx`, `ProfilePage.tsx`): migra a `Card`, `Button`, `Field`, `StatusBadge`. Cancelar una reserva pide confirmación en un `Modal` («¿Cancelar la reserva {code}?», botones «Cancelar reserva» `danger` y «Mantener» `secondary`) y avisa con `toast`. Facturas: el botón de imprimir sigue usando `window.print()`; revisa que la vista de impresión no imprime la cabecera ni el pie (`print:hidden`).
6. Traducciones nuevas en `es.json` y `en.json` (las dos siempre): `booking.summaryTitle` («Revisa tu reserva» / «Review your booking»), `booking.confirm` («Confirmar reserva» / «Confirm booking»), `booking.back` («Volver» / «Back»), `booking.created` («Reserva {{code}} creada» / «Booking {{code}} created»), `booking.choose` («Elegir» / «Choose»), `booking.changeDates`, `account.cancelConfirm`, `account.keep`, `public.hotels.count_one`/`_other`, `public.landing.hotel`. Ninguna cadena visible escrita a mano.
7. Pruebas en `pages/public/hotel-detail/__tests__/BookingSummary.test.tsx` con un doble de `meApi.book` (vi.mock de `api/endpoints`): «Elegir» no llama a `book`; «Confirmar» lo llama una vez con los datos correctos; un error con «available» muestra el aviso.

## No hacer

- No crees reservas reales contra la API pública: las pruebas usan dobles.
- No cambies el backend, ni los nombres de campos de la API.
- No añadas un selector de fechas de terceros.

## Criterios de aceptación

- Nadie puede reservar con un solo clic: siempre hay resumen y confirmación.
- `HotelDetailPage.tsx` queda por debajo de 120 líneas.
- axe sin `serious`/`critical` en `/`, `/hotels`, `/hotels/1` (con el modal abierto también), `/account`, `/account/invoices`, `/account/profile` a 390 y 1440 px.
- Las pruebas nuevas pasan.

## Verificación

Ver `plan/REGLAS.md`. Para capturar el modal abierto, añade un paso a mano con Playwright: entra como cliente, ve a `/hotels/1`, pulsa el primer «Elegir» y captura. **No pulses «Confirmar»**. Capturas en `plan/capturas/04/`.

## Cierre

Commit(s), push, PR hacia `plan/mejoras` con capturas antes/después de portada, ficha, modal de resumen y mis reservas; fusión si está en verde; marca 04 como hecha.
