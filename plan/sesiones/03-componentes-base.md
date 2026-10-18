# 03 · Componentes base

Modelo: GLM 5.3 (opencode go), razonamiento high
Rama: `mejora/03-componentes`, desde `plan/mejoras`. Nunca `main`.
Depende de: 02 fusionada.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/frontend-ui-engineering/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/taste-skill/SKILL.md` (solo las partes de estados, foco y formularios; las reglas de `plan/DISENO.md` mandan)

## Contexto

Lee `plan/REGLAS.md`, `plan/DISENO.md` (sección «Componentes que se rediseñan» y «Foco y estados») y la sección «Inventario de componentes» de `plan/AUDITORIA.md`. Hoy los estilos están en clases CSS de `frontend/src/styles/theme.css` (`.btn-*`, `.field-*`, `.card-tile*`, `.badge`) y muchas páginas escriben botones y campos a mano. Esta sesión crea componentes React con todos sus estados y los usa en las capas (`components/layout/*`) y en login y registro. Las demás páginas se migran en 04 y 05.

## Tareas

1. Crea en `frontend/src/components/ui/`:
   - `Button.tsx`: `variant: 'primary' | 'secondary' | 'ghost' | 'danger'` (por defecto `primary`), `size: 'sm' | 'md'` (36 y 44 px de alto), `loading?: boolean` (muestra un círculo SVG de 16 px que gira, salvo con `prefers-reduced-motion`, pone `aria-busy` y deshabilita), `asChild` no. Acepta todas las props de `<button>` y por defecto `type="button"`. Exporta también `ButtonLink` (mismo aspecto, envuelve `Link` de react-router).
     Estilos: primary `bg-fez-700 text-white hover:bg-fez-800`; secondary `border border-cal-400 bg-white text-tinta-900 hover:bg-cal-100`; ghost `text-fez-700 hover:bg-fez-50`; danger `bg-error-700 text-white hover:brightness-95`. Todos `rounded-(--radius-control) font-semibold transition-colors duration-150 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed`.
   - `Field.tsx`: props `label`, `hint?`, `error?`, `children` (el control) y `id`. Clona el hijo para ponerle `id`, `aria-invalid` y `aria-describedby` (ids `${id}-hint` y `${id}-error`). El error se pinta en `text-sm text-error-ink` con un icono SVG de exclamación de 16 px y `role="alert"` solo al aparecer. Exporta además `Input`, `Select` y `Textarea` con la clase de `.field-input` aplicada.
   - `DateRangeField.tsx`: dos `Input type="date"` en rejilla de 2 columnas con etiquetas traducidas «Entrada» y «Salida» (claves existentes `public.landing.checkIn`/`checkOut`), `min` de salida = entrada + 1 día, error «La salida debe ser posterior a la entrada» si no se cumple (clave nueva `common.dateOrder`), y debajo un texto `aria-live="polite"` con «3 noches» (reutiliza `public.hotelDetail.nights`). Props: `checkIn`, `checkOut`, `onChange(checkIn, checkOut)`.
   - `Card.tsx`: `variant: 'plain' | 'brand'`, `as?: 'div' | 'section' | 'article'`. plain: `rounded-(--radius-card) border border-cal-200 bg-white shadow-(--shadow-card)`. brand: lo mismo más `border-t-2 border-t-granate-700`.
   - `Toast.tsx`: un `ToastProvider` (montado en `main.tsx` dentro de `QueryClientProvider`) y un hook `useToast()` con `toast.success(texto)` y `toast.error(texto)`. Pila abajo a la derecha (abajo a todo el ancho en 390 px), éxito con `role="status"` y cierre a los 6 s, error con `role="alert"` y sin cierre automático; botón de cerrar con `aria-label` traducido (`common.close`). Sin dependencias nuevas.
2. Mejora los existentes:
   - `Modal.tsx`: título con `id` y `aria-labelledby` en el `<dialog>`; al abrir, foco en el primer elemento enfocable del contenido (o en el título con `tabIndex={-1}` si no hay); al cerrar, devuelve el foco al elemento que tenía el foco antes de abrir; botón de cerrar con icono SVG de 20 px y `aria-label`; quita el filete dorado y usa `rounded-(--radius-card)`; fondo del velo `backdrop:bg-tinta-900/40`.
   - `Feedback.tsx`: `ErrorNote` admite `onRetry?: () => void` y pinta un `Button variant="secondary" size="sm"` «Reintentar» (clave `common.retry`); `EmptyState` admite `action?: ReactNode`; el rombo pasa a `text-granate-700`.
   - `StatusBadge.tsx`: aplica los colores de la tabla «Estados de reserva» de `plan/DISENO.md` y la misma lógica para facturas, habitaciones, tareas y prioridades. Clase base `inline-flex items-center gap-1 rounded-(--radius-pill) px-2.5 py-0.5 text-xs font-semibold`.
   - `DataTable.tsx`: `caption` oculta (`sr-only`) obligatoria (prop `caption`), cabeceras `text-xs font-semibold text-tinta-600` sin mayúsculas, celdas con `cifras` cuando `align: 'right'`, filas `h-12`, la indicación «desliza» solo si la tabla desborda (mide con `ResizeObserver` `scrollWidth > clientWidth`). Botones de paginación con `Button variant="secondary" size="sm"`.
3. Rediseña las capas según `plan/DISENO.md`:
   - `layout/PublicShell.tsx`: cabecera `bg-cal-50 border-b border-cal-200`, logotipo `font-display text-xl text-tinta-900` con el rombo en `text-granate-700`, enlaces `text-tinta-900` con el activo `text-fez-700 underline underline-offset-8 decoration-2`; «Crear cuenta» es `ButtonLink size="sm"`, «Iniciar sesión» `ButtonLink variant="ghost" size="sm"`. Menú móvil: panel `bg-white` desde la derecha; cuando está cerrado no debe ser enfocable (usa `inert` en vez de solo `aria-hidden`); Esc lo cierra y el foco vuelve al botón de menú. Pie claro: `bg-cal-100 border-t border-cal-200 text-tinta-600` con el `separador`.
   - `layout/AdminShell.tsx`: barra lateral `reticula-noche sobre-noche`, texto `noche-ink`, inactivo `text-noche-muted hover:text-noche-ink hover:bg-noche-800`, activo `bg-noche-800 text-white` con `aria-current="page"` (NavLink ya lo pone). Sustituye los caracteres `▦ ◫ ▤ ▥ ◧ ◨ ⬡ ⬢ ✦ ◩` por iconos SVG de 18 px dibujados a mano en un archivo `components/ui/icons.tsx` (trazo 1,5, `currentColor`): panel, reserva, calendario, factura, persona, lista, edificio, puerta, etiqueta, gafete. Mismo arreglo de `inert` y Esc para el cajón móvil.
   - `layout/AccountShell.tsx`: pestañas con `role` de enlaces normales (no `tablist`) y el activo subrayado en fez.
4. Usa los componentes nuevos en `pages/LoginPage.tsx` y `pages/RegisterPage.tsx`: `Card variant="brand"`, `Field` + `Input`, `Button` con `loading={isSubmitting}`. El error del servidor va en `ErrorNote`. El bloque de cuentas de demo pasa a `bg-cal-100 text-tinta-600 rounded-(--radius-control)` con un `<dl>`.
5. Borra de `theme.css` las clases `.btn-gold`, y marca con un comentario `/* deprecated: usar <Button> */` las `.btn-*` y `.field-*` que aún se usen en páginas (se borran en 05).
6. Añade pruebas con Vitest y Testing Library (`npm i -D @testing-library/react @testing-library/user-event jsdom` y `environment: 'jsdom'` en un `vitest.config.ts` o en `vite.config.ts > test`):
   - `Button`: con `loading` está deshabilitado y tiene `aria-busy="true"`.
   - `Field`: con `error` el control tiene `aria-invalid="true"` y `aria-describedby` apunta a un nodo con el texto del error.
   - `Modal`: al cerrar, el foco vuelve al botón que lo abrió (jsdom no implementa `showModal`: añade en el setup `HTMLDialogElement.prototype.showModal = function(){ this.open = true }` y `close`).
   - `DateRangeField`: con salida anterior a entrada muestra el error.

## No hacer

- No migres las páginas del panel ni la ficha del hotel (04 y 05), salvo que dejen de compilar.
- No cambies la lógica de autenticación (`auth/`, `api/client.ts`).
- No añadas librerías de componentes (Radix, shadcn, Headless UI…).

## Criterios de aceptación

- Las cuatro pruebas nuevas pasan.
- Con teclado: en 390 px se abre el menú, se recorre, Esc lo cierra y el foco vuelve al botón; con el menú cerrado, Tab no entra en sus enlaces.
- axe sin `serious`/`critical` en `/`, `/login`, `/register`, `/admin` y `/account` a 390 y 1440 px.

## Verificación

Ver `plan/REGLAS.md`. Capturas en `plan/capturas/03/`.

## Cierre

Commit(s) en español, push, PR hacia `plan/mejoras` con capturas antes/después de cabecera pública, menú móvil abierto, barra lateral, login y un modal abierto; fusión si está en verde; marca 03 como hecha.
