# Dirección de diseño · Zellige Hotels

Decidida el 2026-10-18 tras revisar la demo (`plan/capturas/antes/`) y el código (`frontend/src/styles/theme.css`, `docs/DESIGN.md`). Cada decisión lleva su porqué en una línea.

## Qué hay hoy y qué cambia

Hoy: verde azulado muy oscuro (`#06282b`) con dorado (`#c19540`), estrella de ocho puntas sobre todas las cabeceras, fondo frío y error en terracota. Funciona, pero tiene tres problemas:

1. **Se parece demasiado a otra marca que Ayman usa** (verde azulado + ámbar + estrella de ocho puntas). Por eso cambia la paleta y el motivo.
2. **Es frío y oscuro para un hotel.** La cabecera pública y el pie son bloques casi negros; el encargo pide cálido, sereno y claro.
3. **El terracota del error es un naranja**, y el naranja está prohibido.

Se conserva: Marcellus para titulares (ya es la voz del hotel), la estructura de pantallas, el `<dialog>` nativo del modal y la regla de que el ornamento nunca va detrás de datos.

## Capturas de referencia (hoy)

| Pantalla | 1440 px | 390 px |
|---|---|---|
| Portada | `capturas/antes/landing-1440.png` | `capturas/antes/landing-390.png` |
| Listado de hoteles | `capturas/antes/hoteles-1440.png` | `capturas/antes/hoteles-390.png` |
| Ficha y reserva | `capturas/antes/hotel-1440.png` | `capturas/antes/hotel-390.png` |
| Login | `capturas/antes/login-1440.png` | `capturas/antes/login-390.png` |
| Panel (admin) | `capturas/antes/admin-1440.png` | (no capturado) |
| Reservas (admin) | `capturas/antes/reservas-admin-1440.png` | (no capturado) |
| Área de cliente | `capturas/antes/cuenta-1440.png` | (no capturado) |

axe sobre la demo: `capturas/antes/axe-demo.json` (contraste, enlace sin distinguir del texto y `aria-hidden` con foco en el menú móvil).

Fallos vistos en la demo que no son de diseño, pero se arreglan en la sesión 00: abrir directamente `/login` o `/hotels` da 404 en Vercel; en la barra lateral aparece `labels.employeePosition.ADMIN` sin traducir; el panel muestra 0 € y 0 reservas del mes porque los datos de demo tienen fechas fijas.

## Paleta

Concepto: **cal y azulejo verde**. Paredes encaladas, un verde de azulejo de Fez y un granate de celosía. Cálido por el blanco roto, sereno porque solo hay un color fuerte por pantalla.

| Token (`--color-*`) | Valor | Uso | Contraste comprobado |
|---|---|---|---|
| `cal-50` | `#FAF8F4` | fondo de página | (fondo) |
| `cal-100` | `#F1EDE6` | relleno suave, fila al pasar el ratón, superficie 2 | secundario sobre él 5,9:1 |
| `cal-200` | `#E3DDD3` | bordes y divisores | decorativo |
| `cal-400` | `#8E877C` | borde de campos de formulario | 3,4:1 sobre `cal-50` (mínimo 3:1 para controles) |
| `blanco` | `#FFFFFF` | tarjetas, campos, modales | texto 16,3:1 |
| `tinta-900` | `#1C211F` | texto principal | 15,4:1 sobre `cal-50` |
| `tinta-600` | `#555C58` | texto secundario | 6,5:1 sobre `cal-50` |
| `fez-700` | `#1E5B46` | botón principal, enlaces, foco, estado activo | blanco sobre él 8,0:1; como texto 7,5:1 |
| `fez-800` | `#17483A` | botón principal al pasar el ratón | blanco 10,4:1 |
| `fez-50` | `#E4F0EA` | relleno de seleccionado y de éxito | `fez-700` sobre él 6,8:1 |
| `granate-700` | `#8B2E3C` | acento de marca: filete superior de tarjetas de marca, ornamento, precio destacado | 7,8:1 sobre `cal-50`; blanco sobre él 8,2:1 |
| `granate-50` | `#F6E7E9` | fondo de etiqueta de marca | decorativo |
| `noche-900` | `#18231F` | barra lateral del panel | texto `#EDEAE3` 13,5:1; secundario `#A9B5AF` 7,6:1 |
| `noche-800` | `#2A3B34` | elemento activo de la barra lateral | blanco 11,8:1 |
| `error-700` | `#B3261E` | botón peligroso, borde de campo con error | blanco sobre él 6,5:1 |
| `error-ink` / `error-50` | `#8F1D17` / `#FCEBEA` | mensaje de error | 7,7:1 |
| `aviso-ink` / `aviso-50` | `#6B4E00` / `#FBF0D2` | pendiente, en limpieza | 6,8:1 |
| `info-ink` / `info-50` | `#1F4B73` / `#E6EEF6` | confirmada, información | 7,8:1 |

Por qué cada uno:
- `cal-50` en vez del gris verdoso actual: un blanco roto cálido dice «hotel» sin caer en el beige de plantilla.
- Un solo verde fuerte (`fez-700`) para todo lo que se pulsa: el usuario aprende en una pantalla qué es interactivo.
- El granate sustituye al dorado: el dorado sobre blanco no llega a 4,5:1 y además acercaba la paleta al ámbar; el granate es cálido, legible y no es naranja.
- `error-700` es un rojo puro (matiz ~3°), no terracota: el error tiene que leerse como error y el naranja está prohibido.
- Los estados (`aviso`, `info`) usan tinta oscura sobre tinte claro: el color ayuda, pero la etiqueta siempre lleva texto.
- La barra lateral del panel sigue oscura (`noche-900`): el personal pasa horas ahí y un marco oscuro separa la navegación de los datos. Es verde casi negro, no el verde azulado de antes.

Se eliminan: `glaze-*`, `teal-*`, `gold-*`, `terra-*`. La sesión 02 los sustituye en todo el código.

## Motivo

- La estrella de ocho puntas desaparece. Se sustituye por una **retícula de azulejo**: cuadrados girados 45° con un rombo pequeño en cada cruce, en `fez-700` al 6 % de opacidad sobre `cal-50`, o en `#EDEAE3` al 7 % sobre `noche-900`. Por qué: sigue diciendo «azulejo», pero no se confunde con la otra marca.
- Dónde va: fondo de la portada (detrás del titular), fondo de login y registro, barra lateral del panel. **Nunca** detrás de tablas, formularios largos ni texto de párrafo.
- Separador de marca: línea `cal-200`, rombo `granate-700` de 6 px y línea. Solo en portada, login y pie.
- El SVG definitivo de la retícula (mosaico de 48 px) está en la sesión 02.

## Tipografía

| Rol | Fuente | Pesos | Por qué |
|---|---|---|---|
| Titulares de marca (portada, nombre del hotel, títulos de login) | Marcellus, autoalojada con `@fontsource/marcellus` | 400 | Ya es la voz del hotel: clásica, serena y con carácter, sin ser caligráfica. |
| Interfaz y texto | Source Sans 3 Variable, autoalojada con `@fontsource-variable/source-sans-3` | 400, 600, 700 | Muy legible en tablas pequeñas y formularios, cifras tabulares y con buen soporte de acentos. No es ninguna de las fuentes vetadas. |

- Se quita el `<link>` a Google Fonts de `index.html`: autoalojar evita una petición a un tercero y el salto de fuente.
- Cifras de precios, fechas y tablas: `font-variant-numeric: tabular-nums` (clase `.cifras`).

Escala (rem, base 16 px, razón 1,2):

| Token | Tamaño | Interlineado | Uso |
|---|---|---|---|
| `--text-xs` | 0,8125 rem (13 px) | 1,4 | etiquetas de tabla, ayudas |
| `--text-sm` | 0,875 rem (14 px) | 1,45 | interfaz del panel, botones |
| `--text-base` | 1 rem (16 px) | 1,55 | texto general, campos |
| `--text-lg` | 1,1875 rem (19 px) | 1,4 | subtítulos |
| `--text-xl` | 1,4375 rem (23 px) | 1,3 | títulos de página del panel |
| `--text-2xl` | 1,75 rem (28 px) | 1,2 | títulos de sección pública (Marcellus) |
| `--text-4xl` | 2,5 rem (40 px) | 1,1 | nombre del hotel |
| `--text-6xl` | 3,5 rem (56 px) | 1,05 | titular de portada (en 390 px baja a 2,25 rem) |

Por qué: 16 px mínimo en campos evita el zoom automático de iOS; 14 px en el panel deja ver más filas sin bajar de un tamaño cómodo.

Etiquetas de campo: **sin mayúsculas forzadas**. 14 px, peso 600, `tinta-900`. Por qué: las mayúsculas pequeñas cuestan de leer y hoy son la mayoría del texto de los formularios.

## Espaciado

Base 4 px (la escala de Tailwind). Pasos permitidos: 1, 2, 3, 4, 6, 8, 12, 16, 24 (4 a 96 px). Nada de valores sueltos como `py-[13px]`.

| Contexto | Valor | Por qué |
|---|---|---|
| Interior de tarjeta | 20 px (`p-5`), 16 px en 390 px | aire suficiente sin perder densidad |
| Entre campos de un formulario | 16 px (`gap-4`) | agrupación clara |
| Entre secciones públicas | 96 px (`py-24`), 64 px en 390 px | ritmo de revista, calma |
| Entre bloques del panel | 24 px (`gap-6`) | el panel prioriza densidad |
| Ancho máximo público | 72 rem (`max-w-6xl`) | se mantiene |
| Ancho de lectura | 65 caracteres (`max-w-prose`) | párrafos legibles |

## Radios y elevación

| Token | Valor | Uso |
|---|---|---|
| `--radius-control` | 6 px | botones, campos, selects |
| `--radius-card` | 10 px | tarjetas, modal, toasts |
| `--radius-pill` | 999 px | etiquetas de estado |

- Sombras: solo una, `--shadow-card: 0 1px 2px rgb(28 33 31 / .06), 0 4px 12px rgb(28 33 31 / .05)`, en tarjetas y modal. Por qué: el relieve viene del contraste blanco sobre cal, la sombra solo lo apoya.
- El filete superior de 2 px pasa de dorado a `granate-700` y solo en tarjetas de marca (búsqueda de la portada, login, registro, confirmación de reserva).

## Foco y estados

- **Foco visible igual en todo:** `outline: 2px solid var(--color-fez-700); outline-offset: 2px;` vía `:focus-visible`. Sobre `noche-900` el contorno es `#EDEAE3`. Por qué: 7,5:1 frente al fondo, nunca depende de que haya borde.
- Campos: borde `cal-400` (3,4:1). Al enfocar, borde `fez-700` y el contorno de arriba. Con error: borde `error-700`, mensaje debajo con icono y texto, y `aria-invalid="true"` + `aria-describedby`.
- Botón deshabilitado: opacidad 0,5 y `cursor: not-allowed`; nunca solo cambio de color.
- Pulsado: `translate-y-px`. Hover: cambio de fondo en 150 ms `ease-out`.
- Objetivo táctil mínimo: 44 × 44 px en 390 px (botones y enlaces de la barra).
- `prefers-reduced-motion`: sin desplazamientos ni fundidos de entrada; se muestra el estado final.

## Componentes que se rediseñan

Todos viven en `frontend/src/components/ui/` y se usan en todas las pantallas. Ninguna página vuelve a definir estilos de botón o campo a mano.

| Componente | Archivo | Qué cambia |
|---|---|---|
| Botón | `Button.tsx` (nuevo) | variantes `primary` (fez), `secondary` (borde cal-400, texto tinta), `ghost`, `danger` (error-700); tamaños `sm` (36 px) y `md` (44 px); prop `loading` con texto «Guardando…» y `aria-busy`. Sustituye a `.btn-*` y `.btn-gold`. |
| Campo | `Field.tsx` (nuevo) | etiqueta + control + ayuda + error enlazados por `id`; admite `input`, `select` y `textarea`. |
| Fecha | `DateRangeField.tsx` (nuevo) | dos `input type="date"` nativos con etiquetas «Entrada» y «Salida», valida salida > entrada y anuncia el número de noches. Nativo porque es accesible y no añade dependencias. |
| Tarjeta | `Card.tsx` (nuevo) | `variant="plain" | "brand"` (la de marca lleva filete granate). |
| Modal | `Modal.tsx` | mantiene `<dialog>`; añade foco inicial en el primer campo, vuelta del foco al botón que lo abrió, título con `aria-labelledby`, cierre con icono SVG y texto oculto. |
| Toast | `Toast.tsx` (nuevo) | región `role="status"` (éxito) o `role="alert"` (error), se cierra sola a los 6 s salvo errores; para avisar de «Reserva creada», «Factura emitida». |
| Tabla | `DataTable.tsx` | cabecera en 13 px peso 600 sin mayúsculas, `<caption>` oculta, cifras tabulares, filas de 48 px, sin indicación «desliza» si cabe. |
| Etiqueta de estado | `StatusBadge.tsx` | mapas de color a los nuevos tokens (ver abajo) y siempre con texto. |
| Vacío, error y carga | `Feedback.tsx` | vacío con rombo granate y acción opcional; error con icono, texto y botón «Reintentar» (`refetch`); esqueletos con `cal-100`. |
| Cabecera pública | `layout/PublicShell.tsx` | fondo `cal-50` con borde inferior `cal-200`, logotipo en tinta, enlace activo subrayado en fez; el pie también pasa a claro. |
| Barra lateral | `layout/AdminShell.tsx` | `noche-900` con retícula, iconos SVG en lugar de caracteres geométricos (`▦ ◫ ▤…`), rol traducido. |

Estados de reserva:

| Estado | Fondo / texto |
|---|---|
| Pendiente | `aviso-50` / `aviso-ink` |
| Confirmada | `info-50` / `info-ink` |
| Check-in | `fez-700` / blanco |
| Check-out | `cal-100` / `tinta-600` |
| Cancelada | `error-50` / `error-ink` |

Las facturas, habitaciones, tareas y prioridades siguen la misma lógica: pendiente → aviso, en curso o confirmada → info, hecho o libre → fez-50/fez-700, anulado o fuera de servicio → error o cal.

## Pantallas que cambian más

- **Portada:** sin foto de stock de fondo. Titular en Marcellus sobre `cal-50` con la retícula, a la izquierda; a la derecha (1440 px) la foto del primer hotel de la cadena que ya devuelve la API, recortada en un arco (`border-radius: 999px 999px 10px 10px`). Debajo, la tarjeta de búsqueda de marca. Por qué: el arco remite a la arquitectura del hotel sin clip-art y la foto es contenido del producto, no decoración.
- **Ficha del hotel:** cabecera clara con nombre, ciudad y estrellas; la foto pasa a un bloque propio. El flujo de reserva se divide en pasos visibles (sesión 04).
- **Panel:** los cuatro KPI se mantienen, pero el primero (ocupación de hoy) ocupa doble ancho con su barra; gráficas con `fez-700` y `granate-700`, ejes en `tinta-600`.

## Lo que no se hace

- Nada de modo oscuro en la parte pública: el encargo es claro.
- Nada de animaciones de entrada en cascada en la portada.
- No se cambia el idioma por defecto (`es`) ni el selector ES/EN.
