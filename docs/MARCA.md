# Marca · Zellige Hotels

Estudio de marca de la sesión 10 (2026-10-24). Parte de la dirección visual de `plan/DISENO.md` («cal y azulejo verde») y la convierte en una marca: un concepto, un símbolo propio, reglas de uso y un lenguaje de movimiento. La página `/marca` de la demo enseña el sistema en vivo; los archivos están en `docs/marca/` y `frontend/public/identidad/`.

## 1. Concepto: el umbral

Un hotel de Zellige empieza en la puerta. Fuera queda la calle; al cruzar el arco llegan la sombra, el patio y el silencio. La marca cuenta ese paso.

Y lo cuenta con la pieza que da nombre a la casa: la tesela. En un zellige cada pieza está cortada a mano y encaja con las demás sin montarse encima. Es la misma promesa que hace el sistema de reservas: dos estancias nunca ocupan la misma habitación a la vez (la base de datos lo impide con `EXCLUDE USING gist`). El concepto une las dos ideas:

> **Una tesela con una puerta.** Oficio y orden por fuera, calma por dentro.

## 2. Personalidad

| Es | No es |
|---|---|
| Serena: deja respirar, no grita. | Exótica de postal: ni lámparas, ni camellos, ni filigrana de souvenir. |
| Precisa: dice el precio, las noches y el estado de cada reserva. | Fría ni corporativa. |
| Hospitalaria: habla de tú y explica antes de pedir. | Recargada: un solo color fuerte por pantalla. |
| Artesana: geometría hecha con calma, a mano. | Lujo de catálogo: sin dorados ni brillos. |

## 3. Voz

- Segunda persona (tú), frases cortas, primero el dato y después el adjetivo.
- Sin exclamaciones, sin rayas largas, sin «robusto», «soluciones» ni «apasionado».
- Los números son concretos: «3 hoteles», «4 regímenes», «IVA desglosado».

| Sí | No |
|---|---|
| «Tu reserva entra en el sistema del hotel al momento.» | «¡Reserva ya y vive una experiencia única!» |
| «Dos reservas nunca se pisan.» | «Tecnología robusta de última generación.» |
| «Cancela desde tu cuenta, sin llamadas.» | «Soluciones flexibles para ti.» |

## 4. Logotipo

### Símbolo

Archivo: `simbolo.svg` (también `simbolo-mono.svg` y `simbolo-claro.svg`). Construcción sobre una retícula de 64 unidades:

| Pieza | Medida | Por qué |
|---|---|---|
| Tesela | cuadrado de 64 u, radio 14 u | Las teselas de zellige se cortan a mano: esquinas suaves, nunca círculos ni cuadrados perfectos. |
| Puerta | arco de herradura de radio 15 u, centro en (32, 30), jambas a 13,4 u del eje; baja hasta el borde | La herradura es el arco andalusí y magrebí que comparten los tres hoteles. Abierta abajo, la tesela se convierte en umbral: se puede cruzar. |
| Clave | rombo de 7,6 u de diagonal, centrado a 7,8 u del borde superior | Es la pieza que cierra un arco. |

**El rombo se queda, a propósito.** El logotipo anterior era un ◆ suelto. Ahora el rombo tiene un oficio: es la clave del arco. Por eso sigue siendo el separador de marca (línea, rombo granate, línea) y el adorno de los estados vacíos. No vuelve a aparecer suelto como logotipo.

Sin estrella de ocho puntas ni ningún motivo religioso: la marca es arquitectura y oficio.

### Versiones

| Archivo | Uso |
|---|---|
| `logotipo-horizontal.svg` | Cabecera pública, documentos, firmas. Símbolo `fez-700`, nombre `tinta-900`, «Hotels» `granate-700`. |
| `logotipo-apilado.svg` | Portadas, la página de marca, formatos cuadrados. |
| `logotipo-mono.svg` | Un solo color (`tinta-900`): impresión en negro, sellos, fondos de foto claros. |
| `logotipo-claro.svg` | Sobre `noche-900` o `fez-700`: símbolo y nombre `#EDEAE3`, «Hotels» `granate-200`. |
| `favicon.svg`, `apple-touch-icon.png` | El símbolo solo. |
| `og.png` | Imagen al compartir un enlace (1200 × 630). |
| `nombre-ancho.svg` | El nombre a todo el ancho, solo para el pie. |

En la web el logotipo se compone en vivo (`components/brand/Marca.tsx`): símbolo en SVG y el nombre como texto real en Marcellus, en mayúsculas por CSS para que los lectores de pantalla no deletreen. En el panel el apellido pasa a ser «ERP».

### Reglas

- **Área de respeto:** un cuarto del alto del símbolo por cada lado (16 u en la retícula de 64).
- **Tamaño mínimo:** símbolo 16 px; logotipo horizontal 120 px de ancho. Por debajo, solo el símbolo.
- **Nombre:** Marcellus en mayúsculas con espaciado 0,14 em; el apellido a 0,62 em y al 45 % del tamaño. Escrito siempre «Zellige Hotels»; «Zellige» a secas en el pie y en el titular gigante.

## 5. Color

La paleta es la de `plan/DISENO.md` con dos tonos nuevos para las superficies oscuras de la portada.

| Token | Valor | Papel | Contraste |
|---|---|---|---|
| `cal-50` | `#FAF8F4` | fondo, el 60 % de cada pantalla | (fondo) |
| `cal-100` / `cal-200` | `#F1EDE6` / `#E3DDD3` | relleno suave / líneas | decorativo |
| `tinta-900` | `#1C211F` | texto | 15,4:1 sobre `cal-50` |
| `tinta-600` | `#555C58` | texto secundario | 6,5:1 sobre `cal-50` |
| `fez-700` | `#1E5B46` | símbolo, botones, enlaces, foco | 7,5:1 sobre `cal-50`; blanco encima 8,0:1 |
| `noche-900` | `#18231F` | superficies oscuras: historia de la reserva, pie, barra del panel | `#EDEAE3` encima 13,5:1 |
| `granate-700` | `#8B2E3C` | apellido del logotipo, clave, filetes; como mucho el 10 % | 7,8:1 sobre `cal-50` |
| `fez-200` (nuevo) | `#9FCFB7` | acento y cifras sobre `noche-900` | 9,3:1 sobre `noche-900`; 4,6:1 sobre `fez-700` |
| `granate-200` (nuevo) | `#E2B9BF` | apellido del logotipo sobre oscuro | 9,2:1 sobre `noche-900` |

Contrastes calculados con la fórmula de luminancia relativa de WCAG 2.2: `node docs/marca/contraste.mjs '#1E5B46/#FAF8F4' …` los repite. Los estados (aviso, info, error) no cambian.

**Proporción:** 60 % cal, 30 % verde (fez y noche), 10 % granate como máximo. El granate nunca es fondo de una sección.

**Sobre el tópico «crema y burdeos».** Las guías de diseño que usamos avisan de que el blanco roto con un burdeos es la paleta por defecto del lujo genérico. Aquí se mantiene porque tiene un origen concreto (la cal de los muros y el granate de las celosías), pero la marca la lleva el verde: el símbolo, los botones y las superficies oscuras son verdes, y el granate solo firma.

## 6. Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | Marcellus 400 | Logotipo (mayúsculas espaciadas), titulares de portada y de sección, nombres de hotel, el «Zellige» gigante en contorno y el del pie. |
| Texto e interfaz | Source Sans 3 Variable (400, 600, 700) | Todo lo demás. Cifras tabulares en precios y fechas. |

Marcellus es una romana de inscripción: a gran tamaño tiene el carácter de una letra tallada en piedra, que es lo que pide la portada. Ninguna de las dos es de otra marca de Ayman. Las dos se alojan en la propia web.

Escala display nueva (solo portada): titular del inicio `clamp(2.75rem, 8vw, 7rem)` con interlineado 1; titulares de sección `clamp(2.25rem, 5vw, 4.5rem)`. El resto de la escala sigue la de `DISENO.md`.

## 7. Motivo gráfico

- **Retícula de teselas:** cuadrados girados con un rombo en cada cruce, al 6 % sobre cal o al 7 % sobre noche. Solo en la portada, el acceso y la barra del panel. Nunca detrás de tablas ni de texto largo.
- **Arco:** marco de las fotos importantes (la portada, la ficha del hotel).
- **Arquería:** el borde superior de las superficies oscuras es una fila de pequeños arcos, no una línea recta. Es el «borde orgánico» de la marca: viene de la arquitectura, no de un papel rasgado.
- **Clave:** el separador (línea, rombo granate, línea) y el rombo de los estados vacíos.

## 8. Fotografía

- Desde la sesión 11 la marca tiene fotos propias: un patio visto a través de un arco (portada), una foto por hotel (Granada, Marrakech y Barcelona) y una textura de azulejo. Son **imágenes generadas con IA por Ayman Charoui**, sin derechos de terceros. Están en `frontend/public/img/` como AVIF y WebP en varios anchos (`plan/herramientas/optimizar-fotos.mjs`); el componente `Foto` las sirve con `srcset` y `sizes`, y `lib/fotos.ts` decide cuál va a cada hotel por su ciudad. Si un hotel nuevo no tiene foto propia, se usa la que devuelve la API.
- Las fotos de las habitaciones siguen siendo las de la API. Nada de bancos de imágenes nuevos.
- La textura de azulejo lleva una estrella de ocho puntas: solo va de fondo, al 9 % de opacidad y difuminada hacia los bordes, detrás del «Zellige» gigante. Nunca como logotipo ni como motivo protagonista.
- Luz natural, patios, materiales, habitaciones vacías y ordenadas. Sin personas posando.
- Recorte en arco para la foto protagonista (la ficha del hotel y dos de las fotos del «Zellige» en contorno); el resto en rectángulo con radio de tarjeta.
- Cada foto tiene su texto alternativo, o `alt=""` si se repite junto al nombre.

## 9. Movimiento

El movimiento cuenta el paso del umbral: el arco se abre, el texto entra con calma y la historia de la reserva avanza al ritmo de quien lee. Es más lento que el de una marca de consumo: un hotel no tiene prisa.

### Principios

1. **El scroll manda.** Las escenas grandes van atadas al desplazamiento (`scrub`); nada se mueve solo durante más de un segundo.
2. **Lento y sin rebote.** Curvas de salida largas, nunca elásticas.
3. **Distancias cortas.** Los textos suben 24 a 40 px; las fotos se desplazan como mucho un 12 % en paralaje.
4. **Solo `transform` y `opacity`.** Nada que recalcule el diseño de la página.
5. **Un protagonista por pantalla.** Si el arco se abre, el resto espera.
6. **Todo se puede leer quieto.** Con `prefers-reduced-motion: reduce` se muestra el estado final, sin fijar secciones y sin el desplazamiento suave.

### Duraciones y curvas

| Token | Valor | Uso |
|---|---|---|
| `--duracion-micro` | 180 ms | botones, enlaces, tarjetas al pasar el ratón |
| `--duracion-entrada` | 900 ms | titulares línea a línea, tarjetas que entran |
| escalonado | 90 ms entre elementos | líneas de un titular, habitaciones de una lista |
| escenas | atadas al scroll, `scrub: 0,8` | arco del inicio, carrusel, historia fijada, paralaje |
| `--ease-sereno` | `cubic-bezier(.22, 1, .36, 1)` | entradas: arranca decidido y se posa despacio |
| `--ease-umbral` | `cubic-bezier(.65, 0, .35, 1)` | cambios de estado y la apertura del arco |

Dónde: solo en la parte pública (portada, lista de hoteles y ficha). El panel y el área de cliente solo tienen microinteracciones (180 ms).

## 10. Usos correctos e incorrectos

| Correcto | Incorrecto |
|---|---|
| Símbolo en `fez-700` sobre cal, o en `#EDEAE3` sobre noche. | Cambiar el color del símbolo por otro que no sea de la paleta (y nunca naranja). |
| Logotipo con su área de respeto. | Deformarlo, girarlo, ponerle sombra o contorno. |
| El rombo como clave o separador. | El rombo suelto como logotipo, o una estrella de ocho puntas. |
| El nombre en Marcellus mayúsculas. | Rehacer el nombre en otra fuente o en minúsculas. |
| Logotipo mono sobre fotos claras con velo. | Logotipo en color sobre una foto sin contraste. |
| Granate en pequeño: apellido, clave, filetes. | Fondos de sección en granate o degradados. |

## 11. Créditos de las imágenes

Imágenes generadas con IA por Ayman Charoui: `hero`, `granada`, `marrakech`, `barcelona` y `textura` en `frontend/public/img/`. Los originales en JPG no están en el repositorio; las versiones AVIF y WebP se generan con `plan/herramientas/optimizar-fotos.mjs`.

## 12. Cómo se mueve la portada (sesión 11)

Todo el movimiento vive en `frontend/src/motion/` y solo se carga en la portada, la lista de hoteles y la ficha, sin `prefers-reduced-motion` y cuando el navegador ya ha terminado de cargar.

| Escena | Qué hace |
|---|---|
| El umbral | El arco de herradura crece con el scroll hasta que la foto ocupa toda la pantalla (sección fijada). |
| Titulares | Entran línea a línea (máscara y `translateY`); el del inicio, con CSS al cargar. |
| Cinta de datos | Avanza al ritmo del scroll, no se mueve sola. |
| Tres casas | Carrusel horizontal fijado; las tarjetas llegan inclinadas, se enderezan y se apilan. |
| Reservar, paso a paso | Sección fijada en cuatro pasos; en móvil, cada paso entra al llegar. |
| «Zellige» en contorno | El nombre deriva despacio y las tres fotos lo cruzan a distinta velocidad (paralaje). |
| Botones magnéticos | Se acercan un poco al puntero; solo con ratón. |
| Cambio de página | View Transitions API: la cabecera se queda, el contenido se funde y sube. |
| Lista y ficha | Tarjetas y habitaciones entran escalonadas; en la ficha, paralaje dentro de cada foto de la galería. |

Con `prefers-reduced-motion` se ve el estado final, sin fijar secciones y sin Lenis. El teclado no cambia: si el foco entra en una sección fijada, el scroll lleva a ese elemento.
